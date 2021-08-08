import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    Renderer2,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { NgxGuildyService } from '../ngx-guildy.service';
import {
    CdkDragDrop,
    DragDrop,
    DragRef,
    DropListOrientation,
    DropListRef,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { GuildyComponentOptions } from '../guildy-component.decorator';
import { uuidv4 } from '../helper';
import { GuildyContainerDirective } from '../guildy-container.directive';
import { ComponentType } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ComponentStructure {
    id: string;
    name: string;
    inputs: { [key: string]: any };
    children: ComponentStructure[];
}

@Component({
    selector: 'guildy-editor',
    templateUrl: 'guildy-editor.component.html',
    styleUrls: ['guildy-editor.component.css'],
})
export class GuildyEditorComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
    @Input()
    boolean = true;
    @Input()
    components!: ComponentType<any>[];
    @Input()
    state: ComponentStructure | undefined;
    @Output()
    stateChange = new EventEmitter<ComponentStructure>();

    @ContentChildren(GuildyContainerDirective, { descendants: true })
    initialContainers!: QueryList<GuildyContainerDirective>;
    @ViewChild('dynRef', { read: ViewContainerRef })
    draggablesViewContainerRef!: ViewContainerRef;
    @ViewChild('dynRef', { read: ElementRef }) draggablesElementRef!: ElementRef;
    @ViewChild('placeholder') placeholderRef!: TemplateRef<any>;
    _dndId!: string;
    _depth = 0;

    _orientation: DropListOrientation = 'vertical';
    _selfStructure!: ComponentStructure;
    _inited = false;
    private destroySubject = new Subject<any>();
    private dropListRef!: DropListRef<any>;
    private draggables: DragRef<any>[] = [];
    private componentMap = new Map<string, GuildyComponentOptions>();
    private componentConstructorsMap = new Map<ComponentType<any>, GuildyComponentOptions>();

    constructor(
        private guildyService: NgxGuildyService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private dnd: DragDrop,
        private injector: Injector,
        private viewContainerRef: ViewContainerRef,
        public _elementRef: ElementRef,
        private renderer: Renderer2,
        private cd: ChangeDetectorRef
    ) {}

    private static determineDirection(dropListElementRef: ElementRef | HTMLElement): DropListOrientation {
        // @ts-ignore
        const element = dropListElementRef.nativeElement ?? dropListElementRef;
        const flexDirection = getComputedStyle(element).flexDirection;
        return flexDirection.startsWith('row') ? 'horizontal' : 'vertical';
    }

    ngOnInit(): void {
        this._dndId = this._depth == 0 ? 'guildy-editor' : uuidv4();
        this.componentMap = this.guildyService.componentMap;
        this.componentConstructorsMap = this.guildyService.componentConstructorsMap;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this._depth == 0 && changes.state) {
            this._selfStructure = this.state!;
            if (this._inited) {
                this.destroy();
                this.guildyService.requestDestroy();
                // if the component is already inited, we need to "reinit". Otherwise, wait for ngViewInit to trigger init
                this.initialize();
            }
        }
    }

    ngAfterContentInit(): void {
        //probably need to insert component here, instead of doing everything in the init...
    }

    ngAfterViewInit() {
        this.initialize();
    }

    ngOnDestroy() {
        this.destroy();
        this.destroySubject.complete();
    }

    initialize() {
        if (this._depth == 0 && !this._selfStructure) {
            this._selfStructure = {
                id: '0',
                inputs: {},
                name: '__root',
                children: [],
            };
        }

        const cb = () => {
            this.cd.detectChanges();
            this._inited = true;
            this.cd.detectChanges();

            if (this._depth == 0) {
                this.guildyService.stateChanged$.pipe(takeUntil(this.destroySubject)).subscribe(() => {
                    this.stateChange.emit(JSON.parse(JSON.stringify(this._selfStructure)));
                });
            }

            if (this._depth != 0) {
                this.guildyService.destroyRequest$.pipe(takeUntil(this.destroySubject)).subscribe(() => {
                    this.destroy();
                });
            }
            this.guildyService.deleteRequested$.pipe(takeUntil(this.destroySubject)).subscribe(id => {
                this.deleteComponent(id);
            });
        };

        if (this._selfStructure != null && this._selfStructure.children.length > 0) {
            this._selfStructure.children.forEach((structure, i) => {
                const component = this.componentMap.get(structure.name);
                this.init(component?.ctor!, cb, structure, i);
            });
        } else {
            if (this.initialContainers.length == 0) {
                this.init(null, cb);
            } else {
                this.initialContainers.forEach(e => {
                    this.init(e.hostComponent.constructor, cb);
                });
            }
        }
    }

    resolveNgContent<T>(content: any, newComponentStructure: ComponentStructure) {
        const factory = this.componentFactoryResolver.resolveComponentFactory<GuildyEditorComponent>(content);
        const componentRef = factory.create(this.injector);
        componentRef.instance!._depth = this._depth + 1;

        componentRef.instance._selfStructure = newComponentStructure;
        componentRef.hostView.detectChanges();
        return {
            content: componentRef,
        };
    }

    initDropContainer(cb: () => void) {
        const directParent = this.renderer.parentNode(this._elementRef.nativeElement);

        if (!directParent) {
            //TODO figure out why sometimes direct parent is not always immediately available
            setTimeout(() => this.initDropContainer(cb));
            return;
        }

        this.dropListRef = this.dnd.createDropList(directParent);
        this.guildyService.currentOrientation$.next(this._orientation);
        this.dropListRef.withOrientation(this._orientation);
        this.dropListRef.data = this;

        this.guildyService.addDndContainer(this._dndId, this.dropListRef);

        this.dropListRef.beforeStarted.pipe(takeUntil(this.destroySubject)).subscribe(() => {
            try {
                this.renderer.addClass(directParent, 'cdk-drop-list-dragging');
            } catch (e) {
                console.error(e);
            }
        });
        this.dropListRef.entered.pipe(takeUntil(this.destroySubject)).subscribe(() => {
            try {
                this._orientation = GuildyEditorComponent.determineDirection(directParent);
                this.dropListRef.withOrientation(this._orientation);
                this.guildyService.currentOrientation$.next(this._orientation);
            } catch (e) {
                console.error(e);
            }
        });

        this.dropListRef.dropped.pipe(takeUntil(this.destroySubject)).subscribe(event => {
            try {
                this.renderer.removeClass(directParent, 'cdk-drop-list-dragging');

                this.onDrop(event as any);
            } catch (e) {
                console.error(e);
            }
        });
        this.refreshDraggables();
        this.cd.detectChanges();
        cb();
    }

    init(
        componentType: ComponentType<any> | null,
        initCb: () => void,
        jsonStructure: ComponentStructure | null = null,
        i = 0
    ) {
        this.cd.detectChanges();
        this.initDropContainer(() => {
            this.initDraggables(componentType, initCb, jsonStructure, i);
        });
    }

    insertComponent(
        componentMeta: GuildyComponentOptions,
        position: number,
        jsonStructure: ComponentStructure | null = null
    ) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentMeta.ctor!);

        const newComponentStructure = jsonStructure ?? {
            id: uuidv4(),
            name: componentMeta.name,
            inputs: {},
            children: [],
        };

        // this means its coming from struct change by user
        if (!jsonStructure) {
            this._selfStructure.children.splice(position, 0, newComponentStructure);
        }

        const { content } = this.resolveNgContent(GuildyEditorComponent, newComponentStructure);
        const compRef = this.draggablesViewContainerRef.createComponent(
            componentFactory,
            position,
            this.draggablesViewContainerRef.injector,
            [[content.location.nativeElement]]
        );
        Object.entries(newComponentStructure.inputs).forEach(([k, v]) => {
            compRef.instance![k] = v;
        });
        const drag = this.dnd.createDrag(compRef.location);
        compRef.hostView.detectChanges();
        this.renderer.listen(compRef.location.nativeElement, 'click', e => {
            if (!componentMeta.clickThroughWhileEditing) {
                e.preventDefault();
                e.stopPropagation();
            }

            this.guildyService.componentSelected$.next({
                options: componentMeta,
                componentRef: compRef,
                state: newComponentStructure,
            });
        });
        drag.withPlaceholderTemplate({
            template: this.placeholderRef,
            viewContainer: this.viewContainerRef,
            context: null,
        });
        drag.data = { name: null, compRef: compRef };
        this.draggables.splice(position, 0, drag);
        this.refreshDraggables();
        this.guildyService.stateChanged$.next();
    }

    refreshDraggables() {
        this.dropListRef?.withItems(this.draggables);
    }

    swapComponent(from: number, to: number) {
        this.draggablesViewContainerRef.move(this.draggablesViewContainerRef.get(from)!, to);
        moveItemInArray(this.draggables, from, to);
        moveItemInArray(this._selfStructure.children, from, to);
        this.guildyService.stateChanged$.next();
    }

    deleteComponent(id: string) {
        const foundIndex = this._selfStructure.children.findIndex(c => c.id == id);
        if (foundIndex != -1) {
            this.draggablesViewContainerRef.remove(foundIndex);
            this.draggables.splice(foundIndex, 1);
            this._selfStructure.children.splice(foundIndex, 1);
            this.refreshDraggables();
            this.guildyService.stateChanged$.next();
        } else {
        }
    }

    onDrop(event: CdkDragDrop<any, any>) {
        if (
            !this.guildyService.dndContainerIds$
                .getValue()
                .map(d => d.id)
                .includes(event.previousContainer.data._dndId)
        ) {
            const componentMeta = this.componentMap.get(event.item.data.name)!;
            this.insertComponent(componentMeta, event.currentIndex);
        } else if (event.previousContainer === event.container) {
            this.swapComponent(event.previousIndex, event.currentIndex);
        } else {
            if (event.previousContainer.data._dndId == 'library') {
                const componentMeta = this.componentMap.get(event.item.data.name)!;
                this.insertComponent(componentMeta, event.currentIndex);
            } else {
                this.transferComponent(event);
            }
        }
    }

    private destroy() {
        this.dropListRef?.dispose();
        (this.dropListRef as any) = null;
        this.draggables.forEach(d => d.dispose());
        this.draggables = [];
        this.guildyService.removeDndContainer(this._dndId);
        this.draggablesViewContainerRef?.clear();
        this.destroySubject.next(true);
        this.cd.detectChanges();
    }

    private initDraggables(
        componentType: ComponentType<any> | null,
        initCb: () => void,
        jsonStructure: ComponentStructure | null = null,
        i: number = 0
    ) {
        if (componentType) this.insertComponent(this.componentConstructorsMap.get(componentType)!, i, jsonStructure);

        initCb();
    }

    private transferComponent(event: CdkDragDrop<any, any>) {
        const viewToMove = event.previousContainer.data.draggablesViewContainerRef.detach(event.previousIndex);
        const newViewRef = this.draggablesViewContainerRef.insert(viewToMove, event.currentIndex);

        transferArrayItem(
            event.previousContainer.data.draggables,
            this.draggables,
            event.previousIndex,
            event.currentIndex
        );
        transferArrayItem(
            event.previousContainer.data._selfStructure.children,
            this._selfStructure.children,
            event.previousIndex,
            event.currentIndex
        );

        console.log(event.previousContainer.data._depth, this._depth, event.previousIndex, event.currentIndex);

        event.previousContainer.data.refreshDraggables();

        const oldDraggable = this.draggables[event.currentIndex];
        const refreshedDraggable = this.dnd.createDrag(oldDraggable.data.compRef.location);

        refreshedDraggable.data = oldDraggable.data;
        refreshedDraggable.withPlaceholderTemplate({
            template: this.placeholderRef,
            viewContainer: this.viewContainerRef,
            context: null,
        });
        oldDraggable.dispose();
        this.draggables[event.currentIndex] = refreshedDraggable;
        this.refreshDraggables();
        this.guildyService.refreshDropListConnections();
        newViewRef.detectChanges();
        this.guildyService.stateChanged$.next();
    }
}

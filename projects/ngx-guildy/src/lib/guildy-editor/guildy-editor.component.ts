import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ContentChildren,
    ElementRef,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    QueryList,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { NgxGuildyService } from '../ngx-guildy.service';
import {
    CdkDragDrop,
    CdkDragStart,
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

@Component({
    selector: 'guildy-editor',
    templateUrl: 'guildy-editor.component.html',
    styleUrls: ['guildy-editor.component.css'],
})
export class GuildyEditorComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
    //TODO debug color
    @Input()
    color = 50;
    @Input()
    depth = 0;
    _dndId!: string;

    inited = false;

    @ContentChildren(GuildyContainerDirective, { descendants: true })
    initialContainers!: QueryList<GuildyContainerDirective>;

    @ViewChild('dynRef', { read: ViewContainerRef })
    draggablesViewContainerRef!: ViewContainerRef;

    @ViewChild('dynRef', { read: ElementRef }) draggablesElementRef!: ElementRef;

    @ViewChild('placeholder') placeholderRef!: TemplateRef<any>;
    _orientation: DropListOrientation = 'vertical';
    _childrenCount = 0;

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

    ngOnInit(): void {
        this._dndId = this.depth == 0 ? 'guildy-editor' : uuidv4();
        this.componentMap = this.guildyService.componentMap;
        this.componentConstructorsMap = this.guildyService.componentConstructorsMap;
    }

    ngAfterContentInit(): void {
        //probably need to insert component here, instead of doing everything in the init...
    }

    ngAfterViewInit() {
        this.initialize();
    }

    initialize() {
        if (this.initialContainers.length == 0) {
            this.init(null);
        } else {
            this._childrenCount = this.initialContainers.length;
            this.initialContainers.forEach(e => {
                const id = uuidv4();
                this.init(e.hostComponent.constructor);
            });
        }

        this.cd.detectChanges();
        this.inited = true;
        this.cd.detectChanges();
    }

    resolveNgContent<T>(content: any) {
        const factory = this.componentFactoryResolver.resolveComponentFactory(content);
        const componentRef = factory.create(this.injector) as ComponentRef<any>;
        componentRef.instance!.depth = this.depth + 1;
        componentRef.hostView.detectChanges();
        return {
            content: componentRef,
        };
    }

    ngOnDestroy() {}

    initDropContainer() {
        const directParent = this.renderer.parentNode(this._elementRef.nativeElement);

        if (!directParent) {
            //TODO figure out why sometimes direct parent is not always immidiately available
            setTimeout(() => this.initDropContainer(), 10);
            return;
        }

        this.dropListRef = this.dnd.createDropList(directParent);
        this.guildyService.currentOrientation$.next(this._orientation);
        this.dropListRef.withOrientation(this._orientation);
        this.dropListRef.data = this;

        this.guildyService.addDndContainer(this._dndId, this.dropListRef);

        this.dropListRef.beforeStarted.subscribe(event => {
            try {
                this.renderer.addClass(directParent, 'cdk-drop-list-dragging');
            } catch (e) {
                console.error(e);
            }
        });
        this.dropListRef.entered.subscribe(r => {
            try {
                this._orientation = this.determineDirection(directParent);
                this.guildyService.currentOrientation$.next(this._orientation);
            } catch (e) {
                console.error(e);
            }
        });

        this.dropListRef.dropped.subscribe(event => {
            try {
                this.renderer.removeClass(directParent, 'cdk-drop-list-dragging');

                this.onDrop(event as any);
            } catch (e) {
                console.error(e);
            }
        });
        this.refreshDraggables();
    }

    init(componentType: ComponentType<any> | null) {
        this.cd.detectChanges();

        this.initDropContainer();
        this.initDraggables(componentType);
    }

    insertComponent(componentMeta: GuildyComponentOptions, position: number) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentMeta.ctor!);
        const { content } = this.resolveNgContent(GuildyEditorComponent);
        const compRef = this.draggablesViewContainerRef.createComponent(
            componentFactory,
            position,
            this.draggablesViewContainerRef.injector,
            [[content.location.nativeElement]]
        );

        const drag = this.dnd.createDrag(compRef.location);
        compRef.hostView.detectChanges();
        this.renderer.listen(compRef.location.nativeElement, 'click', e => {
            console.log(componentMeta);
            if (!componentMeta.clickThroughWhileEditing) {
                e.preventDefault();
                e.stopPropagation();
            }

            this.guildyService.componentSelected$.next({ options: componentMeta, componentRef: compRef });
        });
        drag.withPlaceholderTemplate({
            template: this.placeholderRef,
            viewContainer: this.viewContainerRef,
            context: null,
        });
        drag.data = { name: null, compRef: compRef };
        this.draggables.splice(position, 0, drag);
        this.refreshDraggables();
    }

    refreshDraggables() {
        this.dropListRef?.withItems(this.draggables);
    }

    swapComponent(from: number, to: number) {
        this.draggablesViewContainerRef.move(this.draggablesViewContainerRef.get(from)!, to);
        moveItemInArray(this.draggables, from, to);
    }

    onDrop(event: CdkDragDrop<any, any>) {
        if (
            !this.guildyService.dndContainerIds$
                .getValue()
                .map(d => d.id)
                .includes(event.previousContainer.data._dndId)
        ) {
            const id = uuidv4();
            const componentMeta = this.componentMap.get(event.item.data.name)!;

            setTimeout(() => {
                this.insertComponent(componentMeta, event.currentIndex);
            }, 0);
        } else if (event.previousContainer === event.container) {
            this.swapComponent(event.previousIndex, event.currentIndex);
        } else {
            if (event.previousContainer.data._dndId == 'library') {
                const componentMeta = this.componentMap.get(event.item.data.name)!;
                this.insertComponent(componentMeta, event.currentIndex);
            } else {
                this.transferComponent(event);
                //this.transferComponent
            }
        }
    }

    copy(i: number, $event: CdkDragStart) {
        //copyArrayItem($event.source., $event.source.data, i, i)
    }

    private initDraggables(componentType: ComponentType<any> | null) {
        let drag;
        if (componentType) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
            let ngContent = null;
            if (componentFactory.ngContentSelectors.length > 0) {
                const { content } = this.resolveNgContent(GuildyEditorComponent);
                ngContent = content;
            }

            const compRef = this.draggablesViewContainerRef.createComponent(
                componentFactory,
                0,
                this.draggablesViewContainerRef.injector,
                ngContent ? [[ngContent.location.nativeElement]] : undefined
            );
            drag = this.dnd.createDrag(compRef.location);
            // drag.withPlaceholderTemplate({
            //     template: this.placeholderRef,
            //     viewContainer: this.viewContainerRef,
            //     context: null,
            // });
            drag.data = {
                compRef: compRef,
                name: this.componentConstructorsMap.get(componentType)!.name,
            };
            compRef.hostView.detectChanges();
        }

        if (drag) this.draggables = [drag];
        else {
            this.draggables = [];
        }
        this.refreshDraggables();
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
        event.previousContainer.data.refreshDraggables();

        const oldDraggable = this.draggables[event.currentIndex];
        const refreshedDraggable = this.dnd.createDrag(oldDraggable.data.compRef.location);

        refreshedDraggable.data = this.draggables[event.currentIndex].data;
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
    }

    private determineDirection(dropListElementRef: ElementRef | HTMLElement): DropListOrientation {
        // @ts-ignore

        const element = dropListElementRef.nativeElement ?? dropListElementRef;

        const flexDirection = getComputedStyle(element).flexDirection;
        return flexDirection.startsWith('row') ? 'horizontal' : 'vertical';
    }
}

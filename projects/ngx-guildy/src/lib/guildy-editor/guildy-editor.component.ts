import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {NgxGuildyService} from "../ngx-guildy.service";
import {
  CdkDragDrop,
  CdkDragStart,
  DragDrop,
  DragRef,
  DropListOrientation,
  DropListRef,
  moveItemInArray
} from "@angular/cdk/drag-drop";
import {GuildyComponentOptions} from "../guildy-component.decorator";
import {uuidv4} from "../helper";
import {Observable} from "rxjs";
import {GuildyContainerDirective} from "../guildy-container.directive";
import {ComponentType} from "@angular/cdk/portal";


@Component({
  selector: 'guildy-editor',
  templateUrl: 'guildy-editor.component.html',
  styleUrls: ['guildy-editor.component.css'],
})
export class GuildyEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  aliveComponents: GuildyComponentOptions[] = [];
  componentMap = new Map<string, GuildyComponentOptions>();
  componentConstructorsMap = new Map<ComponentType<any>, GuildyComponentOptions>();
  //TODO debug color
  @Input()
  color = 50;
  @Input()
  depth = 0;
  _dndId!: string;
  _dndContainerIds!: Observable<{ id: string, ref: DropListRef }[]>;

  inited = false;

  @ContentChildren(GuildyContainerDirective, {descendants: true}) initialContainers!: QueryList<GuildyContainerDirective>;

  @ViewChild("dropList", {read: ViewContainerRef}) dropListViewContainerRef!: ViewContainerRef;
  @ViewChild("dropList", {read: ElementRef}) dropListElementRef!: ElementRef;

  @ViewChild("dynRef", {read: ViewContainerRef}) mainViewRef!: ViewContainerRef;
  @ViewChild("dynRef", {read: ElementRef}) mainElRef!: ElementRef;

  @ViewChild("placeholder") placeholderRef!: TemplateRef<any>;
  @ViewChild("ngContentTemplate", {read: TemplateRef}) ngContentSlot!: TemplateRef<any>;


  private dndList!: DropListRef<any>;
  private draggables: DragRef<any>[] = [];
  orientation: DropListOrientation = 'vertical';
  childrenCount = 0;

  constructor(private guildyService: NgxGuildyService, private componentFactoryResolver: ComponentFactoryResolver, private dnd: DragDrop, private injector: Injector, private viewContainerRef: ViewContainerRef) {

  }

  ngOnInit(): void {
    this._dndId = this.depth == 0 ? 'guildy-editor' : uuidv4();
    this._dndContainerIds = this.guildyService.dndContainerIds$;

    //TODO these should be in service already, instead of every component
    this.guildyService.guildyComponents.forEach(c => this.componentMap.set(c.name, c));
    this.guildyService.guildyComponents.forEach(c => this.componentConstructorsMap.set(c.ctor!, c));
    this.inited = false;
  }


  ngOnDestroy() {
    // // piirrä drag and drop area sellaisella tyylillä componentin päälle, että se ei interferaa (position:absolute? fixed)
    // // projisoi komponentti  sisarukseksi
    // const dashboard = {
    //   componentName: "Card",
    //   inputs: {dada: "dada"},
    //   children: [
    //     {componentName: "Text", inputs: [{text: "Value"}],},
    //     {componentName: "Card", inputs: [{title: "Value"}], children: []}
    //   ]
    // }
    //
    // this.guildyService.removeDndContainer(this._dndId);
  }

  ngAfterViewInit() {
    if (!this.inited) {
      if (this.initialContainers.length == 0) {
        this.init(null);
      } else {
        this.childrenCount = this.initialContainers.length;
        this.initialContainers.forEach(e => {
          const id = uuidv4();
        this.init(e.hostComponent.constructor);

        });
      }
    }
    setTimeout(() => this.inited = true, 0);
  }

  resolveNgContent<T>(content: any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(content);
    const componentRef = factory.create(this.injector) as any;
    componentRef.instance!.depth = this.depth + 1;
    componentRef.hostView.detectChanges();
    return [[componentRef.location.nativeElement]]
  }

  init(componentType: ComponentType<any> | null) {
    let drag;
    if (componentType) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
      const ngContent = this.resolveNgContent(GuildyEditorComponent);
      const compRef = this.mainViewRef.createComponent(componentFactory, 0, this.mainViewRef.injector, ngContent);
      compRef.hostView.detectChanges();
      drag = this.dnd.createDrag(compRef.location);
      drag.withPlaceholderTemplate({
        template: this.placeholderRef,
        viewContainer: this.dropListViewContainerRef,
        context: null
      });
      drag.data = this.componentConstructorsMap.get(componentType)!.name;
    }


    // this.mainViewRef.insert(compRef.hostView, 0);

    if (drag) this.draggables = [drag];
    else this.draggables = [];


    this.dndList = this.dnd.createDropList(this.dropListElementRef).withItems(this.draggables);

    this.orientation = this.determineDirection(this.dropListElementRef);
    this.guildyService.currentOrientation$.next(this.orientation);
    this.dndList.withOrientation(this.orientation);
    this.dndList.data = this._dndId;

    this.guildyService.addDndContainer(this._dndId, this.dndList);
    this.dndList.beforeStarted.subscribe(event => {
      try {
        this.dropListElementRef.nativeElement.classList.add('cdk-drop-list-dragging');
      } catch (e) {
        console.error(e);
      }
    });
    this.dndList.entered.subscribe(r => {
      this.orientation = this.determineDirection(this.dropListElementRef);
      this.guildyService.currentOrientation$.next(this.orientation);
    })

    this.dndList.dropped.subscribe(event => {
      try {
        this.dropListElementRef.nativeElement.classList.remove('cdk-drop-list-dragging');
        this.onDrop(event as any);
      } catch (e) {
        console.error(e);
      }
    });
  }

  insertComponent(componentCtor: ComponentType<any>, position: number) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentCtor);
    const ngContent = this.resolveNgContent(GuildyEditorComponent);
    const compRef = this.mainViewRef.createComponent(componentFactory, position, this.mainViewRef.injector, ngContent);
    const drag = this.dnd.createDrag(compRef.location);
    compRef.hostView.detectChanges();
    drag.withPlaceholderTemplate({
      template: this.placeholderRef,
      viewContainer: this.dropListViewContainerRef,
      context: null
    });
    this.draggables.splice(position, 0, drag);
    this.dndList.withItems(this.draggables);
    compRef.hostView.detectChanges();
  }

  swapComponent(from: number, to: number) {
    this.mainViewRef.move(this.mainViewRef.get(from)!, to);
    moveItemInArray(this.draggables, from, to);
  }

  private transferComponent(ref: any) {

  }

  onDrop(event: CdkDragDrop<GuildyComponentOptions[], any>) {
    if (!this.guildyService.dndContainerIds$.getValue().map(d => d.id).includes(event.previousContainer.data)) {
      const id = uuidv4();
      const componentMeta = this.componentMap.get(event.item.data)!;


      setTimeout(() => {
        this.insertComponent(componentMeta.ctor!, event.currentIndex);
      }, 0);


    } else if (event.previousContainer === event.container) {
      this.swapComponent(event.previousIndex, event.currentIndex);
    } else {
      if (event.previousContainer.data == "library") {
        const componentMeta = this.componentMap.get(event.item.data)!;
        this.insertComponent(componentMeta.ctor!, event.currentIndex);
      } else {

        //this.transferComponent
      }

    }
  }

  copy(i: number, $event: CdkDragStart) {
    //copyArrayItem($event.source., $event.source.data, i, i)
  }

  private determineDirection(dropListElementRef: ElementRef): DropListOrientation {
    const flexDirection = getComputedStyle(dropListElementRef.nativeElement).flexDirection;
    return flexDirection.startsWith("row") ? 'horizontal' : 'vertical';

  }

  private makeTemporaryDropList() {
    const templ = this.mainViewRef.createEmbeddedView(this.ngContentSlot);

  }
}



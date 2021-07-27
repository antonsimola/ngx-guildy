import {
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
  Type,
  ViewEncapsulation
} from '@angular/core';
import {NgxGuildyService} from "./ngx-guildy.service";
import {CdkDragDrop, CdkDragStart, copyArrayItem, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {GuildyComponentOptions} from "./guildy-component.decorator";
import {uuidv4} from "./helper";
import {Observable} from "rxjs";
import {GuildyContainerDirective} from "./guildy-container.directive";
import {ComponentPortal} from "@angular/cdk/portal";


@Component({
  selector: 'guildy-editor',
  templateUrl: 'guildy-editor.component.html',
  styleUrls: ['guildy-editor.component.css'],
})
export class GuildyEditorComponent implements OnInit {

  aliveComponents: GuildyComponentOptions[] = [];
  componentMap: { [key: string]: GuildyComponentOptions } = {};
  componentConstructorsMap = new Map<new (...args: any[]) => any, GuildyComponentOptions>();
  //TODO debug color
  @Input()
  color = 50;
  @Input()
  depth = 0;
  _dndId!: string;
  _dndContainerIds!: Observable<string[]>;

  @ContentChildren(GuildyContainerDirective, {descendants: true}) initialContainers!: QueryList<GuildyContainerDirective>;
  inited = false;


  getHsl() {
    return `hsl(${this.color}, 100%, 50%)`
  }


  constructor(private guildyService: NgxGuildyService, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this._dndId = this.depth == 0 ? 'guildy-editor' : uuidv4();
    setTimeout(() => {
      this.guildyService.addDndContainer(this._dndId);
    }, 0);
    this._dndContainerIds = this.guildyService.dndContainerIds;

    this.componentMap = this.guildyService.guildyComponents.reduce((acc, cur) => {
      acc[cur.name] = cur;
      return acc;
    }, {} as { [key: string]: GuildyComponentOptions })
    this.guildyService.guildyComponents.forEach(c => this.componentConstructorsMap.set(c.ctor!, c));
    this.inited = false;
  }


  ngOnDestroy() {
    this.guildyService.removeDndContainer(this._dndId);
  }

  ngAfterViewInit() {
    this.initialContainers.forEach(e => {
      const id = uuidv4();
      const componentMeta = this.componentConstructorsMap.get(e.hostComponent.constructor)!;
      this.aliveComponents.push({
        id: id,
        ...componentMeta,
        ...this.inspectComponent(componentMeta.ctor!)
      })
    });
  }

  inspectComponent(compType: Type<any>) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(compType);
    return {hasContent: componentFactory.ngContentSelectors.length > 0};
  }

  onDrop(event: CdkDragDrop<GuildyComponentOptions[], any>) {
    if (!this.guildyService.dndContainerIds.getValue().includes(event.previousContainer.id)) {
      const id = uuidv4();
      const componentMeta = this.componentMap[event.item.data];
      this.aliveComponents.splice(event.currentIndex, 0, {
          id: id,
          ...componentMeta,
          ...this.inspectComponent(componentMeta.ctor!),
        portal: new ComponentPortal<any>(componentMeta.ctor!)
        }
      )
    } else if (event.previousContainer === event.container) {
      moveItemInArray(this.aliveComponents, event.previousIndex, event.currentIndex);
    } else {
      //TODO keep the component alive
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  copy(i: number, $event: CdkDragStart) {
    //copyArrayItem($event.source., $event.source.data, i, i)
  }
}



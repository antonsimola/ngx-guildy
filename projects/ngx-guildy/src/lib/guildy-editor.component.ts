import {Component, ComponentFactoryResolver, Input, OnInit, Type, ViewContainerRef} from '@angular/core';
import {NgxGuildyService} from "./ngx-guildy.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {GuildyComponentOptionsExt} from "./guildy-component.decorator";
import {uuidv4} from "./helper";
import {Observable} from "rxjs";


@Component({
  selector: 'guildy-editor',
  templateUrl: 'guildy-editor.component.html',
  styleUrls: ['guildy-editor.component.css']
})
export class GuildyEditorComponent implements OnInit {

  aliveComponents: GuildyComponentOptionsExt[] = [];
  componentMap: { [key: string]: GuildyComponentOptionsExt } = {};
  //TODO debug color
  @Input()
  color = 50;
  @Input()
  depth = 0;
  dndId!: string;
  dndContainerIds!: Observable<string[]>;


  getHsl() {
    return `hsl(${this.color}, 100%, 50%)`
  }


  constructor(private guildyService: NgxGuildyService, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.dndId = this.depth == 0 ? 'guildy-editor' : uuidv4();
    setTimeout(() => {
      this.guildyService.addDndContainer(this.dndId);
    }, 0);
    this.dndContainerIds = this.guildyService.dndContainerIds;

    this.componentMap = this.guildyService.guildyComponents.reduce((acc, cur) => {
      acc[cur.name] = cur;
      return acc;
    }, {} as { [key: string]: GuildyComponentOptionsExt })
  }

  ngOnDestroy() {
    this.guildyService.removeDndContainer(this.dndId);
  }

  inspectComponent(compType: Type<any>) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(compType);
    return {hasContent: componentFactory.ngContentSelectors.length > 0};
  }

  onDrop(event: CdkDragDrop<GuildyComponentOptionsExt[], any>) {
    if (!this.guildyService.dndContainerIds.getValue().includes(event.previousContainer.id)) {
      const id = uuidv4();
      const componentMeta = this.componentMap[event.item.data];
      this.aliveComponents.splice(event.currentIndex, 0, {
          id: id,
          ...this.componentMap[event.item.data],
          ...this.inspectComponent(componentMeta.ctor)
        }
      )
    } else if (event.previousContainer === event.container) {
      moveItemInArray(this.aliveComponents, event.previousIndex, event.currentIndex);
    } else {

      setTimeout(() => {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      }, 0)

    }
  }
}



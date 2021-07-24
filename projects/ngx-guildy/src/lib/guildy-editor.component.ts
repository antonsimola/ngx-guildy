import {Component, ComponentFactoryResolver, Input, OnInit, Type, ViewContainerRef} from '@angular/core';
import {NgxGuildyService} from "./ngx-guildy.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {GuildyComponentOptionsExt} from "./guildy-component.decorator";

function uuidv4() {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}


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


  getHsl() {
    return `hsl(${this.color}, 100%, 50%)`
  }


  constructor(private guildyService: NgxGuildyService, private componentFactoryResolver: ComponentFactoryResolver) {

  }

  ngOnInit(): void {
    this.componentMap = this.guildyService.guildyComponents.reduce((acc, cur) => {
      acc[cur.name] = cur;
      return acc;
    }, {} as { [key: string]: GuildyComponentOptionsExt })
  }

  inspectComponent(compType: Type<any>) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(compType);
    console.log(componentFactory);
    return {hasContent: componentFactory.ngContentSelectors.length > 0};
  }

  onDrop(event: CdkDragDrop<GuildyComponentOptionsExt[], any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.aliveComponents, event.previousIndex, event.currentIndex);
    } else {
      const id = uuidv4();
      const componentMeta = this.componentMap[event.item.data];


      this.aliveComponents.splice(event.currentIndex, 0, {
          id: id,
          ...this.componentMap[event.item.data],
          ...this.inspectComponent(componentMeta.ctor)
        }
      )
      console.log(this.aliveComponents);
    }
  }
}



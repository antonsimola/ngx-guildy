import {Injectable} from '@angular/core';
import {NgxGuildyModule} from "./ngx-guildy.module";
import {GuildyComponentOptions} from "./guildy-component.decorator";
import {BehaviorSubject} from "rxjs";

@Injectable({providedIn: "root"})
export class NgxGuildyService {
  guildyComponents: GuildyComponentOptions[] = [];

  //TODO should be per editor somehow
  dndContainerIds = new BehaviorSubject<string[]>([]);


  constructor() {
    NgxGuildyModule.guildyComponentConstructors.forEach(i => this.guildyComponents.push(i));
  }

  addDndContainer(id: string) {
    this.dndContainerIds.next([id, ...this.dndContainerIds.getValue()]);
  }

  removeDndContainer(id: string) {
    this.dndContainerIds.next(this.dndContainerIds.getValue().filter(i => i != id));
  }
}

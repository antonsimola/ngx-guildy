import {Injectable} from '@angular/core';
import {NgxGuildyModule} from "./ngx-guildy.module";
import {GuildyComponentOptions} from "./guildy-component.decorator";
import {BehaviorSubject} from "rxjs";
import {DropListOrientation, DropListRef} from "@angular/cdk/drag-drop";

@Injectable({providedIn: "root"})
export class NgxGuildyService {
  guildyComponents: GuildyComponentOptions[] = [];

  //TODO should be per editor somehow
  dndContainerIds$ = new BehaviorSubject<{ id: string, ref: DropListRef }[]>([]);
  currentOrientation$ = new BehaviorSubject<DropListOrientation>('vertical');


  constructor() {
    NgxGuildyModule.guildyComponentConstructors.forEach(i => this.guildyComponents.push(i));


    this.dndContainerIds$.subscribe(containers => {
      for (let loop1 of containers) {
        loop1.ref.connectedTo(containers.map(r => r.ref));

      }
    })
  }

  addDndContainer(id: string, ref: DropListRef) {
    this.dndContainerIds$.next([{id, ref}, ...this.dndContainerIds$.getValue()]);
  }

  removeDndContainer(id: string) {
    this.dndContainerIds$.next(this.dndContainerIds$.getValue().filter(i => i.id != id));
  }
}

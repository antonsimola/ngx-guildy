import {Injectable} from '@angular/core';
import {NgxGuildyModule} from "./ngx-guildy.module";
import {GuildyComponentOptionsExt} from "./guildy-component.decorator";

@Injectable({providedIn: "root"})
export class NgxGuildyService {
  guildyComponents: GuildyComponentOptionsExt[] = [];

  constructor() {
    NgxGuildyModule.guildyComponentConstructors.forEach(i => this.guildyComponents.push(i));
  }
}

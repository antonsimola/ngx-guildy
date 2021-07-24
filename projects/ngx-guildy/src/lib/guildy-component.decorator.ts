import {NgxGuildyModule} from "./ngx-guildy.module";

export interface GuildyComponentOptions {
  name: string;
  editorType?: new (...args: any[]) => any;
}

export interface GuildyComponentOptionsExt extends GuildyComponentOptions {
  ctor: new (...args: any[]) => any;
  id?: string;
  hasContent?: boolean;
}


export function GuildyComponent(options: GuildyComponentOptions) {
  return function (ctor: new (...args: any[]) => any) {
    NgxGuildyModule.guildyComponentConstructors.push({...options, ctor: ctor});
  }
}

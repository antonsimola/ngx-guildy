import { ComponentType } from '@angular/cdk/portal';

export interface GuildyComponentOptions {
    name: string;
    editorType?: new (...args: any[]) => any;
    ctor?: ComponentType<any>;
    id?: string;
    hasContent?: boolean;
    clickThroughWhileEditing?: boolean;
    extra?: any;
}

export function GuildyComponent(options: GuildyComponentOptions) {
    return function (ctor: new (...args: any[]) => any) {
        if (!(window as any).guildyComponentConstructors) {
            (window as any).guildyComponentConstructors = [];
        }
        (window as any).guildyComponentConstructors.push({ ...options, ctor: ctor });
    };
}

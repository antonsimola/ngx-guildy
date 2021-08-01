import { ComponentRef, Injectable } from '@angular/core';
import { NgxGuildyModule } from './ngx-guildy.module';
import { GuildyComponentOptions } from './guildy-component.decorator';
import { BehaviorSubject, Subject } from 'rxjs';
import { DropListOrientation, DropListRef } from '@angular/cdk/drag-drop';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({ providedIn: 'root' })
export class NgxGuildyService {
    guildyComponents: GuildyComponentOptions[] = [];
    componentMap = new Map<string, GuildyComponentOptions>();
    componentConstructorsMap = new Map<ComponentType<any>, GuildyComponentOptions>();
    //TODO should be per editor somehow
    dndContainerIds$ = new BehaviorSubject<{ id: string; ref: DropListRef }[]>([]);

    currentOrientation$ = new BehaviorSubject<DropListOrientation>('vertical');
    componentSelected$ = new Subject<{ options: GuildyComponentOptions; componentRef: ComponentRef<any> }>();

    constructor() {
        NgxGuildyModule.guildyComponentConstructors.forEach(i => this.guildyComponents.push(i));

        this.guildyComponents.forEach(c => this.componentMap.set(c.name, c));
        this.guildyComponents.forEach(c => this.componentConstructorsMap.set(c.ctor!, c));
        this.dndContainerIds$.subscribe(() => {
            this.refreshDropListConnections();
        });
    }

    refreshDropListConnections() {
        const containers = this.dndContainerIds$.getValue();
        for (let loop1 of containers) {
            loop1.ref.connectedTo(containers.map(r => r.ref));
        }
    }

    addDndContainer(id: string, ref: DropListRef) {
        this.dndContainerIds$.next([{ id, ref }, ...this.dndContainerIds$.getValue()]);
    }

    removeDndContainer(id: string) {
        this.dndContainerIds$.next(this.dndContainerIds$.getValue().filter(i => i.id != id));
    }
}

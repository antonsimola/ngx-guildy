import { NgModule } from '@angular/core';
import { GuildyEditorComponent } from './guildy-editor/guildy-editor.component';
import { GuildyComponentOptions } from './guildy-component.decorator';
import { ComponentLibraryComponent } from './component-library/component-library.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DynamicComponent } from './dynamic-component/dynamic-component.component';
import { installPatch } from './patch-dnd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GuildyMovableDirective } from './guildy-movable.directive';
import { GuildyContainerDirective } from './guildy-container.directive';
import { ContenteditableDirective } from './contenteditable.directive';
import { PortalModule } from '@angular/cdk/portal';
import { ComponentSettingsComponent } from './component-settings/component-settings.component';

installPatch();

@NgModule({
    declarations: [
        GuildyEditorComponent,
        ComponentLibraryComponent,
        DynamicComponent,
        GuildyMovableDirective,
        GuildyContainerDirective,
        ContenteditableDirective,
        ComponentSettingsComponent,
    ],
    imports: [BrowserAnimationsModule, CommonModule, DragDropModule, PortalModule],
    exports: [
        GuildyEditorComponent,
        ComponentLibraryComponent,
        GuildyContainerDirective,
        GuildyMovableDirective,
        ContenteditableDirective,
        ComponentSettingsComponent,
    ],
})
export class NgxGuildyModule {
    static guildyComponentConstructors: GuildyComponentOptions[] = [];

    constructor() {}
}

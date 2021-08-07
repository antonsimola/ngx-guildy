import { NgModule } from '@angular/core';
import { GuildyEditorComponent } from './guildy-editor/guildy-editor.component';
import { GuildyComponentOptions } from './guildy-component.decorator';
import { ComponentLibraryComponent } from './component-library/component-library.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GuildyMovableDirective } from './guildy-movable.directive';
import { GuildyContainerDirective } from './guildy-container.directive';
import { ContenteditableDirective } from './contenteditable.directive';
import { ComponentSettingsComponent } from './component-settings/component-settings.component';
import { DragPlaceholderComponent } from './drag-placeholder/drag-placeholder.component';
import { ComponentSettingsHeaderDirective } from './component-settings/component-settings-header.directive';
import { ComponentSettingsFooterDirective } from './component-settings/component-settings-footer.directive';
import { installPatch } from './patch-dnd';
import { GuildyComponentItemDirective } from './component-library/component-item.directive';

installPatch();

@NgModule({
    declarations: [
        GuildyEditorComponent,
        ComponentLibraryComponent,
        GuildyMovableDirective,
        GuildyContainerDirective,
        ContenteditableDirective,
        ComponentSettingsComponent,
        DragPlaceholderComponent,
        ComponentSettingsHeaderDirective,
        ComponentSettingsFooterDirective,
        GuildyComponentItemDirective,
    ],
    imports: [BrowserAnimationsModule, CommonModule, DragDropModule],
    exports: [
        GuildyEditorComponent,
        ComponentLibraryComponent,
        ComponentSettingsHeaderDirective,
        ComponentSettingsFooterDirective,
        GuildyContainerDirective,
        GuildyMovableDirective,
        ContenteditableDirective,
        ComponentSettingsComponent,
        GuildyComponentItemDirective,
    ],
})
export class NgxGuildyModule {
    static guildyComponentConstructors: GuildyComponentOptions[] = [];

    constructor() {}
}

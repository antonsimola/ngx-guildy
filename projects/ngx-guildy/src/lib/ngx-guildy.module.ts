import {NgModule} from '@angular/core';
import {GuildyEditorComponent} from './guildy-editor.component';
import {GuildyComponentOptionsExt} from "./guildy-component.decorator";
import {ComponentLibraryComponent} from './component-library/component-library.component';
import {CommonModule} from "@angular/common";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {DynamicComponent} from "./dynamic-component/dynamic-component.component";
import {installPatch} from "./patch-dnd";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


installPatch();

@NgModule({
  declarations: [
    GuildyEditorComponent,
    ComponentLibraryComponent,
    DynamicComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    DragDropModule
  ],
  exports: [
    GuildyEditorComponent,
    ComponentLibraryComponent
  ]
})
export class NgxGuildyModule {
  static guildyComponentConstructors: GuildyComponentOptionsExt[] = [];

  constructor() {
  }
}

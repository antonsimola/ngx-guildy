import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxGuildyModule } from 'ngx-guildy';
import { MyAddableComponent } from './my-addable-component/my-addable.component';
import { MyButtonComponent } from './my-button/my-button.component';
import { MyCardComponent } from './my-card/my-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MyComponentLibraryComponent } from './my-component-library/my-component-library.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MyFlexContainerComponent } from './my-flex-container/my-flex-container.component';
import { FlexEditorComponent } from './my-flex-container/flex-editor/flex-editor.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    declarations: [
        AppComponent,
        MyAddableComponent,
        MyButtonComponent,
        MyCardComponent,
        MyComponentLibraryComponent,
        MyFlexContainerComponent,
        FlexEditorComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgxGuildyModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatButtonModule,
        DragDropModule,
        FlexModule,
        FormsModule,
        MatCheckboxModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxGuildyModule } from 'ngx-guildy';
import { MyTextComponent } from './my-addable-component/my-text.component';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { TextEditorComponent } from './my-addable-component/text-editor/text-editor.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MyButtonEditorComponent } from './my-button/my-button-editor/my-button-editor.component';
import { CardEditorComponent } from './my-card/card-editor/card-editor.component';

@NgModule({
    declarations: [
        AppComponent,
        MyTextComponent,
        MyButtonComponent,
        MyCardComponent,
        MyComponentLibraryComponent,
        MyFlexContainerComponent,
        FlexEditorComponent,
        TextEditorComponent,
        MyButtonEditorComponent,
        CardEditorComponent,
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
        MatFormFieldModule,
        MatInputModule,
        MatSliderModule,
        MatExpansionModule,
        MatDividerModule,
        MatTabsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

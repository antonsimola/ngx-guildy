import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgxGuildyModule} from "ngx-guildy";
import { MyAddableComponent } from './my-addable-component/my-addable.component';
import { MyButtonComponent } from './my-button/my-button.component';
import { MyCardComponent } from './my-card/my-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";

@NgModule({
  declarations: [
    AppComponent,
    MyAddableComponent,
    MyButtonComponent,
    MyCardComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgxGuildyModule,
        BrowserAnimationsModule,
        MatCardModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

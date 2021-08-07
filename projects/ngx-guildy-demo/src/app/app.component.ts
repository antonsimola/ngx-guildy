import { Component } from '@angular/core';
import { ComponentStructure } from 'ngx-guildy';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'ngx-guildy-demo';
    structure: ComponentStructure | undefined;
}

import { Component } from '@angular/core';
import { ComponentStructure } from 'ngx-guildy';
import { MyTextComponent } from './my-addable-component/my-text.component';
import { MyButtonComponent } from './my-button/my-button.component';
import { MyCardComponent } from './my-card/my-card.component';
import { MyFlexContainerComponent } from './my-flex-container/my-flex-container.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'ngx-guildy-demo';
    inStructure: ComponentStructure | undefined;
    outStructure: ComponentStructure | undefined;
    components = [MyTextComponent, MyButtonComponent, MyCardComponent, MyFlexContainerComponent];

    changeStructure($event: any) {
        console.log('change');
        this.inStructure = JSON.parse($event);
    }
}

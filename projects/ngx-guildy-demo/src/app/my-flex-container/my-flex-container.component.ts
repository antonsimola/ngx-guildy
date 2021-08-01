import { Component, OnInit } from '@angular/core';
import { GuildyComponent } from 'ngx-guildy';

@Component({
    selector: 'app-my-flex-container',
    templateUrl: './my-flex-container.component.html',
    styleUrls: ['./my-flex-container.component.scss'],
})
@GuildyComponent({ name: 'Flex', editorType: FlexEditor })
export class MyFlexContainerComponent implements OnInit {
    isRow = false;

    constructor() {}

    ngOnInit(): void {}
}

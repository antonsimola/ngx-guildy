import { Component, Input, OnInit } from '@angular/core';
import { GuildyComponent } from 'ngx-guildy';
import { FlexEditorComponent } from './flex-editor/flex-editor.component';

@Component({
    selector: 'app-my-flex-container',
    templateUrl: './my-flex-container.component.html',
    styleUrls: ['./my-flex-container.component.scss'],
})
@GuildyComponent({ name: 'Flex', editorType: FlexEditorComponent })
export class MyFlexContainerComponent implements OnInit {
    @Input()
    isRow = false;
    @Input()
    color!: string;
    @Input()
    padding: number = 16;
    @Input()
    margin: number = 16;

    constructor() {
        this.color = 'hsl(' + Math.round(Math.random() * 360) + ',100%, 75%)';
    }

    ngOnInit(): void {}
}

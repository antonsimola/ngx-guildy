import { Component, Input, OnInit } from '@angular/core';
import { GuildyComponent } from 'ngx-guildy';
import { MyButtonEditorComponent } from './my-button-editor/my-button-editor.component';

@Component({
    selector: 'app-my-button',
    templateUrl: './my-button.component.html',
    styleUrls: ['./my-button.component.scss'],
})
@GuildyComponent({ name: 'Button', editorType: MyButtonEditorComponent })
export class MyButtonComponent implements OnInit {
    private static counter: number = 0;
    @Input()
    buttonText: string = 'BUTTON TEXT';
    staticIndex: any;

    constructor() {
        MyButtonComponent.counter += 1;
        this.staticIndex = MyButtonComponent.counter;
    }

    ngOnInit(): void {}

    log() {
        console.log('hello');
    }
}

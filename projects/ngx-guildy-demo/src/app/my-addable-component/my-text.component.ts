import { Component, Input, OnInit } from '@angular/core';
import { GuildyComponent } from 'ngx-guildy';
import { TextEditorComponent } from './text-editor/text-editor.component';

@Component({
    selector: 'my-text-component',
    templateUrl: './my-text.component.html',
    styleUrls: ['./my-text.component.scss'],
})
@GuildyComponent({ name: 'Text', editorType: TextEditorComponent })
export class MyTextComponent implements OnInit {
    static counter = 0;
    id: number;
    @Input()
    text = 'Hello';
    @Input()
    fontSize: any;

    constructor() {
        this.id = MyTextComponent.counter++;
    }

    ngOnInit(): void {}
}

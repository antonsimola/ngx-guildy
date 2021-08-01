import { Component, Input, OnInit } from '@angular/core';
import { GuildyComponent } from 'ngx-guildy';
import { TextEditorComponent } from './text-editor/text-editor.component';

@Component({
    selector: 'app-my-addable-component',
    templateUrl: './my-addable.component.html',
    styleUrls: ['./my-addable.component.scss'],
})
@GuildyComponent({ name: 'Text', editorType: TextEditorComponent })
export class MyAddableComponent implements OnInit {
    static counter = 0;
    id: number;
    @Input()
    text = 'Hello';
    @Input()
    fontSize: any;

    constructor() {
        this.id = MyAddableComponent.counter++;
    }

    ngOnInit(): void {}
}

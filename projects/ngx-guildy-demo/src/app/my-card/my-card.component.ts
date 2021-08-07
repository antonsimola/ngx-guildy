import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GuildyComponent } from 'ngx-guildy';
import { CardEditorComponent } from './card-editor/card-editor.component';

@Component({
    selector: 'app-my-card',
    templateUrl: './my-card.component.html',
    styleUrls: ['./my-card.component.scss'],
})
@GuildyComponent({ name: 'Card', editorType: CardEditorComponent })
export class MyCardComponent implements OnInit {
    @Input()
    title: string = 'Title';
    @Output()
    titleChanged = new EventEmitter<string>();

    constructor() {}

    ngOnInit(): void {}

    change($event: any) {}
}

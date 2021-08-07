import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-card-editor',
    templateUrl: './card-editor.component.html',
    styleUrls: ['./card-editor.component.scss'],
})
export class CardEditorComponent implements OnInit {
    @Input()
    title: string | undefined;
    @Output()
    titleChanged = new EventEmitter<string>();

    constructor() {}

    ngOnInit(): void {}
}

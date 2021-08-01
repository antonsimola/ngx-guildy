import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-text-editor',
    templateUrl: './text-editor.component.html',
    styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements OnInit {
    @Input()
    fontSize = 16;
    @Output()
    fontSizeChanged = new EventEmitter<number>();

    constructor() {}

    ngOnInit(): void {}
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-my-button-editor',
    templateUrl: './my-button-editor.component.html',
    styleUrls: ['./my-button-editor.component.scss'],
})
export class MyButtonEditorComponent implements OnInit {
    @Input()
    buttonText = 'Text';
    @Output()
    buttonTextChanged = new EventEmitter<string>();

    constructor() {}

    ngOnInit(): void {}
}

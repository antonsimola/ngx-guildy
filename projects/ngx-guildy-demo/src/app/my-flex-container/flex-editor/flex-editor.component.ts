import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-flex-editor',
    templateUrl: './flex-editor.component.html',
    styleUrls: ['./flex-editor.component.scss'],
})
export class FlexEditorComponent implements OnInit {
    @Input()
    isRow: boolean = false;
    @Output()
    isRowChanged = new EventEmitter<boolean>();

    constructor() {}

    ngOnInit(): void {}
}

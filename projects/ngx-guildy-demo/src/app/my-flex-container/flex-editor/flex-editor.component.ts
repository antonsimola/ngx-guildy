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
    @Input()
    color: string = '';
    @Output()
    colorChanged = new EventEmitter<string>();

    @Input() padding: number = 16;
    @Output()
    paddingChanged = new EventEmitter<number>();

    @Input() margin: number = 16;
    @Output()
    marginChanged = new EventEmitter<number>();

    constructor() {}

    ngOnInit(): void {}
}

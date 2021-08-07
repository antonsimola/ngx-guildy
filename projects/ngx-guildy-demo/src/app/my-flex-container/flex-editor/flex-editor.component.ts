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
    isRowChange = new EventEmitter<boolean>();
    @Input()
    color: string = '';
    @Output()
    colorChange = new EventEmitter<string>();

    @Input() padding: number = 16;
    @Output()
    paddingChange = new EventEmitter<number>();

    @Input() margin: number = 16;
    @Output()
    marginChange = new EventEmitter<number>();

    constructor() {}

    ngOnInit(): void {}
}

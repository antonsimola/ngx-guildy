import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-my-component-library',
    templateUrl: './my-component-library.component.html',
    styleUrls: ['./my-component-library.component.scss'],
})
export class MyComponentLibraryComponent implements OnInit, AfterViewInit {
    constructor() {}

    ngAfterViewInit(): void {}

    ngOnInit(): void {}
}

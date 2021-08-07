import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GuildyComponentOptions, NgxGuildyService } from 'ngx-guildy';
import { DragDrop } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-my-component-library',
    templateUrl: './my-component-library.component.html',
    styleUrls: ['./my-component-library.component.scss'],
})
export class MyComponentLibraryComponent implements OnInit, AfterViewInit {
    components: GuildyComponentOptions[];

    constructor(public guildyService: NgxGuildyService, private dnd: DragDrop) {
        this.components = this.guildyService.guildyComponents;
    }

    ngAfterViewInit(): void {}

    ngOnInit(): void {}
}

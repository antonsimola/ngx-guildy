import { Component } from '@angular/core';
import { NgxGuildyService } from './../ngx-guildy.service';

@Component({
    selector: 'guildy-drag-placeholder',
    templateUrl: './drag-placeholder.component.html',
    styleUrls: ['./drag-placeholder.component.css'],
})
export class DragPlaceholderComponent {
    orientation$ = this.guildyService.currentOrientation$;
    constructor(private guildyService: NgxGuildyService) {}
}

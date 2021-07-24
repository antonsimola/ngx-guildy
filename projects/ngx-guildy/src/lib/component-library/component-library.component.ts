import {Component, OnInit} from '@angular/core';
import {NgxGuildyService} from "../ngx-guildy.service";
import {GuildyComponentOptionsExt} from "../guildy-component.decorator";

@Component({
  selector: 'guildy-component-library',
  templateUrl: './component-library.component.html',
  styleUrls: ['./component-library.component.css']
})
export class ComponentLibraryComponent implements OnInit {
  components: GuildyComponentOptionsExt[] = [];

  constructor(public guildyService: NgxGuildyService) {
    this.components = guildyService.guildyComponents;
  }

  ngOnInit(): void {
  }


}

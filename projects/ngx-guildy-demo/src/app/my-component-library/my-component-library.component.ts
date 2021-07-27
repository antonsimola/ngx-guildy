import { Component, OnInit } from '@angular/core';
import {GuildyComponentOptions, NgxGuildyService} from "ngx-guildy";

@Component({
  selector: 'app-my-component-library',
  templateUrl: './my-component-library.component.html',
  styleUrls: ['./my-component-library.component.scss']
})
export class MyComponentLibraryComponent implements OnInit {
  components: GuildyComponentOptions[];

  constructor(public guildyService: NgxGuildyService) {
    this.components = this.guildyService.guildyComponents
  }

  ngOnInit(): void {
  }

}

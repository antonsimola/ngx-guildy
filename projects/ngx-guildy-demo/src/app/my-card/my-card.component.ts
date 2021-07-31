import {Component, Input, OnInit} from '@angular/core';
import {GuildyComponent} from "ngx-guildy";

@Component({
  selector: 'app-my-card',
  templateUrl: './my-card.component.html',
  styleUrls: ['./my-card.component.scss']
})
@GuildyComponent({name: "Card"})
export class MyCardComponent implements OnInit {
  @Input()
  title: string = "Title";

  constructor() {
  }

  ngOnInit(): void {
  }

  change($event: any) {

  }
}

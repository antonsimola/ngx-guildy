import {Component, Input, OnInit} from '@angular/core';
import {GuildyComponent} from "ngx-guildy";

@Component({
  selector: 'app-my-button',
  templateUrl: './my-button.component.html',
  styleUrls: ['./my-button.component.scss']
})
@GuildyComponent({name: "Button"})
export class MyButtonComponent implements OnInit {
  @Input()
  buttonText: string = "BUTTON TEXT";

  constructor() { }

  ngOnInit(): void {
  }

  log() {
    console.log("hello");
  }
}

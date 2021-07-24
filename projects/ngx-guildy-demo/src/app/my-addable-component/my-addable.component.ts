import {Component, Input, OnInit} from '@angular/core';
import {GuildyComponent} from "ngx-guildy";

@Component({
  selector: 'app-my-addable-component',
  templateUrl: './my-addable.component.html',
  styleUrls: ['./my-addable.component.scss']
})
@GuildyComponent({name: "MyAddableComponent"})
export class MyAddableComponent implements OnInit {
  static counter = 0;
  id: number;
  @Input()
  text = "Hello";

  constructor() {
    this.id = MyAddableComponent.counter++;
  }

  ngOnInit(): void {
  }

}

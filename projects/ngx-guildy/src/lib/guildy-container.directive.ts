import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[guildyContainer]'
})
export class GuildyContainerDirective {

  @Input() hostComponent: any;

  constructor() {
  }
}

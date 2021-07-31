import {Directive, ElementRef, Input, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[guildyContainer]'
})
export class GuildyContainerDirective {

  @Input() hostComponent: any;

  constructor(private elementRef: ElementRef, private viewContainerRef: ViewContainerRef) {
  }
}

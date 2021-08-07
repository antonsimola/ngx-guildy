import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentSettingsContext } from './component-settings-header.directive';

@Directive({
    selector: '[guildyComponentSettingsFooter]',
})
export class ComponentSettingsFooterDirective {
    data = { data: 'Hello' };

    constructor(private templateRef: TemplateRef<{ $implicit: ComponentSettingsContext }>) {}
    ngOnInit() {
        // this.viewContainerRef.createEmbeddedView(this.templateRef, this.data);
    }

    show(viewContainerRef: ViewContainerRef, ctx: ComponentSettingsContext) {
        viewContainerRef.createEmbeddedView(this.templateRef, { $implicit: ctx });
    }
}

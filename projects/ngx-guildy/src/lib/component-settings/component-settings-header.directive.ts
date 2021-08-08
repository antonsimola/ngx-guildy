import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { GuildyComponentOptions } from '../guildy-component.decorator';
import { ComponentStructure } from '../guildy-editor/guildy-editor.component';

export interface ComponentSettingsContext {
    /**
     * The options originally passed to the Decorator
     */
    options: GuildyComponentOptions;
    /**
     * The component instance
     */
    component: any;
    /**
     * The component structure (part of json) for this component
     */
    state: ComponentStructure;

    /**
     * Function to delete component with
     */
    deleteComponent: () => void;
}

@Directive({
    selector: '[guildyComponentSettingsHeader]',
})
export class ComponentSettingsHeaderDirective {
    constructor(private templateRef: TemplateRef<{ $implicit: ComponentSettingsContext }>) {}

    ngOnInit() {}

    show(viewContainerRef: ViewContainerRef, ctx: ComponentSettingsContext) {
        viewContainerRef.createEmbeddedView(this.templateRef, { $implicit: ctx });
    }
}

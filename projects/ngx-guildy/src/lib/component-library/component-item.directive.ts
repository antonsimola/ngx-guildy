import { ChangeDetectorRef, Directive, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { GuildyComponentOptions } from '../guildy-component.decorator';
import { DragDrop, DropListRef } from '@angular/cdk/drag-drop';

@Directive({
    selector: '[guildyComponentItem]',
})
export class GuildyComponentItemDirective {
    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private templateRef: TemplateRef<{ $implicit: GuildyComponentOptions }>,
        private dnd: DragDrop,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit() {}

    show(
        viewContainerRef: ViewContainerRef,
        dropRef: DropListRef,
        placeholderRef: TemplateRef<any>,
        ctx: GuildyComponentOptions
    ) {
        const templateInstance = viewContainerRef.createEmbeddedView(this.templateRef, { $implicit: ctx });
        const droppable = this.dnd.createDrag(templateInstance.rootNodes[0]);
        droppable.data = { name: ctx.name };
        droppable.withPlaceholderTemplate({
            template: placeholderRef,
            viewContainer: viewContainerRef,
            context: null,
        });
        this.cd.detectChanges();
        return droppable;
    }
}

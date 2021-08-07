import {
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    ContentChildren,
    OnInit,
    QueryList,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { NgxGuildyService } from '../ngx-guildy.service';
import { Subscription } from 'rxjs';
import { ComponentStructure } from '../guildy-editor/guildy-editor.component';
import { ComponentSettingsFooterDirective } from './component-settings-footer.directive';
import { ComponentSettingsHeaderDirective } from './component-settings-header.directive';

@Component({
    selector: 'guildy-component-settings',
    templateUrl: './component-settings.component.html',
    styleUrls: ['./component-settings.component.css'],
})
export class ComponentSettingsComponent implements OnInit {
    @ViewChild('componentSettingSlot', { read: ViewContainerRef, static: true })
    componentSettingSlot!: ViewContainerRef;
    sub: Subscription | undefined;
    @ContentChildren(ComponentSettingsHeaderDirective) headers!: QueryList<ComponentSettingsHeaderDirective>;
    @ContentChildren(ComponentSettingsFooterDirective) footers!: QueryList<ComponentSettingsFooterDirective>;
    @ViewChild('headerSlot', { read: ViewContainerRef }) headerSlot!: ViewContainerRef;
    @ViewChild('footerSlot', { read: ViewContainerRef }) footerSlot!: ViewContainerRef;

    private subs: Subscription[] = [];

    constructor(private guildyService: NgxGuildyService, private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit(): void {
        this.sub = this.guildyService.componentSelected$.subscribe(e => {
            if (e.options.editorType) {
                const ctx = {
                    options: e.options,
                    component: e.componentRef.instance,
                    structure: e.structure,
                    deleteComponent: () => this.delete(e.structure.id),
                };
                this.headerSlot.clear();
                this.footerSlot.clear();
                this.headers.forEach(f => f.show(this.headerSlot, ctx));
                this.footers.forEach(f => f.show(this.footerSlot, ctx));
                const settingsFactory = this.componentFactoryResolver.resolveComponentFactory(e.options.editorType);
                const editorFactory = this.componentFactoryResolver.resolveComponentFactory(e.options.ctor!);
                this.componentSettingSlot.clear();
                const settingsCompRef = this.componentSettingSlot.createComponent(settingsFactory);
                this.cleanSettingSubs();
                this.setInputs(e.componentRef, settingsCompRef, settingsFactory.inputs, editorFactory);
                this.listenOutputs(e.componentRef, settingsCompRef, settingsFactory.outputs, e.structure);
            } else {
                this.componentSettingSlot.clear();
            }
        });
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
        this.sub?.unsubscribe();
    }

    cleanSettingSubs() {
        for (let sub of this.subs) {
            sub.unsubscribe();
        }
        this.subs = [];
    }

    private listenOutputs(
        editorComponentRef: ComponentRef<any>,
        settingsComponentRef: ComponentRef<any>,
        outputs: { propName: string; templateName: string }[],
        structure: ComponentStructure
    ) {
        for (let output of outputs) {
            this.subs.push(
                settingsComponentRef.instance[output.templateName].subscribe((v: any) => {
                    const withoutChanged = output.propName.replace(new RegExp('Change(d)?$'), '');

                    structure.inputs[withoutChanged] = v;
                    editorComponentRef.instance[withoutChanged] = v;
                    editorComponentRef.changeDetectorRef.detectChanges();
                    this.guildyService.structureChanged$.next();
                })
            );
        }
    }

    private setInputs(
        editorComponentRef: ComponentRef<any>,
        settingsComponentRef: ComponentRef<any>,
        inputs: { propName: string; templateName: string }[],
        editorFactory: ComponentFactory<any>
    ) {
        for (let input of inputs) {
            settingsComponentRef.instance[input.propName] = editorComponentRef.instance[input.propName];

            // TODO two way from editor -> settings is buggy, need to figure out a new way...
            // const foundTwoWayBinding = editorFactory.outputs.find(
            //     o => o.propName.replace(new RegExp('Change[d?]$'), '') == input.propName
            // );
            // if (foundTwoWayBinding) {
            //     this.subs.push(
            //         editorComponentRef.instance[foundTwoWayBinding.propName].subscribe((editorOutputChange: any) => {
            //             settingsComponentRef.instance[input.propName] = editorOutputChange;
            //             editorComponentRef.changeDetectorRef.detectChanges();
            //         })
            //     );
            // }
        }

        settingsComponentRef.changeDetectorRef.detectChanges();
    }

    private delete(id: string) {
        this.footerSlot.clear();
        this.headerSlot.clear();
        this.componentSettingSlot.clear();
        this.guildyService.deleteRequested$.next(id);
    }
}

import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxGuildyService } from '../ngx-guildy.service';

@Component({
    selector: 'guildy-component-settings',
    templateUrl: './component-settings.component.html',
    styleUrls: ['./component-settings.component.css'],
})
export class ComponentSettingsComponent implements OnInit {
    @ViewChild('componentSettingSlot', { read: ViewContainerRef, static: true })
    componentSettingSlot!: ViewContainerRef;
    private subs: any[] = [];

    constructor(private guildyService: NgxGuildyService, private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit(): void {
        this.guildyService.componentSelected$.subscribe(e => {
            if (e.options.editorType) {
                const factory = this.componentFactoryResolver.resolveComponentFactory(e.options.editorType);
                this.componentSettingSlot.clear();
                const settingsCompRef = this.componentSettingSlot.createComponent(factory);

                this.setInputs(e.componentRef, settingsCompRef, factory.inputs);
                this.listenOutputs(e.componentRef, settingsCompRef, factory.outputs);
            } else {
                this.componentSettingSlot.clear();
            }
        });
    }

    private listenOutputs(
        editorComponentRef: ComponentRef<any>,
        settingsComponentRef: ComponentRef<any>,
        outputs: { propName: string; templateName: string }[]
    ) {
        for (let sub of this.subs) {
            sub.unsubscribe();
        }
        this.subs = [];
        for (let output of outputs) {
            settingsComponentRef.instance[output.templateName].subscribe((v: any) => {
                const withoutChanged = output.propName.replace('Changed', '');
                editorComponentRef.instance[withoutChanged] = v;
                editorComponentRef.changeDetectorRef.detectChanges();
            });
        }
    }

    private setInputs(
        editorComponentRef: ComponentRef<any>,
        settingsComponentRef: ComponentRef<any>,
        inputs: { propName: string; templateName: string }[]
    ) {
        for (let input of inputs) {
            settingsComponentRef.instance[input.propName] = editorComponentRef.instance[input.propName];
        }
        settingsComponentRef.changeDetectorRef.detectChanges();
    }
}

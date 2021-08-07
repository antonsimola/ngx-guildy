import { Component, ContentChild, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxGuildyService } from '../ngx-guildy.service';
import { GuildyComponentOptions } from '../guildy-component.decorator';
import { DragDrop, DragRef, DropListRef } from '@angular/cdk/drag-drop';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GuildyComponentItemDirective } from './component-item.directive';

@Component({
    selector: 'guildy-component-library',
    templateUrl: './component-library.component.html',
    styleUrls: ['./component-library.component.css'],
})
export class ComponentLibraryComponent implements OnInit {
    components: GuildyComponentOptions[] = [];
    @ViewChild('dropList', { static: true }) dropList!: ElementRef;
    @ViewChild('dropList', { static: true, read: ViewContainerRef }) dropListView!: ViewContainerRef;
    @ContentChild(GuildyComponentItemDirective, { read: GuildyComponentItemDirective })
    componentDefinitionTemplate!: GuildyComponentItemDirective;
    @ViewChild('placeholder') placeholderRef!: TemplateRef<any> | null;
    private dropRef!: DropListRef<any>;
    private destroySubject = new Subject();
    private droppables: DragRef<any>[] = [];

    constructor(public guildyService: NgxGuildyService, private dnd: DragDrop) {
        this.components = guildyService.guildyComponents;
    }

    ngOnInit(): void {}

    ngOnDestroy() {
        this.destroySubject.next();
        this.destroySubject.complete();
    }

    ngAfterViewInit() {
        this.dropRef = this.dnd.createDropList(this.dropList);
        this.guildyService.addDndContainer('library', this.dropRef);
        this.dropRef.data = { _dndId: 'library' };

        // this.dropListView.clear();

        this.guildyService.guildyComponents.forEach(comp => {
            this.droppables.push(
                this.componentDefinitionTemplate.show(this.dropListView, this.dropRef, this.placeholderRef!, comp)
            );
        });

        this.dropRef.withItems(this.droppables);
        this.dropRef.beforeStarted.pipe(takeUntil(this.destroySubject)).subscribe(event => {
            try {
                this.dropList.nativeElement.classList.add('cdk-drop-list-dragging');
            } catch (e) {
                console.error(e);
            }
        });
    }
}

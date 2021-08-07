import {
    Component,
    ContentChildren,
    ElementRef,
    OnInit,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { NgxGuildyService } from '../ngx-guildy.service';
import { GuildyComponentOptions } from '../guildy-component.decorator';
import { CdkDrag, DragDrop, DropListRef } from '@angular/cdk/drag-drop';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'guildy-component-library',
    templateUrl: './component-library.component.html',
    styleUrls: ['./component-library.component.css'],
})
export class ComponentLibraryComponent implements OnInit {
    components: GuildyComponentOptions[] = [];
    @ViewChild('dropList', { static: true }) dropList!: ElementRef;
    @ViewChild('dropList', { static: true, read: ViewContainerRef }) dropListView!: ViewContainerRef;
    @ContentChildren(CdkDrag, { read: CdkDrag, descendants: true }) componentDefinitions!: QueryList<any>;
    @ViewChild('placeholder') placeholderRef!: TemplateRef<any> | null;
    orientation$ = this.guildyService.currentOrientation$;
    private dropRef!: DropListRef<any>;
    private destroySubject = new Subject();

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

        const drags = this.componentDefinitions.map(e => ({ dRef: this.dnd.createDrag(e.element), cRef: e }));

        drags.forEach(d => {
            d.dRef.data = { name: d.cRef.data };
            d.dRef.withPlaceholderTemplate({
                template: this.placeholderRef,
                viewContainer: this.dropListView,
                context: null,
            });
        }); //TODO
        this.dropRef.withItems(drags.map(d => d.dRef));
        this.dropRef.beforeStarted.pipe(takeUntil(this.destroySubject)).subscribe(event => {
            try {
                this.dropList.nativeElement.classList.add('cdk-drop-list-dragging');
            } catch (e) {
                console.error(e);
            }
        });
    }
}

import {
  Component, ContentChildren,
  ElementRef,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {NgxGuildyService} from "../ngx-guildy.service";
import {GuildyComponentOptions} from "../guildy-component.decorator";
import {CdkDrag, DragDrop, DropListRef} from "@angular/cdk/drag-drop";

@Component({
  selector: 'guildy-component-library',
  templateUrl: './component-library.component.html',
  styleUrls: ['./component-library.component.css']
})
export class ComponentLibraryComponent implements OnInit {
  components: GuildyComponentOptions[] = [];
  private dropRef!: DropListRef<any>;
  @ViewChild("dropList", {static: true}) dropList!: ElementRef;
  @ViewChild("dropList", {static: true, read: ViewContainerRef}) dropListView!: ViewContainerRef;
  @ContentChildren(CdkDrag, {read: CdkDrag, descendants: true}) componentDefinitions!: QueryList<any>;
  @ViewChild("placeholder") placeholderRef!: TemplateRef<any> | null;
  orientation$ = this.guildyService.currentOrientation$;



  constructor(public guildyService: NgxGuildyService,private dnd: DragDrop) {
    this.components = guildyService.guildyComponents;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dropRef = this.dnd.createDropList(this.dropList);
    this.guildyService.addDndContainer('library', this.dropRef);
    this.dropRef.data = "library";

    const drags = this.componentDefinitions.map(e => ({dRef:this.dnd.createDrag(e.element), cRef: e}));

    drags.forEach(d => {
       d.dRef.data = d.cRef.data;
      d.dRef.withPlaceholderTemplate({
        template: this.placeholderRef,
        viewContainer: this.dropListView,
        context: null
      });
    });//TODO
    this.dropRef.withItems(drags.map(d => d.dRef));
    this.dropRef.beforeStarted.subscribe(event => {
      try {
        this.dropList.nativeElement.classList.add('cdk-drop-list-dragging');
      } catch (e) {
        console.error(e);
      }
    });
  }


}

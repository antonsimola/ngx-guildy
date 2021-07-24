import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  StaticProvider,
  Type,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'ndc-dynamic',
  template: '',
  providers: [],
})
export class DynamicComponent implements OnChanges {
  @Input()
  ndcDynamicComponent!: Type<any>;
  @Input()
  ndcDynamicInjector: Injector | undefined;
  @Input()
  ndcDynamicProviders!: StaticProvider[] | undefined;
  @Input()
  ndcDynamicContent!: any[][] | undefined;

  @Output()
  ndcDynamicCreated: EventEmitter<ComponentRef<any>> = new EventEmitter();

  componentRef: ComponentRef<any>  | undefined;

  constructor(
    private vcr: ViewContainerRef,
    private cfr: ComponentFactoryResolver,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ndcDynamicComponent) {
      this.createDynamicComponent();
    }
  }

  createDynamicComponent() {
    this.vcr.clear();
    this.componentRef = undefined;

    if (this.ndcDynamicComponent) {
      this.componentRef = this.vcr.createComponent(
        this.cfr.resolveComponentFactory(this.ndcDynamicComponent),
        0,
        this._resolveInjector(),
        this.ndcDynamicContent,
      );
      this.ndcDynamicCreated.emit(this.componentRef);
    }
  }

  private _resolveInjector(): Injector {
    let injector = this.ndcDynamicInjector || this.vcr.injector;

    if (this.ndcDynamicProviders) {
      injector = Injector.create({
        providers: this.ndcDynamicProviders,
        parent: injector,
      });
    }

    return injector;
  }
}

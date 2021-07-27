import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFlexContainerComponent } from './my-flex-container.component';

describe('MyFlexContainerComponent', () => {
  let component: MyFlexContainerComponent;
  let fixture: ComponentFixture<MyFlexContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyFlexContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFlexContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

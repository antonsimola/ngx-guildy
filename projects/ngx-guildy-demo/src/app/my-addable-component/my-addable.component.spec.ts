import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAddableComponent } from './my-addable.component';

describe('MyAddableComponentComponent', () => {
  let component: MyAddableComponent;
  let fixture: ComponentFixture<MyAddableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAddableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAddableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

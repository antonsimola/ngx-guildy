import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyButtonEditorComponent } from './my-button-editor.component';

describe('MyButtonEditorComponent', () => {
  let component: MyButtonEditorComponent;
  let fixture: ComponentFixture<MyButtonEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyButtonEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyButtonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

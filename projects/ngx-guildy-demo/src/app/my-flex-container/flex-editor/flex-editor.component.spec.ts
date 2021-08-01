import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexEditorComponent } from './flex-editor.component';

describe('FlexEditorComponent', () => {
  let component: FlexEditorComponent;
  let fixture: ComponentFixture<FlexEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlexEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

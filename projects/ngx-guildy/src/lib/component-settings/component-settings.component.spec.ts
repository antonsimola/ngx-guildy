import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentSettingsComponent } from './component-settings.component';

describe('ComponentSettingsComponent', () => {
  let component: ComponentSettingsComponent;
  let fixture: ComponentFixture<ComponentSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

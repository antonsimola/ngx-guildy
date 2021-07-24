import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildyEditorComponent } from './guildy-editor.component';

describe('NgxGuildyComponent', () => {
  let component: GuildyEditorComponent;
  let fixture: ComponentFixture<GuildyEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuildyEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuildyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

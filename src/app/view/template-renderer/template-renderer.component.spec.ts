import { TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateRendererComponent } from './template-renderer.component';

describe('VideoListComponent', () => {
  let component: TemplateRendererComponent;
  let fixture: ComponentFixture<TemplateRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TemplateRendererComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#agInit: should refresh view after init', () => {
    const params = { ngTemplate: TemplateRef.prototype };
    expect(component.template).toBeUndefined();
    expect(component.templateContext).toBeUndefined();
    spyOn(component, 'refresh');
    component.agInit(params);
    expect(component.refresh).toHaveBeenCalledWith(params);
    expect(component.template).toEqual(params.ngTemplate);
  });

  it('#refresh: should initialize template context', () => {
    const params = {
      data: 'data',
      ngTemplate: TemplateRef.prototype
    };
    expect(component.templateContext).toBeUndefined();
    expect(component.refresh(params)).toBeTrue();
    expect(component.templateContext.$implicit).toEqual(params.data);
    expect(component.templateContext.params).toEqual(params);
  });

});
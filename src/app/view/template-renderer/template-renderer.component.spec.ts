import { AgGridModule } from '@ag-grid-community/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { VideoService } from 'src/app/core/services/video.service';
import { mockVideoList } from 'src/app/core/testing-mock';
import { VideoListComponent } from '../video-list/video-list.component';
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
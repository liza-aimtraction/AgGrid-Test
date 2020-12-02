import { mockContextParams, mockVideo, mockVideoList } from './../../core/testing-mock';
import { VideoService } from './../../core/services/video.service';
import { TemplateRendererComponent } from './../template-renderer/template-renderer.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoListComponent } from './video-list.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RowNode, ColGroupDef, GetContextMenuItemsParams } from '@ag-grid-community/all-modules';


describe('VideoListComponent', () => {
  let component: VideoListComponent;
  let fixture: ComponentFixture<VideoListComponent>;
  let service: VideoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        VideoListComponent
      ],
      imports: [
        AgGridModule.withComponents([ TemplateRendererComponent ]),
        HttpClientTestingModule
      ],
      providers: [VideoService],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(VideoService);
    spyOn(service, 'getVideoList').and.returnValue(of(mockVideoList));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit: should return the list of videos', () => {
    component.ngOnInit();
    expect(service.getVideoList).toHaveBeenCalled();
  });

  it('#toggleAllRows: should select all videos on check and deselect on unckeck', () => {
    const selectSpy = spyOn(component.gridOptions.api, 'selectAll');
    const deselectSpy = spyOn(component.gridOptions.api, 'deselectAll');
    component.toggleAllRows(true);
    expect(selectSpy).toHaveBeenCalled();
    expect(deselectSpy).not.toHaveBeenCalled();
    component.toggleAllRows(false);
    expect(deselectSpy).toHaveBeenCalled();
  });

  it('#toggleRow: should select video by id on check and deselect on unckeck', () => {
    const getNodeSpy = spyOn(component.gridOptions.api, 'getRowNode').and.callThrough();
    const selectSpy = spyOn(RowNode.prototype, 'setSelected');
    component.toggleRow(true, mockVideo.id.videoId);
    expect(getNodeSpy).toHaveBeenCalledWith(mockVideo.id.videoId);
    expect(selectSpy).toHaveBeenCalledWith(true);
    expect(selectSpy).not.toHaveBeenCalledWith(false);
    component.toggleRow(false, mockVideo.id.videoId);
    expect(selectSpy).toHaveBeenCalledWith(false);
  });

  it('#toggleSelection: should toggle visibility of checkbox column and resize columns', () => {
    const toggleSpy = spyOn(component.gridOptions.columnApi, 'setColumnVisible');
    const sizeColumnsSpy = spyOn(component.gridOptions.api, 'sizeColumnsToFit');
    component.toggleSelection(true);
    expect(toggleSpy).toHaveBeenCalledWith('checkbox', true);
    expect(toggleSpy).not.toHaveBeenCalledWith('title', true);
    expect(toggleSpy).not.toHaveBeenCalledWith('checkbox', false);
    component.toggleSelection(false);
    expect(toggleSpy).toHaveBeenCalledWith('checkbox', false);
    expect(sizeColumnsSpy).toHaveBeenCalled();
  });

  it('#isSelected: should return true if the node with given id is selected and false in other case', () => {
    expect(component.isSelected(mockVideo.id.videoId)).toBeFalse();
    component.toggleRow(true, mockVideo.id.videoId);
    expect(component.isSelected(mockVideo.id.videoId)).toBeTrue();
    component.toggleRow(false, mockVideo.id.videoId);
    expect(component.isSelected(mockVideo.id.videoId)).toBeFalse();
  });

  it('#isAllSelected: should return true if all videos are selected and false in other case', () => {
    expect(component.isAllSelected()).toBeFalse();
    component.toggleAllRows(true);
    expect(component.isAllSelected()).toBeTrue();
    component.toggleRow(false, mockVideo.id.videoId);
    expect(component.isAllSelected()).toBeFalse();
  });

  it('#gridReady: should size columns to fit and set columns definitions', () => {
    const sizeColumnsSpy = spyOn(component.gridOptions.api, 'sizeColumnsToFit');
    const setColumnSpy = spyOn(component.gridOptions.api, 'setColumnDefs');
    component.gridReady(component.gridOptions);
    expect(sizeColumnsSpy).toHaveBeenCalled();
    expect(setColumnSpy).toHaveBeenCalled();
  });

  it('#getContextMenuItems: should return menu items with copy and copyWithHeaders if header != "Video Title"', () => {
    const mockNoTitle = ['copy', 'copyWithHeaders'];
    spyOn(mockContextParams.column, 'getColDef').and.returnValue({ headerName:'Not Video Title' });
    expect(component.getContextMenuItems(mockContextParams)).toEqual(mockNoTitle);
  });

  it('#getContextMenuItems: should return menu items with copy, copyWithHeaders and openInNewTab if header == "Video Title"', () => {
    const mockTitle = ['copy', 'copyWithHeaders', {name: 'Open in new tab'}];
    spyOn(mockContextParams.column, 'getColDef').and.returnValue({ headerName:'Video Title' });
    expect(component.getContextMenuItems(mockContextParams).length).toEqual(mockTitle.length);
    expect(component.getContextMenuItems(mockContextParams)[2].name).toEqual('Open in new tab');
  });

  it('#getContextMenuItems: should open in new tab when action triggered', () => {
    mockContextParams.node.data = mockVideo;
    spyOn(mockContextParams.column, 'getColDef').and.returnValue({ headerName:'Video Title' });
    spyOn(window, 'open').and.callFake(() => null);
    component.getContextMenuItems(mockContextParams)[2].action();
    expect(window.open).toHaveBeenCalledWith(`https://www.youtube.com/watch?v=${mockVideo.id.videoId}`);
  });
});

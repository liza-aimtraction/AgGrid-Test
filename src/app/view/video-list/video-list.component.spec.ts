import { mockContextParams, mockVideo, mockVideoList } from '../../core/testing-mock.spec';
import { VideoService } from './../../core/services/video.service';
import { TemplateRendererComponent } from './../template-renderer/template-renderer.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoListComponent } from './video-list.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RowNode } from '@ag-grid-community/all-modules';


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
    const selectSpy = spyOn(RowNode.prototype, 'setSelected').and.callThrough();
    component.toggleRow(true, mockVideo.id.videoId);
    expect(getNodeSpy).toHaveBeenCalledWith(mockVideo.id.videoId);
    expect(selectSpy).toHaveBeenCalledWith(true);
    expect(component.gridOptions.api.getSelectedRows().length).toEqual(1);
    expect(selectSpy).not.toHaveBeenCalledWith(false);
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

  describe('#getContextMenuItems', () => {
    it('should return default menu items if column is not title"', () => {
      const mockNoTitle = ['copy', 'copyWithHeaders', 'paste'];
      spyOn(mockContextParams.column, 'getColDef').and.returnValue({ colId:'not_title' });
      expect(component.getContextMenuItems(mockContextParams)).toEqual(mockNoTitle);
    });

    it('should return default menu items and openInNewTab if column is title', () => {
      const mockTitle = ['copy', 'copyWithHeaders', 'paste', {name: 'Open in new tab'}];
      spyOn(mockContextParams.column, 'getColDef').and.returnValue({ colId:'title' });
      expect(component.getContextMenuItems(mockContextParams).length).toEqual(mockTitle.length);
      expect(component.getContextMenuItems(mockContextParams)[3].name).toEqual('Open in new tab');
    });

    it('should open in new tab when action triggered', () => {
      mockContextParams.node.data = mockVideo;
      spyOn(mockContextParams.column, 'getColDef').and.returnValue({ colId:'title' });
      spyOn(window, 'open').and.callFake(() => null);
      component.getContextMenuItems(mockContextParams)[3].action();
      expect(window.open).toHaveBeenCalledWith(`https://www.youtube.com/watch?v=${mockVideo.id.videoId}`);
    });
  });

  it('#transform: should return formatted date', () => {
    expect(component.transform(new Date(2019, 8, 4, 15, 30, 22))).toEqual('04-09-2019, 15:30');
  });

  it('should have expected column headers', async() => {
    component.gridReady(component.gridOptions);
    await fixture.isStable();
    const elm = fixture.nativeElement;
    const grid = elm.querySelector('ag-grid-angular');
    const headerCells = grid.querySelectorAll('.ag-header-cell');
    const headerTitles = Array.from(headerCells).map((cell: any) =>
      cell.textContent.trim()
    );
    expect(headerTitles).toEqual(['', 'Published on', 'Video Title', 'Description']);
  });

});

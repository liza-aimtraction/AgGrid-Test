import { VideoItem } from './../../core/models/video-item';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TemplateRendererComponent } from '../template-renderer/template-renderer.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { AllCommunityModules, ColDef, ColGroupDef, GetContextMenuItemsParams, GridOptions, Module } from '@ag-grid-community/all-modules';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { VideoService } from 'src/app/core/services/video.service';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';


@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoListComponent implements OnInit {
  @ViewChild('header') header: TemplateRef<any>;
  @ViewChild('headerCheckbox') headerCheckbox: TemplateRef<any>;
  @ViewChild('cellCheckbox') cellCheckbox: TemplateRef<any>;
  @ViewChild('thumbnails') thumbnails: TemplateRef<any>;
  @ViewChild('title') title: TemplateRef<any>;


  agGridModules: Module[] = [...AllCommunityModules, MenuModule, ClipboardModule];
  gridOptions: GridOptions = {
    defaultColDef: {
      resizable: true
    },
    rowSelection: 'multiple',
    rowHeight: 90,
    suppressRowClickSelection: true,
    suppressContextMenu: false,
    popupParent: document.querySelector('body'),
    getRowNodeId: (data: VideoItem) => data.id.videoId,
    getContextMenuItems: this.getContextMenuItems,
  };

  videos$: Observable<VideoItem[]> = new Observable(null);

  constructor(private service: VideoService) { }

  ngOnInit(): void {
    this.videos$ = this.service.getVideoList();
  }

  createColumnDefs(): ColGroupDef[] {
    return [{
        headerGroupComponentFramework: TemplateRendererComponent,
        headerGroupComponentParams: { ngTemplate: this.header },
        children: [
          {
            colId: 'checkbox', width: 50, hide: true,
            headerComponentFramework: TemplateRendererComponent,
            headerComponentParams: { ngTemplate: this.headerCheckbox },
            cellRendererFramework: TemplateRendererComponent,
            cellRendererParams: { ngTemplate: this.cellCheckbox }
          },
          {
            colId: 'thumbnails',
            cellRendererFramework: TemplateRendererComponent,
            cellRendererParams: { ngTemplate: this.thumbnails }
          },
          {
            headerName: 'Published on',
            field: 'snippet.publishedAt'
          },
          {
            headerName: 'Video Title', colId: 'title',
            cellRendererFramework: TemplateRendererComponent,
            cellRendererParams: { ngTemplate: this.title }
          },
          {
            headerName: 'Description',
            field: 'snippet.description'
          },
        ]
    }];
  }

  toggleAllRows(checked: boolean): void {
    if (checked) {
      this.gridOptions.api.selectAll();
    } else {
      this.gridOptions.api.deselectAll();
    }
  }

  getContextMenuItems(params: GetContextMenuItemsParams): any[] {
    const result: any[] = ['copy', 'copyWithHeaders'];
    if(params.column.getColDef().headerName === 'Video Title')
      result.push({
        name: 'Open in new tab',
        action: () => { window.open(`https://www.youtube.com/watch?v=${params.node.data.id.videoId}`); },
      });
    return result;
  }

  toggleRow(checked: boolean, videoId: string): void {
    this.gridOptions.api.getRowNode(videoId).setSelected(checked);
  }

  toggleSelection(mode: boolean): void {
    this.gridOptions.columnApi.setColumnVisible('checkbox', mode);
    this.gridOptions.api.sizeColumnsToFit();
  }

  isSelected(id: string): boolean {
    return this.gridOptions.api.getRowNode(id).isSelected();
  }

  isAllSelected(): boolean {
   return this.gridOptions.api.getSelectedRows().length === this.gridOptions.api.getDisplayedRowCount();
  }

  gridReady($event: GridOptions): void {
    $event.api.setColumnDefs(this.createColumnDefs());
    $event.api.sizeColumnsToFit();
  }

}

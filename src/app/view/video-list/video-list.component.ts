import { catchError } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TemplateRendererComponent } from '../template-renderer/template-renderer.component';
import { AllCommunityModules, ColGroupDef, GetContextMenuItemsParams, GridOptions, Module } from '@ag-grid-community/all-modules';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { VideoService } from 'src/app/core/services/video.service';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';
import { VideoItem } from 'src/app/core/models/video-item';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoListComponent implements OnInit {
  @ViewChild('header') header: TemplateRef<any>;
  @ViewChild('headerCheckbox') headerCheckbox: TemplateRef<any>;
  @ViewChild('cellCheckbox') cellCheckbox: TemplateRef<any>;
  @ViewChild('thumbnails') thumbnails: TemplateRef<any>;
  @ViewChild('title') title: TemplateRef<any>;

  error$: BehaviorSubject<any> = new BehaviorSubject(null);
  videos$: Observable<VideoItem[]> = new Observable(null);
  agGridModules: Module[] = [...AllCommunityModules, MenuModule, ClipboardModule];
  gridOptions: GridOptions = {
    defaultColDef: {
      resizable: true
    },
    rowSelection: 'multiple',
    rowHeight: 90,
    suppressRowClickSelection: true,
    suppressMovableColumns: true,
    popupParent: document.querySelector('body'),
    getRowNodeId: (data: VideoItem) => data.id.videoId,
    getContextMenuItems: this.getContextMenuItems,
  };

  constructor(
    private service: VideoService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.videos$ = this.service.getVideoList().pipe(
      catchError(err => {
        this.error$.next(err.error.error);
        return [];
      })
    );
  }

  createColumnDefs(): ColGroupDef[] {
    return [{
      headerGroupComponentFramework: TemplateRendererComponent,
      headerGroupComponentParams: { ngTemplate: this.header },
      children: [
        {
          colId: 'checkbox',
          headerComponentFramework: TemplateRendererComponent,
          headerComponentParams: { ngTemplate: this.headerCheckbox },
          cellRendererFramework: TemplateRendererComponent,
          cellRendererParams: { ngTemplate: this.cellCheckbox },
          width: 50,
          hide: true,
          lockPinned: true
        },
        {
          colId: 'thumbnails',
          cellRendererFramework: TemplateRendererComponent,
          cellRendererParams: { ngTemplate: this.thumbnails },
          lockPinned: true
        },
        {
          headerName: 'Published on',
          field: 'snippet.publishedAt',
          cellRenderer: date => this.transform(date.value),
          lockPinned: true
        },
        {
          headerName: 'Video Title',
          colId: 'title',
          cellRendererFramework: TemplateRendererComponent,
          cellRendererParams: { ngTemplate: this.title },
          lockPinned: true
        },
        {
          headerName: 'Description',
          field: 'snippet.description',
          lockPinned: true
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
    const result: any[] = ['copy', 'copyWithHeaders', 'paste'];
    if(params.column.getColDef().colId === 'title') {
      result.push({
        name: 'Open in new tab',
        action: () => { window.open(`https://www.youtube.com/watch?v=${params.node.data.id.videoId}`); },
      });
    }
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

  transform(date: string | Date): string{
    return this.datePipe.transform(date, 'dd-MM-yyyy, HH:mm');
  }

}

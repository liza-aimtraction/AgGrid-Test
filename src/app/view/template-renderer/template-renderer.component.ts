import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-template-renderer',
  template: `
    <ng-container
      *ngTemplateOutlet="template; context: templateContext"
    ></ng-container>
  `
})
export class TemplateRendererComponent implements ICellRendererAngularComp {
  template: TemplateRef<any>;
  templateContext: { $implicit: any, params: any };

  refresh(params: any): boolean {
    this.templateContext = {
      $implicit: params.data,
      params
    };
    return true;
  }

  agInit(params: any): void {
    this.template = params.ngTemplate;
    this.refresh(params);
  }
}
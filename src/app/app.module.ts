import { VideoService } from 'src/app/core/services/video.service';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from '@ag-grid-community/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TemplateRendererComponent } from './view/template-renderer/template-renderer.component';
import { VideoListComponent } from './view/video-list/video-list.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoListComponent,
    TemplateRendererComponent,
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([TemplateRendererComponent])
  ],
  providers: [VideoService],
  bootstrap: [AppComponent]
})
export class AppModule { }

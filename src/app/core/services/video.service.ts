import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VideoItem } from '../models/video-item';
import { environment } from 'src/environments/environment';
import { SearchList } from '../models/search-list';

@Injectable()
export class VideoService {

  constructor(private http: HttpClient) { }

  getVideoList(): Observable<VideoItem[]> {
    return this.http.get<SearchList>(environment.youtubeUrl).pipe(
      map(list => list.items)
    );
  }
}

import { PageInfo } from './page-info';
import { VideoItem } from './video-item';

export interface SearchList {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: PageInfo;
  items: VideoItem[];
}

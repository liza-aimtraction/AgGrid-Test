import { Column, GetContextMenuItemsParams, RowNode } from '@ag-grid-community/all-modules';
import { SearchList } from './models/search-list';
import { VideoItem } from './models/video-item';

export const mockVideo: VideoItem = {
  kind: 'youtube#searchResult',
  etag: 'etag',
  id: { kind: 'youtube#video', videoId: 'videoId_1' },
  snippet: {
    publishedAt: '2019-09-04T15:00:12Z',
    channelId: 'channelId_1',
    title: 'title_1',
    description: 'description_1',
    thumbnails: {
      default: { url: 'default.jpg', width: 120, height: 90 },
      medium: { url: 'mqdefault.jpg', width: 320, height: 180 },
      high: { url: 'hqdefault.jpg', width: 480, height: 360 }
    },
    channelTitle: 'ABS-CBN Entertainment',
    liveBroadcastContent: 'none',
    publishTime: '2019-09-04T15:00:12Z'
    }
};

export const mockVideoList: VideoItem[] = [
  mockVideo,
  {
    ...mockVideo,
    id: { kind: 'youtube#video', videoId: 'videoId_2' },
    snippet: {
      ...mockVideo.snippet,
      publishedAt: '2019-09-05T16:00:12Z',
      channelId: 'channelId_2',
      title: 'title_2',
      description: 'description_2'
    }
  }
];

export const mockResponse: SearchList = {
  kind: 'youtube#searchListResponse',
  etag: 'etag',
  nextPageToken: 'nextPageToken',
  regionCode: 'UA',
  pageInfo: {
    totalResults: 1000000,
    resultsPerPage: 2
  },
  items: mockVideoList
};

export const mockContextParams: GetContextMenuItemsParams = {
  column: new Column({}, null, 'colId', true),
  defaultItems: null,
  node: new RowNode(),
  value: null,
  api: null,
  columnApi: null,
  context: null
};
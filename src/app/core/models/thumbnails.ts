export interface Thumbnails {
  default: ThumbnailConf;
  medium: ThumbnailConf;
  high: ThumbnailConf;
}

export interface ThumbnailConf {
  url: string;
  width: number;
  height: number;
}
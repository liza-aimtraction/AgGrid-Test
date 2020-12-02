import { ItemId } from './item-id';
import { Snippet } from './snippet';

export interface VideoItem {
  kind: string;
  etag: string;
  id: ItemId;
  snippet: Snippet;
}
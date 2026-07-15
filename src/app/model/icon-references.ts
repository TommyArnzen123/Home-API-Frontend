import { ICON_REFERENCE_KEYS } from '../constants/icon-registry';

export interface IconReference {
  id: number;
  title: string;
  collection: string;
  license: string;
  author: string;
  url: string;
  notes?: string;
  iconPath: ICON_REFERENCE_KEYS;
  altText: string;
}

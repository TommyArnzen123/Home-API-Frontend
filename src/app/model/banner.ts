export type BannerTypes = 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';

export interface IBanner {
  message: string;
  type: BannerTypes;
  tertiaryText?: string;
}

export interface IBannerActions {
  tertiaryAction: () => void;
}

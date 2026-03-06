export interface IModal {
  title: string;
  content: string;
  footer?: string;
  primaryText?: string;
  secondaryText?: string;
  disableClose?: boolean;
}

export interface IModalActions {
  primaryAction?: () => void;
  secondaryAction?: () => void;
}

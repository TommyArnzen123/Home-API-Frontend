export interface IModal {
  title: string;
  content: string;
  footer?: string;
  primaryText?: string;
  secondaryText?: string;
}

export interface IModalActions {
  primaryAction?: () => void;
  secondaryAction?: () => void;
}

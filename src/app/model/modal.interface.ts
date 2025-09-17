export interface IModal {
  title: string;
  content: string;
  primaryText?: string;
  secondaryText?: string;
}

export interface IModalActions {
  primaryAction?: () => void;
  secondaryAction?: () => void;
}

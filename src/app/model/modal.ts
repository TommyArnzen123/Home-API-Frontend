export enum ButtonIntent {
  PRIMARY = 'primary',
  DESTRUCTIVE = 'destructive',
}

export interface IModal {
  title: string;
  content: string;
  footer?: string;
  primaryText?: string;
  secondaryText?: string;
  disableClose?: boolean;
  primaryIntent?: ButtonIntent;
}

export interface IModalActions {
  primaryAction?: () => void;
  secondaryAction?: () => void;
}

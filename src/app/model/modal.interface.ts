export interface IModal {
  title: string;
  content: string;
  primaryText?: string;
}

export interface IModalActions {
  primaryAction?: () => void;
}

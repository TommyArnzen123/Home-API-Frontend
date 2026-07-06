import { EntityTypes } from '../store/entity.store';

export interface IBreadcrumb {
  type: EntityTypes;
  id: number;
}

export interface IBreadcrumbItemDisplay {
  label: string;
  entityType: EntityTypes;
  entityId: number;
}

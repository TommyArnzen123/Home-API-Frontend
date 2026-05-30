import { EntityTypes } from '../store/entity.store';

export interface IBreadcrumbItemDisplay {
  label: string;
  entityType: EntityTypes;
  entityId: number;
}

import { IBreadcrumbItemDisplay } from '../model/breadcrumb';
import { EntityTypes, IBreadcrumb, PageModes } from '../store/entity.store';

export function generateBreadcrumbEntityPath(path: IBreadcrumb[]): IBreadcrumbItemDisplay[] {
  return path.map((item) => ({
    label: getEntityLabel(item.type),
    entityType: item.type,
    entityId: item.id,
  }));
}

// Set the last item (suffix) of the breadcrumb component in 'Non-View' use-cases.
// Suffix values are derrived from the entity store 'entityPath' and 'pageMode' fields.
// All other items in the breadcrumb component are based only on the 'entityPath' field.
export function generateBreadcrumbSuffix(
  path: IBreadcrumbItemDisplay[],
  mode: PageModes,
): string | null {
  const lastItem = path.at(-1);

  if (!lastItem) return null;

  if (mode === 'EDIT') {
    return `Edit ${getFormattedEntityIdentifier(lastItem.entityType)}`;
  }

  if (mode === 'ADD_CHILD') {
    return `Register ${getChildEntityLabel(lastItem.entityType)}`;
  }

  return null;
}

// Get the label value to be displayed for a specified entity type.
export function getEntityLabel(entityType: EntityTypes): string {
  switch (entityType) {
    case 'USER':
      return 'Home Screen';
    case 'HOME':
      return 'View Home';
    case 'LOCATION':
      return 'View Location';
    case 'DEVICE':
      return 'View Device';
  }
}

// Get a one word formatted identifier for a specified entity type.
export function getFormattedEntityIdentifier(entityType: EntityTypes): string {
  switch (entityType) {
    case 'HOME':
      return 'Home';
    case 'LOCATION':
      return 'Location';
    case 'DEVICE':
      return 'Device';
    default:
      return '';
  }
}

// Get a one word formatted identifier for the child entity type of a specified parent entity type.
export function getChildEntityLabel(parentEntityType: EntityTypes): string {
  switch (parentEntityType) {
    case 'USER':
      return 'Home';
    case 'HOME':
      return 'Location';
    case 'LOCATION':
      return 'Device';
    default:
      return '';
  }
}

// Interfaces are defined for each entity type to allow for custom fields in the future.
// Currently, all entity type edit interfaces have the same fields.

export interface IEditHomeRequest {
  entityId: number;
  name: string;
}

export interface IEditLocationRequest {
  entityId: number;
  name: string;
}

export interface IEditDeviceRequest {
  entityId: number;
  name: string;
}

export interface IEditGenericEntityResponse {
  message: string;
}

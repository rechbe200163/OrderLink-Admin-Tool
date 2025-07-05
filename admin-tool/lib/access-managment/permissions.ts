import { Role } from '@prisma/client';

type Permission = { read: boolean; write: boolean };

export const rolePermissions: Record<Role, Record<string, Permission>> = {
  [Role.ADMIN]: {
    customers: { read: true, write: true },
    products: { read: true, write: true },
    orders: { read: true, write: true },
    addresses: { read: true, write: true },
    carts: { read: true, write: true },
    categories: { read: true, write: true },
    invoices: { read: true, write: true },
    routes: { read: true, write: true },
    employees: { read: true, write: true },
    siteConfig: { read: true, write: true },
    categoriesOnProduct: { read: true, write: true },
    orderOnProduct: { read: true, write: true },
    cartOnProduct: { read: true, write: true },
    routeOnOrder: { read: true, write: true },
    statistics: { read: true, write: false },
  },
  [Role.EMPLOYEE]: {
    customers: { read: true, write: false },
    products: { read: true, write: true },
    orders: { read: true, write: false },
    addresses: { read: true, write: false },
    cart: { read: true, write: true },
    categories: { read: true, write: true },
    invoices: { read: true, write: false },
    routes: { read: true, write: true },
    employees: { read: true, write: false },
    siteConfig: { read: true, write: false },
    categoriesOnProduct: { read: true, write: true },
    orderOnProduct: { read: true, write: false },
    cartOnProduct: { read: true, write: true },
    routeOnOrder: { read: true, write: true },
    statistics: { read: false, write: false },
  },
  [Role.SUPPLIER]: {
    customers: { read: true, write: false },
    products: { read: true, write: true },
    orders: { read: true, write: false },
    addresses: { read: true, write: false },
    cart: { read: false, write: false },
    categories: { read: true, write: false },
    invoices: { read: true, write: false },
    routes: { read: true, write: false },
    employees: { read: true, write: false },
    siteConfig: { read: true, write: false },
    categoriesOnProduct: { read: true, write: false },
    orderOnProduct: { read: true, write: false },
    cartOnProduct: { read: true, write: false },
    routeOnOrder: { read: true, write: false },
    statistics: { read: false, write: false },
  },
  [Role.CUSTOMER]: {},
};

export function hasPermissionFromRole(
  role: Role,
  resource: string,
  action: 'read' | 'write'
): boolean {
  const permission = rolePermissions[role]?.[resource];
  return permission ? permission[action] : false;
}

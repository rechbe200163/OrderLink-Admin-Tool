export interface Product { id: string; }
export interface Employee { id: string; }
export interface Customer { reference: string; }
export interface Permission { id: string; }
export interface Address { id: string; }
export interface Category { id: string; }
export interface RouteData { id: string; name: string; }
export interface Order { id: string; }

const products: Product[] = [
  { id: 'prod1' },
  { id: 'prod2' },
];

const employees: Employee[] = [
  { id: 'emp1' },
  { id: 'emp2' },
];

const customers: Customer[] = [
  { reference: 'cust1' },
  { reference: 'cust2' },
];

const permissions: Permission[] = [
  { id: 'perm1' },
  { id: 'perm2' },
];

const addresses: Address[] = [
  { id: 'addr1' },
  { id: 'addr2' },
];

const categories: Category[] = [
  { id: 'cat1' },
  { id: 'cat2' },
];

const routesData: RouteData[] = [
  { id: 'route1', name: 'First Route' },
  { id: 'route2', name: 'Second Route' },
];

const orders: Order[] = [
  { id: 'order1' },
  { id: 'order2' },
];

export async function fetchProducts(): Promise<Product[]> {
  return products;
}

export async function fetchEmployees(): Promise<Employee[]> {
  return employees;
}

export async function fetchCustomers(): Promise<Customer[]> {
  return customers;
}

export async function fetchPermissions(): Promise<Permission[]> {
  return permissions;
}

export async function fetchAddresses(): Promise<Address[]> {
  return addresses;
}

export async function fetchCategories(): Promise<Category[]> {
  return categories;
}

export async function fetchRoutes(): Promise<RouteData[]> {
  return routesData;
}

export async function fetchOrders(): Promise<Order[]> {
  return orders;
}

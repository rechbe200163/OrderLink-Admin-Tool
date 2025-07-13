import Stripe from 'stripe';
import type { PagingDto } from './dtos';

// Enums replicated from the former Prisma schema
export enum Actions {
  READ = 'READ',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  CREATE = 'CREATE',
}

export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  SUPPPLIER = 'SUPPLIER',
  CUSTOMER = 'CUSTOMER',
}

export enum Ressources {
  PRODUCT = 'PRODUCT',
  ORDER = 'ORDER',
  CUSTOMER = 'CUSTOMER',
  CART = 'CART',
  ADDRESS = 'ADDRESS',
  INVOICE = 'INVOICE',
  EMPLOYEE = 'EMPLOYEE',
  ROLE = 'ROLE',
  ROUTES = 'ROUTES',
  SITE_CONFIG = 'SITE_CONFIG',
  CATEGORY = 'CATEGORY',
  ACTION = 'ACTION',
  PERMISSION = 'PERMISSION',
  STATISTICS = 'STATISTICS',
}

export enum OrderState {
  ORDER_PLACED = 'ORDER_PLACED',
  IN_PROGRESS = 'IN_PROGRESS',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED',
  ORDER_COLLECTED = 'ORDER_COLLECTED',
}

export enum BusinessSector {
  AGRICULTURE = 'AGRICULTURE',
  CONSTRUCTION = 'CONSTRUCTION',
  EDUCATION = 'EDUCATION',
  FINANCE = 'FINANCE',
  HEALTH = 'HEALTH',
  HOSPITALITY = 'HOSPITALITY',
  IT = 'IT',
  MANUFACTURING = 'MANUFACTURING',
  OTHER = 'OTHER',
  RETAIL = 'RETAIL',
  TECHNOLOGY = 'TECHNOLOGY',
  TOURISM = 'TOURISM',
  TRANSPORTATION = 'TRANSPORTATION',
}

// Basic model interfaces extracted from the Prisma schema
export interface Address {
  addressId: string;
  city: string;
  country: string;
  postCode: string;
  state: string;
  streetName: string;
  streetNumber: string;
  modifiedAt: Date | null;
  deleted: boolean;
}

export interface Category {
  categoryId: string;
  name: string;
  imagePath: string | null;
  deleted: boolean;
}

export interface Product {
  productId: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  imagePath: string | null;
  createdAt: Date;
  modifiedAt: Date | null;
  deleted: boolean;
  categoryId: string;
}

export interface Customer {
  customerId: string;
  customerReference: number;
  email: string;
  phoneNumber: string;
  password: string;
  firstName: string | null;
  lastName: string;
  companyNumber: string | null;
  modifiedAt: Date | null;
  deleted: boolean;
  signedUp: Date;
  avatarPath: string | null;
  addressId: string;
  businessSector: BusinessSector | null;
}

export interface Employees {
  employeeId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  deleted: boolean;
  role: Role;
}

export interface Permission {
  id: string;
  role: string;
  resource: Ressources;
  action: Actions;
  allowed: boolean;
}

export interface Route {
  routeId: string;
  name: string;
  deleted: boolean;
}

export interface Order {
  orderId: string;
  customerReference: number;
  orderDate: Date;
  deliveryDate: Date | null;
  deleted: boolean;
  orderState: OrderState;
  selfCollect: boolean;
}

export interface SiteConfig {
  siteConfigId: string;
  companyName: string;
  logoPath: string;
  email: string;
  phoneNumber: string;
  iban: string;
  companyNumber: string;
  addressId: string;
  modifiedAt: Date | null;
  isPremium: boolean;
  deleted: boolean;
  stripeCustomerId: string | null;
  stripeAccountId: string | null;
  stripeConfigured: boolean;
}
export type AIVStats = {
  currentMonthAIV: number;
  lastMonthAIV: number;
  percentageChange: number;
};

export type CustomerStats = {
  currentMonthSignUps: number;
  percentageChange: number;
  lastMonthSignUps: number;
};

export type SalesStates = {
  currentMonthSales: number;
  lastMonthSales: number;
  percentageChange: number;
};

export type RevenueStats = {
  currentMonthRevenue: number;
  lastMonthRevenue: number;
  percentageChange: number;
};

export type CustomerByBranch = {
  totalCustomers: number;
  sectors: Record<BusinessSector, number>;
};

export type OrderStateCount = {
  _count: number;
  orderState: OrderState;
}[];

export type Subscription = {
  id: string;
  status: Stripe.Subscription.Status;
  current_period_start: number;
  current_period_end: number;
  currency: string;
  plan: {
    amount: number;
    interval: string;
    interval_count: number;
  };
};

// Generic DTO aliases for paginated responses

export type CustomersPagingDto = PagingDto<Customer>;
export type AddressesPagingDto = PagingDto<Address>;
export type ProductsPagingDto = PagingDto<Product>;
export type OrdersPagingDto = PagingDto<OrdersWithCustomer>;
export type EmployeesPagingDto = PagingDto<Employees>;
export type RoutesPagingDto = PagingDto<RoutesWithCount>;
export type CategoriesPagingDto = PagingDto<Category>;
export type PermissionsPagingDto = PagingDto<Permission>;
export type SiteConfigDto = {
  siteConfigId: string;
  companyName: string;
  logoPath: string;
  email: string;
  phoneNumber: string;
  iban: string;
  companyNumber: string;
  isPremium: boolean;
  deleted: boolean;
  stripeCustomerId: string | null;
  stripeAccountId: string | null;
  stripeConfigured: boolean;
  address: Address;
};

export type CustomerGrowth = {
  date: string;
  growth: number;
  cumulative_growth: number;
}[];

export interface RoutesWithCount extends Route {
  _count: {
    order: number;
  };
}

export interface RoutesWithOrders extends Route {
  order: Order[];
}

export interface ProductWithCategoryNames extends Product {
  categories: {
    category: Pick<Category, 'categoryId' | 'name'>;
  }[];
}

export interface CustomerWithAddressId extends Customer {
  address: {
    addressId: string;
  };
}

export interface OrderProduct {
  orderId: string;
  productId: string;
  orderDate: Date;
  productAmount: number;
  product: Product;
}

export interface OrdersWithCustomer extends Order {
  products: OrderProduct[];
  customer: {
    customerReference: number;
    firstName: string | null;
    lastName: string;
  };
}

export interface OrdersWithCustomerAndProducts extends OrdersWithCustomer {}

export interface SiteConfigWithAddress extends SiteConfig {
  address: Address;
}

export interface OrdersWithAddressOfCustomer extends Order {
  customer: {
    address: Address;
  };
}

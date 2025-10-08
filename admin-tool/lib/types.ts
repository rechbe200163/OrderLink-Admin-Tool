import Stripe from 'stripe';
import type { PagingDto } from './dtos';

// Enums replicated from the former Prisma schema
export enum Actions {
  READ = 'READ',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  CREATE = 'CREATE',
}

export enum ModulePackageName {
  INSIGHT = 'INSIGHT', // Statistiken
  FLOW = 'FLOW', // Navigation
  ACCESS = 'ACCESS', // Custom Roles
}

export enum UserTier {
  CORE = 'CORE',
  TEAM = 'TEAM',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

// Map ModuleName to ModulePackageName
export const Package: Record<ModuleName, ModulePackageName> = {
  STATISTICS: ModulePackageName.INSIGHT,
  NAVIGATION: ModulePackageName.FLOW,
  CUSTOM_ROLES: ModulePackageName.ACCESS,
};

// Pricing for each package
export const PackagePricing: Record<ModulePackageName, number> = {
  [ModulePackageName.INSIGHT]: 39,
  [ModulePackageName.FLOW]: 29,
  [ModulePackageName.ACCESS]: 9,
};

// Map user count to UserTier
export const USER_TIER_BY_COUNT: Record<number, UserTier> = {
  2: UserTier.CORE,
  6: UserTier.TEAM,
  10: UserTier.PRO,
};

// Pricing for each user tier
export const UserTierPricing: Record<UserTier, number> = {
  [UserTier.CORE]: 0, // up to 2 users
  [UserTier.TEAM]: 5, // up to 6 users
  [UserTier.PRO]: 10, // up to 10 users
  [UserTier.ENTERPRISE]: 0, // custom pricing
};

// Role is now a model in the Prisma schema. The enum has been removed and
// replaced with an interface that mirrors the table structure.
export interface Role {
  name: string;
  description: string | null;
  deleted: boolean;
}

// Default role names for the application. These mirror the seeded roles in the
// database and can be used for select options.
export const ROLE_NAMES = [
  'ADMIN',
  'EMPLOYEE',
  'SUPPLIER',
  'CUSTOMER',
] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export const MODULE_NAMES = [
  'STATISTICS',
  'NAVIGATION',
  'CUSTOM_ROLES',
] as const;
export type ModuleName = (typeof MODULE_NAMES)[number];

// Add an enum for easier access via MODULE_NAME.STATISTICS, etc.
export enum MODULE_NAME {
  STATISTICS = 'STATISTICS',
  NAVIGATION = 'NAVIGATION',
  CUSTOM_ROLES = 'CUSTOM_ROLES',
}

export enum Resources {
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

enum TenantStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
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

export interface Otp {
  id: string;
  code: number;
  employeeId: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
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

export interface ProductHistory extends Product {
  historyId: string;
  version: number;
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
export interface CreateCustomer {
  email: string;
  phoneNumber: string;
  firstName: string | null;
  lastName: string;
  companyNumber: string | null;
  addressId: string;
  businessSector: BusinessSector | null;
}

export interface CreateAddress {
  country: string;
  state: string;
  city: string;
  postCode: string;
  streetName: string;
  streetNumber: string;
}

export interface CreateOrder {
  customerReference: string;
  selfCollect: boolean;
  selectedProducts: string[];
  quantities: Record<string, number>;
  selectedProductObjects: Product[];
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  imagePath: string;
  categoryId: string;
}
export interface Employees {
  employeeId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  deleted: boolean;
  superAdmin: boolean;
  roleName: string;
}

export interface EmployeeWithOtp extends Employees {
  otp: Otp | null;
}

export interface Permission {
  permissionId: string;
  roleName: string;
  resource: Resources;
  action: Actions;
  allowed: boolean;
  createdAt: Date;
  deleted: boolean;
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

export interface Tenant {
  tenantId: string;
  companyName: string;
  slug: string;
  backendUrl?: string | null;
  status: TenantStatus;
  trialStartedAt: Date;
  trialEndsAt: Date;
  maxUsers: number;
  enabledModules: string[];
  billingCustomerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  ordersCount: number;
}

export interface RoutesWithOrders extends Route {
  order: Order[];
}

export interface CustomerWithAddressId extends Customer {
  addressId: string;
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
    address: Address | null;
  };
}

export interface OrdersWithCustomerAndProducts extends OrdersWithCustomer {}

export interface OrdersWithAddressOfCustomer extends Order {
  customer: {
    address: Address;
  };
}

import {
  Address,
  BusinessSector,
  Category,
  Customer,
  Employees,
  OrderState,
  Prisma,
  Product,
  Route,
} from '@prisma/client';
import Stripe from 'stripe';
//! DASHBOARD
export type AIVStats = {
  currentMonthRevenue: number;
  lastMonthRevenue: number;
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
export type GetAllUserPaging = {
  customers: Customer[];
  totalCustomers: number;
  totalPages: number;
};

export type CustomerByBranch = {
  totalCustomers: number;
  sectors: Record<BusinessSector, number>;
};

export type OrderStateCount = {
  _count: number;
  orderState: OrderState;
}[];

export type GetAddressesPaging = {
  addresses: Address[];
  totalAddresses: number;
  totalPages: number;
};

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

export type GetAllProductsPaging = {
  products: Product[];
  totalProducts: number;
  totalPages: number;
};

export type GetAllOrdersPaging = {
  orders: OrdersWithCustomer[];
  totalOrders: number;
  totalPages: number;
};

export type GetAllEmployeesPaging = {
  employees: Employees[];
  totalEmployees: number;
  totalPages: number;
};

export type GetAllRoutePaging = {
  routes: RoutesWithCount[];
  totalRoutes: number;
  totalPages: number;
};

export type GetAllCategoriesPaging = {
  categories: Category[];
  totalCategories: number;
  totalPages: number;
};

export type CustomerGrowth = {
  date: string;
  growth: number;
  cumulative_growth: number;
}[];

const routeWithCount = Prisma.validator<Prisma.RouteDefaultArgs>()({
  include: {
    _count: {
      select: {
        order: true,
      },
    },
  },
});

export type RoutesWithCount = Prisma.RouteGetPayload<typeof routeWithCount>;

const routesWithOrders = Prisma.validator<Prisma.RouteDefaultArgs>()({
  include: {
    order: true,
  },
});

export type RoutesWithOrders = Prisma.RouteGetPayload<typeof routesWithOrders>;

const productWithCategoryNames = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    categories: {
      select: {
        category: {
          select: {
            categoryId: true,
            name: true,
          },
        },
      },
    },
  },
});

export type ProductWithCategoryNames = Prisma.ProductGetPayload<
  typeof productWithCategoryNames
>;

const customerWithAddressId = Prisma.validator<Prisma.CustomerDefaultArgs>()({
  include: {
    address: {
      select: {
        addressId: true,
      },
    },
  },
});

export type CustomerWithAddressId = Prisma.CustomerGetPayload<
  typeof customerWithAddressId
>;

const ordersWithCustomer = Prisma.validator<Prisma.OrderDefaultArgs>()({
  include: {
    products: {
      include: {
        product: true,
      },
    },
    customer: {
      select: {
        customerReference: true,
        firstName: true,
        lastName: true,
      },
    },
  },
});

export type OrdersWithCustomer = Prisma.OrderGetPayload<
  typeof ordersWithCustomer
>;

const ordersWithCustomerAndProducts =
  Prisma.validator<Prisma.OrderDefaultArgs>()({
    include: {
      products: {
        include: {
          product: true,
        },
      },
      customer: {
        select: {
          customerReference: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

export type OrdersWithCustomerAndProducts = Prisma.OrderGetPayload<
  typeof ordersWithCustomerAndProducts
>;

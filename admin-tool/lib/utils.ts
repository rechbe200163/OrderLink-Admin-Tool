import { z } from 'zod';
import { hash } from 'bcryptjs';
import { Role } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { BusinessSector } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatPrice(price: number, currency?: string): string {
  return new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency: currency || 'EUR',
  }).format(price / 100);
}

export function generateCustomerRefercenceNumber(): number {
  const nanoid = customAlphabet('1234567890', 9);
  return Number(nanoid());
}

export async function hashUserPassword(password: string) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function generatePasswordForEmployeeCreation(): Promise<string> {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrtsuvwxyz', 9);
  const hashedPassword = await hashUserPassword(nanoid());
  return hashedPassword;
}

export function formatDateTime(date: string | Date): string {
  const formattedDate = new Date(date).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return formattedDate;
}

export function formatStatsChange(percentageChange: number): string {
  if (percentageChange === 0) {
    return 'Equal to last month';
  } else if (percentageChange > 0) {
    return 'increase from last month';
  } else {
    return 'decrease from last month';
  }
}

export function capitalizeFirstLetter(word: string): string {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export async function checkAPITokenValidity() {}

export const customerFormSchema = z
  .object({
    firstName: z.string().min(1, {
      message: 'Vorname ist erforderlich.',
    }),
    lastName: z.string().min(1, {
      message: 'Nachname ist erforderlich.',
    }),
    email: z.string().email({
      message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    }),
    phoneNumber: z.string().min(1, {
      message: 'Telefonnummer ist erforderlich.',
    }),
    businessSector: z
      .enum([
        BusinessSector.AGRICULTURE,
        BusinessSector.CONSTRUCTION,
        BusinessSector.EDUCATION,
        BusinessSector.FINANCE,
        BusinessSector.HEALTH,
        BusinessSector.HOSPITALITY,
        BusinessSector.MANUFACTURING,
        BusinessSector.RETAIL,
        BusinessSector.TECHNOLOGY,
        BusinessSector.TRANSPORTATION,
      ])
      .optional()
      .nullable(),
    companyNumber: z.string().optional().nullable(),
    address: z.string().min(1, {
      message: 'Adresse ist erforderlich.',
    }),
    password: z.string().optional().nullable(),
  })
  .refine(
    (data) =>
      (data.companyNumber &&
        data.businessSector &&
        data.businessSector !== null) ||
      (!data.companyNumber &&
        (!data.businessSector || data.businessSector === null)),
    {
      message:
        'Sowohl die Firmenbuchnummer als auch der Geschäftsbereich müssen gleichzeitig angegeben werden, wenn eines vorhanden ist und der Geschäftsbereich nicht "N/A" ist.',
      path: ['companyNumber', 'businessSector'],
    }
  );

export const productFormSchema = z.object({
  name: z.string().min(1, {
    message: 'Product name is required.',
  }),
  description: z.string().min(1, {
    message: 'Product description is required.',
  }),
  price: z.string().min(1, {
    message: 'Price must be greater than 0.',
  }),
  stock: z.string().min(1, {
    message: 'Stock must be greater than 0.',
  }),
  imagePath: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).min(1, {
    message: 'At least one category is required.',
  }),
});

export const siteConfigFormSchema = z.object({
  companyName: z.string().min(1, {
    message: 'Company name is required.',
  }),
  logoPath: z.string().optional().nullable(),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phoneNumber: z.string().min(1, {
    message: 'Phone number is required.',
  }),
  iban: z.string().min(1, {
    message: 'IBAN is required.',
  }),
  companyNumber: z.string().min(1, {
    message: 'Company number is required',
  }),
  country: z
    .string()
    .min(1, {
      message: 'Country is required.',
    })
    .optional()
    .nullable(),
  state: z
    .string()
    .min(1, {
      message: 'State is required.',
    })
    .optional()
    .nullable(),
  city: z
    .string()
    .min(1, {
      message: 'City is required.',
    })
    .optional()
    .nullable(),
  postCode: z
    .string()
    .min(1, {
      message: 'Street is required.',
    })
    .optional()
    .nullable(),
  streetName: z
    .string()
    .min(1, {
      message: 'Street name is required.',
    })
    .optional()
    .nullable(),
  streetNumber: z
    .string()
    .min(1, {
      message: 'Street number is required.',
    })
    .optional()
    .nullable(),
  addressId: z.string().optional().nullable(),
  name_5020537749: z
    .tuple([z.string(), z.string().optional()])
    .optional()
    .nullable(),
});

export const addressFormSchema = z.object({
  country: z.string().min(1, {
    message: 'Country is required.',
  }),
  state: z.string().min(1, {
    message: 'State is required.',
  }),
  city: z.string().min(1, {
    message: 'City is required.',
  }),
  postCode: z.string().min(1, {
    message: 'Street is required.',
  }),
  streetName: z.string().min(1, {
    message: 'Street name is required.',
  }),
  streetNumber: z.string().min(1, {
    message: 'Street number is required.',
  }),
});

export const categoryFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Category name is required.',
  }),
});

export const orderFormSchema = z.object({
  customerReference: z.string().min(1, {
    message: 'Customer Reference is required.',
  }),
  productIds: z.string().min(1, {
    message: 'At least one product ID is required.',
  }),
  quantity: z.record(z.string().min(1, { message: 'Quantity is required.' })),
  selfCollect: z.boolean().optional().nullable(),
});

export const routeFormSchema = z.object({
  name: z.string().min(1, {
    message: 'Route name is required.',
  }),
  orderIds: z.string().min(1, {
    message: 'At least one order ID is required.',
  }),
});

export const employeeFormSchema = z.object({
  firstName: z.string().min(1, {
    message: 'First name is required.',
  }),
  lastName: z.string().min(1, {
    message: 'Last name is required.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  role: z.nativeEnum(Role, {
    message: 'Role is required.',
  }),
  password: z.string().optional().nullable(),
});

export const InitialAdminFormSchema = z.object({
  firstName: z.string().min(1, {
    message: 'First name is required.',
  }),
  lastName: z.string().min(1, {
    message: 'Last name is required.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(10, {
    message: 'Password must be at least 10 characters long.',
  }),
});

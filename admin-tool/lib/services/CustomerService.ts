'server only';
import prisma from '@/prisma/client';
import { FormState } from '../form.types';
import {
  generateCustomerRefercenceNumber,
  hashUserPassword,
  customerFormSchema,
} from '../utils';
import { BusinessSector } from '@prisma/client';

class CustomerService {
  private static instacne: CustomerService;

  public static getInstace(): CustomerService {
    if (!CustomerService.instacne)
      return (CustomerService.instacne = new CustomerService());

    return CustomerService.instacne;
  }

  async restoreUser(customerReference: number): Promise<FormState> {
    try {
      // Fetch the customer record from the database using the provided customer reference
      const customer = await prisma.customer.findUnique({
        where: { customerReference },
      });

      if (!customer) {
        // If no customer is found, return an error indicating this
        return {
          success: false,
          errors: {
            title: ['Customer not found'],
          },
        };
      }

      // Restore the customer's record from the database with deleted attribute cascade to cart
      await prisma.customer.update({
        where: { customerReference },
        data: { deleted: false },
      });

      // Return a success response after the restoration operation completes successfully
      //revalidateTag('customersPaging');
      return { success: true };
    } catch (error) {
      // Log the error for debugging purpose

      // Return a generic error response to the user
      return {
        success: false,
        errors: {
          title: [
            'An unexpected error occurred. Please try again later.' + error,
          ],
        },
      };
    }
  }

  async deleteUser(customerReference: number): Promise<FormState> {
    try {
      // Fetch the customer record from the database using the provided customer reference
      const customer = await prisma.customer.findUnique({
        where: { customerReference },
      });

      if (!customer) {
        // If no customer is found, return an error indicating this
        return {
          success: false,
          errors: {
            title: ['Customer not found'],
          },
        };
      }

      // soft Delete the customer's record from the database with deleted attribute cascade to cart
      await prisma.customer.update({
        where: { customerReference },
        data: { deleted: true },
      });

      // Return a success response after the deletion operation completes successfully
      //revalidateTag('customersPaging');
      return { success: true };
    } catch (error) {
      // Log the error for debugging purposes

      // Return a generic error response to the user
      return {
        success: false,
        errors: {
          title: [
            'An unexpected error occurred. Please try again later.' + error,
          ],
        },
      };
    }
  }

  async addCustomer(
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
    try {
      const validData = customerFormSchema.safeParse({
        firstName: formData.get('firstName')?.toString() || null,
        lastName: formData.get('lastName')?.toString() || null,
        email: formData.get('email')?.toString() || null,
        phoneNumber: formData.get('phoneNumber')?.toString() || null,
        businessSector:
          (formData.get('businessSector') as BusinessSector) || null,
        companyNumber: formData.get('companyNumber')?.toString() || null,
        address: formData.get('addressId')?.toString() || null,
      });

      if (!validData.success) {
        return {
          success: false,
          errors: {
            title: ['Invalid form data'],
          },
        };
      }

      const customerReference = generateCustomerRefercenceNumber();
      // check for customer with same customer

      const checkForExistingEmail = await prisma.customer.findUnique({
        where: {
          email: validData.data.email,
        },
      });

      if (checkForExistingEmail) {
        return {
          success: false,
          errors: {
            title: ['Email already exists'],
          },
        };
      }

      const hashPwd = await hashUserPassword('password');

      const customer = await prisma.customer.create({
        data: {
          email: validData.data.email,
          password: hashPwd,
          firstName: validData.data.firstName,
          lastName: validData.data.lastName,
          companyNumber: validData.data.companyNumber,
          phoneNumber: validData.data.phoneNumber,
          customerReference: customerReference,
          businessSector:
            validData.data.businessSector === null
              ? null
              : validData.data.businessSector,
          address: {
            connect: {
              addressId: formData.get('addressId') as string,
            },
          },
          cart: {
            create: {},
          },
        },
      });

      if (!customer) {
        return {
          success: false,
          errors: {
            title: ['Failed to add customer'],
          },
        };
      }

      return {
        success: true,
        message: `Customer ${customer.firstName} ${customer.lastName} added successfully`,
      };
    } catch (error) {
      return {
        success: false,
        errors: {
          title: ['Something went wrong', error + ''],
        },
      };
    }
  }

  async updateCustomer(
    customerReference: number,
    formData: FormData
  ): Promise<FormState> {
    try {
      const validData = customerFormSchema.safeParse({
        firstName: formData.get('firstName')?.toString() || null,
        lastName: formData.get('lastName')?.toString() || null,
        email: formData.get('email')?.toString() || null,
        phoneNumber: formData.get('phoneNumber')?.toString() || null,
        // Proper handling of 'businessSector'
        businessSector:
          formData.get('businessSector') &&
          formData.get('businessSector') !== 'N/A'
            ? (formData.get('businessSector') as BusinessSector)
            : null, // if 'N/A', set to null, else use the value from form
        companyNumber: formData.get('companyNumber')?.toString() || null,
        address: formData.get('addressId')?.toString() || null,
        password: formData.get('password')?.toString() || null,
      });

      if (!validData.success) {
        return {
          success: false,
          errors: {
            title: [
              'Invalid form data: ' +
                JSON.stringify(validData.error?.flatten().fieldErrors),
            ],
          },
        };
      }

      const oldCustomer = await prisma.customer.findUnique({
        where: { customerReference, deleted: false },
      });

      if (!oldCustomer) {
        return {
          success: false,
          errors: {
            title: ['Customer not found'],
          },
        };
      }

      await prisma.customerHistory.create({
        data: {
          customerReference: oldCustomer.customerReference,
          email: oldCustomer.email,
          phoneNumber: oldCustomer.phoneNumber,
          password: oldCustomer.password,
          firstName: oldCustomer.firstName,
          lastName: oldCustomer.lastName,
          companyNumber: oldCustomer.companyNumber,
          deleted: true,
          signedUp: oldCustomer.signedUp,
          avatarPath: oldCustomer.avatarPath,
          addressId: oldCustomer.addressId,
          businessSector: oldCustomer.businessSector,
        },
      });

      const updatedCustomer = await prisma.customer.update({
        where: { customerReference },
        data: {
          email: validData.data.email || oldCustomer.email,
          firstName: validData.data.firstName || oldCustomer.firstName,
          lastName: validData.data.lastName || oldCustomer.lastName,
          companyNumber:
            validData.data.companyNumber === null
              ? null
              : validData.data.companyNumber || oldCustomer.companyNumber,
          phoneNumber: validData.data.phoneNumber || oldCustomer.phoneNumber,
          // Correct handling of businessSector
          businessSector:
            validData.data.businessSector !== null
              ? validData.data.businessSector || oldCustomer.businessSector
              : null,
          address: validData.data.address
            ? {
                connect: {
                  addressId: validData.data.address,
                },
              }
            : {
                connect: {
                  addressId: oldCustomer.addressId,
                },
              },
          customerReference: oldCustomer.customerReference,
          password: oldCustomer.password, // You might want to handle password hashing here as well
        },
      });

      if (!updatedCustomer) {
        return {
          success: false,
          errors: {
            title: ['Failed to update customer'],
          },
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        errors: {
          title: ['Something went wrong' + error],
        },
      };
    }
  }
}

export const customerService = CustomerService.getInstace();

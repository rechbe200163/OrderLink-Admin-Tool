'server only';
import prisma from '@/prisma/client';
import {
  employeeFormSchema,
  generatePasswordForEmployeeCreation,
  hashUserPassword,
  InitialAdminFormSchema,
} from '../utils';
import { FormState } from '../form.types';
import { Prisma, Role } from '@prisma/client';

class EmployeeService {
  private static instance: EmployeeService;

  public static getInstace(): EmployeeService {
    if (!EmployeeService.instance) {
      EmployeeService.instance = new EmployeeService();
    }

    return EmployeeService.instance;
  }

  /**
   *
   * @param formData
   * @returns
   */
  async createEmployee(formData: FormData): Promise<FormState> {
    const validData = employeeFormSchema.safeParse({
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      role: formData.get('role'),
    });

    if (!validData.success) {
      return {
        success: false,
        errors: { title: ['Invalid form data'] },
      };
    }

    const { email, firstName, lastName, role } = validData.data;

    try {
      await prisma.employees.create({
        data: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: await generatePasswordForEmployeeCreation(),
          role: role as Role,
        },
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        errors: { title: ['An error occurred' + error] },
      };
    }
  }

  async updateEmployee(
    employeeId: string,
    formData: FormData
  ): Promise<FormState> {
    const validData = employeeFormSchema.safeParse({
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      role: formData.get('role'),
      password: formData.get('password'),
    });

    if (!validData.success) {
      return {
        success: false,
        errors: { title: ['Invalid form data'] },
      };
    }

    const { email, firstName, lastName, role, password } = validData.data;

    if (
      !(await prisma.employees.findUnique({
        where: { employeeId: employeeId },
      }))
    ) {
      return {
        success: false,
        errors: { title: ['Employee not found'] },
      };
    }

    // Find existing order
    const updateData: Prisma.EmployeesUpdateInput = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: role as Role,
    };

    if (password) {
      updateData.password = password;
    }

    await prisma.employees.update({
      where: { employeeId: employeeId },
      data: updateData,
    });

    return {
      success: true,
    };
  }
  async createInitialAdmin(formData: FormData): Promise<FormState> {
    try {
      const validData = InitialAdminFormSchema.safeParse({
        email: formData.get('email'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        password: formData.get('password'),
      });

      if (!validData.success) {
        return {
          success: false,
          errors: { title: ['Invalid form data'] },
        };
      }

      await prisma.employees.create({
        data: {
          email: validData.data.email,
          firstName: validData.data.firstName,
          lastName: validData.data.lastName,
          password: await hashUserPassword(validData.data.password),
          role: Role.ADMIN,
        },
      });

      // // auto login the new admin

      // signIn('credentials', {
      //   email: validData.data.email,
      //   password: validData.data.password,
      //   redirect: false,
      // });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        errors: { title: ['An error occurred' + error] },
      };
    }
  }
}

export const employeeService = EmployeeService.getInstace();

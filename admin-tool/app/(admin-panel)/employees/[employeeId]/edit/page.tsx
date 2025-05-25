import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import EditEmployee from '@/components/helpers/employees/EditEmployee';
import { employeesApiService } from '@/lib/api/concrete/employees';
import { getTranslations } from 'next-intl/server';
import React from 'react';

interface EditProductPageProps {
  params: Promise<{
    employeeId: string;
  }>;
}

async function EditProductPage(props: EditProductPageProps) {
  const { employeeId } = await props.params;
  const employee = await employeesApiService.getEmployeeById(employeeId);
  const t = await getTranslations('Dashboard');
  return (
    <div className='sticky top-0 bg-background z-10 px-4 '>
      <BreadcrumbComponent
        items={[
          { label: t('Ressource.BreadCrumps.title'), href: '/' },
          {
            label: t('Ressource.Employees.BreadCrumps.title'),
            href: '/employees/',
          },
          {
            label: t('Ressource.Employees.BreadCrumps.edit'),
            href: `/employee/${employee.employeeId}/edit`,
          },
        ]}
      />
      <EditEmployee employee={employee} />
    </div>
  );
}

export default EditProductPage;

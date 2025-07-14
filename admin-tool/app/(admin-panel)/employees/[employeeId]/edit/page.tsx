import EditEmployee from '@/components/helpers/employees/EditEmployee';
import { employeesApiService } from '@/lib/api/concrete/employees';
import React from 'react';

interface EditProductPageProps {
  params: Promise<{
    employeeId: string;
  }>;
}

async function EditProductPage(props: EditProductPageProps) {
  const { employeeId } = await props.params;
  const employee = await employeesApiService.getEmployeeById(employeeId);
  return (
    <div className='sticky top-0 bg-background z-10'>
      <EditEmployee employee={employee} />
    </div>
  );
}

export default EditProductPage;

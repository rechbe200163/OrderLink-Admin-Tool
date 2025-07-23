import React from 'react';
import EmployeeProfile from '@/components/helpers/employees/EmployeeProfile';

interface EditProductPageProps {
  params: Promise<{
    employeeId: string;
  }>;
}

async function EditProductPage(props: EditProductPageProps) {
  const { employeeId } = await props.params;
  return (
    <div className='p-5'>
      <EmployeeProfile employeeId={employeeId} />
    </div>
  );
}

export default EditProductPage;

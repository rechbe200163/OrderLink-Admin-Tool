import EmployeeDetails from '@/components/helpers/employees/EmployeeDetails';
import { employeesApiService } from '@/lib/api/concrete/employees';
import { getSession } from '@/lib/utlis/getSession';

interface PageProps {
  params: Promise<{ employeeId: string }>;
}

export default async function EmployeeDetailsPage({ params }: PageProps) {
  const { employeeId } = await params;
  const employee = await employeesApiService.getEmployeeWithOtp(employeeId);
  const session = await getSession().catch(() => null);

  return (
    <div className='p-5'>
      <EmployeeDetails employee={employee} isLoggedIn={!!session} />
    </div>
  );
}

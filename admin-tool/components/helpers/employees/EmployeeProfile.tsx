import EmployeeDetails from '@/components/helpers/employees/EmployeeDetails';
import EditEmployee from '@/components/helpers/employees/EditEmployee';
import { employeesApiService } from '@/lib/api/concrete/employees';
import { getSession } from '@/lib/utlis/getSession';

export default async function EmployeeProfile({
  employeeId,
}: {
  employeeId: string;
}) {
  const employee = await employeesApiService.getEmployeeWithOtp(employeeId);
  const session = await getSession().catch(() => null);

  return (
    <div className='flex flex-col md:flex-row gap-6'>
      <div className='flex-1'>
        <EditEmployee employee={employee} />
      </div>
      <div className='md:w-1/3'>
        <EmployeeDetails employee={employee} isLoggedIn={!!session} hidePersonalInfo />
      </div>
    </div>
  );
}

import { employeesApiService } from '@/lib/api/concrete/employees';
import EditEmployee from './EditEmployee';
import EmployeeDetails from './EmployeeDetails';

interface EmployeeProfileProps {
  employeeId: string;
}

export default async function EmployeeProfile({
  employeeId,
}: EmployeeProfileProps) {
  const employee = await employeesApiService.getEmployeeWithOtp(employeeId);

  if (!employee) {
    return (
      <div className='flex items-center justify-center min-h-[calc(100vh-64px)] bg-background'>
        <p className='text-lg text-muted-foreground'>Employee not found.</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background p-6 md:p-8 lg:p-10'>
      <h2 className='text-3xl font-bold tracking-tight mb-8 text-foreground'>
        Edit Employee: {employee.firstName} {employee.lastName}
      </h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
        <EditEmployee employee={employee} />
        <EmployeeDetails employee={employee} />
      </div>
    </div>
  );
}

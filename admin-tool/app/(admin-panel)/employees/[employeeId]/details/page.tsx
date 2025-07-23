import EmployeeProfile from '@/components/helpers/employees/EmployeeProfile';

interface PageProps {
  params: Promise<{ employeeId: string }>;
}

export default async function EmployeeDetailsPage({ params }: PageProps) {
  const { employeeId } = await params;

  return (
    <div className='p-5'>
      <EmployeeProfile employeeId={employeeId} />
    </div>
  );
}

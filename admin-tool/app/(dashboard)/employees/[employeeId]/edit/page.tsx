import EmployeeProfile from '@/components/helpers/employees/EmployeeProfile'; // Updated path
import { fetchEmployees } from '@/dummyDataForStaticBuild';

interface EditProductPageProps {
  params: Promise<{
    employeeId: string;
  }>;
}

async function EditProductPage(props: EditProductPageProps) {
  const { employeeId } = await props.params;
  return (
    // The EmployeeProfile component now handles its own padding and background
    <EmployeeProfile employeeId={employeeId} />
  );
}

export default EditProductPage;

export async function generateStaticParams() {
  const employees = await fetchEmployees();
  return employees.map((e) => ({ employeeId: e.id }));
}

import EmployeeProfile from '@/components/helpers/employees/EmployeeProfile'; // Updated path

interface EditProductPageProps {
  params: {
    employeeId: string;
  };
}

async function EditProductPage(props: EditProductPageProps) {
  const { employeeId } = await props.params;
  return (
    // The EmployeeProfile component now handles its own padding and background
    <EmployeeProfile employeeId={employeeId} />
  );
}

export default EditProductPage;

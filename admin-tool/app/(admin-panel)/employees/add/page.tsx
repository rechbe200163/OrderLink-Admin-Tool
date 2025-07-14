import CreateEmployees from '@/components/helpers/employees/CreateEmployee';
import { roleApiService } from '@/lib/api/concrete/roles';
async function CreateEmployeePage() {
  const roles = await roleApiService.getRoleNames();
  return <CreateEmployees roles={roles} />;
}

export default CreateEmployeePage;

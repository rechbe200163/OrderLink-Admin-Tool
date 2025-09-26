import CreateEmployees from '@/components/helpers/employees/CreateEmployee';
import { roleApiService } from '@/lib/api/concrete/roles';
async function CreateEmployeePage() {
  const roles = await roleApiService.getRoleNames();
  return (
    <div className='min-w-full p-5'>
      <CreateEmployees roles={roles} />
    </div>
  );
}

export default CreateEmployeePage;

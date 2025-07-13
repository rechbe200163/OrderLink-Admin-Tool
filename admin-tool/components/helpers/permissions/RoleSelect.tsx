'use client';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { capitalizeFirstLetter } from '@/lib/utils';

export default function RoleSelect({ roles, value }: { roles: string[]; value: string }) {
  const tRole = useTranslations('FilterAndSearch.Filter.Roles.options');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function getRoleLabel(role: string): string {
    switch (role) {
      case 'ADMIN':
        return tRole('admin');
      case 'EMPLOYEE':
        return tRole('employee');
      case 'SUPPLIER':
        return tRole('supplier');
      default:
        return capitalizeFirstLetter(role);
    }
  }

  const handleChange = (role: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('role', role);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleChange} defaultValue={value}>
      <SelectTrigger className='w-40'>
        <SelectValue placeholder='Role' />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role} value={role}>
            {getRoleLabel(role)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

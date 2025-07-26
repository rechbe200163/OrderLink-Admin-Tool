'use client';
import { SelectNative } from '@/components/ui/select-native';
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
    <SelectNative
      onChange={(e) => handleChange(e.target.value)}
      defaultValue={value}
      className='w-40 h-9 ps-3 pe-8'
    >
      {roles.map((role) => (
        <option key={role} value={role}>
          {getRoleLabel(role)}
        </option>
      ))}
    </SelectNative>
  );
}

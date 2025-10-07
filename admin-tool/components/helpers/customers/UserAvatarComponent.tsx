import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User2Icon } from 'lucide-react';

export default async function UserAvatarComponent({
  avatarPath,
}: {
  avatarPath: string;
}) {
  return (
    <Avatar>
      <AvatarImage src={avatarPath!} className='w-10 h-10 rounded-full' />
      <AvatarFallback>
        <User2Icon />
      </AvatarFallback>
    </Avatar>
  );
}

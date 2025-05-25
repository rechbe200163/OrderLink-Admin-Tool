import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabaseService } from '@/lib/utlis/SupabaseStorageService';
import { User2Icon } from 'lucide-react';

export default async function UserAvatarComponent({
  avatarPath,
}: {
  avatarPath: string;
}) {
  const imageURL = await supabaseService.getSingedUrlSupabase(avatarPath);
  return (
    <Avatar>
      <AvatarImage src={imageURL!} className='w-10 h-10 rounded-full' />
      <AvatarFallback>
        <User2Icon />
      </AvatarFallback>
    </Avatar>
  );
}

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense } from 'react';

const TabView = ({
  tabs,
}: {
  tabs: {
    value: string;
    label: string;
    icon?: any;
    badge?: number;
    content: React.ComponentType<any>;
  }[];
}) => {
  return (
    <div className='flex flex-col w-full'>
      <Tabs defaultValue={tabs[0]?.value} className='w-full flex flex-col'>
        <TabsList className='mb-3 h-auto gap-2 rounded-none border-b border-border bg-transparent px-4 py-1 text-foreground flex justify-start'>
          {tabs.map(({ value, label, icon: Icon, badge }, index) => (
            <TabsTrigger
              key={index}
              value={value}
              className='relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent'
            >
              {Icon && (
                <Icon
                  className='-ms-0.5 me-1.5 opacity-60'
                  size={16}
                  strokeWidth={2}
                  aria-hidden='true'
                />
              )}
              {label}
              {badge && <Badge className='ms-1.5'>{badge}</Badge>}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(({ value, content: ContentComponent }, index) => (
          <TabsContent key={index} value={value}>
            <div className='w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 px-5'>
              <Suspense fallback={<div>Loading...</div>}>
                <ContentComponent />
              </Suspense>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TabView;

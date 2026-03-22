import React from 'react';

type AddResourcePageProps = {
  title: string;
  children: React.ReactNode;
};

const AddResourcePage = ({ title, children }: AddResourcePageProps) => {
  return (
    <div className='px-5 pt-5'>
      <h1 className='mb-6 text-2xl font-bold'>{title}</h1>
      {children}
    </div>
  );
};

export default AddResourcePage;

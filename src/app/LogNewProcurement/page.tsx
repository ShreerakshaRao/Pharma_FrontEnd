"use client";

import React, { Suspense } from 'react';
import Purchase from '../components/Purchase';

const PageContent = () => {
  return (
    <>
      <Purchase />
    </>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default Page;

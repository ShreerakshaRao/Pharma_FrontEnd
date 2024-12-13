"use client";

import React, { Suspense } from "react";
import Item from "../components/Item";
import Supplier from "../components/Supplier";
import { useSearchParams } from "next/navigation";
import Purchase from "../components/Purchase";
import Navbar from "../components/Navbar";

const PageContent = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const action = searchParams.get("action");

  return (
    <>
      {page === "addSupplier" && <Supplier />}
      {page === "supplierList" && <Navbar />}

      {page === "addItem" && <Item />}
      {page === "itemList" && <Navbar />}

      {(page === "supplierEdit" || page === "supplierDelete") && <Supplier />}
      {(page === "itemEdit" || page === "itemDelete") && <Item />}

      {action === "editPurchase" && <Purchase />}
      {page === "purchaseList" && <Navbar />}
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

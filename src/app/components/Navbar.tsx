"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "../fonts/style.css";
import PurchaseList from "./PurchaseList";
import SupplierList from "./SupplierList";
import ItemList from "./ItemList";

const Navbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // const [showStocksMenu, setShowStocksMenu] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [activePrimary, setActivePrimary] = useState<string | null>(null);
  const [showSupplierList, setShowSupplierList] = useState(false);
  const [showItemList, setShowItemList] = useState(false);


  // const [activeSecondary, setActiveSecondary] = useState<string | null>(null);

  // const stockSubMenu = () => {
  //   setShowStocksMenu((prev: any) => !prev);
  //   setActivePrimary("Stocks"); 
  // };

  useEffect(() => {
    const highlight = searchParams.get("highlight");
    if (highlight) {
      setActivePrimary(highlight);
      if (highlight === "Stock Purchase") setShowPurchase(true);
      if (highlight === "Supplier") setShowSupplierList(true);
      if (highlight === "Item") setShowItemList(true);
    }
  }, [searchParams]);

  const dropdownRouting = (subPath: string, secondary: string) => {
    // setActiveSecondary(secondary); // Set the active secondary menu item
    router.push(`/Routing?page=${subPath}`);
  };

  const purchaseList = () => {
    setShowPurchase((prev: boolean) => !prev);
    setActivePrimary("Stock Purchase");
    router.push(`/Routing?page=purchaseList&highlight=Stock Purchase`);

  };

  const supplierList = () => {
    setShowSupplierList((prev: boolean) => !prev);
    setActivePrimary("Supplier");
    router.push(`/Routing?page=supplierList&highlight=Supplier`);

  };

  const itemList = () => {
    setShowItemList((prev: boolean) => !prev);
    setActivePrimary("Item");
    router.push(`/Routing?page=itemList&highlight=Item`);

  };


  return (
    <>
      <div className="h-20 border-b border-tableBorder px-10 content-center">
        <div className="h-12 w-full content-center flex gap-24">
          <ul className="flex gap-14">
            <li className="flex">
              <Image src="Tiameds_Logo.svg" alt="Logo" width={48} height={48}/>
              <Image src="Tiameds_Logo2.svg" alt="Logo" width={87} height={39}/>
            </li>
          </ul>
          <ul className="flex gap-10 content-center items-center text-lg font-light">
          <li className={`relative group ${activePrimary === "Supplier" ? "underline decoration-[#4B0082]" : "" } cursor-pointer`} >
              <div className="cursor-pointer">Supplier</div>
              <ul className="navbar_dropdown">
                <li className="dropdown_list cursor-pointer" onClick={() => dropdownRouting("addSupplier", "Supplier")} >Add Supplier</li>
                <li className="dropdown_list cursor-pointer" onClick={supplierList} >Supplier List</li>
              </ul>
          </li>

          <li className={`relative group ${activePrimary === "Item" ? "underline decoration-[#4B0082]" : "" } cursor-pointer`} >
              <div className="cursor-pointer">Item</div>
              <ul className="navbar_dropdown">
                <li className="dropdown_list cursor-pointer" onClick={() => dropdownRouting("addItem", "Item")}> Add Item</li>
                <li className="dropdown_list cursor-pointer"  onClick={itemList}>  Item List</li>
              </ul>
          </li>

            <li className={`${activePrimary === "Stores" ? "underline decoration-[#4B0082]" : "" } cursor-pointer`} onClick={() => setActivePrimary("Stores")}>
              Stores
            </li>
            <li className={`${activePrimary === "Bills" ? "underline decoration-[#4B0082]" : ""} cursor-pointer`} onClick={() => setActivePrimary("Bills")}>
              Bills
            </li>

            <li className={`${activePrimary === "Stock Purchase" ? "underline decoration-[#4B0082]" : "" } cursor-pointer`} onClick={purchaseList}>
            Stock Purchase
            </li>
          </ul>




          <ul className="flex gap-4 content-center items-center ml-auto">
            <li><Image src="Notification_Icon.svg" alt="Notification Icon" width={32} height={32} /></li>
            <li> <Image src="Admin_Img.svg" alt="Admin" width={56} height={56} /></li>
            <li className="inline-grid">
              <span className="text-lg font-normal">April Lossy</span>{" "}
              <span className="text-sm font-normal">Admin</span>
            </li>
          </ul>
        </div>
      </div>

      {/* {showStocksMenu && (
        <div className="h-16 py-3 px-10 border-b border-tableBorder">
          <ul className="flex gap-8 h-10 content-center items-center text-lg font-light">
            <li
              className={`relative group ${
                activeSecondary === "Supplier" ? "underline decoration-[#4B0082]" : ""
              } cursor-pointer`}
            >
              <div className="cursor-pointer">Supplier</div>
              <ul className="navbar_dropdown">
                <li
                  className="dropdown_list cursor-pointer"
                  onClick={() => dropdownRouting("addSupplier", "Supplier")}
                >
                  Add Supplier
                </li>
                <li
                  className="dropdown_list cursor-pointer"
                  onClick={() => dropdownRouting("supplierList", "Supplier")}
                >
                  Supplier List
                </li>
              </ul>
            </li>

            <li
              className={`relative group ${
                activeSecondary === "Item" ? "underline decoration-[#4B0082]" : ""
              } cursor-pointer`}
            >
              <div className="cursor-pointer">Item</div>
              <ul className="navbar_dropdown">
                <li
                  className="dropdown_list cursor-pointer"
                  onClick={() => dropdownRouting("addItem", "Item")}
                >
                  Add Item
                </li>
                <li
                  className="dropdown_list cursor-pointer"
                  onClick={() => dropdownRouting("itemList", "Item")}
                >
                  Item List
                </li>
              </ul>
            </li>

            <li
              className={`${
                activeSecondary === "Store" ? "underline decoration-[#4B0082]" : ""
              } cursor-pointer`}
              onClick={() => setActiveSecondary("Store")}
            >
              Store
            </li>
            <li
              className={`${
                activeSecondary === "Purchase" ? "underline decoration-[#4B0082]" : ""
              } cursor-pointer`}
              onClick={purchaseList}
            >
              Purchase
            </li>
            <li
              className={`${
                activeSecondary === "Purchase Order" ? "underline decoration-[#4B0082]" : ""
              } cursor-pointer`}
              onClick={() => setActiveSecondary("Purchase Order")}
            >
              Purchase Order
            </li>
            <li
              className={`${
                activeSecondary === "Purchase Return" ? "underline decoration-[#4B0082]" : ""
              } cursor-pointer`}
              onClick={() => setActiveSecondary("Purchase Return")}
            >
              Purchase Return
            </li>
          </ul>
        </div>
      )} */}

      {activePrimary === "Stock Purchase" && <PurchaseList />}
      {activePrimary === "Supplier" && <SupplierList />}
      {activePrimary === "Item" && <ItemList />}
    </>
  );
};

export default Navbar;

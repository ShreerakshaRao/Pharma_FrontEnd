"use client";

import React, { useEffect, useState } from 'react'
import '../fonts/style.css'; 
import Image from 'next/image';
import { useRouter } from 'next/navigation'


interface purchase {
  invId: number;
  supplierId: string;
  purchaseDate: string; // or Date if it's directly parsed as Date
  purchaseBillNo: string;
  batchNo: string;
  grandTotal: number;
  paymentStatus: string;
  goodStatus: string;
  supplierName?: string;
}

interface Supplier {
  supplierName: string;
  // supplierMobile: string;
  // supplierEmail: string;
  // supplierAddress: string;
}


const PurchaseList = () => {
  const router = useRouter();
  const Fetch_Purchase = "http://localhost:8080/api/v1/pharma/stock/getAll";

  const [purchases, setPurchases] = useState<purchase[]>([]);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search query


  
  // Function to fetch supplier data by supplierId
  const fetchSupplier = async (supplierId: string): Promise<string> => {
    const Fetch_Supplier = `http://localhost:8080/api/v1/pharma/supplier/getById/${supplierId}`;
    try {
      const response = await fetch(Fetch_Supplier);
      if (!response.ok) {
        throw new Error(`Failed to fetch supplier. Status: ${response.status}`);
      }
      const data: Supplier = await response.json();
      return data.supplierName;
    } catch (error) {
      console.error("Error fetching supplier:", error);
      return "Unknown Supplier"; // Default value in case of failure
    }
  };

  // Fetch purchases and supplier names
  useEffect(() => {
    const fetchPurchasesWithSuppliers = async () => {
      try {
        const response = await fetch(Fetch_Purchase);
        const data: purchase[] = await response.json();

        // Fetch supplier names for each purchase
        const purchasesWithSuppliers = await Promise.all(
          data.map(async (purchase) => {
            const supplierName = await fetchSupplier(purchase.supplierId);
            return { ...purchase, supplierName };
          })
        );

        setPurchases(purchasesWithSuppliers);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    fetchPurchasesWithSuppliers();
  }, []);

  // Restore state from query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("searchQuery");
    const row = params.get("activeRow");

    if (query) setSearchQuery(query);
    if (row) setActiveRow(Number(row));
  }, []);
  
  // Handle search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filtered purchases based on search query
  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.supplierName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.purchaseBillNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.grandTotal.toString().includes(searchQuery) ||
      new Date(purchase.purchaseDate).toLocaleDateString().includes(searchQuery)
  );
  
  const handleIconClick = (invId: number | null) => {
    setActiveRow((prev) => (prev === invId ? null : invId)); 
  };
  
    // const handleEdit = (invId: number) => {
    //   router.push(`/Routing?invId=${invId}&action=editPurchase&searchQuery=${searchQuery}&activeRow=${activeRow}`);
    // };
  
    const handleDelete = (invId: number) => {
      router.push(`/DeleteView?invId=${invId}&action=delete&searchQuery=${searchQuery}&activeRow=${activeRow}`);
    };
  
    const handleView = (invId: number) => {
      router.push(`/DeleteView?invId=${invId}&action=view&searchQuery=${searchQuery}&activeRow=${activeRow}`);
    };

    const newProcurement = () => {
      router.push('/LogNewProcurement'); 
    };

  return (
    <>

    
    <main>
          <span className='heading_text'>
               Procurement List
          </span>

          <div className='search'>
            <div className='space-x-4'>
                <input type="text" name='search' className="input_search" placeholder='Search table...' value={searchQuery} onChange={handleSearch}/>
                {/* <button className='button_filter'>Filter</button> */}
            </div>
            <div>
               <button className='button_log' onClick={newProcurement}> Log New Procurement</button>
            </div>
          </div>

          <div>
        <table className="purchase_table">
          <thead >
            <tr className='purchase_table_tr'>
              <td className="rounded-tl-lg rounded-bl-lg px-2">Supplier Name</td>
              <td>Purchase Date</td>
              <td>Bill No</td>
              {/* <td>Batch No</td> */}
              <td>Bill Amount</td>
              <td>Payment Status</td>
              <td>Goods Status</td>
              <td className="rounded-tr-lg rounded-br-lg"><Image src="Action_Icon2.svg" alt="Action Icon" width={16} height={16}/></td>
            </tr>
          </thead>

          <tbody>
        {filteredPurchases.map((purchase) => (
          <tr key={purchase.invId}>
            <td className='px-2'>{purchase.supplierName}</td>
            <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
            <td>{purchase.purchaseBillNo}</td>
            {/* <td>{purchase.batchNo}</td> */}
            <td>{purchase.grandTotal}</td>
            <td><button className='text-colorWarning bg-buttonWarning h-7 w-20 rounded-3xl'>{purchase.paymentStatus}</button></td>
            <td className='text-colorSuccess'>{purchase.goodStatus}</td>
            
            <td>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Image src="Action_Icon.svg" alt="Action Icon" width={16} height={16} onClick={() => handleIconClick(purchase.invId)} style={{ cursor: "pointer" }} />
                {activeRow === purchase.invId && (
                <div style={{ position: "absolute", top: "20px", left: "0", backgroundColor: "white", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  padding: "8px", borderRadius: "4px", zIndex: 1000, }} >
            
                 
                  {/* <div style={{ padding: "5px", cursor: "pointer" }} onClick={() => handleEdit(purchase.invId)} > Edit  </div> */}

                  <div style={{ padding: "5px", cursor: "pointer" }} onClick={() => handleView(purchase.invId)} > View </div>   

                  <div style={{ padding: "5px", cursor: "pointer" }} onClick={() => handleDelete(purchase.invId)} > Delete  </div>
 
               </div>
              )}
            </div>
          </td>
          </tr>
        ))}
      </tbody>
    </table>

      </div>
    </main>
    
    
    </>
  )
}

export default PurchaseList


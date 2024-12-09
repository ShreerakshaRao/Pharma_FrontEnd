"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import '../fonts/style.css'; 
import { useRouter, useSearchParams } from 'next/navigation'

interface Item {
  itemId: number;
  batchNo: string;
  packageQuantity: number;
  expiryDate: string;
  itemName:string;
  purchasePrice: number;
  mrpSalePrice: number;
  gstAmount: number;
  amount: number;
}

interface OrderSummary {
  purchaseDate: string;
  purchaseBillNo: string;
  paymentDueDate: string;
  grnNo: string;
  grnDate: string;
  orderStatus: string;

  items: Item[];

  totalAmount: number;
  totalGst: number;
  totalDiscount: number;
  grandTotal: number;

  supplierId: string;
  
}

interface Supplier {
  supplierName: string;
  supplierMobile: string;
  supplierEmail: string;
  supplierAddress: string;
}

interface StockItem {
  itemId: number;
  batchNo: string;
  packageQuantity: number;
  expiryDate: string;
  gstAmount: number;
  amount: number;
}

interface ItemDetails {
  itemName: string;
  purchasePrice: number;
  mrpSalePrice: number;
}

const OrderSummary = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invId = searchParams.get("invId");
  const action = searchParams.get("action");
  
  const [orderData, setOrderData] = useState<OrderSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [supplier, setSupplier] = useState<Supplier | null>(null);


  // const Fetch_Summary = `http://localhost:8080/pharma/stock/getById/${invId}`;
  const Delete_Purchase = `http://localhost:8080/pharma/stock/delete/${invId}`;
  
  
  const fetchSupplier = async (supplierId: string) => {
    const Fetch_Supplier = `http://localhost:8080/pharma/supplier/getById/${supplierId}`;
    try {
      const response = await fetch(Fetch_Supplier);
      if (!response.ok) {
        throw new Error(`Failed to fetch supplier. Status: ${response.status}`);
      }
      const data: Supplier = await response.json();
      setSupplier(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching supplier:", error);
      setError("Failed to fetch supplier details.");
    }
  };

  const fetchItemDetails = async (itemId: number): Promise<ItemDetails | null> => {
    const Fetch_Item = `http://localhost:8080/pharma/item/getById/${itemId}`;
    try {
      const response = await fetch(Fetch_Item);
      if (!response.ok) {
        throw new Error(`Failed to fetch item details. Status: ${response.status}`);
      }
      const data = await response.json();
      return {
        itemName: data.itemName || "N/A",
        purchasePrice: data.purchasePrice || 0,
        mrpSalePrice: data.mrpSalePrice || 0,
        // gstAmount: data.gstAmount || 0,
      };
    } catch (error) {
      console.error("Error fetching item details:", error);
      return null;
    }
  };

  useEffect(() => {
    const Fetch_Summary = `http://localhost:8080/pharma/stock/getById/${invId}`;
    const fetchOrderData = async () => {
      if (!invId) {
        setError("Invalid Invoice ID.");
        return;
      }

      try {
        const response = await fetch(Fetch_Summary);
        if (!response.ok) throw new Error(`Failed to fetch order data. Status: ${response.status}`);
        const data = await response.json();

        console.log("Fetched Data:", data); // Debug API response

        // Transform API response to match expected structure
        const transformedData: OrderSummary = {
          purchaseDate: data.purchaseDate || "",
          purchaseBillNo: data.purchaseBillNo || "",
          paymentDueDate: data.paymentDueDate || "",
          grnNo: data.grnNo || "N/A",
          grnDate: data.grnDate || "N/A",
          orderStatus: "Pending",
          items: await Promise.all(
            data.stockItems.map(async (item: StockItem) => {
              const itemDetails = await fetchItemDetails(item.itemId);
              return {
                itemId: item.itemId,
                batchNo: item.batchNo || "N/A",
                packageQuantity: item.packageQuantity || 0,
                expiryDate: item.expiryDate || "N/A",
                gstAmount: item.gstAmount || 0,
                amount: item.amount || 0,
                ...itemDetails, // Add fetched item details
              };
            })
          ),
          totalAmount: data.totalAmount || 0,
          totalGst: data.totalGst || 0,
          totalDiscount: data.totalDiscount || 0,
          grandTotal: data.grandTotal || 0,
          supplierId: data.supplierId || "",
        };

        setOrderData(transformedData); // Set the transformed data
        setError(null);

        // Fetch supplier details
        if (data.supplierId) {
          fetchSupplier(data.supplierId);
 
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchOrderData();
  }, [invId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!orderData) {
    return <div>Loading order details...</div>;
  }
  
  

  const handleDelete = async () => {
    if (!invId) {
      alert("Invalid Invoice ID. Cannot delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this order?")) {
      return; // User cancelled the action
    }

    try {
      setIsDeleting(true);
      const response = await fetch(Delete_Purchase, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete order. Status: ${response.status}`);
      }

      alert("Order deleted successfully.");
      setIsDeleting(false);
      router.push(`/Routing?page=purchaseList&highlight=Stock Purchase`);


    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
      setIsDeleting(false);
    }
  };

  const backPage = () => {
    router.push(`/Routing?page=purchaseList&highlight=Stock Purchase`);
  };
  return (
    <>
    
<Navbar/>

<main className='space-y-10'>
  <div className='order_part1'>
    <div className='order_card1'>
      <div className='text-3xl font-bold text-center'>Order Summary</div>
      <div className='flex justify-center items-center'><Image src="Tiameds_Logo.svg" alt="Logo" width={120} height={120} /></div>
    </div>
     

    <div className='order_card w-32'>
      <div>Invoice Date: <span className='medium_text2'>{new Date(orderData.purchaseDate).toLocaleDateString()}</span></div> 
      <div>Invoice No: <span className='medium_text2'>{orderData.purchaseBillNo}</span></div>
      <div>Payment Due Date: <span className='medium_text2'>{new Date(orderData.paymentDueDate).toLocaleDateString()}</span></div>
      <div>GRN No:</div>
      <div>GRN Date:</div>
      <div>Order Status: <span className='text-colorSuccess'>Order Received</span></div>
    </div>

    <div className="order_card w-38">
            <div>Supplier: <span className='medium_text2'>{supplier?.supplierName}</span></div>
            <div>Contact: <span className='medium_text2'>{supplier?.supplierMobile}</span></div>
            <div>Email: <span className='medium_text2'>{supplier?.supplierEmail}</span></div>
            <div>Address: <span className='medium_text2'>{supplier?.supplierAddress}</span></div>
          </div>
  </div>

  <div className='order_table'>
    <table className='w-full'>
      <thead  className='border-b border-tableBorder h-14'>
        <tr>
          <td className='px-4'>Name of the Item</td>
          <td>Batch No</td>
          <td>Pacakage Qty</td>
          <td>Expiry Date</td>
          <td>Purchase Price</td>
          <td>MRP</td>
          <td>GST</td>
          <td>Amount</td>
        </tr>
      </thead>

      <tbody>
              {orderData.items && orderData.items.length > 0 ? (
                orderData.items.map((item, index) => (
                  <tr key={index}>
                    <td className='px-4'>{item.itemName}</td>
                    <td>{item.batchNo}</td>
                    <td>{item.packageQuantity}</td>
                    <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                    <td>{item.purchasePrice}</td>
                    <td>{item.mrpSalePrice}</td>
                    <td>{item.gstAmount}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
    </table>
  </div>

  <div className='order_card2'>
    <div className='flex'>
      <div>SUB TOTAL</div>
      <div className='order_card2_div'>{orderData.totalAmount}</div>
    </div>

    <div className='flex'>
      <div>GST</div>
      <div className='order_card2_div'>{orderData.totalGst}</div>
    </div>
    
    <div className='flex'>
      <div>DISCOUNT</div>
      <div className='order_card2_div'>{orderData.totalDiscount}</div>
    </div>

    <div className='flex'>
      <div>Grand Total</div>
      <div className='order_card2_div'>{orderData.grandTotal}</div>
    </div>
  </div>
</main>

<div className="flex px-10">
<footer className='ml-auto space-x-5'>

      <button className='button'>Print</button>
      {action === "delete" && (
            <button className="button_red" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
      <button className='button_purple' onClick={backPage}>Back</button>


</footer>
</div>
</>

)
}

export default OrderSummary


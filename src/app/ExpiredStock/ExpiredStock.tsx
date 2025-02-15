'use client'

import { getExpiredStock, getInventory, getStockByItemId } from '@/services/inventoryService';
import { getItemById } from '@/services/itemService';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import '../fonts/style.css'; 


interface ExpiredStockProps {
  itemId: number;
}

interface Inventory {
  stockId: number;
  itemId: number;
  batchNo: string;
  packageQuantity: number;
  expiryDate: string;
  purchasePrice: number;
  mrpSalePrice: number;
  store: string;
  expiredQuantity?: number;
}

const ExpiredStock: React.FC<ExpiredStockProps> = ({ itemId }) => {  
  const [itemName, setItemName] = useState<string>("");
  const [manufacturer, setManufacturer] = useState<string>("");
  const [packageQuantity, setPackageQuantity] = useState<number>(0);
  const [expiredQuantity, setExpiredQuantity] = useState<number>(0);
  const [stockData, setStockData] = useState<Inventory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemDetails = await getItemById(itemId);
        setItemName(itemDetails.itemName);
        setManufacturer(itemDetails.manufacturer);

        const inventoryResponse = await getInventory();
        const inventoryItem = inventoryResponse.find((inv: { itemId: number; }) => inv.itemId === itemId);
        setPackageQuantity(inventoryItem ? inventoryItem.packageQuantity : 0);

        const expiredStockResponse = await getExpiredStock();
        const expiredStockItem = expiredStockResponse.find((exp: { itemId: number; }) => exp.itemId === itemId);
        setExpiredQuantity(expiredStockItem ? expiredStockItem.packageQuantity : 0);

        const stockResponse = await getStockByItemId(itemId);
        if (Array.isArray(stockResponse)) {
          setStockData(stockResponse);
        } else {
          throw new Error("Invalid stock response format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error instanceof Error ? error.message : "An unknown error occurred");
      }
    };

    fetchData();
  }, [itemId]);

  return (
    <>
      <span className='heading_text'>Expired Stock</span>

      
        <div className='m-4 border border-tableBorder h-full rounded-lg'>
          <div className="grid grid-cols-4 p-3">
            <div>
              <div className="small_text">Item Name</div>
              <div className="medium_text3">{itemName}</div>
            </div>

            <div>
              <div className="small_text">Manufacturer</div>
              <div className="medium_text3">{manufacturer}</div>
            </div>

            <div>
              <div className="small_text">Current Stock</div>
              <div className="medium_text3">{packageQuantity}</div>
            </div>

            <div>
              <div className="small_text">Expired Stock</div>
              <div className={`medium_text3 ${expiredQuantity ? "text-red-600 font-bold" : ""}`}>
              {expiredQuantity}
              </div>
            </div>
          </div>
        </div>
      
      

        <div className='p-3'>
        <div className="sub_heading_text">Stock Details</div>
          <table className="purchase_table">
            <thead>
              <tr className='purchase_table_tr'>
                <td className="rounded-tl-lg rounded-bl-lg px-2">Batch No</td>
                <td>Store</td>
                <td>Purchase Price</td>
                <td>MRP Price</td>
                <td>Expiry Date</td>
                <td className="rounded-tr-lg rounded-br-lg">Quantity</td>
              </tr>
            </thead>

            <tbody className="small_text">
              {stockData.length > 0 ? (
                stockData.map((stock) => (
                  <tr key={stock.stockId}>
                    <td className='px-2'>{stock.batchNo}</td>
                    <td>{stock.store}</td>
                    <td>{stock.purchasePrice}</td>
                    <td>{stock.mrpSalePrice}</td>
                    <td className={new Date(stock.expiryDate) < new Date() ? "text-red-600 font-bold" : ""}>
                        {new Date(stock.expiryDate).toLocaleDateString("en-GB", {
                         day: "2-digit",
                         month: "short",
                         year: "numeric",
                         })}
                    </td>                   
                    <td>{stock.packageQuantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">No stock data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    </>
  );
};

export default ExpiredStock;

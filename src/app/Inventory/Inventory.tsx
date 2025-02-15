'use client';

import React, { useEffect, useState } from 'react';
import '../fonts/style.css'; 
import { getItemById } from '@/services/itemService';
import { getInventory, getExpiredStock } from '@/services/inventoryService';
import { toast } from 'react-toastify';
import { CiViewList } from "react-icons/ci";
import ExpiredStock from '../ExpiredStock/ExpiredStock';


interface Inventory {
  invItemId: number;
  itemId: number;
  packageQuantity: number;
  expiredQuantity?: number; 
  itemName?: string;
  manufacturer?: string;

}


const Inventory = () => {
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [searchQuery, setSearchQuery] = useState(""); 
    const [showExpiredStock, setshowExpiredStock] = useState(false); // New state for form visibility
    const [selectedItemId, setSelectedItemId] = useState<number>(); 
  
  
const fetchItem = async (itemId: string): Promise<{ name: string; manufacturer: string }> => {
  try {
    const item = await getItemById(Number(itemId)); 
    return { name: item.itemName, manufacturer: item.manufacturer };
  } catch (error) {
    console.error("Error fetching Item:", error);
    return { name: "Unknown Item", manufacturer: "Unknown Manufacturer" };
  }
};


useEffect(() => {
      const fetchInventory = async () => {
        try {
          const inventoryResponse = await getInventory();
          const expiredStockResponse = await getExpiredStock(); // Fetch expired stock
  
          if (!Array.isArray(inventoryResponse) || !Array.isArray(expiredStockResponse)) {
            throw new Error("Invalid data format from API");
          }
  
          const expiredStockMap = new Map(
            expiredStockResponse.map((item) => [item.itemId, item.packageQuantity])
          );
  
          const inventoryWithData: Inventory[] = await Promise.all(
            inventoryResponse.map(async (inventory) => {
                const { name, manufacturer } = await fetchItem(inventory.itemId); // ✅ Extract name & manufacturer
                return {
                  ...inventory,
                  itemName: name,  // ✅ Correct: itemName is now a string
                  manufacturer,  // ✅ Correct: Assign manufacturer properly
                  expiredQuantity: expiredStockMap.get(inventory.itemId) || 0,
                };
            })
          );
  
          setInventory(inventoryWithData);
        } catch (error) {
          console.error("Error fetching inventory:", error);
          toast.error(error instanceof Error ? error.message : "An unknown error occurred");
        }
      };
  
      fetchInventory();
    }, []);
  
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    };
  
    const filteredInventory = inventory.filter(
      (inv) =>
        inv.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.packageQuantity.toString().includes(searchQuery)
    );
  
    const expiredStock = (itemId: number) => {
      setSelectedItemId(itemId);
      setshowExpiredStock(true);
    };
  
    return (
      <>
      {!showExpiredStock ? 
        <main>
          <span className='heading_text'>Inventory List</span>
  
          <div className='search'>
            <div className='space-x-4'>
              <input type="text" name='search' className="input_search" placeholder='Search table...' value={searchQuery} onChange={handleSearch}/>
            </div>
          </div>
  
          <div>
            <table className="purchase_table">
              <thead>
                <tr className='purchase_table_tr'>
                  <td className="rounded-tl-lg rounded-bl-lg px-2">Item Name</td>
                  <td>Manufacturer</td>
                  <td>Current Stock</td>
                  <td>Expired Stock</td>
                  <td className="rounded-tr-lg rounded-br-lg"> Action
                  </td>
                </tr>
              </thead>
  
              <tbody className="small_text">
                {filteredInventory.map((inv) => (
                  <tr key={inv.invItemId}>
                    <td className='px-3'>{inv.itemName}</td>
                    <td>{inv.manufacturer}</td>
                    <td>{inv.packageQuantity}</td>
                    <td className={inv.expiredQuantity && inv.expiredQuantity > 0 ? 'text-red-600 font-bold' : ''}>
                      {inv.expiredQuantity || 0}
                    </td>
                    <td>
                        <div className="relative group inline-block">
                         <CiViewList className="w-6 h-6 cursor-pointer"
                         onClick={() => expiredStock(inv.itemId)}/>
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-3 py-1 text-xs text-red-700 bg-white shadow-lg rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-max">
                              View Expired Stock List
                            </span>
                          </div>
  
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
        : '' }
        <main>
        {showExpiredStock && (
                    <ExpiredStock itemId={selectedItemId ?? 0} />
          )}
        </main>
      </>
    );
}

export default Inventory
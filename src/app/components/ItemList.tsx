"use client";

import React, { useEffect, useState } from 'react';
import '../fonts/style.css'; 
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Item {
  itemId: number; 
  itemName: string;
  purchasePrice: number;
  mrpSalePrice: number;
  gstPercentage: number;
  hsnNo: string;
}

const ItemList = () => {
  const router = useRouter();
  const Fetch_Item = "http://localhost:8080/pharma/item/getAll";

  const [items, setItems] = useState<Item[]>([]);
  const [activeRow, setActiveRow] = useState<number | null>(null);


  const fetchItems = async (): Promise<Item[]> => {
      try {
        const response = await fetch(Fetch_Item); 
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        return response.json();
      } catch (error) {
        console.error(error);
        return [];
      }
    };
  
  useEffect(() => {
      const loadItems = async () => {
        const data = await fetchItems();
        setItems(data);
      };
      loadItems();
    }, []);

    const iconClick = (itemId: number | null) => {
      setActiveRow((prev) => (prev === itemId ? null : itemId)); 
    };
    
      const handleDelete = (itemId: number) => {
        router.push(`/Routing?itemId=${itemId}&page=itemDelete`); 
      };
    
      const handleView = (itemId: number) => {
        router.push(`/Routing?itemId=${itemId}&page=itemEdit`); 
      };

  return (
    <>
    <main>
      <span className='heading_text'>
        Item List
      </span>
      <div>
        <table className="purchase_table">
          <thead>
            <tr className='purchase_table_tr'>
              <td className="rounded-tl-lg rounded-bl-lg px-2">Item Name</td>
              <td>Purcahse Price</td>
              <td>MRP</td>
              <td>GST </td>
              <td>HSN No</td>
              <td className="rounded-tr-lg rounded-br-lg">
                <Image src="Action_Icon2.svg" alt="Action Icon" width={16} height={16} />
              </td>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.itemId}>
                  <td>{item.itemName}</td>
                  <td>{item.purchasePrice}</td>
                  <td>{item.mrpSalePrice}</td>
                  <td>{item.gstPercentage}</td>
                  <td>{item.hsnNo}</td>
                  
                  <td>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Image src="Action_Icon.svg" alt="Action Icon" width={16} height={16} onClick={() => iconClick(item.itemId)} style={{ cursor: "pointer" }} />
            {activeRow === item.itemId && (
            <div style={{ position: "absolute", top: "20px", left: "0", backgroundColor: "white", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              padding: "8px", borderRadius: "4px", zIndex: 1000, }} >
        
              {/* <div style={{ padding: "5px", cursor: "pointer" }} > Edit </div> */}

              <div style={{ padding: "5px", cursor: "pointer" }} onClick={() => handleView(item.itemId)} > Edit </div> 

              <div style={{ padding: "5px", cursor: "pointer" }} onClick={() => handleDelete(item.itemId)} > Delete  </div>
             
                 
           </div>
          )}
        </div>
      </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  </>
  )
}

export default ItemList
"use client";

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import '../fonts/style.css'; 
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation'

interface Item {
  itemName: string;
  purchaseUnit: string;
  unitType: string;
  manufacturer: string;
  purchasePrice: string;
  mrpSalePrice: string;
  purchasePricePerUnit: string;
  mrpSalePricePerUnit: string;
  gst_percentage: string;
  hsnNo: string;
  consumables: boolean;

} 

const Item = () => {
    const router = useRouter();

    const Item_Save = "http://localhost:8080/pharma/item/save";
    const Item_Fetch = "http://localhost:8080/pharma/item/getById"; 
    const Item_Delete = "http://localhost:8080/pharma/item/delete";
    const Item_Update = "http://localhost:8080/pharma/item/update";
    
    const searchParams = useSearchParams();
    const itemId = searchParams.get("itemId");
    const page = searchParams.get("page");  

    const [item, setitem] = useState<Item>({
      itemName: "",
      purchaseUnit: "",
      unitType: "",
      manufacturer: "",
      purchasePrice: "",
      mrpSalePrice: "",
      purchasePricePerUnit: "",
      mrpSalePricePerUnit: "",
      gst_percentage: "",
      hsnNo: "",
      consumables: false,
    });
   
    useEffect(() => {
      const fetchItemDetails = async () => {
        if ((page === 'itemEdit' || page === 'itemDelete') && itemId) {
          try {
            const response = await fetch(`${Item_Fetch}/${itemId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch item details');
            }
            const data = await response.json();
            setitem(data);
          } catch (error) {
            console.error(error);
            alert('Unable to fetch item details.');
          }
        }
      };
      fetchItemDetails();
    }, [page, itemId]);


   const handleChange = (
  eve: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, type, value } = eve.target;

  const updatedValue = type === 'checkbox' ? (eve.target as HTMLInputElement).checked : value;

  setitem((prevItem: Item) => {
    const newItem = {
      ...prevItem,
      [name]: updatedValue,
    };

    // Additional logic for purchase price and unit calculations
    if (name === "purchaseUnit" || name === "purchasePrice" || name === "mrpSalePrice") {
      const purchaseUnit = parseInt(newItem.purchaseUnit);
      const purchasePrice = parseInt(newItem.purchasePrice);
      const mrpSalePrice = parseInt(newItem.mrpSalePrice);

      if (!isNaN(purchaseUnit) && !isNaN(purchasePrice) && purchaseUnit > 0) {
        newItem.purchasePricePerUnit = (purchasePrice / purchaseUnit).toString();
      } else {
        newItem.purchasePricePerUnit = ""; // Reset if inputs are invalid
      }

      if (!isNaN(purchaseUnit) && !isNaN(mrpSalePrice) && purchaseUnit > 0) {
        newItem.mrpSalePricePerUnit = (mrpSalePrice / purchaseUnit).toString();
      } else {
        newItem.mrpSalePricePerUnit = ""; // Reset if inputs are invalid
      }
    }

    return newItem;
  });
};

     const addItem = async (e: { preventDefault: () => void }) => {
      e.preventDefault();

         try {
        const response = await fetch(Item_Save, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });
  
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        
        alert("Item added successfully!");
        
        // window.location.reload();
        router.push(`/Routing?page=itemList&highlight=Item`);
      } catch (error) {
        console.log(error);
        alert("Failed to add item. Please try again.");
      }
    };

    const onlyNumber = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length <= 10) {
        handleChange(e); 
      }
    };
   
    const deleteItem = async () => {
      if (!itemId) {
        alert('Item ID is required to delete.');
        return;
      }
      try {
        const response = await fetch(`${Item_Delete}/${itemId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete item");
        }
        alert("Item Deleted");
        history.back();
      } catch (error) {
        console.error(error);
      }
    };
  
    const editItem = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (!itemId) {
        alert("Item ID is required to update.");
        return;
      }
      try {
        const response = await fetch(`${Item_Update}/${itemId}`, {
          method: "PUT", // Use PUT method for updating
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });
    
        if (!response.ok) {
          throw new Error("Failed to update Item");
        }
        alert("Item Updated Successfully");
        history.back();
      } catch (error) {
        console.error(error);
        alert("An error occurred while updating the Item.");
      }
    };
    
    
  return (
    <div className="outer_card">
      <header className="supplier_item_header">
        <div className="flex gap-4">
          <Image src="Tiameds_Logo.svg" alt="Logo" width={48} height={48} />
          <span className="text-2xl font-medium">Add New Item</span>
        </div>
        <Image src="Close_Icon.svg" alt="Close Icon" width={24} height={24} />
      </header>

      <main className="supplier_item_main">
        <span className="sub_heading_text">Item Details</span>

        <div className="my-3 mb-4 grid grid-cols-4 gap-4">
          <div className="inline-grid gap-1">
            <label htmlFor="itemName" >Name</label>
            <input type="text" name="itemName" id="itemName" value={item.itemName  as string} onChange={(e) => handleChange(e)} placeholder="Enter here..." maxLength={50} className="supplier_item_input" />
          </div>

          <div className="inline-grid gap-1">
            <label htmlFor="purchaseUnit" >Purchase Unit</label>
            <input type="text" name="purchaseUnit" id="purchaseUnit" value={item.purchaseUnit} onChange={(e) => handleChange(e)} placeholder="Enter here..." maxLength={5} className="supplier_item_input" />
          </div>

          <div className="inline-grid gap-1">
            <label htmlFor="unitType" >Unit Type</label>
            <select name="unitType" id="unitType" value={item.unitType  as string} onChange={(e) => handleChange(e)} className="supplier_item_select" >
              <option value="">Select</option>
              <option value="Bottel">Bottel</option>
              <option value="Injection">Injection</option>
              <option value="Numbers">Numbers</option>
              <option value="Strips">Strips</option>
              <option value="Vial">Vial</option>
            </select>
          </div>

          <div className="inline-grid gap-1">
            <label htmlFor="manufacturer" >Manufacturer</label>
            <input type="text" name="manufacturer" id="manufacturer" value={item.manufacturer as string} onChange={(e) => handleChange(e)} placeholder="Enter here..." maxLength={50} className="supplier_item_input" />
          </div>

          <div className="inline-grid gap-1">
            <label htmlFor="purchasePrice" >Purchase Price</label>
            <input type="number" name="purchasePrice" id="purchasePrice" value={item.purchasePrice} onChange={onlyNumber} placeholder="Enter here..." className="supplier_item_input"  />
          </div>

          <div className="inline-grid gap-1">
          <label htmlFor="mrpSalePrice" >MRP</label>
          <input type="number" name="mrpSalePrice" id="mrpSalePrice" value={item.mrpSalePrice} onChange={onlyNumber} placeholder="Enter here..." className="supplier_item_input" />
        </div>

        <div className="inline-grid gap-1">
            <label htmlFor="purchasePricePerUnit" >Purchase Price Per Unit</label>
            <input type="number" name="purchasePricePerUnit" id="purchasePricePerUnit" value={item.purchasePricePerUnit} onChange={(e) => handleChange(e)} placeholder="Enter here..." readOnly className="supplier_item_input"  />
          </div>

          <div className="inline-grid gap-1">
          <label htmlFor="mrpSalePricePerUnit" >Sale Price Per Unit</label>
          <input type="number" name="mrpSalePricePerUnit" id="mrpSalePricePerUnit" value={item.mrpSalePricePerUnit} onChange={(e) => handleChange(e)} placeholder="Enter here..." readOnly className="supplier_item_input" />
        </div>

        <div className="inline-grid gap-1">
          <label htmlFor="gst_percentage" >GST%</label>
          <select name="gst_percentage" id="gst_percentage" value={item.gst_percentage} onChange={(e) => handleChange(e)} className="supplier_item_select" >
              <option value="">Select</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>

            </select>
        </div>

        <div className="inline-grid gap-1">
          <label htmlFor="hsnNo" >HSN No</label>
          <input type="text" name="hsnNo" id="hsnNo" value={item.hsnNo as string} onChange={(e) => handleChange(e)} placeholder="Enter here..." maxLength={20} className="supplier_item_input" />
        </div>

      </div>

      <div className="flex items-center space-x-2">
      <input type="checkbox" name="consumables" id="Pharma Consumables" onChange={(e) => handleChange(e)} className="w-4 h-4 rounded focus:ring-2 focus:ring-inputBorder focus:border-transparent outline-none" />
      <label htmlFor="consumables" > Pharma Consumables</label>
    </div>

        
      </main>

      <footer className="space-x-5">
        {page === "itemEdit" && <button className="button" onClick={editItem}>Edit</button>}
        {page === "itemDelete" && <button className="button_red" onClick={deleteItem}>Delete</button>}
        {page === "addItem" && <button onClick={addItem} className="gray_purple_button">Add Item</button>}
      </footer>
    </div>
 
  )
}

export default Item
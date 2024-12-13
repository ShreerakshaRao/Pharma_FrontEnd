"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import '../globals.css'; 
import '../fonts/style.css'; 
import { useRouter, useSearchParams } from 'next/navigation';



const Supplier = () => {
  const router = useRouter();
  const Supplier_Save = "http://localhost:8080/api/v1/pharma/supplier/save";
  const Supplier_Fetch = "http://localhost:8080/api/v1/pharma/supplier/getById"; 
  const Supplier_Delete = "http://localhost:8080/api/v1/pharma/supplier/delete";
  const Supplier_Update = "http://localhost:8080/api/v1/pharma/supplier/update";
  
  const searchParams = useSearchParams();
  const supplierId = searchParams.get("supplierId");
  const page = searchParams.get("page");

 const [supplier, setsupplier] = useState({
    supplierName:"",
    supplierMobile:"",
    supplierEmail:"",
    supplierGstinNo:"",
    supplierGstType:"",
    supplierAddress:"",
  });
   
  useEffect(() => {
    const fetchSupplierDetails = async () => {
      if ((page === 'supplierEdit' || page === 'supplierDelete') && supplierId) {
        try {
          const response = await fetch(`${Supplier_Fetch}/${supplierId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch supplier details');
          }
          const data = await response.json();
          setsupplier(data);
        } catch (error) {
          console.error(error);
          alert('Unable to fetch supplier details.');
        }
      }
    };
    fetchSupplierDetails();
  }, [page, supplierId]);

  
   const handleChange = (eve: React.ChangeEvent<HTMLInputElement  | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = eve.target.value;
    setsupplier({...supplier, [eve.target.name]: value });
   }

   const addSupplier = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!supplier.supplierName) {
      alert("Please fill Supplier Name");
      return;
    }
    
    if (!supplier.supplierMobile) {
      alert("Please fill Contact No.");
      return;
    }

    if (!supplier.supplierGstinNo) {
      alert("Please fill GSTIN No.");
      return;
    }

    if (!supplier.supplierGstType) {
      alert("Please fill GST Type");
      return;
    }
    
    if (!supplier.supplierEmail) {
      alert("Please fill Email");
      return;
    }

    if (!supplier.supplierAddress) {
      alert("Please fill Address");
      return;
    }
    
    try {
      const response = await fetch(Supplier_Save, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplier),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      alert("Suplier added successfully")
      // window.location.reload();
      router.push(`/Routing?page=supplierList&highlight=Supplier`);

    } catch (error) {
      console.log(error); 
    }
  };

  const onlyNumber = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 10) {
      handleChange(e); 
    }
  };
  
  const deleteSupplier = async () => {
    if (!supplierId) {
      alert('Supplier ID is required to delete.');
      return;
    }
    try {
      const response = await fetch(`${Supplier_Delete}/${supplierId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete supplier");
      }
      alert("Supplier Deleted");
      history.back();
    } catch (error) {
      console.error(error);
    }
  };

  const editSupplier = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!supplierId) {
      alert("Supplier ID is required to update.");
      return;
    }
    try {
      const response = await fetch(`${Supplier_Update}/${supplierId}`, {
        method: "PUT", // Use PUT method for updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplier),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update supplier");
      }
      alert("Supplier Updated Successfully");
      history.back();
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating the supplier.");
    }
  };
  
  const closeIcon = () => {
    router.back();
   };

  return (
    <div className="outer_card">
      <header className="supplier_item_header">
        <div className="flex gap-4">
          <Image src="Tiameds_Logo.svg" alt="Logo" width={48} height={48} />
          <span className="heading_text">Add New Supplier</span>
        </div>
        <Image src="Close_Icon.svg" alt="Close Icon" width={24} height={24} onClick={closeIcon} className='cursor-pointer'/>
      </header>

      <main className="supplier_item_main">
        <span className="sub_heading_text">Supplier Details</span>

        <div className="grid grid-cols-4 gap-6">
          <div className="inline-grid gap-1">
            <label htmlFor="supplierName" >Name</label>
            <input type="text" name="supplierName" id="supplierName" value={supplier.supplierName} onChange={(e) => handleChange(e)} placeholder="Enter here..." maxLength={50} className="supplier_item_input" />
          </div>

          <div className="inline-grid gap-1">
            <label htmlFor="supplierMobile" >Contact No.</label>
            <input type="number" name="supplierMobile" id="supplierMobile" value={supplier.supplierMobile} onChange={onlyNumber} placeholder="Enter here..." className="supplier_item_input" />
          </div>

          <div className="inline-grid gap-1">
            <label htmlFor="supplierGstinNo" >GSTIN No.</label>
            <input type="text" name="supplierGstinNo" id="supplierGstinNo" value={supplier.supplierGstinNo} onChange={(e) => handleChange(e)} placeholder="Enter here..." maxLength={20} className="supplier_item_input" />
          </div>

          <div className="inline-grid gap-1">
            <label htmlFor="supplierGstType" >GST Type</label>
            <select name="supplierGstType" id="supplierGstType" value={supplier.supplierGstType} onChange={(e) => handleChange(e)} className="supplier_item_select" >
              <option value="" disabled>Select</option>
              <option value="CGST">CGST</option>
              <option value="SGST">SGST</option>
              <option value="CGST+SGST">CGST+SGST</option>
            </select>
          </div>

          <div className="inline-grid gap-1">
            <label htmlFor="supplierEmail" >Email</label>
            <input type="text" name="supplierEmail" id="supplierEmail" value={supplier.supplierEmail} onChange={(e) => handleChange(e)} placeholder="Enter here..." maxLength={50} className="supplier_item_input"  />
          </div>
        </div>

        <div className="inline-grid gap-1">
          <label htmlFor="supplierAddress" >Address</label>
          <textarea cols={188} rows={4}  name="supplierAddress" id="supplierAddress" value={supplier.supplierAddress} onChange={(e) => handleChange(e)} placeholder="Enter here..." maxLength={500} className="supplier_textarea" ></textarea>
        </div>
      </main>

      <footer className="space-x-5">
        {page === "supplierEdit" && <button className="button" onClick={editSupplier}>Edit</button>}
        {page === "supplierDelete" && <button className="button_red" onClick={deleteSupplier}>Delete</button>}
        {page === "addSupplier" && <button onClick={addSupplier} className="gray_purple_button">Add Supplier</button>}
      </footer>
    </div>
  
);
};


export default Supplier
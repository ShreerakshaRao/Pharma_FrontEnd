"use client";

import React, { useEffect, useState } from 'react';
import '../fonts/style.css'; 
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Supplier {
    supplierId: number; 
    supplierName: string;
    supplierMobile: number;
    supplierEmail: string;
    supplierGstType: string;
    supplierGstinNo: string;
}

const SupplierList = () => {
    const router = useRouter();
    const Fetch_Supplier = "http://localhost:8080/api/v1/pharma/supplier/getAll";

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [activeRow, setActiveRow] = useState<number | null>(null);


    const fetchSuppliers = async (): Promise<Supplier[]> => {
        try {
          const response = await fetch(Fetch_Supplier); 
          if (!response.ok) {
            throw new Error('Failed to fetch suppliers');
          }
          return response.json();
        } catch (error) {
          console.error(error);
          return [];
        }
      };
    
    useEffect(() => {
        const loadSuppliers = async () => {
          const data = await fetchSuppliers();
          setSuppliers(data);
        };
        loadSuppliers();
      }, []);

      const iconClick = (supplierId: number | null) => {
        setActiveRow((prev) => (prev === supplierId ? null : supplierId)); 
      };
      
        const handleDelete = (supplierId: number) => {
          router.push(`/Routing?supplierId=${supplierId}&page=supplierDelete`); 
        };
      
        const handleView = (supplierId: number) => {
          router.push(`/Routing?supplierId=${supplierId}&page=supplierEdit`); 
        };

    return (
      <>
        <main>
          <span className='heading_text'>
            Supplier List
          </span>
          <div>
            <table className="purchase_table">
              <thead>
                <tr className='purchase_table_tr'>
                  <td className="rounded-tl-lg rounded-bl-lg px-2">Supplier Name</td>
                  <td>Contact Number</td>
                  <td>Email</td>
                  <td>GST Type</td>
                  <td>GSTIN No</td>
                  <td className="rounded-tr-lg rounded-br-lg">
                    <Image src="Action_Icon2.svg" alt="Action Icon" width={16} height={16} />
                  </td>
                </tr>
              </thead>
              <tbody>
                {suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <tr key={supplier.supplierId}>
                      <td>{supplier.supplierName}</td>
                      <td>{supplier.supplierMobile}</td>
                      <td>{supplier.supplierEmail}</td>
                      <td>{supplier.supplierGstType}</td>
                      <td>{supplier.supplierGstinNo}</td>
                      
                      <td>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Image src="Action_Icon.svg" alt="Action Icon" width={16} height={16} onClick={() => iconClick(supplier.supplierId)} style={{ cursor: "pointer" }} />
                {activeRow === supplier.supplierId && (
                <div style={{ position: "absolute", top: "20px", left: "0", backgroundColor: "white", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  padding: "8px", borderRadius: "4px", zIndex: 1000, }} >
            
                  {/* <div style={{ padding: "5px", cursor: "pointer" }} > Edit </div> */}

                  <div style={{ padding: "5px", cursor: "pointer" }} onClick={() => handleView(supplier.supplierId)} > Edit </div>  

                  <div style={{ padding: "5px", cursor: "pointer" }} onClick={() => handleDelete(supplier.supplierId)} > Delete  </div>
                 
                   
               </div>
              )}
            </div>
          </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      No suppliers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </>
    );
};

export default SupplierList;

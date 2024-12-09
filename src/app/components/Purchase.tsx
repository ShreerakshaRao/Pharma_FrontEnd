"use client";

import React, { useCallback, useEffect, useState } from 'react'
import Navbar from './Navbar';
import '../fonts/style.css'; 
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';

type Supplier = {
  supplierId: number;
  supplierName: string;
};

type Item = {
  itemId: string;
  itemName: string;
};

type PurchaseRow = {
  selectedItem: string;
  batchNo: string;
  packageQuantity: string;
  expiryDate: string;
  purchasePrice: number;
  mrpSalePrice: number;
  gstPercentage: number;
  gstAmount: number;
  discount:number;
  amount: number;
};

type StockItem = {
  itemId: string;
  batchNo: string;
  packageQuantity: number;
  expiryDate: string;
  purchasePrice: number;
  mrpSalePrice: number;
  gstPercentage: number;
  gstAmount: number;
  discount: number;
  amount: number;
};

const Purchase = () => {
const router = useRouter();

const Purchase_Save = "http://localhost:8080/pharma/stock/save";
const Fetch_Supplier = "http://localhost:8080/pharma/supplier/getAll";
const Fetch_Item = "http://localhost:8080/pharma/item/getAll";
const Fetch_Item_ById = "http://localhost:8080/pharma/item/getById";

const searchParams = useSearchParams();
const invId = searchParams.get("invId");
const action = searchParams.get("action"); 

const [showOptions, setShowOptions] = useState<number | null>(null);
const [supplier, setSupplier] = useState<Supplier[]>([]);
const [selectedSupplier, setSelectedSupplier] = useState("");
const [purchase, setPurchase] = useState({
  purchaseDate: "",
  purchaseBillNo: "",
  creditPeriod: "",
  paymentDueDate: "",
  supplierId: "",
  invoiceAmount: "",
  totalAmount: 0,
  totalGst: 0,
  totalDiscount: 0,
  grandTotal: 0,

});

const [items, setItems] = useState<Item[]>([]);
const [purchaseRows, setPurchaseRows] = useState<PurchaseRow[]>([
  {
    selectedItem: "",
    batchNo: "",
    packageQuantity: "",
    expiryDate: "",
    purchasePrice: 0,
    mrpSalePrice: 0,
    gstPercentage: 0,
    gstAmount: 0,
    discount:0,
    amount: 0,
  },
]);


const [totalDiscount, setTotalDiscount] = useState(0);

// Fetch suppliers and items in useEffect hooks (No changes made here)
useEffect(() => {
  fetch(Fetch_Supplier)
    .then((response) => response.json())
    .then((data: Supplier[]) => setSupplier(data))
    .catch((error) => console.error("Error fetching suppliers:", error));
}, []);

useEffect(() => {
  fetch(Fetch_Item)
    .then((response) => response.json())
    .then((data: Item[]) => setItems(data))
    .catch((error) => console.error("Error fetching items:", error));
}, []);

// Fetch item details and update purchaseRow on item change
const fetchItemDetails = (itemId: string, index: number) => {
  fetch(`${Fetch_Item_ById}/${itemId}`)
    .then((response) => response.json())
    .then((data) => {
      const { purchasePrice, mrpSalePrice, gstPercentage } = data;
      const packageQuantity = parseFloat(purchaseRows[index].packageQuantity) || 0;
      const gstAmount = (purchasePrice * gstPercentage) / 100;
      const amount = purchasePrice * packageQuantity;

      const itemName = items.find((item) => item.itemId === itemId)?.itemName || "";


      setPurchaseRows((prevRows) =>
        prevRows.map((row, rowIndex) =>
          rowIndex === index
            ? { ...row, purchasePrice, mrpSalePrice, gstPercentage, gstAmount, amount, itemName }
            : row
        )
      );
    })
    .catch((error) => console.error("Error fetching item details:", error));
};

useEffect(() => {
  if (selectedSupplier) {
    console.log(`Selected Supplier: ${selectedSupplier}`);
  }
}, [selectedSupplier]);


useEffect(() => {
  if (action === "editPurchase" && invId) {
    const fetchPurchaseData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/pharma/stock/getById/${invId}`);
        if (!response.ok) {
          throw new Error("Error fetching purchase data");
        }
        const data = await response.json();
        console.log("Fetched Data:", data); 

        // Map the received data to the form structure
        const {
          purchaseDate,
          purchaseBillNo,
          creditPeriod,
          paymentDueDate,
          supplierId,
          invoiceAmount,
          totalAmount,
          totalGst,
          totalDiscount,
          grandTotal,
          stockItems
        } = data;

        // Convert dates to 'YYYY-MM-DD' format if needed
        const formatDate = (dateString: string) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'
        };

        // Update the main purchase state
        setPurchase({
          purchaseDate: formatDate(purchaseDate),
          purchaseBillNo,
          creditPeriod,
          paymentDueDate: formatDate(paymentDueDate),
          supplierId: supplierId.toString(), // Ensure it's a string for the select element
          invoiceAmount: invoiceAmount.toString(),
          totalAmount,
          totalGst,
          totalDiscount,
          grandTotal,
        });

        // Update the purchaseRows state
        const rows = stockItems.map((item: StockItem) => ({
          selectedItem: item.itemId,
          batchNo: item.batchNo,
          packageQuantity: item.packageQuantity.toString(),
          expiryDate: formatDate(item.expiryDate),
          purchasePrice: item.purchasePrice,
          mrpSalePrice: item.mrpSalePrice,
          gstPercentage: item.gstPercentage,
          gstAmount: item.gstAmount,
          discount: item.discount,
          amount: item.amount,
        }));
        setPurchaseRows(rows);
      } catch (error) {
        console.error("Error fetching purchase data:", error);
        alert("Error fetching purchase data");
      }
    };

    fetchPurchaseData();
  }
}, [action, invId]);


const handleChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  index?: number
) => {
  const { name, value } = event.target;

  if (index !== undefined) {
    setPurchaseRows((prevRows) =>
      prevRows.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              [name]: name === "discount" ? parseFloat(value) || 0 : value,
              ...(name === "packageQuantity"
                ? { amount: parseFloat(value) * row.purchasePrice }
                : {}), // Automatically calculate amount when packageQuantity changes
            }
          : row
      )
    );

    if (name === "selectedItem") {
      fetchItemDetails(value, index); // Fetch item details when item is selected
    }
  } else {
    setPurchase((prevPurchase) => {
      const updatedPurchase = {
        ...prevPurchase,
        [name]: value,
        ...(name === "selectedSupplier" ? { supplierId: value } : {}),
      };

      // Calculate paymentDueDate when purchaseDate or creditPeriod changes
      if (name === "purchaseDate" || name === "creditPeriod") {
        const purchaseDate = new Date(updatedPurchase.purchaseDate);
        const creditPeriod = parseInt(updatedPurchase.creditPeriod, 10);

        if (!isNaN(creditPeriod) && purchaseDate.toString() !== "Invalid Date") {
          const paymentDueDate = new Date(purchaseDate);
          paymentDueDate.setDate(paymentDueDate.getDate() + creditPeriod);
          updatedPurchase.paymentDueDate = paymentDueDate.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'
        } else {
          updatedPurchase.paymentDueDate = ""; // Clear if invalid
        }
      }

      return updatedPurchase;
    });

    if (name === "selectedSupplier") {
      setSelectedSupplier(value); // Set selected supplier in the main purchase state
    }

    if (name === "discount") {
      handleDiscountChange(parseFloat(value) || 0); // Pass the parsed value directly
    }
  }
};


const handleDiscountChange = (discountValue: number) => {
  setTotalDiscount(discountValue);
};

// Calculate totals and grand total (main change is in calculation of grand total)
const calculateTotals = useCallback(() => {
  const totalAmt = purchaseRows.reduce((sum, row) => sum + row.amount, 0);
  const totalGstAmt = purchaseRows.reduce((sum, row) => sum + row.gstAmount, 0);
  const totalDiscountAmt = purchaseRows.reduce((sum, row) => sum + (row.discount || 0), 0);
  const grandTotal = totalAmt + totalGstAmt - totalDiscountAmt;

  setPurchase((prevPurchase) => ({
    ...prevPurchase,
    totalAmount: totalAmt,
    totalGst: totalGstAmt,
    totalDiscount: totalDiscountAmt,
    grandTotal: grandTotal,
  }));
}, [purchaseRows]);

useEffect(() => {
  calculateTotals();
}, [purchaseRows, calculateTotals, totalDiscount]);  


const addPurchase = async (e: { preventDefault: () => void }) => {
  e.preventDefault();

  // Debug: Log purchase and purchaseRows to ensure they have the correct data
  console.log("Purchase Data Before Saving: ", purchase);
  console.log("Purchase Rows: ", purchaseRows);

  // Check if purchaseRows have valid data before sending
  if (purchaseRows.some(row => !row.selectedItem || !row.packageQuantity)) {
    alert("Please fill all required fields in the purchase rows.");
    return;
  }

    // Construct purchaseData object with both parent and child data
    const purchaseData = {
      purchaseDate: purchase.purchaseDate,
      purchaseBillNo: purchase.purchaseBillNo,
      creditPeriod: purchase.creditPeriod,
      paymentDueDate: purchase.paymentDueDate,
      supplierId: purchase.supplierId,
      invoiceAmount: purchase.invoiceAmount,
      totalAmount: purchase.totalAmount,
      totalGst: purchase.totalGst,
      totalDiscount: purchase.totalDiscount,
      grandTotal: purchase.grandTotal,
  
      // Pass items array, ensuring it is formatted to match the backend structure
      stockItems: purchaseRows.map(row => ({
        itemId: row.selectedItem,
        batchNo: row.batchNo,
        packageQuantity: parseFloat(row.packageQuantity) || 0,
        expiryDate: row.expiryDate,
        // purchasePrice: row.purchasePrice,
        // mrpSalePrice: row.mrpSalePrice,
        gstPercentage: row.gstPercentage,
        gstAmount: row.gstAmount,
        discount: row.discount,
        amount: row.amount,
      })),
    };
  
    try {
      // Make a single request to save both parent and child data
      const response = await fetch(Purchase_Save, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData),
      });
  
      if (!response.ok) throw new Error("Error saving purchase data");
  
      const savedPurchase = await response.json();
      console.log("Saved Purchase:", savedPurchase);
  
      alert("Purchase saved successfully!");
      router.push(`/Routing?page=purchaseList&highlight=Stock Purchase`);

  
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving purchase.");
    }
};




// Adding a new row to purchaseRows
const addNewRow = () => {
  setPurchaseRows([
    ...purchaseRows,
    {
      selectedItem: "",
      batchNo: "",
      packageQuantity: "",
      expiryDate: "",
      purchasePrice: 0,
      mrpSalePrice: 0,
      gstPercentage: 0,
      gstAmount: 0,
      discount:0,
      amount: 0,
    },
  ]);
};

// Handling row deletion
const handleDeleteRow = (index: number) => {
  if (purchaseRows.length === 1) {
    alert("Cannot delete the last row.");
    return;
  }

  const confirmDelete = window.confirm("Are you sure you want to delete this row?");
  if (confirmDelete) {
    setPurchaseRows(purchaseRows.filter((_, i) => i !== index));
  }
};


const updatePurchase = async () => {
  try {
    // Prepare the data to be sent to the backend
    const updatedData = {
      purchaseDate: purchase.purchaseDate, // Already in YYYY-MM-DD
      paymentDueDate: purchase.paymentDueDate, // Already in YYYY-MM-DD
      // expiryDate: purchase.expiryDate, // Already in YYYY-MM-DD
      purchaseBillNo: purchase.purchaseBillNo,
      creditPeriod: purchase.creditPeriod,
      supplierId: parseInt(purchase.supplierId, 10), // Convert to number
      invoiceAmount: parseFloat(purchase.invoiceAmount), // Convert to number
      totalAmount: purchase.totalAmount,
      totalGst: purchase.totalGst,
      totalDiscount: purchase.totalDiscount,
      grandTotal: purchase.grandTotal,
    };

    const response = await fetch(`http://localhost:8080/pharma/stock/update/${invId}`, {
      method: "PUT", // HTTP method for updating
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to update purchase data");
    }

    const responseData = await response.json();
    console.log("Purchase updated successfully:", responseData);

    // Optional: Handle success, e.g., show a success message or navigate away
    alert("Purchase updated successfully!");
    router.push(`/Routing?page=purchaseList&highlight=Stock Purchase`);

  } catch (error) {
    console.error("Error updating purchase data:", error);
    alert("Failed to update purchase data.");
  }
};

  return (
    <>
    <Navbar/>
<main>
    <span className='heading_text'>
      Log New Procurement
    </span>

      <div className='card_1'>
           <div className='sub_heading_text pb-6'>Basic Details</div>

           <div className='grid grid-cols-2 small_text gap-6'>
            <div className='space_two'>
              <label htmlFor="purchaseDate">Purchase Date</label>
              <input type="date" name="purchaseDate" id="purchaseDate" value={purchase.purchaseDate} onChange={(e) => handleChange(e)} className='procurement_input'/>
            </div>

            <div className='space_two'>
              <label htmlFor="purchaseBillNo">Bill Number</label>
              <input type="text" name="purchaseBillNo" id="purchaseBillNo" value={purchase.purchaseBillNo} onChange={(e) => handleChange(e)} className='procurement_input'/>
            </div>

            <div className='space_two'>
              <label htmlFor="creditPeriod">Credit Period (in Days)</label>
              <input type="text" name="creditPeriod" id="creditPeriod" value={purchase.creditPeriod} onChange={(e) => handleChange(e)} className='procurement_input'/>
            </div>

            <div className='space_two'>
              <label htmlFor="paymentDueDate">Payment Due Date</label>
              <input type="date" name="paymentDueDate" id="paymentDueDate" value={purchase.paymentDueDate} onChange={(e) => handleChange(e)} className='procurement_input'/>
            </div>

            <div className='space_two'>
            <label htmlFor="supplierName">Supplier</label>
            <select name="supplierId" id="supplierId" value={purchase.supplierId || ""} onChange={handleChange} className='procurement_input'>                
              <option value="" disabled>  Select a Supplier </option>
                    {supplier.map((supplier) => (
                        <option key={supplier.supplierId} value={supplier.supplierId}> {supplier.supplierName} </option>
                     ))}
            </select>
            </div>

            <div className='space_two'>
              <label htmlFor="invoiceAmount">Invoice Amount</label>
              <input type="text" name="invoiceAmount" id="invoiceAmount" value={purchase.invoiceAmount} onChange={(e) => handleChange(e)} className='procurement_input'/>
            </div>

           </div>
          </div>


    <div className='sub_heading_text'>Procured Items</div>

    <div className='space-x-2'>
           <label className='small_text'>Store</label>
           <input type="text" name='store' id='store' className='procurement_input'/>
      </div>

      <div>
        <table className="purchase_table">
          <thead >
            <tr className='purchase_table_tr'>
              <td className="rounded-tl-lg rounded-bl-lg px-2">Name of the Item</td>
              <td>Batch No</td>
              <td>Package Qty</td>
              <td>Expiry Date</td>
              <td>Purchase Price</td>
              <td>MRP</td>
              <td>GST %</td>
              <td>GST</td>
              <td>Discount</td>
              <td>Amount</td>
              <td className="rounded-tr-lg rounded-br-lg"><Image src="Action_Icon2.svg" alt="Action Icon" width={16} height={16}/></td>
            </tr>
          </thead>

          <tbody >
            {purchaseRows.map((row, index) => (
              <tr key={index}>
                <td>
                <select name="selectedItem" value={row.selectedItem || ""} onChange={(e) => handleChange(e, index)} className="h-11 w-56 procurement_input">
                   <option value="" disabled> Select Item </option>
                    {items.map((item) => (
                         <option key={item.itemId} value={item.itemId} data-name={item.itemName}> {item.itemName} </option>
                    ))}
                </select>
                </td>

                <td>
                  <input type="text" name="batchNo" value={row.batchNo} onChange={(e) => handleChange(e, index)} className='h-11 w-24 procurement_input1'/>
                </td>

                <td>
                  <input type="text" name="packageQuantity" value={row.packageQuantity} onChange={(e) => handleChange(e, index)} className='h-11 w-20 procurement_input1'/>
                </td>

                <td>
                  <input type="date" name="expiryDate" value={row.expiryDate} onChange={(e) => handleChange(e, index)} className='h-11 w-28 procurement_input1'/>
                </td>

                <td>{row.purchasePrice}</td>
                <td>{row.mrpSalePrice}</td>
                <td>{row.gstPercentage}</td>
                <td>{row.gstAmount}</td>
                <td>
                  <input type="text" name="discount" id='discount' value={row.discount} onChange={(e) => handleChange(e, index)} className='h-11 w-20 procurement_input1'/>
                </td>

                <td>{row.amount}</td>
                
                <td>
                  <div style={{ position: "relative" }}>
                    <Image src="Action_Icon.svg" alt="Action Icon" width={16} height={16} onClick={() =>setShowOptions(showOptions === index ? null : index) }/>
                    {showOptions === index && (
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "0",
                          backgroundColor: "white",
                          border: "1px solid #ccc",
                          padding: "5px",
                          zIndex: 10,
                        }}
                      >
                        <button onClick={() => handleDeleteRow(index)} style={{ color: "red" }}>
                          Delete
                        </button>
                        <button onClick={() => alert("Edit functionality here")}>
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addNewRow}
          className="h-11 w-56 bg-lightGray text-sm font-medium rounded-lg border border-buttonBorder"
        >
          + Add New Purchase Item
        </button>
      </div>

      <div className='card_2'>
        <div className="card_2_div">
          <label htmlFor="totalAmount">SUB TOTAL</label>
          <input type="text" name="totalAmount" id="totalAmount" value={purchase.totalAmount} readOnly className='card_2_input'/>
        </div>

        <div className="card_2_div">
          <label htmlFor="totalGst">GST</label>
          <input type="text" name="totalGst" id="totalGst" value={purchase.totalGst} readOnly  className='card_2_input'/>
        </div>

        <div className="card_2_div">
          <label htmlFor="totalDiscount">DISCOUNT</label>
          <input type="number" name="totalDiscount" id="totalDiscount" value={purchase.totalDiscount} readOnly className="card_2_input" />
          </div>

        <div className="card_2_div bg-softPink rounded-md">
          <label htmlFor="grandTotal">Total</label>
          <input type="text" name="grandTotal" id="grandTotal" value={purchase.grandTotal} readOnly className='card_2_input' />
        </div>
      </div>

</main>

<footer className='procurement_footer'>
  {action === "editPurchase" && <button className="button" onClick={updatePurchase}>Edit</button>}

  {(!action || action === "") && <button className='button_purple' onClick={addPurchase}>Save</button>}
</footer>
    </>
  )
}

export default Purchase
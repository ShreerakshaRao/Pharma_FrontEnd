import { z } from 'zod';  

export const supplierSchema = z.object({
    supplierName: z
    .string()
    .min(3, { message: "Name should be at least 3 characters long." })
    .max(100, { message: "Name cannot exceed 100 characters." }),

    supplierMobile: z.string().min(10, { message: 'Contact No. should be at least 10 digits' }),

    supplierGstinNo: z.string().min(15, { message: 'GSTIN No. should be at least 15 digits' }),

    supplierGstType: z.string().min(1, { message: 'GST Type is required' }),


});
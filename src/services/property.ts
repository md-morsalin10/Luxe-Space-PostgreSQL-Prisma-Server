import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";

const router = Router()



router.get("/api/property", async(req:Request, res:Response)=>{
    const result = await prisma.property.findMany()
    res.json({
        success: true,
        message:"Data found",
        result
    })
})

router.post("/api/property", async(req:Request, res:Response)=>{
     const propertyData = req.body
     const data = await prisma.property.create({
        data:propertyData
     })
     res.json({
        success: true,
        massage: "Data created successfully!!",
        data
     })
})

export default router
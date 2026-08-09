import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";


const propertyRouter = Router()

propertyRouter.post("/api/property", async (req: Request, res: Response) => {
    try {
        const propertyData = req.body
        const data = await prisma.property.create({
            data: propertyData
        })

        res.json({
            success: true,
            message: "data created!!!",
            data
        })
    }
    catch (error: any) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            error: "Product creation failed",
            details: error.message || error,
        });
    }

})

export default propertyRouter
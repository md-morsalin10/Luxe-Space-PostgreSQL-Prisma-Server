import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";
import { success } from "better-auth";

const propertyRouter = Router();

//  GET ALL PROPERTIES
propertyRouter.get("/api/property", async (req: Request, res: Response) => {
    try {
        const data = await prisma.property.findMany({
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to fetch properties", error: error.message });
    }
});

propertyRouter.get("/api/property/sellerId", async (req: Request, res: Response) => {
    try {
        const { sellerId } = req.body
        if (!sellerId) {
            res.status(400).json({
                success: false,
                message: "Seller id required"
            })
        }
        const sellerProperty = await prisma.property.findMany({
            where: {
                sellerId: sellerId as string
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        res.json(sellerProperty)
    }
    catch (error: any) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

//  GET SINGLE PROPERTY BY ID
propertyRouter.get("/api/property/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const data = await prisma.property.findUnique({
            where: { id: id as string },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        if (!data) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Error fetching property", error: error.message });
    }
});

//  CREATE NEW PROPERTY 
propertyRouter.post("/api/property", async (req: Request, res: Response) => {
    try {
        const {
            title,
            type,
            price,
            location,
            bedrooms,
            bathrooms,
            area,
            description,
            image,
            sellerId,
        } = req.body;


        if (!sellerId) {
            return res.status(400).json({
                success: false,
                message: "sellerId is required to create a property.",
            });
        }

        const data = await prisma.property.create({
            data: {
                title,
                type: type || "villa",
                price: Number(price),
                location,
                bedrooms: Number(bedrooms),
                bathrooms: Number(bathrooms),
                area: Number(area),
                description,
                image,
                sellerId, // Valid User ID
            },
        });

        res.status(201).json({
            success: true,
            message: "Property created successfully!",
            data,
        });
    } catch (error: any) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            success: false,
            message: "Property creation failed",
            details: error.message || error,
        });
    }
});

export default propertyRouter;
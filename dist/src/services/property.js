import { Router } from "express";
import prisma from "../lib/prisma";
import { verifyAdmin, verifySeller, verifyToken } from "../middlewares/verifyToken";
const propertyRouter = Router();
//  GET ALL PROPERTIES
propertyRouter.get("/api/property", verifyToken, async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch properties", error: error.message });
    }
});
propertyRouter.get("/api/property/sellerId", verifyToken, verifySeller, async (req, res) => {
    try {
        const { sellerId } = req.query;
        if (!sellerId) {
            res.status(400).json({
                success: false,
                message: "Seller id required"
            });
        }
        const sellerProperty = await prisma.property.findMany({
            where: {
                sellerId: sellerId
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
        });
        res.json(sellerProperty);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
//  GET SINGLE PROPERTY BY ID
propertyRouter.get("/api/property/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const data = await prisma.property.findUnique({
            where: { id: id },
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching property", error: error.message });
    }
});
propertyRouter.get("/api/features/properties", verifyToken, async (req, res) => {
    try {
        const data = await prisma.property.findMany({
            take: 8,
            orderBy: {
                createdAt: 'desc'
            },
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
        res.json(data);
        // res.status(200).json({
        //     success: true,
        //     data
        // });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch features property data",
            error: error.message
        });
    }
});
//  CREATE NEW PROPERTY 
propertyRouter.post("/api/property", verifyToken, verifySeller, async (req, res) => {
    try {
        const { title, type, price, location, bedrooms, bathrooms, area, description, image, sellerId, } = req.body;
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
    }
    catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            success: false,
            message: "Property creation failed",
            details: error.message || error,
        });
    }
});
// DELETE PROPERTY
propertyRouter.delete("/api/property/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const existingProperty = await prisma.property.findUnique({
            where: { id: id }
        });
        if (!existingProperty) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }
        await prisma.property.delete({
            where: { id: id }
        });
        res.status(200).json({ success: true, message: "Property deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error deleting property", error: error.message });
    }
});
// UPDATE PROPERTY
propertyRouter.put("/api/property/:id", verifyToken, verifySeller, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const existingProperty = await prisma.property.findUnique({
            where: { id: id }
        });
        if (!existingProperty) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }
        const updatedProperty = await prisma.property.update({
            where: { id: id },
            data: updateData
        });
        res.status(200).json({ success: true, message: "Property updated successfully", data: updatedProperty });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error updating property", error: error.message });
    }
});
export default propertyRouter;

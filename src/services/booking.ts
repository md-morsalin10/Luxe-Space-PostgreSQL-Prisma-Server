import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";

const bookingRoute = Router()

bookingRoute.post("/api/payment", async (req: Request, res: Response) => {
    try {

        const { sessionId,
            propertyId,
            title,
            price,
            type,
            location,
            image,
            sellerId,
            sellerEmail,
            sellerName,
            buyerId,
            buyerEmail,
            buyerName } = req.body

        if (!sessionId || !propertyId || !buyerId) {
            return res.status(400).json({
                success: false,
                message: "Require missing"
            })
        }

        const existingBooking = await prisma.booking.findUnique({
            where: { sessionId },
        });

        if (existingBooking) {
            return res.status(200).json(
                { message: 'Booking already recorded', booking: existingBooking },
            );
        }

        const newBooking = await prisma.booking.create({
            data: {
                sessionId,
                propertyId,
                title,
                price,
                type,
                location,
                image,
                sellerId,
                sellerEmail,
                sellerName,
                userId: buyerId,
                buyerEmail,
                buyerName,
                status: "sold",

            }
        })
        return res.status(201).json({
            message: "Payment saved successfully",
            booking: newBooking,
        });

    }
    catch (error) {
        console.error("Payment Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

export default bookingRoute
import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";

const bookingRoute = Router();

// POST /api/payment
// Called by the Next.js /success page after a successful Stripe checkout.
// Creates a Booking record and atomically marks the Property as "sold".
bookingRoute.post("/api/payment", async (req: Request, res: Response) => {
    try {
        const {
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
            buyerId,
            buyerEmail,
            buyerName,
        } = req.body;

        // ── Explicit input validation ────────────────────────────────────────
        const missing: string[] = [];
        if (!sessionId)  missing.push("sessionId");
        if (!propertyId) missing.push("propertyId");
        if (!buyerId)    missing.push("buyerId");
        if (!sellerId)   missing.push("sellerId");
        if (!title)      missing.push("title");
        if (!price)      missing.push("price");

        if (missing.length > 0) {
            console.error("[POST /api/payment] Missing required fields:", missing);
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missing.join(", ")}`,
            });
        }

        // ── Idempotency: skip duplicate Stripe session IDs ───────────────────
        const existingBooking = await prisma.booking.findUnique({
            where: { sessionId },
        });

        if (existingBooking) {
            console.log("[POST /api/payment] Booking already recorded for session:", sessionId);
            return res.status(200).json({
                message: "Booking already recorded",
                booking: existingBooking,
            });
        }

        const parsedPrice = Number(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            console.error("[POST /api/payment] Invalid price value:", price);
            return res.status(400).json({
                success: false,
                message: "Invalid price value.",
            });
        }

        // ── Atomic transaction: booking.create + property.update ─────────────
        // If either operation fails, both roll back. This prevents the database
        // from ending up with a Booking record but the Property still "pending".
        const [newBooking] = await prisma.$transaction([
            prisma.booking.create({
                data: {
                    sessionId,
                    propertyId,
                    title,
                    price: parsedPrice,
                    type,
                    location,
                    image: image || null,
                    sellerId,
                    sellerEmail,
                    sellerName,
                    buyerId,
                    buyerEmail,
                    buyerName,
                    status: "sold",
                },
            }),
            // NOTE: Only update fields that actually exist on the Property model.
            // buyerEmail and buyerName are NOT on the Property schema — they live
            // on the Booking record instead. Attempting to set them caused the
            // Prisma runtime error that broke the entire booking flow.
            prisma.property.update({
                where: { id: propertyId },
                data: {
                    status: "sold",
                    buyerId: buyerId,
                },
            }),
        ]);

        console.log("[POST /api/payment] Booking created successfully:", newBooking.id);

        return res.status(201).json({
            success: true,
            message: "Payment saved and property marked as sold.",
            booking: newBooking,
        });
    } catch (error: unknown) {
        const err = error as Error & { code?: string };
        console.error("[POST /api/payment] Error:", {
            message: err.message,
            code: err.code,
            stack: err.stack,
        });
        return res.status(500).json({
            success: false,
            message: "Internal server error while processing booking.",
        });
    }
});

// GET /api/payment/sellerId?sellerId=<id>
// Returns all bookings where the property was sold by the given seller.
bookingRoute.get("/api/payment/sellerId", async (req: Request, res: Response) => {
    try {
        const { sellerId } = req.query;

        if (!sellerId || typeof sellerId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Query param 'sellerId' is required.",
            });
        }

        const data = await prisma.booking.findMany({
            where: { sellerId },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json(data);
    } catch (error: unknown) {
        const err = error as Error;
        console.error("[GET /api/payment/sellerId] Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
});

// GET /api/payment/buyerId?buyerId=<id>
// Returns all bookings for the given buyer.
bookingRoute.get("/api/payment/buyerId", async (req: Request, res: Response) => {
    try {
        const { buyerId } = req.query;

        if (!buyerId || typeof buyerId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Query param 'buyerId' is required.",
            });
        }

        const data = await prisma.booking.findMany({
            where: { buyerId },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json(data);
    } catch (error: unknown) {
        const err = error as Error;
        console.error("[GET /api/payment/buyerId] Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
});

export default bookingRoute;
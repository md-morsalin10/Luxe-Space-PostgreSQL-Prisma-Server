import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    console.log("📥 Incoming Auth Header:", req.headers.authorization);
    const authHeaders = req.headers?.authorization

    if (!authHeaders) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const token = authHeaders.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const session = await prisma.session.findFirst({
        where: {
            token: token
        },
        include: {
            user: true
        }
    });

    if (!session || !session.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or expired session"
        });
    }

    (req as any).user = session.user;

    const user = session?.user
    const userId = session?.user?.id
    console.log(user, userId, "from season")

    next()

}

export const verifySeller = async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (user?.role !== "seller") {
        return res.status(403).json({
            message: "Forbidden access you are not seller"
        })
    }

    next()
}

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (user?.role !== "admin") {
        return res.status(403).json({
            message: "Forbidden access You are not admin"
        })
    }

    next()
}

export const verifyBuyer = async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (user?.role !== "buyer") {
        return res.status(403).json({
            message: "Forbidden access you are not buyer"
        })
    }
    next()
}
import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";

const userRouter = Router()

userRouter.get("/api/users", async(req:Request, res:Response)=>{
      const result = await prisma.user.findMany()
      res.json(result) 
})

// TOGGLE USER SUSPENSION
userRouter.patch("/api/users/:id/suspend", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isSuspended } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: id as string },
            data: { isSuspended: Boolean(isSuspended) },
        });

        res.status(200).json({ success: true, message: `User suspension status updated to ${isSuspended}`, data: updatedUser });
    } catch (error: any) {
        console.error("Error updating suspension status:", error);
        res.status(500).json({ success: false, message: "Error updating user suspension status", error: error.message });
    }
});

export default userRouter
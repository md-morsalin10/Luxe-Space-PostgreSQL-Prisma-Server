import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";

const userRouter = Router()

userRouter.get("/api/users", async(req:Request, res:Response)=>{
      const result = await prisma.user.findMany()
      res.json(result) 
})

export default userRouter
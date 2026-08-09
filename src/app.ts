import express from "express"
import cors from "cors"
import userRouter from "./services/users";


const app = express()
app.use(cors())
app.use(express.json());

app.use(userRouter)

app.get("/", async (req, res) => {
  res.send({
    success: true,
    message: "Server is running smoothly.................!"
  });
})

export default app
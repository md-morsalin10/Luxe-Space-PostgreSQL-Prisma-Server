import express from "express"
import cors from "cors"
import router from "./services/property";


const app = express()
app.use(cors())
app.use(express.json());

app.use(router)

app.get("/", async (req, res) => {
  res.send({
    success:true,
    message:"Server is running smoothly.................!"
  });
})

export default app
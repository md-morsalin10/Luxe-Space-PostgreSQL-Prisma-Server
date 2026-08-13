import dotenv from "dotenv";
import app from "./app";
dotenv.config();
const PORT = process.env.PORT || 5000;
// Main Server Listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import dotenv from "dotenv";

dotenv.config();


import app from "./app";

const PORT = process.env.PORT || 5000;

// Main Server Listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
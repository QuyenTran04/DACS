import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
//import nodeSSPI from "node-sspi";

dotenv.config();
const nodeSSPI = require("node-sspi");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Middleware để nhận diện Windows Authentication
app.use((req, res, next) => {
  const nodeSSPIObj = new nodeSSPI();
  nodeSSPIObj.authenticate(req, res, () => {
    res.finished || next();
  });
});

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database"); 
const authRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profileRoutes = require("./routes/profileRoutes");
const tourRoutes = require("./routes/tourRoutes");
const momoRoutes = require("./routes/momoRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const app = express();
app.use(express.json());
app.use(cors()); 

connectDB();
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/tour",tourRoutes);
app.use("/api/momo", momoRoutes);
app.use("/api/booking", bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));

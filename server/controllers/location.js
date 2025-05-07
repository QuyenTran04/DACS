const Location = require("../models/Location");

exports.addLocations = async (req, res) => {
  try {
    const { name, country } = req.body; 
    if (!name) {
      return res
        .status(400)
        .json({ message: "Tên location không được để trống" });
    }
    const existingUser = await Location.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: "Location đã tồn tại" });
    }
    const newLocation = new Location({
      name,
      country: country || "Việt Nam", 
    });
    await newLocation.save();
    res
      .status(201)
      .json({ message: "Thêm location thành công", location: newLocation });
  } catch (error) {
    console.error("Lỗi tạo location:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};


exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find(); 
    res.status(200).json(locations);
  } catch (error) {
    console.error("Lỗi lấy danh sách location:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

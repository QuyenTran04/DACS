const Location = require("../models/Location");

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find({}, "_id name"); 
    res.status(200).json(locations);
  } catch (error) {
    console.error("Lỗi lấy danh sách location:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

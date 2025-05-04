const Tour = require("../models/tour");

exports.createTour = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      locationId,
      price,
      duration,
      availableDates,
      maxGuests,
      images, // nhận mảng URL ảnh từ FE
    } = req.body;

    const location = await Location.findById(locationId);
    if (!location) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy tỉnh/thành đã chọn." });
    }

    const newTour = new Tour({
      providerId: req.user.id,
      title,
      description,
      address,
      location: locationId,
      price,
      duration,
      images, // là mảng các URL Firebase
      availableDates,
      maxGuests,
    });

    await newTour.save();

    res.status(201).json({ message: "Tạo tour thành công!", tour: newTour });
  } catch (error) {
    console.error("Lỗi tạo tour:", error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};


exports.getToursByProvider = async (req, res) => {
  try {
    const providerID = req.user.id;
    const tour = await Tour.findOne({ providerID });
    if (!tour) {
      return res.status(404).json({ message: "Tour không tồn tại" });
    }
    res.status(200).json({ tour });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: "Không tìm thấy tour" });
    res.json({ tour });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getListTour = async (req, res) => {
  try {
    const tour = await Tour.find();
    if (!tour) {
      return res.status(404).json({ message: "Tour không tồn tại" });
    }
    res.status(200).json({ tour });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

exports.getToursByLocation = async (req, res) => {
  try {
    const { locationId } = req.params; 

    const tours = await Tour.find({ location: locationId })
      .populate("location", "name") 
      .populate("providerId", "name");

    res.status(200).json(tours);
  } catch (error) {
    console.error("Lỗi lấy danh sách tour theo location:", error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};


exports.updateTour = async (req, res) => {
  try {
    const providerID = req.user.id;
    const { tourId } = req.params; 

    const {
      title,
      description,
      address,
      locationId,
      price,
      duration,
      availableDates,
      maxGuests,
    } = req.body;

    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => "/uploads/" + file.filename);
    }

    const updatedFields = {
      title,
      description,
      address,
      location: locationId,
      price,
      duration,
      availableDates,
      maxGuests,
    };
    if (imagePaths.length > 0) {
      updatedFields.images = imagePaths;
    }

    const updatedTour = await Tour.findOneAndUpdate(
      { _id: tourId, providerId: providerID }, 
      updatedFields,
      { new: true }
    );
    if (!updatedTour) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tour để cập nhật." });
    }
    res.status(200).json({ message: "Cập nhật tour thành công!", tour: updatedTour });
  } catch (error) {
    console.error("Lỗi cập nhật tour:", error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};



exports.deleteTour = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { tourId } = req.params;

    const deletedTour = await Tour.findOneAndDelete({
      _id: tourId,
      providerId: providerId,
    });

    if (!deletedTour) {
      return res.status(404).json({ message: "Không tìm thấy tour để xoá." });
    }

    res
      .status(200)
      .json({ message: "Xoá tour thành công!", tour: deletedTour });
  } catch (error) {
    console.error("Lỗi xoá tour:", error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};


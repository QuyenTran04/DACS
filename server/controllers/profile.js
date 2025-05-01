const Profile = require("../models/profile");

exports.createProfile = async (req, res) => {
  try {
    const { fullName, phone, address, dateOfBirth, gender } = req.body;
    const existingProfile = await Profile.findOne({
      userId: Number(req.user.id),
    });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile đã tồn tại!" });
    }
    const profile = new Profile({
      userId: req.user.id, 
      fullName,
      phone,
      address,
      dateOfBirth,
      gender,
    });
    await profile.save();
    res.status(201).json({ message: "Tạo profile thành công!", profile });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Profile.findOne({ userId });
    if (!profile)
      return res.status(404).json({ message: "Profile không tồn tại" });
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Cập nhật Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, address, dateOfBirth, gender } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { fullName, phone, address, dateOfBirth, gender },
      { new: true }
    );

    if (!updatedProfile)
      return res.status(404).json({ message: "Profile không tồn tại" });

    res
      .status(200)
      .json({
        message: "Cập nhật profile thành công",
        profile: updatedProfile,
      });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};


export const travelerOptions = [
  {
    id: 1,
    title: "Một Mình",
    description: "Lý tưởng cho một hành trình tự khám phá",
    icon: "person",
    people: "1 người"
  },
  {
    id: 2,
    title: "Cặp Đôi",
    description: "Lý tưởng cho những chuyến đi lãng mạn",
    icon: "people",
    people: "2 người"
  },
  {
    id: 3,
    title: "Gia Đình",
    description: "Tạo ra những kỷ niệm với những người thân yêu",
    icon: "family-restroom",
    people: "3-5 người"
  },
  {
    id: 4,
    title: "Bạn Bè",
    description: "Phiêu lưu cùng nhóm bạn",
    icon: "people-circle",
    people: "4+ người"
  }
];

export const budgetOptions = [
  {
    id: 1,
    title: "Rẻ",
    description: "Lý tưởng cho một chuyến đi tiết kiệm",
    icon:'💵'
  },
  {
    id: 2,
    title: "Vừa Phải",
    description: "Giữ sự cân bằng",
    icon: "💰",
  },
  {
    id: 3,
    title: "Sang Trọng",
    description: "Dùng hết tiền cho chuyến đi",
    icon: "💸",
  },
];

export const AI_PROMPT = "Tạo kế hoạch chuyến đi cho các dữ liệu sau: Địa điểm - {location}. {totalDays} Ngày và {totalNights} Đêm, cho một nhóm {travelers} người, với ngân sách {budget}. Bao gồm chi tiết chuyến bay, giá vé máy bay và URL đặt vé, danh sách các lựa chọn khách sạn với Tên Khách Sạn, Địa Chỉ Khách Sạn, Giá, Hình Ảnh Khách Sạn, Tọa Độ Địa Lý, Đánh Giá, Mô Tả, và các địa điểm tham quan gần đó với Tên Địa Điểm, Chi Tiết Địa Điểm, Hình Ảnh Địa Điểm, Tọa Độ Địa Lý, Giá Vé, Thời Gian Di Chuyển đến mỗi địa điểm. Đảm bảo bạn đưa kế hoạch này dưới định dạng JSON."

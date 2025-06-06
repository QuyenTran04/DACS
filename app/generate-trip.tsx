import { View, Text, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateTripContext } from "@/context/CreateTripContext";
import { AI_PROMPT } from "@/constants/Options";
import { generateTripPlan } from "@/config/GeminiConfig";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/FirebaseConfig";
import moment from "moment";
const GenerateTrip = () => {
  const { tripData } = useContext(CreateTripContext);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  const router = useRouter();

  useEffect(() => {
    generateTrip();
  }, []);

  const generateTrip = async () => {
    const locationInfo = tripData.find(
      (item) => item.locationInfo
    )?.locationInfo;
    const travelers = tripData.find((item) => item.travelers)?.travelers;
    const dates = tripData.find((item) => item.dates)?.dates;
    const budget = tripData.find((item) => item.budget)?.budget;

    if (!locationInfo || !travelers || !dates || !budget) {
      alert("Thiếu thông tin chuyến đi. Vui lòng kiểm tra lại.");
      router.replace("/create-trip/review-trip");
      return;
    }

    const totalDays = dates.totalNumberOfDays || 0;
    const totalNights = totalDays > 0 ? totalDays - 1 : 0;

    const FINAL_PROMPT = `
Tôi muốn tạo một chuyến đi đến ${locationInfo.name} từ ngày ${moment(
      dates.startDate
    ).format("DD/MM/YYYY")} đến ngày ${moment(dates.endDate).format(
      "DD/MM/YYYY"
    )} cho ${travelers.count} người (${travelers.type}) với ngân sách ${
      budget.type
    }.

Hãy trả kết quả dưới dạng **JSON hợp lệ**, đúng cấu trúc bên dưới, tất cả dữ liệu phải là thông tin thực tế (không là placeholder hay dữ liệu giả), và toàn bộ văn bản phải bằng **tiếng Việt**:

{
  "trip": {
    "traveler": "<kiểu khách du lịch - ví dụ: Một Mình, Cặp đôi, Gia đình>",
    "budget": "<mức ngân sách - ví dụ: Rẻ, Vừa, Cao cấp>",
    "startDate": "DD/MM/YYYY",
    "endDate": "DD/MM/YYYY",
    "flights": [
      {
        "airline": "Tên hãng bay",
        "flightNumber": "Mã chuyến bay",
        "departureAirport": "Tp.HCM",
        "arrivalAirport": "Tên điểm đến",
        "departureTime": "HH:mm",
        "arrivalTime": "HH:mm",
        "price": "Giá vé máy bay (VND, dạng số không có dấu chấm)",
        "bookingURL": "Đường link đặt vé"
      }
    ],
    "hotels": [
      {
        "name": "Tên khách sạn",
        "address": "Địa chỉ chính xác",
        "price": "Giá phòng mỗi đêm (VND, dạng số)",
        "image": "URL ảnh khách sạn",
        "coordinates": {
          "latitude": "Vĩ độ",
          "longitude": "Kinh độ"
        },
        "rating": "Điểm đánh giá (VD: 4.5)",
        "description": "Mô tả ngắn gọn"
      }
    ],
    "attractions": [
      {
        "name": "Tên địa điểm",
        "description": "Mô tả địa điểm",
        "image": "URL ảnh địa điểm",
        "coordinates": {
          "latitude": "Vĩ độ",
          "longitude": "Kinh độ"
        },
        "price": "Giá vé (0 nếu miễn phí)",
        "travelTime": "Thời gian di chuyển từ khách sạn (VD: 15 phút)"
      }
    ]
  }
}

**Lưu ý quan trọng:**
- Trả về đúng JSON như trên, không kèm theo bất kỳ chú thích, lời giới thiệu hoặc nội dung văn bản ngoài JSON.
- Không sử dụng placeholder như “TBD”, “đang cập nhật”, v.v.
- Tất cả URL ảnh và bookingURL phải là chuỗi URL hợp lệ và chính xác có trên internet.
- Tất cả địa chỉ, tên địa điểm, khách sạn, hãng bay phải là thông tin thực tế và chính xác có trên google map.
- có ít nhất 2 khách sạn 
- Tất cả giá tiền để dạng số không có dấu chấm phân cách (VD: 1500000).
- Không được bỏ trống trường "flights", luôn trả về ít nhất 1 chuyến bay phù hợp.
Không tạo URL ảnh giả, trả về URL ảnh đại diện chuẩn (ví dụ dùng https://image-tc.galaxy.tf/wijpeg-1n8c7t9k6mxea1b9dxrd4ubzd/hanoi-top-10-attractions.jpg?width=1920)
`;


    setLoading(true);

    try {
      const tripResponse = await generateTripPlan(FINAL_PROMPT);

      const docId = Date.now().toString();
      await setDoc(doc(db, "UserTrips", docId), {
        userEmail: user?.email,
        tripPlan: tripResponse,
        tripData: JSON.stringify(tripData),
        docId,
        prompt: FINAL_PROMPT, // để debug nếu cần
      });

      router.push("/mytrip");
    } catch (error) {
      console.error("Lỗi tạo kế hoạch:", error);
      alert("Đã xảy ra lỗi khi tạo lịch trình. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView className="p-6 h-full flex flex-col items-center justify-center">
      <Text className="font-outfit-bold text-3xl text-center">
        Vui lòng chờ...
      </Text>
      <Text className="font-outfit-medium text-xl text-center mt-10">
        Đang tạo lịch trình du lịch của bạn...
      </Text>

      <Image
        source={require("@/assets/images/loading.gif")}
        className="w-96 h-96"
      />

      <Text className="font-outfit text-gray-700 text-center mt-10">
        Việc này có thể mất một chút thời gian, vui lòng không quay lại.
      </Text>
    </SafeAreaView>
  );
};

export default GenerateTrip;
 
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
    ).format("DD/MM/YYYY")} 
  đến ngày ${moment(dates.endDate).format("DD/MM/YYYY")} cho ${
      travelers.count
    } người (${travelers.type}) với ngân sách ${budget.type}.
  Vui lòng trả về kết quả dưới dạng JSON chuẩn gồm:
  - Thông tin chuyến bay (hãng, mã,điểm đi(mặc định ở tp.HCM)/đến, giờ đi/đến),
  - Giá vé máy bay kèm URL đặt vé,
  - Danh sách khách sạn gồm Tên, Địa chỉ, Giá, Ảnh, Tọa độ, Đánh giá, Mô tả,
  - Các địa điểm tham quan gần đó với Tên, Mô tả, Ảnh, Tọa độ, Giá vé, Thời gian di chuyển.
  Chỉ trả về JSON hợp lệ, không có chú thích hay văn bản khác ngoài JSON.
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

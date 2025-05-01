import onboarding1 from "@/assets/images/onboarding1.svg";
import onboarding2 from "@/assets/images/onboarding2.svg";
import onboarding3 from "@/assets/images/onboarding3.svg";
import person from "@/assets/icons/person.png";
import email from "@/assets/icons/email.png";
import lock from "@/assets/icons/lock.png";
import google from "@/assets/icons/google.png";

export const onboarding = [
    {
        id: 1,
        title: 'Lên Kế Hoạch Cho Chuyến Đi Hoàn Hảo',
        description: 'Dễ dàng tạo các lịch trình tùy chỉnh phù hợp với phong cách của bạn, từ các kế hoạch hàng ngày đến các điểm đến không thể bỏ qua.',
        image: onboarding1
    },
    {
        id: 2,
        title: 'Khám Phá Những Nơi Bí Ẩn',
        description: 'Khám phá những địa điểm yêu thích của người dân địa phương và những trải nghiệm độc đáo ở bất cứ đâu. Chuyến đi của bạn, được thiết kế riêng cho bạn.',
        image: onboarding2
    },
    {
        id: 3,
        title: 'Giữ Mọi Thứ Ngăn Nắp & Thư Giãn',
        description: 'Giữ tất cả thông tin về chuyến đi của bạn ở một nơi, để bạn có thể tập trung vào việc tạo ra những kỷ niệm mà không lo lắng.',
        image: onboarding3
    }
]

export const icons = {
    person,
    email,
    lock,
    google
}

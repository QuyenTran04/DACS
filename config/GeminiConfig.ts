const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `Tạo kế hoạch chuyến đi cho các dữ liệu sau: Địa điểm - Hà Nội. 4 Ngày và 3 Đêm, cho một cặp đôi (2 người), với ngân sách Cao cấp. Bao gồm thông tin chuyến bay, giá vé máy bay kèm URL đặt vé, danh sách khách sạn gồm Tên, Địa chỉ, Giá, Ảnh, Tọa độ, Đánh giá, Mô tả. Các địa điểm tham quan gần đó với Tên, Mô tả, Ảnh, Tọa độ, Giá vé, Thời gian di chuyển. Trả kết quả dưới định dạng JSON.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `{
  "trip_plan": {
    "location": "Hanoi, Vietnam",
    "duration": "4 Days and 3 Nights",
    "group_size": "Couple (2 people)",
    "budget": "Luxury",
    "flight_details": {
      "airline": "Vietnam Airlines",
      "flight_number": "VN-A123",
      "departure_city": "Ho Chi Minh City",
      "arrival_city": "Hanoi",
      "departure_date": "2023-12-10",
      "arrival_date": "2023-12-10",
      "departure_time": "9:00 AM",
      "arrival_time": "10:30 AM",
      "price": "₫3,500,000",
      "booking_url": "https://www.vietnamairlines.com/"
    },
    "hotel": {
      "options": [
        {
          "name": "Sofitel Legend Metropole Hanoi",
          "address": "15 Ngo Quyen, Hanoi, Vietnam",
          "price": "₫8,000,000 per night",
          "image_url": "https://www.sofitel-legend-metropole-hanoi.com/hotel.jpg",
          "geo_coordinates": {
            "latitude": 21.0285,
            "longitude": 105.8542
          },
          "rating": 5.0,
          "description": "A historic 5-star hotel offering luxury, elegance, and impeccable service in the heart of Hanoi."
        },
        {
          "name": "The Hanoi La Siesta Hotel & Spa",
          "address": "94 Ma May Street, Hanoi, Vietnam",
          "price": "₫3,500,000 per night",
          "image_url": "https://www.hanoilasietahotel.com/image.jpg",
          "geo_coordinates": {
            "latitude": 21.0334,
            "longitude": 105.8517
          },
          "rating": 4.7,
          "description": "A boutique hotel with stylish interiors and a relaxing spa experience."
        }
      ]
    },
    "places_to_visit": [
      {
        "name": "Hoan Kiem Lake",
        "details": "A scenic lake in the center of Hanoi, surrounded by lush greenery and historical sites.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Hoan_Kiem_Lake_Hanoi.jpg",
        "geo_coordinates": {
          "latitude": 21.0285,
          "longitude": 105.8542
        },
        "ticket_price": "Free",
        "time_to_travel": "5 minutes from Sofitel Legend Metropole Hanoi"
      },
      {
        "name": "Old Quarter",
        "details": "The vibrant heart of Hanoi, with narrow streets, historic architecture, and bustling markets.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Old_Quarter_Hanoi.jpg",
        "geo_coordinates": {
          "latitude": 21.0333,
          "longitude": 105.8518
        },
        "ticket_price": "Free",
        "time_to_travel": "10 minutes from Hoan Kiem Lake"
      },
      {
        "name": "Temple of Literature",
        "details": "A well-preserved ancient temple dedicated to Confucius and scholars, one of Hanoi's iconic landmarks.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Temple_of_Literature_Hanoi.jpg",
        "geo_coordinates": {
          "latitude": 21.0278,
          "longitude": 105.8372
        },
        "ticket_price": "₫30,000",
        "time_to_travel": "15 minutes from Old Quarter"
      }
    ]
  }
}`
        }
      ]
    }
  ]
});

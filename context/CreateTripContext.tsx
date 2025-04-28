import { createContext, useContext, useState } from 'react';

// Định nghĩa kiểu TripData
export interface TripData {
  startDate: string;
  endDate: string;
  totalNumOfDays: number;
  locationInfo?: {
    name: string;
    coordinate?: {
      lat: number;
      lng: number;
    };
    photoRef?: string;
    url?: string;
  };
  traveler?: {
    title: string;
  };
  budget?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  }; // Thêm thuộc tính user
}

// Định nghĩa kiểu cho context
interface CreateTripContextType {
  tripData: TripData | null;
  setTripData: React.Dispatch<React.SetStateAction<TripData | null>>;
}

// Khởi tạo context với kiểu dữ liệu
export const CreateTripContext = createContext<CreateTripContextType | null>(null);

// Custom hook để dễ dàng truy cập vào context
export const useCreateTrip = () => {
  const context = useContext(CreateTripContext);
  if (!context) {
    throw new Error('useCreateTrip must be used within a CreateTripProvider');
  }
  return context;
};

// Provider component
export const CreateTripProvider = ({ children }: { children: React.ReactNode }) => {
  const [tripData, setTripData] = useState<TripData | null>(null);

  return (
    <CreateTripContext.Provider value={{ tripData, setTripData }}>
      {children}
    </CreateTripContext.Provider>
  );
};
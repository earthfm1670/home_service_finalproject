import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  value: string;
  onChange: (time: string) => void;
  selectedDate: Date | null;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  value,
  onChange,
  selectedDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [error, setError] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const isTimeDisabled = (hour: string, minute: string) => {
    if (!selectedDate) {
      return true; // Disable all times if no date is selected
    }
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);

    const now = currentDateTime; // Use the state variable instead of creating a new Date
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    // Check if the time is within business hours (9:00 to 18:00)
    const isWithinBusinessHours =
      selectedDateTime.getHours() >= 9 && selectedDateTime.getHours() < 18;

    // If the selected date is today, check if it's at least one hour from now
    if (selectedDate.toDateString() === now.toDateString()) {
      return selectedDateTime < oneHourLater || !isWithinBusinessHours;
    }

    // If the selected date is in the future, only check business hours
    return !isWithinBusinessHours;
  };

  const handleTimeSelect = () => {
    if (!selectedDate) {
      setError("โปรดเลือกวันที่ต้องการจองบริการก่อนเลือกเวลา");
      return;
    }

    setError(null);
    if (
      selectedHour &&
      selectedMinute &&
      !isTimeDisabled(selectedHour, selectedMinute)
    ) {
      onChange(`${selectedHour}:${selectedMinute}`);
      setIsOpen(false);
    }
  };

  const handleOpenClick = () => {
    if (!selectedDate) {
      setError("โปรดเลือกวันที่ต้องการจองบริการก่อนเลือกเวลา");
    } else {
      setError(null);
      setIsOpen(!isOpen);
    }
  };
  return (
    <div className="relative">
      <div
        className="w-full flex justify-between items-center px-3 h-10 rounded-md border border-input bg-white shadow-sm text-sm cursor-pointer"
        onClick={handleOpenClick}
      >
        <span>{value || "กรุณาเลือกเวลา"}</span>
        <Clock className="h-4 w-4" size={18} />
      </div>

      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg overflow-hidden lg:w-48">
          <div className="flex divide-x divide-gray-200">
            {/* Hours Column */}
            <div className="flex-1 w-1/2 overflow-y-auto max-h-60">
              {hours.map((hour) => (
                <div
                  key={`hour-${hour}`}
                  className={`h-8 flex items-center justify-center cursor-pointer text-base rounded-md
                    ${
                      selectedHour === hour
                        ? "bg-blue-500 text-white hover:bg-blue-600 round-md hover:round-md"
                        : isTimeDisabled(hour, "00")
                        ? "text-gray-300 cursor-not-allowed"
                        : "hover:bg-gray-100 round-md hover:round-md"
                    }`}
                  onClick={() =>
                    !isTimeDisabled(hour, "00") && setSelectedHour(hour)
                  }
                >
                  {hour}
                </div>
              ))}
            </div>

            {/* Minutes Column */}
            <div className="flex-1 w-1/2 overflow-y-auto max-h-60">
              {minutes.map((minute) => (
                <div
                  key={`minute-${minute}`}
                  className={`h-8 flex items-center justify-center cursor-pointer text-base rounded-md
                    ${
                      selectedMinute === minute
                        ? "bg-blue-500 text-white hover:bg-blue-600 round-md hover:round-md"
                        : isTimeDisabled(selectedHour, minute)
                        ? "text-gray-300 cursor-not-allowed"
                        : "hover:bg-gray-100 round-md hover:round-md"
                    }`}
                  onClick={() =>
                    !isTimeDisabled(selectedHour, minute) &&
                    setSelectedMinute(minute)
                  }
                >
                  {minute}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t flex justify-between items-center">
            <div className="text-base font-medium">
              {selectedHour
                ? selectedMinute
                  ? `${selectedHour}:${selectedMinute}`
                  : `${selectedHour}:--`
                : ""}
            </div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handleTimeSelect}
              disabled={
                !selectedHour ||
                !selectedMinute ||
                isTimeDisabled(selectedHour, selectedMinute)
              }
            >
              ยืนยัน
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSelector;

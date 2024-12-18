import React, { useState } from "react";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  value: string;
  onChange: (time: string) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const hours = Array.from({ length: 25 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const handleTimeSelect = () => {
    if (selectedHour && selectedMinute) {
      onChange(`${selectedHour}:${selectedMinute}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div
        className="w-full flex justify-between items-center px-3 h-10 rounded-md border border-input bg-white shadow-sm text-sm cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || "กรุณาเลือกเวลา"}</span>
        <Clock className="h-4 w-4" size={18} />
      </div>

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
                        : "hover:bg-gray-100 round-md hover:round-md"
                    }`}
                  onClick={() => setSelectedHour(hour)}
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
                        : "hover:bg-gray-100 round-md hover:round-md"
                    }`}
                  onClick={() => setSelectedMinute(minute)}
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
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-sm"
              onClick={handleTimeSelect}
              disabled={!selectedHour || !selectedMinute}
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

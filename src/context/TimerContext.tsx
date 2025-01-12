import React, { createContext, useState, useEffect, useContext } from "react";

interface TimerContextType {
  timeLeft: number;
  startTimer: () => void;
  resetTimer: () => void;
  isTimerExpired: boolean;
  setIsTimerExpired: (value: boolean) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timeLeft, setTimeLeft] = useState(1 * 60); // 10 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isTimerExpired, setIsTimerExpired] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsTimerExpired(true);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setIsActive(true);
    setIsTimerExpired(false);
  };

  const resetTimer = () => {
    setTimeLeft(1 * 60);
    setIsActive(false);
    setIsTimerExpired(false);
  };

  return (
    <TimerContext.Provider
      value={{
        timeLeft,
        startTimer,
        resetTimer,
        isTimerExpired,
        setIsTimerExpired,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};

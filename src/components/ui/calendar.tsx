import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold text-slate-700",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 flex items-center justify-center border border-gray-300 rounded-full hover:bg-blue-100 text-gray-500"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "text-gray-500 w-8 font-medium text-sm text-center",
        row: "flex w-full mt-1",
        cell: cn(
          "relative p-0 text-center text-sm ",
          // Remove the background color for selected dates
          "[&:has([aria-selected])]:bg-transparent [&:has([aria-selected].day-outside)]:bg-transparent dark:[&:has([aria-selected])]:bg-transparent"
        ),
        day: cn(
          "h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none",
          "text-gray-700"
        ),
        // Update the day_selected class to remove background color and adjust text color
        day_selected: "text-white font-bold hover:bg-blue-400 bg-blue-500 focus:outline-none",
        day_today: "border border-blue-400 text-blue-600 font-bold",
        day_outside: "text-gray-300 dark:text-gray-500",
        day_disabled: "text-gray-400 opacity-50",
        day_hidden: "invisible",
        day_range_start: "text-blue-600 font-bold rounded-l-full",
        day_range_end: "text-blue-600 font-bold rounded-r-full",
        day_range_middle: "text-blue-600",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

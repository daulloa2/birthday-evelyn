// components/CalendarMonth.tsx
"use client";

import { Crown } from "lucide-react";

const COLORS = {
  text: "#373335",
  muted: "#6D6668",
  border: "#DDD6D2",
  heart: "#D10000",
  highlight: "#B98A90",
  highlightText: "#373335",
} as const;

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

type CalendarMonthProps = {
  date: Date;
  highlightDate?: Date;
  startOnSunday?: boolean;
  className?: string;
};

export default function CalendarMonth({
  date,
  highlightDate,
  startOnSunday = false,
  className = "",
}: CalendarMonthProps) {
  const baseDate = startOfMonth(date);
  const totalDays = daysInMonth(date);

  const highlight = highlightDate
    ? new Date(highlightDate)
    : undefined;

  const startOffset = startOnSunday
    ? baseDate.getDay()
    : (baseDate.getDay() + 6) % 7;

  const calendarDays: Array<number | null> = Array.from(
    { length: startOffset + totalDays },
    (_, index) =>
      index < startOffset
        ? null
        : index - startOffset + 1
  );

  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  const weekdays = startOnSunday
    ? ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"]
    : ["L", "M", "X", "J", "V", "S", "D"];

  return (
    <div
      className={`relative w-full select-none ${className}`}
    >
      <div
        className="border-t"
        style={{ borderColor: COLORS.border }}
      >
        {/* Días de la semana */}
        <div
          className="
            grid
            grid-cols-7
            text-center
            text-[11px]
            uppercase
            tracking-wide
          "
          style={{ color: COLORS.muted }}
        >
          {weekdays.map((weekday) => (
            <div key={weekday} className="py-1.5">
              {weekday}
            </div>
          ))}
        </div>

        <div
          className="border-t"
          style={{ borderColor: COLORS.border }}
        />

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-y-1">
          {calendarDays.map((day, index) => {
            const isHighlight =
              day !== null &&
              highlight !== undefined &&
              highlight.getFullYear() === date.getFullYear() &&
              highlight.getMonth() === date.getMonth() &&
              highlight.getDate() === day;

            return (
              <div
                key={`${index}-${day ?? "empty"}`}
                className="grid h-9 place-items-center text-sm sm:h-10"
              >
                {day === null ? (
                  <span className="invisible" aria-hidden>
                    -
                  </span>
                ) : (
                  <div className="relative grid h-8 w-8 place-items-center sm:h-9 sm:w-9">
                    {isHighlight && (
                      <Crown
                        aria-hidden
                        className="
                          pointer-events-none
                          absolute
                          z-0
                          size-7
                          fill-current
                          sm:size-8
                        "
                        style={{
                          color: COLORS.heart,
                          transform: "scale(1.35)",
                        }}
                      />
                    )}

                    <span
                      className="relative z-10"
                      style={{
                        color: isHighlight
                          ? COLORS.highlightText
                          : COLORS.text,
                        fontWeight: isHighlight ? 700 : 400,
                      }}
                    >
                      {day}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
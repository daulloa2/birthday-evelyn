// components/CountdownBanner.tsx
"use client";

import * as React from "react";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-greatvibes",
  display: "swap",
});

const COLORS = {
  text: "#373335",
  muted: "#6D6668",
  separator: "#B8B0AD",
} as const;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

type CountdownBannerProps = {
  date: Date;
  className?: string;
};

type CountdownValue = {
  value: string;
  label: string;
};

export default function CountdownBanner({
  date,
  className = "",
}: CountdownBannerProps) {
  const [mounted, setMounted] = React.useState(false);
  const [now, setNow] = React.useState(0);

  React.useEffect(() => {
    setMounted(true);
    setNow(Date.now());

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const totalSeconds = Math.max(
    0,
    Math.floor((date.getTime() - now) / 1000)
  );

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const values: CountdownValue[] = [
    { value: String(days), label: "Días" },
    { value: pad(hours), label: "Horas" },
    { value: pad(minutes), label: "Minutos" },
    { value: pad(seconds), label: "Segundos" },
  ];

  const placeholderValues: CountdownValue[] = [
    { value: "--", label: "Días" },
    { value: "--", label: "Horas" },
    { value: "--", label: "Minutos" },
    { value: "--", label: "Segundos" },
  ];

  const renderRow = (items: CountdownValue[]) => (
    <div className="mt-3 flex items-end justify-center gap-2 font-medium tabular-nums sm:gap-3">
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <div className="min-w-[58px] text-center sm:min-w-16">
            <div
              className="text-4xl leading-none sm:text-5xl"
              style={{ color: COLORS.text }}
            >
              {item.value}
            </div>

            <div
              className={`mt-1 text-[18px] tracking-[0.04em] sm:text-[20px] ${greatVibes.className}`}
              style={{ color: COLORS.muted }}
            >
              {item.label}
            </div>
          </div>

          {index < items.length - 1 && (
            <span
              className="pb-9 text-xl sm:pb-10 sm:text-2xl"
              style={{ color: COLORS.separator }}
              aria-hidden
            >
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section
      className={[
        "relative w-full overflow-visible rounded-2xl px-4 py-4 sm:px-6 sm:py-5",
        className,
      ].join(" ")}
    >
      <div className="w-full">
        <div
          className={`text-center text-[32px] sm:text-[36px] ${greatVibes.className}`}
          style={{ color: COLORS.text }}
        >
          Faltan…
        </div>

        {renderRow(mounted ? values : placeholderValues)}
      </div>
    </section>
  );
}
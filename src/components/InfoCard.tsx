// components/InfoCard.tsx
"use client";

import type { ReactNode } from "react";

const DEFAULT_ACCENT = "#8C3F49";

const COLORS = {
  text: "#373335",
  muted: "#6D6668",
  border: "#DDD6D2",
  background: "#FFFFFF",
  iconBackground: "#F3EEEC",
} as const;

type InfoCardProps = {
  icon?: ReactNode;
  title: ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  iconWrapperClassName?: string;
  accentColor?: string;
};

export default function InfoCard({
  icon,
  title,
  children,
  className = "",
  titleClassName = "",
  bodyClassName = "",
  iconWrapperClassName = "",
  accentColor = DEFAULT_ACCENT,
}: InfoCardProps) {
  return (
    <div
      className={`
        mx-auto
        w-full
        max-w-[520px]
        px-6
        py-6
        ${className}
      `}
      style={{
        borderColor: COLORS.border,
        boxShadow: "0 6px 20px rgba(55,51,53,0.06)",
      }}
    >
      {icon && (
        <div
          className={`
            mx-auto
            grid
            size-12
            place-items-center
            rounded-2xl
            border
            shadow-sm
            ${iconWrapperClassName}
          `}
          style={{
            color: accentColor,
            backgroundColor: COLORS.iconBackground,
            borderColor: COLORS.border,
          }}
        >
          {icon}
        </div>
      )}

      <div className="mt-4 text-center">
        <div
          className={`
            text-sm
            font-semibold
            tracking-wide
            ${titleClassName}
          `}
          style={{ color: COLORS.text }}
        >
          {title}
        </div>

        <div
          className={`
            mt-2
            text-sm
            leading-relaxed
            ${bodyClassName}
          `}
          style={{ color: COLORS.muted }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
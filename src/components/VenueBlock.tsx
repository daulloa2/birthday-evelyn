// components/VenueBlock.tsx
"use client";

import {
  Great_Vibes,
  Cormorant_Garamond,
} from "next/font/google";

const COLORS = {
  text: "#373335",
  muted: "#6D6668",
  border: "#DDD6D2",
  background: "#FFFFFF",
  backCard: "#FAF8F7",
  shadow: "rgba(55, 51, 53, 0.07)",
} as const;

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-greatvibes",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

type VenueBlockProps = {
  title?: string;
  name: string;
  address?: string;
  time?: string;
  mapUrl: string;
  className?: string;
};

export default function VenueBlock({
  title,
  name,
  address,
  time,
  mapUrl,
  className = "",
}: VenueBlockProps) {
  return (
    <section className={`w-full ${className}`}>
      <div className="relative mx-auto w-full max-w-[520px] py-6">
        {/* Tarjeta decorativa posterior */}
        <div
          aria-hidden
          className="absolute inset-x-3 bottom-3 top-3 rounded-2xl"
          style={{
            backgroundColor: COLORS.backCard,
            border: `1px solid ${COLORS.border}`,
            boxShadow: `0 10px 22px ${COLORS.shadow}`,
            transform: "rotate(-1.2deg)",
          }}
        />

        {/* Tarjeta principal */}
        <div
          className="relative rounded-2xl px-7 py-7 text-center"
          style={{
            backgroundColor: COLORS.background,
            border: `1px solid ${COLORS.border}`,
            boxShadow: `0 4px 12px ${COLORS.shadow}`,
          }}
        >
          {title && (
            <div
              className={`
                ${greatVibes.className}
                text-[28px]
                leading-none
                sm:text-[34px]
              `}
              style={{ color: COLORS.text }}
            >
              {title}
            </div>
          )}

          {time && (
            <div
              className="
                mt-2
                text-[12px]
                font-medium
                uppercase
                tracking-[0.18em]
                sm:text-[13px]
              "
              style={{ color: COLORS.muted }}
            >
              {time}
            </div>
          )}

          <h3
            className={`
              ${cormorant.className}
              mt-3
              text-[15px]
              font-medium
              uppercase
              sm:text-[18px]
            `}
            style={{
              color: COLORS.text,
              letterSpacing: "0.12em",
            }}
          >
            {name}
          </h3>

          {address && (
            <p
              className={`
                ${cormorant.className}
                mt-3
                text-sm
                leading-relaxed
              `}
              style={{ color: COLORS.muted }}
            >
              {address}
            </p>
          )}
          <div className="mt-5">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver ${name} en el mapa`}
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(245,243,255,0.92))",
                border: "1px solid var(--border)",
                color: "var(--ink)",
                boxShadow: "0 10px 22px rgba(167,139,250,0.14)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              Ver mapa
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
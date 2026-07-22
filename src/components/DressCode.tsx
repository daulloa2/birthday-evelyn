// components/DressCode.tsx
"use client";

import Image from "next/image";
import { Great_Vibes } from "next/font/google";

type Swatch = {
  color: string;
  name?: string;
};

type DressCodeProps = {
  title?: string;
  brideMessage?: string;
  generalMessage?: string;
  colors?: Swatch[];
  womenColors?: Swatch[];
  className?: string;
  titleClassName?: string;
  captionClassName?: string;
};

const COLORS = {
  text: "#373335",
  muted: "#6D6668",
  border: "#DDD6D2",
  background: "#FFFFFF",
  softBackground: "#FAF8F7",
} as const;

const DRESS_IMAGE = "/couple3.png";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-greatvibes",
  display: "swap",
});

export default function DressCode({
  title = "Código de vestimenta",
  brideMessage = "Con cariño, les pedimos evitar vestir de rojo o utilizar tonos similares, ya que este color será exclusivo para mí.",
  generalMessage = "El resto de colores queda libre para que cada invitado brille a su manera.",
  colors = DEFAULT_COLORS,
  womenColors,
  className = "",
  titleClassName = "",
  captionClassName = "",
}: DressCodeProps) {
  const restrictedColors =
    womenColors && womenColors.length > 0
      ? womenColors.slice(0, 4)
      : colors.slice(0, 4);

  return (
    <section className={`relative w-full ${className}`}>
      <div
        className="
          mx-auto
          w-full
          max-w-[640px]
          px-4
          py-5
          sm:px-6
          sm:py-6
        "
        style={{
          backgroundColor: COLORS.background,
          borderTop: `1px solid ${COLORS.border}`,
          borderBottom: `1px solid ${COLORS.border}`,
          boxShadow: "0 4px 14px rgba(55, 51, 53, 0.05)",
        }}
      >
        <div className="text-center">
          <h3
            className={`
              font-medium
              ${titleClassName}
            `}
            style={{ color: COLORS.text }}
          >
            {title}
          </h3>

          <p
            className={`
              mt-1
              text-[25px]
              sm:text-[29px]
              ${greatVibes.className}
            `}
            style={{ color: COLORS.muted }}
          >
            Formal
          </p>

          <Image
            src={DRESS_IMAGE}
            alt="Vestimenta formal sugerida para el evento"
            width={110}
            height={110}
            className="pointer-events-none mx-auto mt-3 select-none"
            style={{ height: "auto" }}
            priority={false}
          />

          <div className="mt-4 flex flex-col items-center gap-3">
            <p
              className={`
                max-w-[520px]
                text-xs
                leading-snug
                sm:text-sm
                ${captionClassName}
              `}
              style={{ color: COLORS.text }}
            >
              {brideMessage}
            </p>

            <PaletteInline colors={restrictedColors} />
          </div>

          {generalMessage && (
            <p
              className={`
                mx-auto
                mt-4
                max-w-[520px]
                text-xs
                leading-snug
                sm:text-sm
                ${captionClassName}
              `}
              style={{ color: COLORS.muted }}
            >
              {generalMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function PaletteInline({ colors }: { colors: Swatch[] }) {
  return (
    <div
      className="
        inline-flex
        flex-wrap
        items-center
        justify-center
        gap-2
        sm:gap-3
      "
      aria-label="Colores reservados"
    >
      {colors.slice(0, 4).map((swatch, index) => (
        <span
          key={`${swatch.color}-${index}`}
          className="
            h-7
            w-7
            rounded-full
            ring-1
            sm:h-8
            sm:w-8
          "
          style={{
            backgroundColor: swatch.color,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.08)",
          }}
          aria-label={swatch.name ?? `Color reservado ${index + 1}`}
          title={swatch.name ?? swatch.color}
        />
      ))}
    </div>
  );
}

const DEFAULT_COLORS: Swatch[] = [
  { color: "#6E3038", name: "Rojo vino oscuro" },
  { color: "#8C3F49", name: "Rojo vino" },
  { color: "#B05D67", name: "Rojo rosado" },
  { color: "#D39BA1", name: "Rosa rojizo" },
];
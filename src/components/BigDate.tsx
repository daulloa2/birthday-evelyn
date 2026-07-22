// components/BigDate.tsx
"use client";

const MONTHS = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];

const WEEKDAYS = [
  "DOMINGO",
  "LUNES",
  "MARTES",
  "MIÉRCOLES",
  "JUEVES",
  "VIERNES",
  "SÁBADO",
];

type BigDateProps = {
  date: Date | string | number;
  location?: string;
  className?: string;
  dayClassName?: string;
  labelsClassName?: string;
};

export default function BigDate({
  date,
  location = "Olmedo",
  className = "",
  dayClassName = "",
  labelsClassName = "",
}: BigDateProps) {
  const currentDate = new Date(date);

  const year = currentDate.getFullYear();
  const day = currentDate.getDate();
  const month = MONTHS[currentDate.getMonth()];
  const weekday = WEEKDAYS[currentDate.getDay()];

  const colors = {
    text: "#4A4446",
    number: "#353033",
    border: "#DED4D2",
    centerBorder: "#D8C4C7",
  };

  return (
    <section
      className={`mx-auto flex w-full max-w-3xl justify-center ${className}`}
    >
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center">
        {/* Día de la semana */}
        <div
          className="border-y py-3 text-center"
          style={{ borderColor: colors.border }}
        >
          <span
            className={`
              inline-block
              whitespace-nowrap
              text-[10px]
              font-medium
              uppercase
              tracking-[0.25em]
              sm:text-xs
              sm:tracking-[0.35em]
              ${labelsClassName}
            `}
            style={{ color: colors.text }}
          >
            {weekday}
          </span>
        </div>

        {/* Fecha central */}
        <div
          className="
            relative
            z-10
            flex
            flex-col
            items-center
            justify-center
            rounded-full
            border
            bg-transparent
            px-5
            py-6
            transition-colors
            duration-300
            sm:px-8
            sm:py-8
          "
          style={{ borderColor: colors.centerBorder }}
        >
          <span
            className={`
              mb-3
              text-[11px]
              font-medium
              uppercase
              tracking-[0.2em]
              sm:text-sm
              ${labelsClassName}
            `}
            style={{ color: colors.text }}
          >
            {location}
          </span>

          <span
            className={`
              font-serif
              font-light
              leading-none
              ${dayClassName}
            `}
            style={{
              color: colors.number,
              fontSize: "clamp(56px, 10vw, 85px)",
            }}
            aria-label={`Día ${day}`}
          >
            {day}
          </span>

          <span
            className={`
              mt-3
              text-[11px]
              font-medium
              uppercase
              tracking-[0.2em]
              sm:text-sm
              ${labelsClassName}
            `}
            style={{ color: colors.text }}
          >
            {year}
          </span>
        </div>

        {/* Mes */}
        <div
          className="border-y py-3 text-center"
          style={{ borderColor: colors.border }}
        >
          <span
            className={`
              inline-block
              whitespace-nowrap
              text-[10px]
              font-medium
              uppercase
              tracking-[0.25em]
              sm:text-xs
              sm:tracking-[0.35em]
              ${labelsClassName}
            `}
            style={{ color: colors.text }}
          >
            {month}
          </span>
        </div>
      </div>
    </section>
  );
}
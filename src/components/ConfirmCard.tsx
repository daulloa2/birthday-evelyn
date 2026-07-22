// components/ConfirmCard.tsx
"use client";

import {
  CalendarCheck2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import RsvpButton from "@/components/RsvpButton";

type Family = {
  id: string;
  nombreFamilia: string;
  nroPersonas: number;
};

type ConfirmCardProps = {
  confirmed: boolean;
  declined?: boolean;
  checking?: boolean;
  prefillFamilyId?: string;
  prefillFamily?: Family;
  onConfirmed?: () => void;
  onDeclined?: () => void;
  className?: string;
  titleClassName?: string;
  textClassName?: string;
  deadlineText?: string;
  titleWhenOpen?: string;
  titleWhenDone?: string;
  titleWhenDeclined?: string;
  hideIfNoPrefill?: boolean;
  messageWhenConfirmed?: string;
  messageWhenDeclined?: string;
};

const COLORS = {
  text: "#373335",
  muted: "#6D6668",
  subtle: "#8A8385",

  primary: "#8C3F49",
  primarySoft: "#F4ECEC",

  success: "#3F7D59",
  successSoft: "#EDF5F0",

  declined: "#A55158",
  declinedSoft: "#F8EEEE",

  background: "#FFFFFF",
  border: "#DDD6D2",
  shadow: "rgba(55, 51, 53, 0.08)",
} as const;

export default function ConfirmCard({
  confirmed,
  declined = false,
  checking = false,
  prefillFamilyId,
  prefillFamily,
  onConfirmed,
  onDeclined,
  className = "",
  titleClassName = "",
  textClassName = "",
  deadlineText = "Por favor, confirma tu asistencia antes del 5 de agosto de 2026.",
  titleWhenOpen = "Confirmar asistencia",
  titleWhenDone = "¡Gracias por confirmar!",
  titleWhenDeclined = "¡Respuesta registrada!",
  hideIfNoPrefill = true,
  messageWhenConfirmed = "¡Nos hace mucha ilusión compartir este día contigo!",
  messageWhenDeclined = "No hay problema, nos encontraremos en una próxima ocasión.",
}: ConfirmCardProps) {
  const hasPrefill = Boolean(prefillFamilyId || prefillFamily);

  if (hideIfNoPrefill && !hasPrefill) {
    return null;
  }

  const showForm = !confirmed && !declined;

  const statusAppearance = confirmed
    ? {
        icon: <CheckCircle2 className="size-6" />,
        color: COLORS.success,
        background: COLORS.successSoft,
      }
    : declined
      ? {
          icon: <XCircle className="size-6" />,
          color: COLORS.declined,
          background: COLORS.declinedSoft,
        }
      : {
          icon: <CalendarCheck2 className="size-6" />,
          color: COLORS.primary,
          background: COLORS.primarySoft,
        };

  const currentTitle = confirmed
    ? titleWhenDone
    : declined
      ? titleWhenDeclined
      : titleWhenOpen;

  return (
    <section className={`w-full ${className}`}>
      <div
        className="
          mx-auto
          w-full
          max-w-[520px]
          px-6
          py-8
          text-center
          sm:max-w-[720px]
        "
        style={{
          backgroundColor: COLORS.background,
          borderTop: `1px solid ${COLORS.border}`,
          borderBottom: `1px solid ${COLORS.border}`,
          boxShadow: `0 8px 30px ${COLORS.shadow}`,
        }}
      >
        {/* Estado de la confirmación */}
        <div className="mx-auto grid place-items-center">
          <div
            aria-hidden
            className="
              grid
              size-12
              place-items-center
              rounded-2xl
            "
            style={{
              color: statusAppearance.color,
              backgroundColor: statusAppearance.background,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            {statusAppearance.icon}
          </div>
        </div>

        <h3
          className={`
            mt-4
            text-4xl
            sm:text-5xl
            ${titleClassName}
          `}
          style={{ color: COLORS.text }}
        >
          {currentTitle}
        </h3>

        {showForm ? (
          <>
            <p
              className={`
                mt-2
                text-sm
                ${textClassName}
              `}
              style={{ color: COLORS.muted }}
            >
              {deadlineText}
            </p>

            {hasPrefill && !checking && (
              <div className="mt-5">
                <RsvpButton
                  triggerLabel="Confirmar"
                  prefillFamilyId={prefillFamilyId}
                  prefillFamily={prefillFamily}
                  greetingTemplate="{{nombre}}"
                  titleClassName={titleClassName}
                  textClassName={textClassName}
                  note="Nos encantará contar con tu presencia. Tu confirmación nos ayudará a organizar mejor este día tan especial."
                  requirePrefill
                  onConfirmed={onConfirmed}
                  onDeclined={onDeclined}
                />
              </div>
            )}

            {checking && (
              <p
                className={`
                  mt-5
                  text-sm
                  ${textClassName}
                `}
                style={{ color: COLORS.muted }}
              >
                Consultando tu invitación…
              </p>
            )}

            <p
              className={`
                mt-3
                text-xs
                ${textClassName}
              `}
              style={{
                color: COLORS.subtle,
                lineHeight: 1.4,
              }}
            >
              Si necesitas actualizar tu respuesta más adelante, contáctanos.
            </p>
          </>
        ) : (
          <p
            className={`
              mt-2
              text-sm
              ${textClassName}
            `}
            style={{ color: COLORS.muted }}
          >
            {confirmed
              ? messageWhenConfirmed
              : messageWhenDeclined}
          </p>
        )}
      </div>
    </section>
  );
}
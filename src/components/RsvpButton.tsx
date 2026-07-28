// components/RsvpButton.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
// 👇 Importamos la X normal
import {
  CalendarHeart,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

const COLORS = {
  text: "#373335",
  textStrong: "#2F2B2D",
  muted: "#6D6668",
  subtle: "#91898B",

  primary: "#8C3F49",
  primarySoft: "#F3ECEC",

  background: "#FFFCFA",
  backgroundAlt: "#F6F2F0",
  card: "#FFFFFF",

  border: "#DDD6D2",
  button: "#F1ECE9",
  buttonHover: "#E8E1DE",

  success: "#3F7D59",
  successSoft: "#EDF5F0",

  declined: "#A55158",
  declinedSoft: "#F8EEEE",
} as const;

const DECORATION_FILTER =
  "brightness(0) saturate(100%) invert(25%) sepia(18%) saturate(1850%) hue-rotate(305deg) brightness(88%) contrast(86%)";

const CORNER_TOP = "/redleaves.png";
const CORNER_BOTTOM = "/redroses.png";

type Family = {
  id: string;
  nombreFamilia: string;
  nroPersonas: number;
  invitados?: {
    adult?: number;
    kids?: number;
    total?: number;
  };
};

type RsvpButtonProps = {
  triggerClassName?: string;
  triggerLabel?: string;
  prefillFamilyId?: string;
  prefillFamily?: Family;
  confirmed?: boolean;
  onConfirmed?: () => void;
  onDeclined?: () => void;
  greetingTemplate?: string;
  note?: string;
  titleClassName?: string;
  textClassName?: string;
  requirePrefill?: boolean;
  successYesMessage?: string;
  successNoMessage?: string;
};

function personasLabel(value?: number) {
  if (typeof value !== "number") {
    return "";
  }

  return value === 1 ? "1 persona" : `${value} personas`;
}

function asistiranLabel(value?: number) {
  if (typeof value !== "number") {
    return "";
  }

  return value === 1 ? "¿Asistirás?" : "¿Asistirán?";
}

export default function RsvpButton({
  triggerClassName = "",
  triggerLabel = "Confirmar",
  prefillFamilyId,
  prefillFamily,
  confirmed,
  onConfirmed,
  onDeclined,
  greetingTemplate = "Estimad@ {{nombre}}",
  note,
  titleClassName = "",
  textClassName = "",
  requirePrefill = true,
  successYesMessage = "¡Qué emoción, nos vemos en mis 15 años!",
  successNoMessage = "No hay problema, nos encontraremos en una próxima ocasión.",
}: RsvpButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);

  const [families, setFamilies] = React.useState<Family[]>([]);
  const [familyId, setFamilyId] = React.useState(
    prefillFamily?.id ?? ""
  );

  const [attendance, setAttendance] =
    React.useState<"si" | "no">("si");

  const [loadingFamilies, setLoadingFamilies] =
    React.useState(false);

  const [submitting, setSubmitting] =
    React.useState(false);

  const [loadedOnce, setLoadedOnce] =
    React.useState(false);

  const [alreadyResponded, setAlreadyResponded] =
    React.useState(false);

  const [checkingStatus, setCheckingStatus] =
    React.useState(false);

  const [successData, setSuccessData] = React.useState<{
    nombreFamilia: string;
    nroPersonas: number;
    asistencia: boolean;
  } | null>(null);

  const hasPrefill = Boolean(
    prefillFamily || prefillFamilyId
  );

  const selected =
    families.find((family) => family.id === familyId) ??
    prefillFamily ??
    null;

  const isConfirmed =
    confirmed === true || alreadyResponded;

  React.useEffect(() => {
    if (!hasPrefill || confirmed !== undefined) {
      return;
    }

    const id = prefillFamily?.id ?? prefillFamilyId;

    if (!id) {
      return;
    }

    let cancelled = false;

    const checkEligibility = async () => {
      try {
        setCheckingStatus(true);

        const response = await fetch("/api/rsvp/eligible", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `No fue posible consultar la invitación: ${response.status}`
          );
        }

        const data = await response.json();
        const list: Family[] = data.families ?? [];

        const stillEligible = list.some(
          (family) => family.id === id
        );

        if (!cancelled) {
          setAlreadyResponded(!stillEligible);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setCheckingStatus(false);
        }
      }
    };

    void checkEligibility();

    return () => {
      cancelled = true;
    };
  }, [
    hasPrefill,
    confirmed,
    prefillFamily,
    prefillFamilyId,
  ]);

  React.useEffect(() => {
    if (
      !open ||
      loadedOnce ||
      hasPrefill ||
      requirePrefill
    ) {
      return;
    }

    let cancelled = false;

    const loadFamilies = async () => {
      try {
        setLoadingFamilies(true);

        const response = await fetch("/api/rsvp/eligible", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `No fue posible cargar las familias: ${response.status}`
          );
        }

        const data = await response.json();
        const list: Family[] = data.families ?? [];

        if (!cancelled) {
          setFamilies(list);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoadingFamilies(false);
          setLoadedOnce(true);
        }
      }
    };

    void loadFamilies();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    loadedOnce,
    hasPrefill,
    requirePrefill,
  ]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selected || isConfirmed) {
      return;
    }

    setSubmitting(true);

    try {
      const asistencia = attendance === "si";

      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          familyId: selected.id,
          nombreFamilia: selected.nombreFamilia,
          nroPersonas: selected.nroPersonas,
          asistencia,
          adultos: Number.isFinite(
            selected.invitados?.adult
          )
            ? selected.invitados?.adult
            : undefined,
          ninos: Number.isFinite(
            selected.invitados?.kids
          )
            ? selected.invitados?.kids
            : undefined,
        }),
      });

      if (response.status === 409) {
        setFamilies((current) =>
          current.filter(
            (family) => family.id !== selected.id
          )
        );

        setFamilyId("");
        setAlreadyResponded(true);
        setOpen(false);
        return;
      }

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setFamilies((current) =>
        current.filter(
          (family) => family.id !== selected.id
        )
      );

      setFamilyId("");
      setOpen(false);
      setAlreadyResponded(true);

      setSuccessData({
        nombreFamilia: selected.nombreFamilia,
        nroPersonas: selected.nroPersonas,
        asistencia,
      });

      if (asistencia) {
        onConfirmed?.();
      } else {
        onDeclined?.();
      }

      window.setTimeout(() => {
        setSuccessOpen(true);
      }, 0);
    } catch (error) {
      console.error(
        "No fue posible registrar la respuesta:",
        error
      );
    } finally {
      setSubmitting(false);
    }
  }

  const noneLeft =
    loadedOnce &&
    !loadingFamilies &&
    families.length === 0;

  const shouldHide =
    (requirePrefill && !hasPrefill) ||
    (hasPrefill &&
      (isConfirmed || checkingStatus));

  if (shouldHide) {
    return null;
  }

  const displayName =
    selected?.nombreFamilia ?? "__________";

  const greeting = greetingTemplate.replace(
    "{{nombre}}",
    displayName
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={noneLeft}
            title={
              noneLeft
                ? "Ya no hay familias pendientes"
                : ""
            }
            className={`
              h-auto
              w-auto
              rounded-xl
              px-5
              py-2
              text-[15px]
              transition-colors
              ${triggerClassName}
            `}
            style={{
              backgroundColor: COLORS.button,
              color: COLORS.text,
              borderColor: COLORS.border,
              boxShadow:
                "0 2px 6px rgba(55,51,53,0.06)",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor =
                COLORS.buttonHover;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor =
                COLORS.button;
            }}
          >
            {noneLeft ? "Sin pendientes" : triggerLabel}
          </Button>
        </DialogTrigger>

        <DialogContent
          className="
            overflow-hidden
            rounded-[28px]
            border
            p-0
            sm:max-w-lg
          "
          style={{
            borderColor: COLORS.border,
            background: `linear-gradient(
              180deg,
              ${COLORS.background},
              ${COLORS.backgroundAlt}
            )`,
            boxShadow:
              "0 18px 50px rgba(55,51,53,0.13)",
          }}
        >
          {/* 👇 Botón de cierre forzado. Sin outline ni focus:ring para que no salga el círculo al presionarlo */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-50 grid size-8 place-items-center rounded-full bg-white/40 text-gray-500 transition-colors hover:bg-white/80 hover:text-gray-800 outline-none focus:outline-none"
            aria-label="Cerrar"
          >
            
          </button>

          <Image
            src={CORNER_TOP}
            alt=""
            width={192}
            height={192}
            aria-hidden
            className="
              pointer-events-none
              absolute
              right-[-5%]
              top-[-5%]
              select-none
            "
            style={{
              width: "12rem",
              height: "auto",
              opacity: 0.85,
              transform: "rotate(28deg)",
            }}
            priority={false}
          />

          <Image
            src={CORNER_BOTTOM}
            alt=""
            width={192}
            height={192}
            aria-hidden
            className="
              pointer-events-none
              absolute
              bottom-[-10%]
              left-[-8%]
              select-none
            "
            style={{
              width: "10rem",
              height: "auto",
              transform: "rotate(180deg)",
            }}
            priority={false}
          />

          <DialogHeader className="relative z-10 px-6 pb-2 pt-6 text-center">
            <div
              className="
                mx-auto
                grid
                size-11
                place-items-center
                rounded-2xl
                border
              "
              style={{
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
              }}
            >
              <CalendarHeart
                className="size-5"
                style={{ color: COLORS.primary }}
              />
            </div>

            <DialogTitle
              className={`
                mt-3
                text-center
                text-4xl
                tracking-wide
                ${titleClassName}
              `}
              style={{ color: COLORS.textStrong }}
            >
              Confirmación de asistencia
            </DialogTitle>

            <DialogDescription
              className={`
                text-center
                text-sm
                ${textClassName}
              `}
              style={{ color: COLORS.muted }}
            >
              Por favor, registra tu respuesta para este evento.
            </DialogDescription>

            <div
              className={`
                mt-2
                text-center
                text-lg
                ${textClassName}
              `}
              style={{ color: COLORS.muted }}
            >
              Para:
            </div>

            <div
              className={`
                mt-1
                text-center
                text-4xl
                ${titleClassName}
              `}
              style={{ color: COLORS.textStrong }}
            >
              {greeting}
            </div>

            <div
              className="mx-auto mt-3 h-px w-24"
              style={{
                backgroundColor: COLORS.border,
              }}
            />
          </DialogHeader>

          <div className="relative z-10 px-5 pb-6">
            {loadingFamilies ? (
              <div
                className="text-center text-sm"
                style={{ color: COLORS.muted }}
              >
                Cargando familias…
              </div>
            ) : noneLeft && !selected ? (
              <div
                className="text-center text-sm"
                style={{ color: COLORS.muted }}
              >
                No hay familias pendientes por responder.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid gap-4"
              >
                {note && (
                  <div className="px-4 py-3 text-center">
                    <p
                      className={`
                        text-sm
                        ${textClassName}
                      `}
                      style={{ color: COLORS.muted }}
                    >
                      {note}
                    </p>
                  </div>
                )}

                {!requirePrefill && !hasPrefill && (
                  <div className="grid gap-2">
                    <Label
                      className={textClassName}
                      style={{ color: COLORS.text }}
                    >
                      Familia
                    </Label>

                    <Select
                      value={familyId}
                      onValueChange={setFamilyId}
                    >
                      <SelectTrigger
                        className="rounded-xl"
                        style={{
                          backgroundColor: COLORS.card,
                          borderColor: COLORS.border,
                          color: COLORS.text,
                        }}
                      >
                        <SelectValue placeholder="Selecciona tu familia" />
                      </SelectTrigger>

                      <SelectContent>
                        {families.map((family) => (
                          <SelectItem
                            key={family.id}
                            value={family.id}
                          >
                            {family.nombreFamilia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label
                    className={`
                      text-2xl
                      ${titleClassName}
                    `}
                    style={{ color: COLORS.text }}
                  >
                    {asistiranLabel(
                      selected?.invitados?.total
                    )}
                  </Label>

                  <RadioGroup
                    value={attendance}
                    onValueChange={(
                      value: "si" | "no"
                    ) => setAttendance(value)}
                    className="grid grid-cols-2 gap-3"
                  >
                    {(["si", "no"] as const).map(
                      (value) => {
                        const isSelected =
                          attendance === value;

                        const statusColor =
                          value === "si"
                            ? COLORS.success
                            : COLORS.declined;

                        const statusBackground =
                          value === "si"
                            ? COLORS.successSoft
                            : COLORS.declinedSoft;

                        return (
                          <label
                            key={value}
                            htmlFor={`asist-${value}`}
                            className="
                              group
                              relative
                              flex
                              cursor-pointer
                              select-none
                              items-center
                              gap-3
                              rounded-2xl
                              border
                              px-4
                              py-3
                              transition
                            "
                            style={{
                              backgroundColor:
                                isSelected
                                  ? statusBackground
                                  : COLORS.card,
                              borderColor:
                                isSelected
                                  ? statusColor
                                  : COLORS.border,
                              boxShadow:
                                isSelected
                                  ? `0 0 0 3px ${statusColor}18`
                                  : "none",
                            }}
                          >
                            <RadioGroupItem
                              id={`asist-${value}`}
                              value={value}
                              className="sr-only"
                            />

                            {value === "si" ? (
                              <CheckCircle2
                                className="size-5"
                                style={{
                                  color: isSelected
                                    ? COLORS.success
                                    : COLORS.subtle,
                                }}
                                aria-hidden
                              />
                            ) : (
                              <XCircle
                                className="size-5"
                                style={{
                                  color: isSelected
                                    ? COLORS.declined
                                    : COLORS.subtle,
                                }}
                                aria-hidden
                              />
                            )}

                            <span
                              className={`
                                text-sm
                                ${textClassName}
                              `}
                              style={{
                                color: COLORS.text,
                              }}
                            >
                              {value === "si"
                                ? "Sí"
                                : "No"}
                            </span>
                          </label>
                        );
                      }
                    )}
                  </RadioGroup>
                </div>

                <DialogFooter className="pt-1">
                  <div className="flex w-full justify-center">
                    <Button
                      type="submit"
                      disabled={!selected || submitting}
                      className="
                        h-auto
                        rounded-2xl
                        px-5
                        py-2
                        text-sm
                        font-semibold
                        transition-colors
                      "
                      style={{
                        backgroundColor: COLORS.button,
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.text,
                        boxShadow:
                          "0 3px 10px rgba(55,51,53,0.07)",
                      }}
                    >
                      {submitting
                        ? "Enviando…"
                        : "Enviar confirmación"}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
      >
        <DialogContent
          className="
            border-0
            bg-transparent
            p-0
            shadow-none
            sm:max-w-md
            [&>button]:hidden
            [&_[data-slot='dialog-close']]:hidden
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="rounded-[24px] border p-6 shadow-2xl"
            style={{
              background: `linear-gradient(
                180deg,
                ${COLORS.background},
                ${COLORS.backgroundAlt}
              )`,
              borderColor: COLORS.border,
            }}
          >
            <DialogHeader className="items-center">
              <div
                className="
                  mb-2
                  inline-flex
                  size-12
                  items-center
                  justify-center
                  rounded-full
                "
                style={{
                  backgroundColor:
                    successData?.asistencia
                      ? COLORS.successSoft
                      : COLORS.declinedSoft,
                }}
              >
                {successData?.asistencia ? (
                  <CheckCircle2
                    className="size-7"
                    style={{
                      color: COLORS.success,
                    }}
                  />
                ) : (
                  <XCircle
                    className="size-7"
                    style={{
                      color: COLORS.declined,
                    }}
                  />
                )}
              </div>

              <DialogTitle
                className="text-center"
                style={{ color: COLORS.textStrong }}
              >
                {successData?.asistencia
                  ? "¡Confirmación enviada!"
                  : "¡Respuesta registrada!"}
              </DialogTitle>

              <DialogDescription
                className="text-center"
                style={{ color: COLORS.muted }}
              >
                Tu respuesta fue registrada correctamente.
              </DialogDescription>
            </DialogHeader>

            <div
              className={`
                space-y-1
                text-center
                text-sm
                ${textClassName}
              `}
              style={{ color: COLORS.text }}
            >
              <p>
                Registramos la respuesta de{" "}
                <strong>
                  {successData?.nombreFamilia}
                </strong>{" "}
                para{" "}
                <strong>
                  {personasLabel(
                    successData?.nroPersonas
                  )}
                </strong>
                .
              </p>

              <p>
                {successData?.asistencia
                  ? successYesMessage
                  : successNoMessage}
              </p>
            </div>

            <DialogFooter className="mt-4 justify-center">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="
                    h-auto
                    rounded-xl
                    px-5
                    py-2
                  "
                  style={{
                    backgroundColor: COLORS.button,
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                >
                  Aceptar
                </Button>
              </DialogClose>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
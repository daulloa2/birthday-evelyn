// components/RecGiftsSection.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { Banknote, Gift } from "lucide-react";
import InfoCard from "@/components/InfoCard";
import { Button } from "@/components/ui/button";
import BankAccountsDialog, {
  type BankAccount,
} from "@/components/BankAccountsDialog";


const COLORS = {
  text: "#373335",
  muted: "#6D6668",
  primary: "#8C3F49",
  primaryDark: "#6E3038",
  accent: "#B98A90",
  buttonBackground: "#F3EEEC",
  buttonBackgroundHover: "#EAE2DF",
  border: "#DDD6D2",
  card: "#FFFFFF",
} as const;

/**
 * Convierte la decoración azul existente en un rojo vino apagado.
 * Así no es necesario reemplazar todavía el archivo PNG.
 */
const DECORATION_FILTER =
  "brightness(0) saturate(100%) invert(25%) sepia(18%) saturate(1850%) hue-rotate(305deg) brightness(88%) contrast(86%)";

type RecGiftsSectionProps = {
  gifts?: string;
  registryLabel?: string;
  registryUrl?: string;
  accounts?: BankAccount[];
  className?: string;
  titleClassName?: string;
  itemClassName?: string;
};

export default function RecGiftsSection({
  gifts = "Tu presencia es lo más valioso para nosotros. Si deseas hacerme un regalo, he preparado algunas opciones para facilitarte el proceso.",
  registryLabel,
  registryUrl,
  accounts = [],
  className = "",
  titleClassName = "",
  itemClassName = "",
}: RecGiftsSectionProps) {
  const [accountsOpen, setAccountsOpen] = React.useState(false);

  return (
    <section
      className={[
        "relative w-full overflow-visible px-3",
        "[--corner:clamp(120px,22vw,150px)]",
        "sm:[--corner:clamp(84px,16vw,180px)]",
        className,
      ].join(" ")}
    >
      {/* Decoración */}
      <Image
        src="/blueleaves.png"
        alt=""
        width={400}
        height={400}
        aria-hidden
        className="
          pointer-events-none
          absolute
          right-[calc(-0.30_*_var(--corner))]
          z-0
          select-none
          sm:top-[calc(-0.01_*_var(--corner))]
        "
        style={{
          width: "var(--corner)",
          height: "auto",
          filter: DECORATION_FILTER,
          opacity: 0.68,
        }}
        priority={false}
      />

      <div className="relative z-10 mx-auto grid max-w-[880px] pb-6 gap-6">
        <InfoCard
          title={
            <span
              className={titleClassName}
              style={{ color: COLORS.text }}
            >
              Regalos
            </span>
          }
          icon={
            <Gift
              className="size-6"
              style={{ color: COLORS.primary }}
            />
          }
        >
          <p
            className={itemClassName}
            style={{ color: COLORS.text }}
          >
            {gifts}
          </p>

          <div
            className={`
              mt-4
              flex
              flex-wrap
              items-center
              justify-center
              gap-3
              text-center
              ${itemClassName}
            `}
          >
            {accounts.length > 0 && (
              <Button
                type="button"
                onClick={() => setAccountsOpen(true)}
                className="
                  h-auto
                  w-auto
                  rounded-xl
                  border
                  px-5
                  py-2
                  text-[19px]
                  font-medium
                  transition-colors
                  sm:text-[25px]
                "
                style={{
                  backgroundColor: COLORS.buttonBackground,
                  color: COLORS.text,
                  borderColor: COLORS.border,
                  boxShadow: "0 1px 3px rgba(55,51,53,0.06)",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor =
                    COLORS.buttonBackgroundHover;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor =
                    COLORS.buttonBackground;
                }}
              >
                <Banknote
                  className="mr-2 size-4"
                  style={{ color: COLORS.primary }}
                />

                Ver cuentas
              </Button>
            )}

            {registryUrl && (
              <a
                href={registryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition-colors
                "
                style={{
                  backgroundColor: COLORS.buttonBackground,
                  color: COLORS.text,
                  borderColor: COLORS.border,
                  boxShadow: "0 1px 3px rgba(55,51,53,0.06)",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor =
                    COLORS.buttonBackgroundHover;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor =
                    COLORS.buttonBackground;
                }}
              >
                {registryLabel ?? "Ver mesa de regalos"}
              </a>
            )}
          </div>
        </InfoCard>
      </div>

      {accounts.length > 0 && (
        <BankAccountsDialog
          open={accountsOpen}
          onOpenChange={setAccountsOpen}
          accounts={accounts}
          title="Cuentas para regalo"
          description="Puedes copiar los datos que necesites. ¡Gracias!"
        />
      )}
    </section>
  );
}
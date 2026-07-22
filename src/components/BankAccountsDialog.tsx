// components/BankAccountsDialog.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { Copy, Check, Banknote, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type BankAccount = {
  bank: string;
  holder: string;
  account: string;
  dni: string;
  qr?: string;
};

type BankAccountsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: BankAccount[];
  title?: string;
  description?: string;
  titleClassName?: string;
  textClassName?: string;
  onShowQR?: (account: BankAccount) => void;
};

const COLORS = {
  text: "#373335",
  textStrong: "#2F2B2D",
  muted: "#6D6668",
  primary: "#8C3F49",
  accent: "#B98A90",
  border: "#DDD6D2",
  background: "#FFFCFA",
  backgroundAlt: "#F6F2F0",
  card: "#FFFFFF",
  button: "#F1ECE9",
  buttonHover: "#E8E1DE",
} as const;

const DECORATION_FILTER =
  "brightness(0) saturate(100%) invert(25%) sepia(18%) saturate(1850%) hue-rotate(305deg) brightness(88%) contrast(86%)";

const CORNER_TOP = "/blueleaves.png";
const CORNER_BOTTOM = "/blueroses.png";

export default function BankAccountsDialog({
  open,
  onOpenChange,
  accounts,
  title = "Cuentas para regalo",
  description = "Gracias por tu cariño. Puedes utilizar cualquiera de estas cuentas:",
  titleClassName = "",
  textClassName = "",
  onShowQR,
}: BankAccountsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          overflow-hidden
          rounded-[28px]
          border
          p-0
          sm:max-w-2xl
        "
        style={{
          borderColor: COLORS.border,
          background: `linear-gradient(
            180deg,
            ${COLORS.background},
            ${COLORS.backgroundAlt}
          )`,
          boxShadow: "0 18px 50px rgba(55, 51, 53, 0.12)",
        }}
      >
        {/* Decoración superior */}
        <Image
          src={CORNER_TOP}
          alt=""
          width={192}
          height={192}
          aria-hidden
          className="
            pointer-events-none
            absolute
            right-[-8%]
            top-[-10%]
            select-none
          "
          style={{
            width: "10rem",
            height: "auto",
            opacity: 0.58,
            filter: DECORATION_FILTER,
            transform: "rotate(8deg)",
          }}
          priority={false}
        />

        {/* Decoración inferior */}
        <Image
          src={CORNER_BOTTOM}
          alt=""
          width={192}
          height={192}
          aria-hidden
          className="
            pointer-events-none
            absolute
            bottom-[-8%]
            left-[-10%]
            select-none
          "
          style={{
            width: "10rem",
            height: "auto",
            opacity: 0.58,
            filter: DECORATION_FILTER,
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
            <Banknote
              className="size-5"
              style={{ color: COLORS.primary }}
            />
          </div>

          <DialogTitle
            className={`
              mt-3
              text-center
              text-3xl
              tracking-wide
              ${titleClassName}
            `}
            style={{ color: COLORS.textStrong }}
          >
            {title}
          </DialogTitle>

          <DialogDescription
            className={`
              mt-1
              text-center
              text-sm
              ${textClassName}
            `}
            style={{ color: COLORS.muted }}
          >
            {description}
          </DialogDescription>

          <div
            className="mx-auto mt-3 h-px w-24"
            style={{ backgroundColor: COLORS.border }}
          />
        </DialogHeader>

        <div className="relative z-10 px-5 pb-6">
          <ul className="grid gap-4 sm:grid-cols-2">
            {accounts.map((account) => (
              <li
                key={`${account.bank}-${account.account}`}
                className="
                  rounded-2xl
                  border
                  p-4
                  sm:p-5
                "
                style={{
                  backgroundColor: "rgba(255,255,255,0.94)",
                  borderColor: COLORS.border,
                  boxShadow: "0 6px 18px rgba(55,51,53,0.07)",
                }}
              >
                <div
                  className="mb-2 text-base font-semibold"
                  style={{ color: COLORS.textStrong }}
                >
                  {account.bank}
                </div>

                <FieldRow
                  label="Titular"
                  value={account.holder}
                  textClassName={textClassName}
                />

                <FieldRow
                  label="Nro. de cuenta"
                  value={account.account}
                  copyable
                  textClassName={textClassName}
                />

                <FieldRow
                  label="DNI"
                  value={account.dni}
                  copyable
                  textClassName={textClassName}
                />

                <div className="mt-4 flex flex-wrap gap-2">
                  <CopyAllButton account={account} />

                  {account.qr && (
                    <Button
                      type="button"
                      variant="outline"
                      className="
                        h-auto
                        rounded-xl
                        px-4
                        py-2
                        transition-colors
                      "
                      onClick={() => onShowQR?.(account)}
                      style={{
                        backgroundColor: COLORS.button,
                        borderColor: COLORS.border,
                        color: COLORS.text,
                        boxShadow: "0 2px 6px rgba(55,51,53,0.06)",
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
                      <QrCode
                        className="mr-2 size-4"
                        style={{ color: COLORS.primary }}
                      />

                      Ver QR
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FieldRow({
  label,
  value,
  copyable = false,
  textClassName = "",
}: {
  label: string;
  value: string;
  copyable?: boolean;
  textClassName?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1400);
    } catch (error) {
      console.error(`No fue posible copiar ${label}:`, error);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <div className={`text-sm ${textClassName}`}>
        <span style={{ color: COLORS.muted }}>
          {label}:
        </span>{" "}

        <span
          className="font-medium"
          style={{ color: COLORS.textStrong }}
        >
          {value}
        </span>
      </div>

      {copyable && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="
            h-8
            rounded-xl
            transition-colors
          "
          onClick={handleCopy}
          aria-label={`Copiar ${label}`}
          style={{
            backgroundColor: COLORS.button,
            borderColor: COLORS.border,
            color: copied ? COLORS.primary : COLORS.text,
            boxShadow: "0 1px 3px rgba(55,51,53,0.05)",
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
          {copied ? (
            <Check className="size-4" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      )}
    </div>
  );
}

function CopyAllButton({
  account,
}: {
  account: BankAccount;
}) {
  const [copied, setCopied] = React.useState(false);

  const text = [
    `Banco: ${account.bank}`,
    `Titular: ${account.holder}`,
    `Cuenta: ${account.account}`,
    `DNI: ${account.dni}`,
  ].join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1400);
    } catch (error) {
      console.error("No fue posible copiar los datos:", error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleCopy}
      className="
        h-auto
        rounded-xl
        px-4
        py-2
        transition-colors
      "
      style={{
        backgroundColor: COLORS.button,
        borderColor: COLORS.border,
        color: COLORS.text,
        boxShadow: "0 2px 6px rgba(55,51,53,0.06)",
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
      {copied ? (
        <>
          <Check
            className="mr-2 size-4"
            style={{ color: COLORS.primary }}
          />
          Copiado
        </>
      ) : (
        <>
          <Copy
            className="mr-2 size-4"
            style={{ color: COLORS.primary }}
          />
          Copiar datos
        </>
      )}
    </Button>
  );
}
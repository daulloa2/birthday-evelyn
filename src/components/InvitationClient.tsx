// components/InvitationClient.tsx
"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import CalendarMonth from "@/components/CalendarMonth";
import QuoteBlock from "@/components/QuoteBlock";
import TextBlock from "@/components/TextBlock";
import VenueBlock from "@/components/VenueBlock";
import BigDate from "@/components/BigDate";
import ConfirmCard from "@/components/ConfirmCard";
import dynamic from "next/dynamic";
import Image from "next/image";
import RevealSection from "@/components/RevealSection";
import DressCode from "@/components/DressCode";
import RecGiftsSection from "@/components/RecGiftsSection";
import BackgroundAudio from "@/components/BackgroundAudio";
import HeroCover from "@/components/HeroCover";

import {
  Great_Vibes,
  Cormorant_Garamond,
  Lora,
  Mr_De_Haviland,
  Mea_Culpa,
  Lavishly_Yours,
  Rouge_Script,
  MonteCarlo
} from "next/font/google";

type Family = { id: string; nombreFamilia: string; nroPersonas: number };
type CSSVarProps<T extends string> = React.CSSProperties & Record<T, string>;

const RED_PALETTE = {
  primary: "#8C3F49",      // Rojo vino: solo para acentos
  primaryDark: "#6E3038",  // Rojo oscuro: detalles puntuales
  accent: "#B98A90",       // Rosa apagado
  soft: "#FFFCFA",         // Marfil
  softAlt: "#F6F2F0",      // Fondo neutro suave
  background: "#F3F0EE",   // Fondo exterior
  card: "#FFFFFF",
  text: "#373335",         // Gris oscuro para texto principal
  muted: "#6D6668",        // Gris medio para texto secundario
  line: "#DDD6D2",         // Líneas cálidas
} as const;

const SOFT_BG_CARD = RED_PALETTE.card;
const SOFT_ACCENT = RED_PALETTE.accent;

// Recolorea las decoraciones azules existentes sin requerir nuevos archivos PNG.
const RED_DECORATION_FILTER =
  "brightness(0) saturate(100%) invert(25%) sepia(18%) saturate(1850%) hue-rotate(305deg) brightness(88%) contrast(86%)";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-greatvibes", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cormorant", display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-lora", display: "swap" });
const mr_de_haviland = Mr_De_Haviland({ subsets: ["latin"], weight: "400", variable: "--font-mrdehaviland", display: "swap" });
const mea_culpa = Mea_Culpa({ subsets: ["latin"], weight: "400", variable: "--font-meaculpa", display: "swap" });
const lavishlyYours = Lavishly_Yours({ subsets: ["latin"], weight: "400", variable: "--font-lavishlyyours", display: "swap" });
const rougeScript = Rouge_Script({ subsets: ["latin"], weight: "400", variable: "--font-rougescript", display: "swap" });
const montecarlo = MonteCarlo({ subsets: ["latin"], weight: "400", variable: "--font-montecarlo", display: "swap" });

const CountdownBanner = dynamic(() => import("@/components/CountdownBanner"), { ssr: false });

const GalleryCarousel = dynamic(
  () => import("@/components/GalleryCarousel"),
  {
    ssr: false,
    loading: () => (
      <div
        className="aspect-[4/3] w-full bg-[#F3F0EE]"
        aria-hidden
      />
    ),
  }
);
const WEDDING_DATE = new Date("2026-08-08T17:00:00");

const CHURCH_NAME = "Iglesia Santa Teresita del cantón Olmedo";
//const CHURCH_MAPS_URL = "https://maps.app.goo.gl/YRyZSh5wyinbugAH9";
const RECEPTION_NAME = "Hostería Olmedo";
//const RECEPTION_MAPS_URL = "https://maps.app.goo.gl/hyzpdakVDWBAejcQA";

export default function InvitationClient({ familyIdFromUrl }: { familyIdFromUrl?: string }) {
  const [prefillFamily, setPrefillFamily] = React.useState<Family | undefined>(undefined);
  const [confirmed, setConfirmed] = React.useState(false);
  const [declined, setDeclined] = React.useState(false);
  const [checking, setChecking] = React.useState(true);
  const garlandVar: CSSVarProps<"--garland"> = { ["--garland"]: "clamp(110px,26vw,200px)" };

  // Lee estado desde el backend por familyId
  React.useEffect(() => {
    if (!familyIdFromUrl) { setChecking(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/guests?familyId=${encodeURIComponent(familyIdFromUrl)}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`GET /api/guests?familyId failed: ${res.status}`);
        const data = await res.json();

        // Normalización (acepta varios esquemas del backend):
        const rawStr = (data.status ?? data.rsvp ?? data.response ?? data.answer ?? "")
          .toString()
          .trim()
          .toLowerCase();
        const yesLike = ["si", "sí", "yes", "true"];
        const noLike = ["no", "false"];
        const responded = data.responded === true;
        const isYes =
          yesLike.includes(rawStr) ||
          data.status === "si" ||
          data.confirmed === true ||
          (responded && data.attending === true);

        const isNo =
          noLike.includes(rawStr) ||
          data.status === "no" ||
          data.declined === true ||
          (responded && data.attending === false);

        if (!cancelled) {
          setConfirmed(Boolean(isYes));
          setDeclined(Boolean(isNo) && !isYes);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [familyIdFromUrl]);

  // Prefill de familia
  React.useEffect(() => {
    if (!familyIdFromUrl) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/guests", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const list: Family[] = data.families ?? [];
        const fam = list.find((f) => f.id === familyIdFromUrl);
        if (!cancelled) setPrefillFamily(fam);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { cancelled = true; };
  }, [familyIdFromUrl]);

  return (
    <main
      className={`paper-invite invitation-theme relative h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth no-scrollbar ${lora.className}`}
      style={{
        overscrollBehaviorY: "contain",
        background: `linear-gradient(180deg, ${RED_PALETTE.background} 0%, #FFFFFF 50%, ${RED_PALETTE.softAlt} 100%)`,
        color: RED_PALETTE.text,
      }}
    >
      <BackgroundAudio
        src="audio/theme.mp3"
        title="Nuestra canción"
        artist="Evelyn Bahamonde Carrión"
        cover="/assets/inicio.jpg"
      />

      <style jsx global>{`
        .invitation-theme .countdown-neutral,
        .invitation-theme .countdown-neutral * {
          color: ${RED_PALETTE.text} !important;
          border-color: transparent !important;
        }

        .invitation-theme .calendar-neutral,
        .invitation-theme .calendar-neutral * {
          color: ${RED_PALETTE.text} !important;
          border-color: ${RED_PALETTE.line} !important;
        }

        .invitation-theme .calendar-neutral svg,
        .invitation-theme .calendar-neutral line,
        .invitation-theme .calendar-neutral path {
          stroke: ${RED_PALETTE.muted} !important;
        }

        .invitation-theme .calendar-neutral [class*="selected"],
        .invitation-theme .calendar-neutral [class*="highlight"],
        .invitation-theme .calendar-neutral [aria-selected="true"] {
          background: ${RED_PALETTE.softAlt} !important;
          color: ${RED_PALETTE.primaryDark} !important;
          border-color: ${RED_PALETTE.accent} !important;
        }

        .invitation-theme .venue-neutral,
        .invitation-theme .venue-neutral * {
          color: ${RED_PALETTE.text} !important;
          border-color: ${RED_PALETTE.line} !important;
        }

        .invitation-theme .confirm-neutral,
        .invitation-theme .confirm-neutral * {
          border-color: ${RED_PALETTE.line} !important;
        }
      `}</style>

      <div className="mx-auto max-w-[640px] bg-white/70 shadow-[0_0_36px_rgba(55,51,53,0.06)]">
        {/* 1 — Hero */}
        <HeroCover src="/assets/inicio.jpg" alt="Evelyn Bahamonde Carrión">
          <div className="no-auto-resize">
            <h1 className={`text-center text-[64px] sm:text-[100px] ${mr_de_haviland.className} text-white drop-shadow`}>
              Evelyn Gabriela Bahamonde Carrión
            </h1>
            <p className={`mt-2 text-center text-white/90 text-[44px] sm:text-[50px] ${mr_de_haviland.className}`}>¡Mis 15 años!</p>
          </div>

        </HeroCover>
        {/* 10 — Cita (hoja blanca) */}
        <RevealSection>
          <section className="relative ">
            <div
              className="mx-auto max-w-[880px] overflow-hidden p-6 sm:p-8"
              style={{
                ...garlandVar,
                background: `linear-gradient(180deg, #FFFFFF 0%, ${RED_PALETTE.soft} 100%)`,
                boxShadow: "0 8px 24px rgba(55,51,53,0.06)",
              }}
            >
              <Image
                src="/red_horizontal.png"
                alt=""
                aria-hidden
                width={320}
                height={120}
                className="pointer-events-none select-none absolute z-0"
                style={{
                  top: "10%",
                  left: "50%",
                  transform: "translate(-50%, -30%)",
                  width: "var(--garland)",
                  height: "auto",
                  opacity: 0.68,
                }}
                priority={false}
              />
              <Image
                src="/red_horizontal.png"
                alt=""
                aria-hidden
                width={320}
                height={120}
                className="pointer-events-none select-none absolute z-0"
                style={{
                  bottom: "10%",
                  left: "50%",
                  transform: "translate(-50%, 30%)",
                  width: "var(--garland)",
                  height: "auto",
                  opacity: 0.68,
                  
                }}
                priority={false}
              />
              <div className="relative z-10 py-6 text-center ">
                <QuoteBlock
                  classNameAuthor={`${cormorant.className} text-[15px] sm:text-[20px] py-3`}
                  classNameQuote={`${rougeScript.className} text-[25px] sm:text-[29px] pt-3`}
                  quote="Se fuerte y valiente. No temas ni desmayes, porque el señor tu Dios estará contigo dondequiera que vayas."
                  author="Josué 1:9"
                />
              </div>
            </div>
          </section>
        </RevealSection>
        {/* 2 — Texto + BigDate + Countdown + CalendarMonth (panel rojo suave) */}
        <RevealSection>
          <section
            className="relative px-4 sm:px-6 py-6 sm:py-8"
            style={{
              background: `linear-gradient(0deg, ${RED_PALETTE.softAlt} 0%, #FFFFFF 100%)`,
              boxShadow: "0 8px 22px rgba(55,51,53,0.05)",
            }}
          >
            <div className="mx-auto w-full max-w-[560px] text-center">
              <TextBlock
                className="bg-transparent p-0 shadow-none"
                paragraphClassName={`text-center leading-[1.2] ${rougeScript.className}`}
                paragraphs={[
                  "Hoy queda en el recuerdo mi niñez, pero hoy renazco para vivir una de las etapas más felices de mi vida: mi adolescencia.",
                  "Quisiera que estés junto a mí para que compartas conmigo la celebración de mis 15 años."
                ]}
              />

              <div className="mt-4">
                <BigDate
                  date={WEDDING_DATE}
                  className={`mx-auto ${cormorant.className}`}
                  dayClassName={greatVibes.className}
                  labelsClassName={lora.className}
                />
              </div>
              <div className="mt-4">
                <CountdownBanner
                  date={WEDDING_DATE}
                  className="my-0"
                />
              </div>
              <div className="mt-6">
                <div className={`${lavishlyYours.className} text-4xl sm:text-5xl font-semibold text-[#373335]`}>
                  El gran día
                </div>
                <div className="flex items-center justify-center gap-2 text-sm pt-4" style={{ color: SOFT_ACCENT }}>
                  <CalendarIcon className="size-4" />
                  <span className="uppercase tracking-[0.18em]">
                    {WEDDING_DATE.toLocaleDateString("es-ES", { month: "long" })}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <CalendarMonth
                  className="mx-auto w-full max-w-[520px]"
                  date={WEDDING_DATE}
                  highlightDate={WEDDING_DATE}
                  startOnSunday
                />
              </div>
            </div>
          </section>
        </RevealSection>

        {/* 3 — Info Padrinos (hoja blanca) */}
        <RevealSection>
          <section
            className={[
              "[--corner:clamp(80px,25vw,200px)]",
              "sm:[--corner:clamp(120px,16vw,210px)]",
            ].join(" ")}
          >
            <div
        className={`
          relative
          z-10
          bg-white/90
          px-4
          pb-8
          pt-20
          text-center
          ring-1
          ring-[#E8E0DD]/80
          shadow-[0_12px_36px_rgba(55,51,53,0.07)]
          backdrop-saturate-150
          sm:px-6
          sm:pt-16
        `}
      >
              <Image
                src="/blue_leaves.png"
                alt=""
                aria-hidden
                width={360}
                height={360}
                className="pointer-events-none absolute z-0 select-none"
                style={{
                  width: "var(--corner)",
                  height: "auto",
                  top: 0,
                  left: 0,
                  transform: "translate(-10%, -10%)",
                  filter: RED_DECORATION_FILTER,
                  opacity: 0.68,
                }}
                priority={false}
              />

              <h2
                className={`
          ${mea_culpa.className}
          relative
          z-10
          mb-10
          text-[40px]
          leading-tight
          text-[#373335]
          sm:text-[50px]
        `}
              >
                Con la bendición de Dios y
                <br />
                mis queridos padres
              </h2>

              {/* Padres */}
              <div className="relative z-10 mb-9">
                <h3
                  className={`
            ${mea_culpa.className}
            mb-3
            text-[35px]
            font-light
            text-[#777073]
            sm:text-[44px]
          `}
                >
                  Mis padres
                </h3>

                <p
                  className={`
            ${montecarlo.className}
            text-[24px]
            leading-relaxed
            text-[#373335]
            sm:text-[30px]
          `}
                >
                  Noralva María Carrión Armijos
                  <br />
                  Danilo Armando Bahamonde Sánchez
                </p>
              </div>

              {/* Padrinos */}
              <div className="relative z-10 mb-6">
                <h3
                  className={`
            ${mea_culpa.className}
            mb-3
            text-[35px]
            font-light
            text-[#777073]
            sm:text-[44px]
          `}
                >
                  Mis padrinos
                </h3>

                <p
                  className={`
            ${montecarlo.className}
            text-[24px]
            leading-relaxed
            text-[#373335]
            sm:text-[30px]
          `}
                >
                  María del Cisne Armijos Carrión
                  <br />
                  Carlos Rolando Tapia López
                </p>
              </div>
            </div>
          </section>
        </RevealSection>
        {/* 6 — Imagen */}
        <RevealSection>
          <section className="grid gap-4">
            <div
              className="relative mt-0 w-full aspect-[16/10] overflow-hidden"
              style={{ backgroundColor: SOFT_BG_CARD, boxShadow: "0 8px 20px rgba(55,51,53,0.07)" }}
            >
              <Image src="/assets/momentos1.jpg" alt="Momentos" fill sizes="100vw" className="object-cover" loading="lazy" />
            </div>
          </section>
        </RevealSection>
        {/* 4 — Venue */}
        <RevealSection>
          <section
            className={[
              "[--corner:clamp(112px,38vw,260px)]",
              "sm:[--corner:clamp(52px,16vw,210px)]",
              "relative w-full px-4 sm:px-6",
              "pt-0 pb-0 sm:pt-0 sm:pb-0",
              "mb-0",
              "bg-[#FFF9FA] text-[#373335]",
              "shadow-[0_8px_22px_rgba(55,51,53,0.06)]",
            ].join(" ")}
          >
            <div className="z-10 pb-9 py-9">
              <div className="venue-neutral">
                <VenueBlock
                  title="Ceremonia"
                  name={CHURCH_NAME}
                  address=""
                  time="05:00 PM"
                />
              </div>

              <div className="relative px-6 py-2 [--rose:clamp(90px,34vw,200px)] sm:[--rose:clamp(72px,22vw,180px)]">
                <Image
                  src="/redroses.png"
                  alt=""
                  width={240}
                  height={240}
                  className="pointer-events-none select-none absolute z-20"
                  style={{
                    left: "calc(-0.20 * var(--rose))",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "var(--rose)",
                    height: "auto",


                  }}
                  priority={false}
                />
              </div>

              <div className="venue-neutral">
                <VenueBlock
                  title="Recepción"
                  name={RECEPTION_NAME}
                  address=""
                  time="06:00 PM"
                />
              </div>
            </div>
          </section>
        </RevealSection>
        {/* 6 — Imagen */}
        <RevealSection>
          <section className="grid gap-4">
            <div
              className="relative mt-0 w-full aspect-[16/10] overflow-hidden"
              style={{ backgroundColor: SOFT_BG_CARD, boxShadow: "0 8px 20px rgba(55,51,53,0.07)" }}
            >
              <Image
                src="/assets/momentos2.jpg"
                alt="Momentos"
                fill sizes="100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </section>
        </RevealSection>


        {/* 7 — DressCode */}
        <RevealSection>
          <DressCode
            titleClassName={`${mea_culpa.className} text-4xl`}
            captionClassName={`${rougeScript.className} text-[25px] sm:text-[29px]`}
            womenColors={[
              { color: "#FF2E2E", name: "Rojo 1" },
              { color: "#FF0000", name: "Rojo 2" },
              { color: "#D10000", name: "Rojo 3" },
              { color: "#A30000", name: "Rojo 4" },
              { color: "#750000", name: "Rojo 5" },
            ]}
          />
        </RevealSection>
        {/* 9 — Carrusel */}
        <RevealSection>
          <section className="grid gap-3 [--garland:clamp(110px,26vw,200px)]">
            <GalleryCarousel
              aspect={4 / 3}
              images={[
                { src: "/assets/1.jpg", alt: "Foto 1", objectPosition: "50% 40%"  },
                { src: "/assets/2.jpg", alt: "Foto 2", objectPosition: "50% 20%" },
                { src: "/assets/3.jpg", alt: "Foto 3" },
                { src: "/assets/4.jpg", alt: "Foto 4", objectPosition: "50% 10%" },
                { src: "/assets/5.jpg", alt: "Foto 5" },
                { src: "/assets/6.jpg", alt: "Foto 6" },
                { src: "/assets/7.jpg", alt: "Foto 7" },
              ]}
              className={`${cormorant.className} text-3xl text-[#373335]`}
            />
          </section>
        </RevealSection>
        {/* 8 — Recomendaciones + Regalos */}
        <RevealSection>
          <RecGiftsSection
            className="pt-6"
            titleClassName={`${mea_culpa.className} text-4xl`}
            itemClassName={`${rougeScript.className} text-[26px] sm:text-[33px]`}
            accounts={[
              {
                bank: "Banco del Austro",
                holder: "Daniel Esteban Castanier Palacios",
                account: "0400549877",
                dni: "0107517088",
              },
            ]}
          />
        </RevealSection>

        {/* 11 — Confirmación — SOLO si hay id */}
        {familyIdFromUrl && (
          <RevealSection>
            <section className="confirm-neutral">
              <ConfirmCard
                confirmed={confirmed}
                declined={declined}
                checking={checking}
                prefillFamilyId={familyIdFromUrl}
                prefillFamily={prefillFamily}
                onConfirmed={() => {
                  setConfirmed(true);
                  setDeclined(false);
                }}
                onDeclined={() => {
                  setConfirmed(false);
                  setDeclined(true);
                }}
                titleClassName={greatVibes.className}
                textClassName={lora.className}
                hideIfNoPrefill
                messageWhenConfirmed="¡Nos hace mucha ilusión compartir este día contigo!"
                messageWhenDeclined="No hay problema, nos encontraremos en una próxima ocasión."
              />
            </section>
          </RevealSection>
        )}

        {/* 12 — Cierre */}
        <RevealSection>
          <HeroCover src="/assets/cierre.jpg" alt="Nos vemos pronto" objectPosition="60% 20%">
            <h1 className={`text-center text-5xl sm:text-8xl ${greatVibes.className} text-white drop-shadow`}>
              ¡Nos vemos en mi fiesta!
            </h1>
          </HeroCover>
        </RevealSection>
      </div>
    </main>
  );
}

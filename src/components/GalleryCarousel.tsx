// components/GalleryCarousel.tsx
"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type GalleryImage = {
  src: StaticImageData | string;
  alt?: string;
  objectPosition?: string;
};

type GalleryCarouselProps = {
  images: GalleryImage[];
  aspect?: number;
  className?: string;
};

const COLORS = {
  text: "#373335",
  primary: "#8C3F49",
  border: "#DDD6D2",
  controlBackground: "rgba(255,255,255,0.92)",
  controlBackgroundHover: "rgba(255,255,255,1)",
  inactiveIndicator: "rgba(255,255,255,0.82)",
} as const;

export default function GalleryCarousel({
  images,
  aspect = 16 / 10,
  className = "",
}: GalleryCarouselProps) {
  const [[index, direction], setIndex] = React.useState<
    [number, 1 | -1]
  >([0, 1]);

  const [open, setOpen] = React.useState(false);
  const touchStartX = React.useRef<number | null>(null);

  const count = images.length;

  function paginate(nextDirection: 1 | -1) {
    if (count <= 1) {
      return;
    }

    setIndex(([currentIndex]) => [
      (currentIndex + nextDirection + count) % count,
      nextDirection,
    ]);
  }

  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    if (touchStartX.current === null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX;

    if (typeof endX !== "number") {
      touchStartX.current = null;
      return;
    }

    const difference = endX - touchStartX.current;

    if (Math.abs(difference) > 40) {
      paginate(difference < 0 ? 1 : -1);
    }

    touchStartX.current = null;
  }

  if (count === 0) {
    return null;
  }

  const currentImage = images[index];

  return (
    <div
      className={`
        relative
        w-full
        max-w-full
        overflow-hidden
        bg-white
        ${className}
      `}
      style={{
        boxShadow: "0 4px 14px rgba(55,51,53,0.07)",
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: aspect }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence
          initial={false}
          custom={direction}
          mode="popLayout"
        >
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{
              x: direction > 0 ? 80 : -80,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: direction > 0 ? -80 : 80,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 30,
            }}
          >
            <Image
              src={currentImage.src}
              alt={
                currentImage.alt ??
                `Fotografía ${index + 1}`
              }
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              priority={index === 0}
              className="select-none object-cover"
              style={{
                objectPosition:
                  currentImage.objectPosition ?? "center",
              }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <>
          <CarouselButton
            label="Imagen anterior"
            position="left-2"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft className="size-5" />
          </CarouselButton>

          <CarouselButton
            label="Imagen siguiente"
            position="right-2"
            onClick={() => paginate(1)}
          >
            <ChevronRight className="size-5" />
          </CarouselButton>
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label="Ampliar imagen"
            className="
              absolute
              right-2
              top-2
              grid
              place-items-center
              rounded-full
              border
              p-2
              shadow
              transition-colors
            "
            style={{
              color: COLORS.text,
              backgroundColor: COLORS.controlBackground,
              borderColor: COLORS.border,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor =
                COLORS.controlBackgroundHover;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor =
                COLORS.controlBackground;
            }}
          >
            <Maximize2 className="size-4" />
          </button>
        </DialogTrigger>

        <DialogContent
          className="
            w-[min(1100px,calc(100dvw-24px))]
            rounded-2xl
            border-none
            bg-black/95
            p-0
          "
        >
          <DialogTitle className="sr-only">
            Imagen {index + 1} de {count}
          </DialogTitle>

          <DialogClose asChild>
            <button
              type="button"
              aria-label="Cerrar imagen ampliada"
              className="
                absolute
                right-3
                top-3
                z-20
                rounded-full
                bg-black/30
                p-2
                text-white/80
                transition-colors
                hover:text-white
              "
            >
              <X className="size-5" />
            </button>
          </DialogClose>

          <div className="grid max-h-[86dvh] place-items-center">
            <Image
              src={currentImage.src}
              alt={
                currentImage.alt ??
                `Fotografía ampliada ${index + 1}`
              }
              width={2000}
              height={2000}
              className="
                h-auto
                max-h-[86dvh]
                w-auto
                max-w-[96dvw]
                select-none
                object-contain
              "
              priority
            />
          </div>
        </DialogContent>
      </Dialog>

      {count > 1 && (
        <div
          className="
            pointer-events-none
            absolute
            bottom-2
            left-0
            right-0
            flex
            justify-center
            gap-1
          "
          aria-hidden
        >
          {images.map((image, indicatorIndex) => (
            <div
              key={`${String(image.src)}-${indicatorIndex}`}
              className="h-1.5 w-5 rounded-full"
              style={{
                backgroundColor:
                  indicatorIndex === index
                    ? COLORS.primary
                    : COLORS.inactiveIndicator,
                boxShadow:
                  "inset 0 0 0 1px rgba(55,51,53,0.10)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CarouselButton({
  label,
  position,
  onClick,
  children,
}: {
  label: string;
  position: "left-2" | "right-2";
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`
        absolute
        top-1/2
        grid
        -translate-y-1/2
        place-items-center
        rounded-full
        border
        p-2
        shadow
        transition-colors
        ${position}
      `}
      style={{
        color: COLORS.text,
        backgroundColor: COLORS.controlBackground,
        borderColor: COLORS.border,
      }}
      onClick={onClick}
      onMouseEnter={(event) => {
        event.currentTarget.style.backgroundColor =
          COLORS.controlBackgroundHover;
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.backgroundColor =
          COLORS.controlBackground;
      }}
    >
      {children}
    </button>
  );
}
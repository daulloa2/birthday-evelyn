"use client";
import Image from "next/image";
import * as React from "react";

export default function HeroCover({
  src,
  alt = "",
  className = "",
  objectPosition = "",
  topContent,
  bottomContent,
  children,
}: {
  src: string;
  alt?: string;
  className?: string;
  objectPosition?: string;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const renderBottom = bottomContent || children;

  return (
    <div className={`relative w-full min-h-dvh overflow-hidden ${className}`}>
      {/* imagen de fondo */}
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{
          objectPosition: objectPosition ?? "center",
        }}
      />

      {/* RENDERIZADO SUPERIOR */}
      {topContent && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-black/80 via-black/50 to-transparent" />
          {/* 👇 Modificado de top-[15%] a top-[5%] para pegarlo más al borde */}
          <div className="absolute inset-x-0 top-[10%] z-10 px-6">
            {topContent}
          </div>
        </>
      )}

      {/* RENDERIZADO INFERIOR */}
      {renderBottom && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-[15%] z-10 px-6">
            {renderBottom}
          </div>
        </>
      )}
    </div>
  );
}
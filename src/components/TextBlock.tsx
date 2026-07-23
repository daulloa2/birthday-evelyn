// components/TextBlock.tsx
"use client";

type TextBlockProps = {
  title?: string;
  paragraphs: string[];
  className?: string;
  titleClassName?: string;
  paragraphClassName?: string;
};

export default function TextBlock({
  title,
  paragraphs,
  className = "",
  titleClassName = "",
  paragraphClassName = "",
}: TextBlockProps) {
  return (
    <div
      className={`
        p-5
        sm:rounded-2xl
        shadow-[0_1px_2px_rgba(0,0,0,0.03)]
        ${className}
      `}
    >
      {title && (
        <h2
          className={`
            mb-2
            text-center
            text-[#3F3A3B]
            ${titleClassName}
          `}
        >
          {title}
        </h2>
      )}

      <div className="space-y-2 text-[25px] text-[#4A4446] sm:text-[29px]">
        {paragraphs.map((paragraph, index) => (
          <p
            key={`${index}-${paragraph.slice(0, 20)}`}
            className={paragraphClassName}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
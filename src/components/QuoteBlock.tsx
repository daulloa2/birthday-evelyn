// components/QuoteBlock.tsx
"use client";

type QuoteBlockProps = {
  quote: string;
  author?: string;
  className?: string;
  classNameQuote?: string;
  classNameAuthor?: string;
};

export default function QuoteBlock({
  quote,
  author,
  className = "",
  classNameQuote = "",
  classNameAuthor = "",
}: QuoteBlockProps) {
  return (
    <figure className={className}>
      <blockquote
        className={`
          text-center
          italic
          leading-[1.2]
          text-[#3F3A3B]
          ${classNameQuote}
        `}
      >
        “{quote}”
      </blockquote>

      {author && (
        <figcaption
          className={`
            mt-2
            text-center
            text-xs
            text-[#625B5D]
            ${classNameAuthor}
          `}
        >
          — {author}
        </figcaption>
      )}
    </figure>
  );
}
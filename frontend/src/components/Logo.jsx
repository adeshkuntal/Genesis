import React from "react";
import icon from "../assets/logo.png";

export default function Logo({
  size = "md",
  withTagline = false,
  to,
  variant = "default",
}) {
  const sizes = {
    sm: {
      image: "h-9 w-9",
      text: "text-lg",
      gap: "gap-2",
    },
    md: {
      image: "h-12 w-12",
      text: "text-2xl",
      gap: "gap-2.5",
    },
    lg: {
      image: "h-20 w-20",
      text: "text-4xl",
      gap: "gap-3",
    },
  };

  const s = sizes[size];

  const content =
    variant === "auth" ? (
      <div className="flex flex-col items-center">
        <img
          src={icon}
          alt="Genesis"
          className={`
            ${s.image}
            object-contain
            transition-transform
            duration-200
            hover:scale-[1.03]
          `}
        />

        <span
          className={`
            ${s.text}
            mt-3
            font-display
            font-semibold
            leading-none
            tracking-[-0.025em]
            text-ivory
          `}
        >
          Genesis
        </span>

        {withTagline && (
          <span className="mt-2 text-[9px] uppercase tracking-[0.15em] text-slate-soft">
            Automated Planning &amp; Blog Writing AI
          </span>
        )}
      </div>
    ) : (
      <div className={`group flex items-center ${s.gap}`}>
        <div
          className={`
            ${s.image}
            flex
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            border
            border-white/[0.08]
            bg-[#101923]
            p-1
            transition-all
            duration-200
            group-hover:border-teal/30
          `}
        >
          <img
            src={icon}
            alt="Genesis"
            className="h-full w-full object-contain"
          />
        </div>

        <span
          className={`
            ${s.text}
            font-display
            font-semibold
            leading-none
            tracking-[-0.025em]
            text-ivory
          `}
        >
          Genesis
        </span>
      </div>
    );

  if (to) {
    return (
      <a
        href={to}
        aria-label="Genesis"
        className="inline-flex focus:outline-none"
      >
        {content}
      </a>
    );
  }

  return content;
}
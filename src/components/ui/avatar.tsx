import * as React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  className?: string;
}

export function Avatar({ src, alt, name, className }: AvatarProps) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "";
  return (
    <span className={`inline-flex items-center justify-center rounded-full bg-[#E9F1FF] text-[#009FE3] font-bold text-base w-10 h-10 ${className || ""}`.trim()}>
      {src ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        initials || <span className="text-lg">👤</span>
      )}
    </span>
  );
} 
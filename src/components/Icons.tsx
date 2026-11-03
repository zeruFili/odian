import React from "react";

export interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  filled?: boolean;
}

export type IconName =
  | "cart"
  | "bag"
  | "search"
  | "user"
  | "heart"
  | "eye"
  | "star"
  | "close"
  | "check"
  | "chevron"
  | "chevronRight"
  | "arrow"
  | "arrowRight"
  | "menu"
  | "filter"
  | "tag"
  | "sparkle"
  | "leaf"
  | "shield"
  | "truck"
  | "refresh"
  | "grid"
  | "list"
  | "calendar"
  | "alert"
  | "mapPin";

export function SearchIcon({ size = 20, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function UserIcon({ size = 20, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

export function BagIcon({ size = 20, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 8h14l-1 13H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function HeartIcon({ size = 20, strokeWidth = 1.7, filled = false, className }: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function EyeIcon({ size = 20, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function StarIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9L12 2.5Z" />
    </svg>
  );
}

export function CloseIcon({ size = 20, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function CheckIcon({ size = 18, strokeWidth = 2, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 20, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 18, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 18, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function MenuIcon({ size = 22, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function FilterIcon({ size = 18, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

export function FunnelIcon({ size = 16, strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

export function LeafIcon({ size = 24, strokeWidth = 1.5, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 4 13c0-4 3-7 8-9 5 2 8 5 8 9a7 7 0 0 1-7 7h-2Z" />
      <path d="M4 21c2-4 5-7 10-9" />
    </svg>
  );
}

export function SparkleIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2c.5 4.5 2.5 7 6 7.5-3.5.5-5.5 3-6 7.5-.5-4.5-2.5-7-6-7.5C9.5 9 11.5 6.5 12 2Z" />
    </svg>
  );
}

export function ShieldCheckIcon({ size = 22, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function TruckIcon({ size = 22, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

export function RefreshCwIcon({ size = 20, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export function GridViewIcon({ size = 18, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

export function ListViewIcon({ size = 18, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

export function InstagramIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14 8h2V5h-2a4 4 0 0 0-4 4v2H8v3h2v7h3v-7h2.5l.5-3H13V9a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function YoutubeIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12s0-3.3-.4-4.8c-.2-.8-.9-1.5-1.7-1.7C18.3 5 12 5 12 5s-6.3 0-7.9.5c-.8.2-1.5.9-1.7 1.7C2 8.7 2 12 2 12s0 3.3.4 4.8c.2.8.9 1.5 1.7 1.7 1.6.5 7.9.5 7.9.5s6.3 0 7.9-.5c-.8-.2 1.5-.9 1.7-1.7.4-1.5.4-4.8.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

export function VisaIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 48 32" className="icon-pay" aria-hidden="true">
      <rect width="48" height="32" rx="4" fill="#fff" />
      <path d="M18 21h-3l2-12h3l-2 12Zm9-12-1.5 8L28 21h-3l1-8-2.4 8h-3.1l3.7-12h3.9Zm7.6 8.4c-.1-.9-.7-1.4-1.4-1.9l-1.7-.8c-.5-.2-.7-.5-.7-.8 0-.4.4-.8 1.2-.8a5 5 0 0 1 2.4.6l.8-2.3a6.5 6.5 0 0 0-3.3-.8c-2.3 0-4 1.2-4 3 0 1.3 1.2 2 2.1 2.5l.9.4c.5.2.8.5.8.9 0 .5-.5.8-1.3.8a4.5 4.5 0 0 1-2.7-.8l-.8 2.4a6.8 6.8 0 0 0 3.6 1c2.5 0 4.2-1.2 4.2-3.2ZM45 21h-2.2l-2-12h3.2c.4 0 .8.3.9.8L46 14l-1 7ZM10 9l-3 8-.3-1.8L5.6 9H2.4l.1.4 3.4 8h3L12.2 9H10Z" fill="#1434CB" />
    </svg>
  );
}

export function MastercardIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 48 32" className="icon-pay" aria-hidden="true">
      <rect width="48" height="32" rx="4" fill="#fff" />
      <circle cx="18" cy="16" r="10" fill="#EB001B" />
      <circle cx="30" cy="16" r="10" fill="#F79E1B" />
      <path d="M24 8.2a10 10 0 0 1 0 15.6A10 10 0 0 1 24 8.2Z" fill="#FF5F00" />
    </svg>
  );
}

export function GooglePayIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 48 32" className="icon-pay" aria-hidden="true">
      <rect width="48" height="32" rx="4" fill="#fff" />
      <path d="M28.2 15.5v4.4h-1.3V15l-2.5 6.5h-1l-2.5-6.5v4.9h-1.6V15.5h2.2l2.2 5.8 2.3-5.8h2.2ZM31.4 21.9c-2.2 0-3.5-1.4-3.5-3.2s1.3-3.2 3.5-3.2c1 0 1.8.3 2.4.8l-.8.8c-.5-.4-1-.6-1.6-.6-1.2 0-2 .8-2 2.2s.8 2.2 2 2.2c.7 0 1.2-.3 1.6-.8l-.9-.7h-1.6v-1.1h2.8v3.1a4 4 0 0 1-2.9.7Z" fill="#5F6368" />
      <path d="M40.4 14.4h1.1l1.5 3.6 1.5-3.6h1.1l-2.2 5.1v2.4H42v-2.4l-1.6-5.1Z" fill="#4285F4" />
      <path d="M14.5 11.8v2h2.9a4.3 4.3 0 0 1-1.2 2.8 4.3 4.3 0 0 1-1.7 1.1v.1a5.6 5.6 0 1 0 0-6Z" fill="#4285F4" />
      <path d="M10.4 17.7a5.6 5.6 0 0 0 4.1-1.6l-1.3-1.3a3.8 3.8 0 0 1-2.8 1.2 3.7 3.7 0 0 1-3.6-2.6h-1.5v.1a5.6 5.6 0 0 0 5.1 4.2Z" fill="#34A853" />
      <path d="M6.8 13.4a3.8 3.8 0 0 1 0-2.3v-.1H5.3a5.7 5.7 0 0 0 0 4.5l1.5-2.1Z" fill="#FBBC04" />
      <path d="M10.4 10.2a3.7 3.7 0 0 1 2.4.9l1.3-1.3a5.6 5.6 0 0 0-3.7-1.4 5.7 5.7 0 0 0-5.1 3.5l1.5 1.2a3.7 3.7 0 0 1 3.6-2.9Z" fill="#EA4335" />
    </svg>
  );
}

export function ApplePayIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 48 32" className="icon-pay" aria-hidden="true">
      <rect width="48" height="32" rx="4" fill="#fff" />
      <path d="M15.6 11.4c.8-.9 1.3-2.2 1.1-3.4-1.1 0-2.4.7-3.1 1.6-.7.8-1.3 2.1-1.1 3.3 1.2.1 2.4-.6 3.1-1.5ZM17.6 13.7c-.5-.6-1.2-1-1.9-1-1.3 0-1.9.6-2.9.6-.9 0-1.6-.6-2.8-.6-1.4 0-2.9.9-3.8 2.3-1.6 2.8-.4 7 1.1 9.3.8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.6-.7 3-.7 1.4 0 1.8.7 3 .7 1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.2-2.5s-2.4-.9-2.4-3.6c0-2.3 1.9-3.3 2-3.4-1.1-1.6-2.8-1.8-3.4-1.8-1.3-.1-2.5.8-3.1.8Z" fill="#000" />
    </svg>
  );
}

/* ============================================================
   Unified Icon component matching Doqa Rental syntax
   ============================================================ */
export interface UnifiedIconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const Icon: React.FC<UnifiedIconProps> = ({
  name,
  size = 18,
  className = "",
  strokeWidth = 2,
}) => {
  switch (name) {
    case "cart":
    case "bag":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <circle cx="8" cy="20" r="1" />
          <circle cx="19" cy="20" r="1" />
          <path d="M3 3h2l2.5 11h10L21 6H6" />
        </svg>
      );
    case "search":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" className={className} aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
      );
    case "user":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
      );
    case "heart":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "eye":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9L12 2.5Z" />
        </svg>
      );
    case "close":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" className={className} aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "check":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "chevron":
    case "chevronRight":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
    case "arrow":
    case "arrowRight":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "menu":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "filter":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
      );
    case "tag":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
          <path d="M7 7h.01" />
        </svg>
      );
    case "sparkle":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 2c.5 4.5 2.5 7 6 7.5-3.5.5-5.5 3-6 7.5-.5-4.5-2.5-7-6-7.5C9.5 9 11.5 6.5 12 2Z" />
        </svg>
      );
    case "leaf":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M11 20A7 7 0 0 1 4 13c0-4 3-7 8-9 5 2 8 5 8 9a7 7 0 0 1-7 7h-2Z" />
          <path d="M4 21c2-4 5-7 10-9" />
        </svg>
      );
    case "shield":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "truck":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case "refresh":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      );
    case "grid":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "list":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      );
    case "calendar":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" className={className} aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );
    case "alert":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
    case "mapPin":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    default:
      return null;
  }
};

export default Icon;

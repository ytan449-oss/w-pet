import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
export function ArrowIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}><path d="M4 12h15M13 5l7 7-7 7" /></svg>;
}
export function BagIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" {...props}><path d="M5 7h14l1 14H4L5 7Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></svg>;
}
export function FlowerIcon(props: IconProps) {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}><g fill="currentColor"><ellipse cx="24" cy="12" rx="7" ry="10" /><ellipse cx="24" cy="36" rx="7" ry="10" /><ellipse cx="12" cy="24" rx="10" ry="7" /><ellipse cx="36" cy="24" rx="10" ry="7" /><ellipse cx="15.5" cy="15.5" rx="7" ry="10" transform="rotate(-45 15.5 15.5)" /><ellipse cx="32.5" cy="15.5" rx="7" ry="10" transform="rotate(45 32.5 15.5)" /><ellipse cx="15.5" cy="32.5" rx="7" ry="10" transform="rotate(45 15.5 32.5)" /><ellipse cx="32.5" cy="32.5" rx="7" ry="10" transform="rotate(-45 32.5 32.5)" /></g><circle cx="24" cy="24" r="6" fill="var(--color-cream)" /></svg>;
}
export function LeafIcon(props: IconProps) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" {...props}><path d="M26 5C9 3 2 16 9 23S29 23 26 5Z" /><path d="M5 28 23 9M12 21l1-8M17 16l7-1" /></svg>;
}
export function HeartIcon(props: IconProps) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" {...props}><path d="M16 27 5 16C-2 7 9-1 16 8c7-9 18-1 11 8L16 27Z" /></svg>;
}
export function PawIcon(props: IconProps) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" {...props}><ellipse cx="8" cy="11" rx="3" ry="4" transform="rotate(-20 8 11)" /><ellipse cx="15" cy="7" rx="3" ry="4" /><ellipse cx="23" cy="10" rx="3" ry="4" transform="rotate(20 23 10)" /><path d="M8 22c2-9 13-9 16 0 3 8-6 6-8 5-2 1-11 3-8-5Z" /></svg>;
}

/** Decorative vector art, not a photograph of Aria, Wellness or a real product. */
export function CompanionIllustration() {
  return <svg viewBox="0 0 440 460" fill="none" aria-hidden="true" focusable="false">
    <ellipse cx="220" cy="227" rx="175" ry="201" fill="#e5edf1" />
    <circle cx="308" cy="119" r="28" fill="#fbf8f1" />
    <path d="M67 350c61-34 101-12 150-18 72-9 92-47 158-31" stroke="#b7c9d1" strokeWidth="1.5" />
    <path d="M71 367c50-15 97 1 144-7 70-12 108-7 157-28" stroke="#b7c9d1" strokeWidth="1.5" />
    <path d="M100 328c24-44 32-68 12-94m4 60c22-13 32-31 25-50m-32 54c-22-8-32-21-31-38" stroke="#8da6b7" strokeWidth="2" strokeLinecap="round" />
    <path d="M303 340c-4-44 4-86 30-118m-22 68c24-8 41-21 48-37m-50 55c-17-15-28-35-25-52" stroke="#8da6b7" strokeWidth="2" strokeLinecap="round" />
    <path d="M186 324c-12-31-9-58 4-79l9-26c-23-5-28-15-24-31 3-13 19-20 28-22l9-25c5-12 12-12 22-1l8 8c15 2 28 16 28 33l-1 22c-1 19-9 33-25 41l9 61 18 20" fill="#fbf8f1" stroke="#365d82" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M235 154c-15 8-24 31-12 45 5 7 13 9 20 4m-43-24h2m-18 18 11 3m24 53c-3 21 2 42 9 65m-32 6h74m-34-89 12 1" stroke="#365d82" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M196 239c-22 6-23 32-41 36-9 2-13-5-16-14" stroke="#365d82" strokeWidth="3" strokeLinecap="round" />
    <path d="m197 223 21 22 24-13" stroke="#b79b81" strokeWidth="2" strokeLinecap="round" />
    {Array.from({length: 12}, (_, i) => {
      const a = (i * 30 - 90) * Math.PI / 180;
      return <circle key={i} cx={220 + Math.cos(a) * 148} cy={228 + Math.sin(a) * 177} r="2" fill="#6b8ba5" />;
    })}
  </svg>;
}

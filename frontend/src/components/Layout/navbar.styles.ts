/* ===== Layout ===== */
export const navbarContainer = `
  relative
  w-full
  bg-[#fdffe9]
  border-b border-[#e5e7eb]/40

`;

/* ===== Inner wrapper ===== */
export const navbarInner = `
  max-w-7xl
  mx-auto
  px-4 py-4
  sm:px-6
`;

/* ===== Top row ===== */
export const topRow = `
  flex items-center justify-between
`;

/* ===== Logo ===== */
export const logoWrapper = `
  flex items-center
`;

export const logoText = `
  font-[family-name:var(--font-title)]
  font-bold
  text-2xl
  tracking-wider
  text-[#31380d]
`;

/* ===== Search DESKTOP ===== */
export const searchDesktop = `
  hidden lg:flex
  flex-1
  justify-center
  mx-6
`;

/* ===== Search MOBILE ===== */
export const searchMobile = `
  absolute
  left-1/2
  -translate-x-1/2
  top-full
  mt-3

  w-full
  px-4

  flex justify-center
  lg:hidden
  z-20
`;

/* ===== Actions ===== */
export const actionsWrapper = `
  flex items-center gap-3
`;

export const iconButton = `
  flex flex-col items-center gap-2
  text-[#31380d]
  hover:text-[#87a700]
  transition-colors
`;

export const iconLabel = `
  text-[11px]
  font-medium
  font-[family-name:var(--font-text)]
  leading-none
`;

/* ===== Card container ===== */
export const cardContainer = `
  relative
  w-full
  aspect-[7/8]
  rounded-2xl
  overflow-hidden
  group
  cursor-pointer
`;

/* ===== Background image ===== */
export const cardImage = `
  absolute inset-0
  w-full h-full
  object-cover
  transition-transform duration-500
  group-hover:scale-105
`;

/* ===== Overlay ===== */
export const cardOverlay = `
  absolute inset-0
  bg-gradient-to-t
  from-black/60
  via-black/10
  to-transparent
`;

/* ===== Content wrapper ===== */
export const contentWrapper = `
  absolute bottom-4 left-0
  w-full
  px-0.5
  grid grid-cols-[1fr_auto]
  items-end
`;

/* ===== Title wrapper ===== */
export const titleWrapper = `
  h-[56px]
  flex items-start
  pr-2 pl-0.5
  max-w-[14rem]
`;

/* ===== Title ===== */
export const titleText = `
  text-left
  max-w-[10rem]
  uppercase
  text-3xl
  leading-7
  tracking-wide
  text-[#fdffe9]
  font-[family-name:var(--font-title)]
  drop-shadow-md
`;

/* ===== Button ===== */
export const discoverButton = `
  bg-[#fdffe9]
  text-[#31380d]
  border-2 border-[#87a700]
  text-xs
  font-[family-name:var(--font-text)]
  font-bold
  px-3 sm:px-5
  py-1.5 sm:py-2
  rounded-full
  whitespace-nowrap
  shadow-sm
  hover:bg-[#87a700]
  hover:text-[#fdffe9]
  transition-colors
`;

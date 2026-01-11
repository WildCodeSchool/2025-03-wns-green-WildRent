export const footerStyles = {
  wrapper: "bg-[#2f3a0d] text-white",

  desktop: {
    container:
      "hidden md:flex max-w-7xl mx-auto h-16 px-6 items-center justify-between",
    logo: "font-[family-name:var(--font-title)] font-bold text-3xl tracking-wide leading-relaxed",
    nav: "flex gap-6 text-sm",
    social: "flex gap-4",
    icon: "hover:text-[#87a700] transition-colors",
  },

  mobile: {
    container: "md:hidden w-full px-7 py-3 flex flex-col gap-6 items-center",
    logo: "font-[family-name:var(--font-title)] font-bold text-3xl tracking-wide leading-none",
    nav: "flex flex-col gap-3 text-[18px] items-center text-center leading-[10px] max-w-[360px]",
    divider: "w-3 h-[2px] bg-white/60 my-1 rounded-full",
    social: "flex justify-center gap-5",
    icon: "hover:text-[#87a700] transition-colors",
  },
};

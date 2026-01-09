export const footerStyles = {
  wrapper: "bg-[#2f3a0d] text-white",

  desktop: {
    container:
      "hidden md:flex max-w-7xl mx-auto h-16 px-6 items-center justify-between",
    logo: "font-bold tracking-wide",
    nav: "flex gap-6 text-sm",
    social: "flex gap-4",
    icon: "hover:text-[#87a700] transition-colors",
  },

  mobile: {
    container: "md:hidden px-6 py-8 flex flex-col gap-6",
    logo: "font-bold tracking-wide",
    nav: "flex flex-col gap-3 text-sm",
    social: "flex justify-center gap-5",
    icon: "hover:text-[#87a700] transition-colors",
  },
};

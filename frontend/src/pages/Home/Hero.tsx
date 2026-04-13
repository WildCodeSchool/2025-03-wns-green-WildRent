export default function Hero() {
  return (
    <section
      className="relative min-h-[85vh] w-full bg-cover bg-center flex items-start"
      style={{
        backgroundImage: "url('/images/hero-bg.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-12 lg:pt-16 xl:pt-20">
        <div className="max-w-2xl text-white">
          <h1 className="font-title text-4xl sm:text-5xl lg:text-6xl leading-tight">
            Louez votre matériel outdoor TEST
            <br />
            en toute simplicité HELLO
          </h1>

          <p className="mt-6 text-lg sm:text-xl font-medium leading-relaxed text-white/90">
            Ski, randonnée, plongée...tout l'équipement qu'il vous faut, en
            quelques clics.
          </p>
        </div>
      </div>
    </section>
  );
}

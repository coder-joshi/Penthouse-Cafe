export default function Specials() {
  const specials = [
    {
      title: "Handmade Pasta",
      desc: "Our pasta is rolled fresh daily, bringing authentic texture and flavor to every dish.",
      icon: "🍝" // Placeholder for an image or illustration
    },
    {
      title: "Freshly Baked Pizza",
      desc: "Wood-fired to perfection with a blistered crust and the finest imported ingredients.",
      icon: "🍕"
    },
    {
      title: "House Cured Salumi",
      desc: "A rotating selection of artisanal meats, cured in-house with traditional methods.",
      icon: "🍖"
    }
  ];

  return (
    <section className="py-24 bg-charcoal text-cream px-6 relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-texture opacity-10 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <img src="/logo-window.png" alt="" className="h-12 mx-auto mb-6 opacity-20 filter invert" />
          <h2 className="font-serif text-4xl text-cream">Our Specials</h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {specials.map((special, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-cream/5 flex items-center justify-center mb-6 shadow-xl border border-cream/10 text-4xl">
                {/* Replace with actual photos or linework illustrations if available */}
                {special.icon}
              </div>
              <h3 className="font-serif text-xl mb-3 text-gold tracking-wide">{special.title}</h3>
              <p className="text-sm font-light text-cream/70 leading-relaxed max-w-xs">
                {special.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Events() {
  const events = [
    {
      title: "Wine Tasting Evening",
      date: "OCTOBER 15",
      desc: "Join us for a curated tasting of rare Tuscan vintages guided by our sommelier."
    },
    {
      title: "Live Jazz Sundays",
      date: "EVERY SUNDAY",
      desc: "Unwind with a late dinner and live instrumental jazz overlooking the city."
    },
    {
      title: "Truffle Season Menu",
      date: "NOVEMBER 1 - 30",
      desc: "A special prix fixe menu celebrating the arrival of white Alba truffles."
    }
  ];

  return (
    <section id="events" className="py-24 bg-cream px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.2em] text-xs text-gold font-medium mb-4">Gatherings</p>
          <h2 className="font-serif text-4xl text-navy">Upcoming Events</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <div key={idx} className="bg-white p-8 border border-navy/5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
              <span className="text-xs font-medium tracking-[0.15em] text-sage mb-4 block">
                {event.date}
              </span>
              <h3 className="font-serif text-2xl text-navy mb-4">{event.title}</h3>
              <p className="text-charcoal/70 text-sm font-light leading-relaxed mb-6 flex-grow">
                {event.desc}
              </p>
              <a href="#" className="text-xs uppercase tracking-widest text-gold hover:text-navy transition-colors font-medium border-b border-transparent hover:border-navy pb-1">
                Read More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

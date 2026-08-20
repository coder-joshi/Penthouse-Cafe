export default function VisitUs() {
  return (
    <section id="visit" className="py-24 bg-cream px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
        
        {/* Info & Form */}
        <div className="w-full lg:w-1/2">
          <div className="mb-12 text-center lg:text-left">
            <h2 className="font-serif text-4xl text-navy mb-8">Visit Us</h2>
            
            <div className="flex flex-col gap-4 text-charcoal/80 text-sm font-light">
              <div>
                <strong className="block text-navy font-medium mb-1 uppercase tracking-widest text-xs">Address</strong>
                123 Bellwether Lane<br/>New York, NY 10012
              </div>
              <div>
                <strong className="block text-navy font-medium mb-1 uppercase tracking-widest text-xs">Hours</strong>
                Tue - Sun: 5:00 PM - 11:00 PM<br/>Monday: Closed
              </div>
              <div>
                <strong className="block text-navy font-medium mb-1 uppercase tracking-widest text-xs">Contact</strong>
                +1 (212) 555-0198<br/>reservations@penthouse.com
              </div>
            </div>
          </div>

          <div className="bg-white p-8 border border-navy/5 shadow-sm">
            <h3 className="font-serif text-2xl text-navy mb-6">Send a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-cream/50 border border-navy/10 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder-charcoal/40"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-cream/50 border border-navy/10 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder-charcoal/40"
                />
              </div>
              <textarea 
                rows={4} 
                placeholder="How can we help you?"
                className="w-full bg-cream/50 border border-navy/10 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder-charcoal/40 resize-none"
              ></textarea>
              <button 
                type="submit"
                className="w-full bg-navy text-cream py-3 uppercase tracking-widest text-xs font-medium hover:bg-gold transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="w-full lg:w-1/2 min-h-[400px] bg-charcoal/5 relative border border-navy/10">
          {/* Using a placeholder for a real map iframe */}
          <div className="absolute inset-0 flex items-center justify-center text-navy/40 font-serif text-xl bg-[url('https://maps.wikimedia.org/osm-intl/13/2411/3079.png')] bg-cover bg-center grayscale opacity-80">
            [ Map Integration ]
          </div>
        </div>

      </div>
    </section>
  );
}

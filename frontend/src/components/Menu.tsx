import { useState } from 'react';

const MENU_DATA = {
  Starters: [
    { name: 'Crispy Artichokes', desc: 'Lemon, pecorino, parsley', price: '$14' },
    { name: 'Burrata al Tartufo', desc: 'Umbrian truffle, grilled bread', price: '$18' },
    { name: 'Polpo alla Brace', desc: 'Charred octopus, fennel, orange', price: '$21' },
  ],
  Pasta: [
    { name: 'Cacio e Pepe', desc: 'Tonnarelli, pecorino romano, black pepper', price: '$22' },
    { name: 'Rigatoni Spicy Vodka', desc: 'Calabrian chili, crushed tomato, cream', price: '$24' },
    { name: 'Pappardelle Ragu', desc: 'Slow-braised short rib, parmigiano', price: '$28' },
  ],
  Pizza: [
    { name: 'Margherita', desc: 'San Marzano tomato, fior di latte, basil', price: '$18' },
    { name: 'Diavola', desc: 'Spicy soppressata, hot honey, mozzarella', price: '$21' },
    { name: 'Tartufo', desc: 'Wild mushroom, truffle cream, fontina', price: '$24' },
  ]
};

type Category = keyof typeof MENU_DATA;

export default function Menu() {
  const [activeTab, setActiveTab] = useState<Category>('Starters');
  const categories = Object.keys(MENU_DATA) as Category[];

  return (
    <section id="menu" className="py-24 bg-cream">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.2em] text-xs text-gold font-medium mb-4">From The Kitchen</p>
          <h2 className="font-serif text-4xl md:text-5xl text-navy">Build your evening.</h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 md:gap-8 mb-12 border-b border-navy/10 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`text-sm md:text-base tracking-wider uppercase transition-colors ${
                activeTab === cat 
                  ? 'text-navy font-medium border-b-2 border-gold pb-4 -mb-[18px]' 
                  : 'text-navy/50 hover:text-navy'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-8 min-h-[300px]">
          {MENU_DATA[activeTab].map((item, idx) => (
            <div key={idx} className="flex justify-between items-end border-b border-navy/5 pb-4 group">
              <div className="flex-1 pr-4">
                <h3 className="font-serif text-xl md:text-2xl text-navy mb-1">{item.name}</h3>
                <p className="text-sm text-charcoal/70 font-light">{item.desc}</p>
              </div>
              <div className="text-gold font-medium text-lg">
                {item.price}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a href="#" className="inline-block border border-navy text-navy px-8 py-3 uppercase tracking-widest text-sm hover:bg-navy hover:text-cream transition-colors duration-300">
            See Full Menu
          </a>
        </div>

      </div>
    </section>
  );
}

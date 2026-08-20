export default function Footer() {
  return (
    <footer className="bg-cream pt-16 pb-8 px-6 border-t border-navy/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-sm">
          
          <div>
            <h4 className="font-medium text-navy uppercase tracking-widest text-xs mb-4">Our Menu</h4>
            <ul className="space-y-3 font-light text-charcoal/70">
              <li><a href="#" className="hover:text-gold transition-colors">Starters & Salads</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Handmade Pasta</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Wood-fired Pizza</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Dessert & Wine</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-navy uppercase tracking-widest text-xs mb-4">Services</h4>
            <ul className="space-y-3 font-light text-charcoal/70">
              <li><a href="#" className="hover:text-gold transition-colors">Private Events</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Catering</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Gift Cards</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Reservations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-navy uppercase tracking-widest text-xs mb-4">Information</h4>
            <ul className="space-y-3 font-light text-charcoal/70">
              <li><a href="#" className="hover:text-gold transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-navy uppercase tracking-widest text-xs mb-4">Connect</h4>
            <ul className="space-y-3 font-light text-charcoal/70">
              <li><a href="#" className="hover:text-gold transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Newsletter</a></li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-navy/10 text-xs font-light text-charcoal/50">
          <p>&copy; {new Date().getFullYear()} The Penthouse at Home Sweet Home. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-navy transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-navy transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

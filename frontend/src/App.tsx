import Nav from './components/Nav';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Menu from './components/Menu';
import Specials from './components/Specials';
import Events from './components/Events';
import Catering from './components/Catering';
import Gallery from './components/Gallery';
import VisitUs from './components/VisitUs';
import Footer from './components/Footer';

function App() {
  return (
    <div className="font-sans text-charcoal bg-cream min-h-screen">
      <Nav />
      <Hero />
      <Intro />
      <Menu />
      <Specials />
      <Events />
      <Catering />
      <Gallery />
      <VisitUs />
      <Footer />
    </div>
  );
}

export default App;

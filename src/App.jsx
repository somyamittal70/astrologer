import "./index.css";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Hero from "./pages/Hero";
import Destiny from "./pages/Destiny";
import About from "./pages/About";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";
import CTA from "./pages/CTA";
import FAQ from "./pages/FAQ";
import Strip from "./pages/Strip";
import PainPoint from "./pages/PainPoint";
import TrustUs from "./pages/TrustUs";
// import PopUp from "./pages/PopUp";

function App() {
  return (
    <>
      {/* <PopUp /> */}
      <Header />
      <main>
        <Hero />
        <Destiny />
        <Strip />
        <PainPoint />
        <About />
        <Services />
        <TrustUs />
        <Testimonials />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
export default App;

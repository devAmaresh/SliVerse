import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { WhyUs } from "./components/WhyUs";
import { FAQ } from "./components/FAQ";
import Footer from "./components/Footer";
const page = () => {
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <WhyUs />
          <FAQ />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default page;

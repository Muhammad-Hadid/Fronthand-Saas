import React from 'react'
import Header from "./Components/Header"
import Herosection from "./Components/Herosection";
import MotionFeatures from "./Components/MartoryFeatures"
import PricingCards from "./Components/PricingCards";
import FeatureCards from "./Components/FeatureCards"
import ContactForm from "./Components/ContactForm";
import Footer from "./Components/Footer";

function page() {
  return (
    <>
    <div>
      <Header />
      <Herosection />
      <MotionFeatures />
      <FeatureCards />
      <PricingCards />
      <ContactForm />
      <Footer />
      
      
    </div>
    </>
  )
}

export default page

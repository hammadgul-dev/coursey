import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Hero from "@/components/landing/Hero"
import Stats from "@/components/landing/Stats"
import WhyCoursey from "@/components/landing/WhyCoursey"
import HowItWorks from "@/components/landing/HowItWorks"
import Testimonials from "@/components/landing/Testimonials"
import CTASection from "@/components/landing/CTASection"

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <WhyCoursey />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  )
}

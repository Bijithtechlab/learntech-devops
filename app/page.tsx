import Hero from '@/components/Hero'
import About from '@/components/About'
import FeaturedCourses from '@/components/FeaturedCourses'
import Features from '@/components/Features'
import FeaturedTrainers from '@/components/FeaturedTrainers'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <FeaturedCourses />
      <Features />
      <FeaturedTrainers />
      <Testimonials />
      <Footer />
    </main>
  )
}
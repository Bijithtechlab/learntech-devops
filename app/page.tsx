import Hero from '@/components/Hero'
import About from '@/components/About'
import FeaturedCourses from '@/components/FeaturedCourses'
import Features from '@/components/Features'
import FeaturedTrainers from '@/components/FeaturedTrainers'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <FeaturedCourses />
      <Features />
      <FeaturedTrainers />
      <Footer />
    </main>
  )
}
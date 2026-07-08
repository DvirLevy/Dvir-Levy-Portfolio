import { Suspense, lazy } from "react"
import Hero from "@/components/Hero"
import About from "@/components/About"
import Skills from "@/components/Skills"
import Footer from "@/components/Footer"

const Projects = lazy(() => import("@/components/Projects"))
const Contact = lazy(() => import("@/components/Contact"))

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Skills />
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <Contact />
      </Suspense>
      <Footer />
    </div>
  )
}

export default Index

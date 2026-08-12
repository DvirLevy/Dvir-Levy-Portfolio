import { Button } from "@/components/ui/button"
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  MessageCircleQuestion,
} from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"
import { AwsRouts, LambdaService } from "@/utils/lambdaService"

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  const autoplayPlugin = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false }),
  )

  const wa = {
    name: "waLogo",
    s3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/companies/WhatsApp.svg.webp",
  }

  const handleWa = () => {
    const phoneNumber = "972542663619"
    const message = ""
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }
  const companies = [
    {
      name: "ironSource",
      s3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/companies/ironsource.svg",
    },
    {
      name: "Moovit",
      s3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/companies/JifitiLogo.png",
    },
    {
      name: "Giphy",
      s3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/companies/moovitLogo.png",
    },
  ]

  // Duplicate companies for smoother infinite scroll
  const duplicatedCompanies = [...companies, ...companies]
  const getResume = () => {
    LambdaService.DataAnalytics({
      awsRoute: AwsRouts.DOWNLOAD,
      eventName: "download",
      date: new Date().toString(),
    })
    const url =
      "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/companies/F.pdf"
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/hero-bg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          {/* Greeting */}
          <div className="inline-block">
            <span
              id="greeting"
              className="text-sm sm:text-base font-mono text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              👋 Hello, I'm
            </span>
          </div>

          {/* Name */}
          <h1
            id="name"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            <span className="text-gradient">Dvir Levy</span>
          </h1>

          {/* Title */}
          <p
            id="professionalTitle"
            className="text-xl sm:text-2xl md:text-3xl text-foreground/90 font-medium"
          >
            AI Software Engineer
          </p>

          {/* Description */}
          <p
            id="description"
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            AI Engineer building intelligent systems and real-time AI
            applications.
            <br className="hidden sm:block" />
            I specialize in backend development, LLM integrations, and scalable
            cloud-based architectures using Node.js, TypeScript, and AWS.
            <br className="hidden sm:block" />
            Focused on Retrieval-Augmented Generation (RAG), semantic search,
            and production-ready AI systems.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 w-full max-w-3xl mx-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.7)] transition-all bg-indigo-600 hover:bg-indigo-500 font-bold"
              onClick={() =>
                window.dispatchEvent(new Event("open-portfolio-bot"))
              }
            >
              <MessageCircleQuestion className="mr-2 h-5 w-5" />
              Ask My AI Assistant!
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 shadow-lg transition-all"
              onClick={scrollToProjects}
              id="viewProjectsBtn"
            >
              View Projects
              <ArrowDown className="mr-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base sm:text-lg px-8 py-6"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              id="contactMeBtn"
            >
              Contact Me
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base sm:text-lg px-8 py-6"
              onClick={() => getResume()}
              id="downloadResumeBtn"
            >
              <a
                href="https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/companies/Dvir+Levy+-+Resume.pdf"
                target='_blank'
                rel="noopener noreferrer"
              >
                Download my Resume
              </a>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 justify-center pt-8">
            <a
              href="https://github.com/DvirLevy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center shadow-md hover:shadow-glow card-hover"
              aria-label="GitHub"
              id="githubLink"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/dvirlevyhakak"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center shadow-md hover:shadow-glow card-hover"
              aria-label="LinkedIn"
              id="linkedinLink"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:dvirlh1@gmail.com"
              className="w-12 h-12 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center shadow-md hover:shadow-glow card-hover"
              aria-label="Email"
              id="emailLink"
            >
              <Mail className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={handleWa}
              aria-label="Chat on WhatsApp"
              className="w-12 h-12 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center shadow-md hover:shadow-glow card-hover"
            >
              <img src={wa.s3} alt="" width={20} height={20} />
            </button>
          </div>
        </div>

        {/* Companies Carousel */}
        <div className="mt-16 relative z-10">
          <p className="text-center text-sm text-muted-foreground mb-6 font-medium">
            Companies I've Worked At
          </p>
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            className="w-full max-w-4xl mx-auto"
            id="companiesCarousel"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {duplicatedCompanies.map((company, index) => (
                <CarouselItem
                  key={`${company.name}-${index}`}
                  className="pl-2 md:pl-4 basis-1/2 md:basis-1/3"
                >
                  <div className="p-6 flex items-center justify-center transition-all">
                    <img
                      src={company.s3}
                      alt={`${company.name} logo`}
                      loading="lazy"
                      className={
                        company.name == "ironSource"
                          ? "h-24 md:h-36 w-auto scale-750"
                          : "h-24 md:h-36 w-auto scale-550"
                      }
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        id="scrollIndicator"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce -mb-8"
      >
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </section>
  )
}

export default Hero

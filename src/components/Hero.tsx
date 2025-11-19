import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import heroBackground from "@/assets/hero-bg.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ironsourceLogo from "@/assets/companies/ironsource.png";
import moovitLogo from "@/assets/companies/moovit.png";
import giphyLogo from "@/assets/companies/giphy.png";

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const companies = [
    { name: "ironSource", logo: ironsourceLogo },
    { name: "Moovit", logo: moovitLogo },
    { name: "Giphy", logo: giphyLogo },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          {/* Greeting */}
          <div className="inline-block">
            <span className="text-sm sm:text-base font-mono text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full backdrop-blur-sm">
              👋 Hello, I'm
            </span>
          </div>

          {/* Name */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="text-gradient">Dvir Levy</span>
          </h1>

          {/* Title */}
          <p className="text-xl sm:text-2xl md:text-3xl text-foreground/90 font-medium">
            Automation Engineer & Tools Developer
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I leverage my development and testing skills by creating tools and scripts that drive efficiency.
            <br className="hidden sm:block" />
            Passionate about designing automation frameworks, CI/CD practices, and data-driven testing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 shadow-lg hover:shadow-glow transition-all"
              onClick={scrollToProjects}
            >
              View Projects
              <ArrowDown className="mr-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-base sm:text-lg px-8 py-6"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact Me
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
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/dvirlevyhakak" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center shadow-md hover:shadow-glow card-hover"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="mailto:dvirlh1@gmail.com"
              className="w-12 h-12 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center shadow-md hover:shadow-glow card-hover"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Companies Carousel */}
        <div className="mt-16 relative z-10">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Companies I've Worked With
          </p>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            className="w-full max-w-3xl mx-auto"
          >
            <CarouselContent>
              {companies.map((company) => (
                <CarouselItem key={company.name} className="basis-1/3 md:basis-1/3">
                  <div className="p-4 flex items-center justify-center">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="h-16 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </section>
  );
};

export default Hero;

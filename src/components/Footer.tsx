import { Github, Linkedin, Mail, Heart, FileUser } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const wa = { name: "waLogo", s3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/companies/WhatsApp.svg.webp" }

  const handleWa = ()=>{
    const phoneNumber = '972542663619'
    const message = ''
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div id="footer" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div id="aboutMeFooter" className="space-y-4">
              <h3 id='aboutMeName' className="text-lg font-semibold">Dvir Levy</h3>
              <p id="aboutMeText" className="text-sm text-muted-foreground leading-relaxed">
                Automation Engineer & Tools Developer.
                Specializing in test automation and performance testing.
              </p>
            </div>

            {/* Quick Links */}
            <div id='quickLinksFooter' className="space-y-4">
              <h3 id='quickLinksTitle' className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a id="aboutMeLink" href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a id="skillsLink" href="#skills" className="text-muted-foreground hover:text-primary transition-colors">
                    Skills
                  </a>
                </li>
                <li>
                  <a id="projectsLink" href="#projects" className="text-muted-foreground hover:text-primary transition-colors">
                    Projects
                  </a>
                </li>
                <li>
                  <a id="contactLink" href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Connect</h3>
              <div className="flex gap-3">
                <a 
                  id="githubLinkFooter"
                  href="https://github.com/DvirLevy" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  id="linkedinLinkFooter"
                  href="https://www.linkedin.com/in/dvirlevyhakak" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  id="emailLinkFooter" 
                  href="mailto:dvirlh1@gmail.com"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
                {/* <a
                  id="resumeLinkFooter"
                  href="https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/companies/Dvir+Levy+-+Resume.pdf"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
                  target='_blank'
                  rel="noopener noreferrer"           
                >
                  <FileUser className="h-5 w-5"/>
                </a> */}
                <img
                  src={wa.s3}
                  alt={wa.name}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
                  onClick={handleWa}
                />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              © {currentYear} Dvir Levy. Built with
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              using React & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

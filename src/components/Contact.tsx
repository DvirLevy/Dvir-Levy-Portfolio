import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Github, Send } from "lucide-react";
import { toast } from "sonner";
import whatsappLogo from '../assets/companies/WhatsApp.svg.webp'
import { link } from "fs";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! I'll get back to you soon.");
  };

   const handleWa = ()=>{
    const phoneNumber = '972542663619'
    const message = ''
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "dvirlh1@gmail.com",
      link: "mailto:dvirlh1@gmail.com"
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      value: "linkedin.com/in/dvirlevyhakak",
      link: "https://www.linkedin.com/in/dvirlevyhakak"
    },
    {
      icon: Github,
      title: "GitHub",
      value: "github.com/DvirLevy",
      link: "https://github.com/DvirLevy"
    },
     {
      logo: whatsappLogo,
      title: "WhatsApp",
      value: "Catch me on WhatsApp",
      link: ''
    }

  ];

  return (
    <section className="py-20 sm:py-24 md:py-32" id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Get In Touch
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Interested in discussing your next automation project? Let's talk!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="p-6 sm:p-8 bg-card/50 backdrop-blur-sm border-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input 
                    id="name"
                    placeholder="Your name"
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input 
                    id="subject"
                    placeholder="What would you like to discuss?"
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea 
                    id="message"
                    placeholder="Tell me about your project..."
                    rows={5}
                    required
                    className="bg-background resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  size="lg"
                >
                  Send Message
                  <Send className="mr-2 h-4 w-4" />
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 sm:p-8 bg-primary/5 border-primary/20">
                <h3 className="text-2xl font-semibold mb-6">Contact Details</h3>
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.title !== "WhatsApp" ? method.link : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-background/50 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        {method.title == "WhatsApp" ? <img src={method.logo} alt={method.title} className="h-10 w-10 text-primary"  />: 
                        <method.icon className="h-6 w-6 text-primary" />}
                        
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{method.title}</p>
                        <p className="text-sm text-muted-foreground">{method.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </Card>

              <Card className="p-6 sm:p-8 bg-card/50 backdrop-blur-sm border-2">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">💼 Available For</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    I'm available for new opportunities and looking for exciting challenges.
                    Whether you need automation solutions or development expertise -
                    I'd love to hear from you!
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Badge variant="secondary">Test Automation</Badge>
                    <Badge variant="secondary">Performance Testing</Badge>
                    <Badge variant="secondary">Tools Development</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

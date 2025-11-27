import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Github, Send } from "lucide-react";
import { toast } from "sonner";
import React, { useEffect } from "react";
import EmailServiceLambda from "@/utils/EmailSender";

const Contact = () => {
  console.log("rendered")
  const [formError,setFormError] = React.useState<Record<string,string>>({})
  const [isFormValid, setIsFormValid] = React.useState(false)
  const [getInTouchForm,setGetInTouchForm] = React.useState({
    fullName : '',
    email : '',
    to:"dvirlh1@gmail.com",
    subject: '',
    message: ''
  })
  const [touched, setTouched] = React.useState({
    fullName: false,
    email: false,
    subject: false,
    message: false,
  });

  const formValidator = () => {
    const errors: Record<string,string> = {}

    // Full Name validation
    if(getInTouchForm.fullName.trim().length < 2){
      errors.fullName = 'Full Name is required'
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(getInTouchForm.email)){
      errors.email = 'Invalid email address'
    }
    // Subject validation
    if(getInTouchForm.subject.trim().length < 2 && getInTouchForm.message.trim().length>20){
      errors.subject = 'Subject is required'
    }
    // Message validation
    if(getInTouchForm.message.trim().length < 5 && getInTouchForm.message.trim().length>100 ){
      errors.message = 'Message must be at least 5 characters long and max 100 characters'
    }

    return errors
  }

  const handleGetInTouchForm =(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
      setGetInTouchForm({...getInTouchForm ,
        [e.target.id]:e.target.value
      })
  }

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    if(!isFormValid){
      toast.error("error try again")
      console.log(formError)
    }
    else{
      console.log("from handleSubmit")
      console.log(getInTouchForm)
      await EmailServiceLambda(getInTouchForm)
      toast.success("Message sent successfully! I'll get back to you soon.");
    }
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
      value: "Dvirlh1@gmail.com",
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
      s3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/companies/WhatsApp.svg.webp",
      title: "WhatsApp",
      value: "Catch me on WhatsApp",
      link: ''
    }

  ];

  useEffect(()=>{
    const errorValidation = formValidator()
    setFormError(errorValidation)
    setIsFormValid(Object.keys(errorValidation).length === 0)

  },[getInTouchForm])

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
                    id="fullName"
                    placeholder="Your name"
                    required
                    className="bg-background"
                    onChange={handleGetInTouchForm}
                    value={getInTouchForm.fullName}
                    onBlur={() => setTouched({ ...touched, fullName: true })}
                  />
                  {touched.fullName && formError.fullName && <p className="text-red-500 text-sm">{formError.fullName}</p>}
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
                    onChange={handleGetInTouchForm}
                    value={getInTouchForm.email}
                    onBlur={() => setTouched({ ...touched, email: true })}
                  />
                  {touched.email && formError.email && <p className="text-red-500 text-sm">{formError.email}</p>}
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
                    onChange={handleGetInTouchForm}
                    value={getInTouchForm.subject}
                    onBlur={() => setTouched({ ...touched, subject: true })}
                  />
                  {touched.subject && formError.subject && <p className="text-red-500 text-sm">{formError.subject}</p>}
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
                    onChange={handleGetInTouchForm}
                    value={getInTouchForm.message}
                    onBlur={() => setTouched({ ...touched, message: true })}
                  />
                  {touched.message && formError.message && <p className="text-red-500 text-sm">{formError.message}</p>}
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
                      onClick={handleWa}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        {method.title == "WhatsApp" ? <img src={method.s3} alt={method.title} className="h-10 w-10 text-primary"  />: 
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

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Github, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("ההודעה נשלחה בהצלחה! אחזור אליך בהקדם.");
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "אימייל",
      value: "your.email@example.com",
      link: "mailto:your.email@example.com"
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      value: "linkedin.com/in/yourprofile",
      link: "#"
    },
    {
      icon: Github,
      title: "GitHub",
      value: "github.com/yourusername",
      link: "#"
    }
  ];

  return (
    <section className="py-20 sm:py-24 md:py-32" id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              צור קשר
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              מעוניין לשמוע על הפרויקט הבא שלך? בוא נדבר!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="p-6 sm:p-8 bg-card/50 backdrop-blur-sm border-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    שם מלא
                  </label>
                  <Input 
                    id="name"
                    placeholder="השם שלך"
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    אימייל
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
                    נושא
                  </label>
                  <Input 
                    id="subject"
                    placeholder="על מה תרצה לדבר?"
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    הודעה
                  </label>
                  <Textarea 
                    id="message"
                    placeholder="ספר לי על הפרויקט שלך..."
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
                  שלח הודעה
                  <Send className="mr-2 h-4 w-4" />
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 sm:p-8 bg-primary/5 border-primary/20">
                <h3 className="text-2xl font-semibold mb-6">דרכי התקשרות</h3>
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.link}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-background/50 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <method.icon className="h-6 w-6 text-primary" />
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
                  <h3 className="text-xl font-semibold">💼 זמין לפרויקטים</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    אני זמין לפרויקטים חדשים ומחפש הזדמנויות מעניינות.
                    בין אם אתה מחפש פתרונות אוטומציה או פיתוח אפליקציות React -
                    אשמח לשמוע ולעזור!
                  </p>
                  <div className="flex gap-3 pt-2">
                    <Badge variant="secondary">אוטומציה</Badge>
                    <Badge variant="secondary">React Development</Badge>
                    <Badge variant="secondary">Full-Stack</Badge>
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

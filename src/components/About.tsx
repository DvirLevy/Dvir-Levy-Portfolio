import { Card } from "@/components/ui/card";
import { Code2, Workflow, Zap, TestTube } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: TestTube,
      title: "E2E Test Automation",
      description: "Expert in Playwright, Selenium, and Oxygen Platform for comprehensive test coverage"
    },
    {
      icon: Zap,
      title: "Performance Testing",
      description: "JMeter load testing with Coralogix monitoring and trace analysis"
    },
    {
      icon: Code2,
      title: "Tools Development",
      description: "Building custom automation tools and SQL analytics platforms"
    },
    {
      icon: Workflow,
      title: "CI/CD & Cloud",
      description: "Azure DevOps, CloudBeat, and comprehensive infrastructure automation"
    }
  ];

  return (
    <section className="py-20 sm:py-24 md:py-32 bg-muted/30" id="about">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              About Me
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Automation Engineer with passion for building efficient testing solutions
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {highlights.map((item, index) => (
              <Card 
                key={index}
                className="p-6 sm:p-8 card-hover bg-card/50 backdrop-blur-sm border-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Bio Section */}
          <Card className="p-8 sm:p-10 md:p-12 bg-card/50 backdrop-blur-sm border-2">
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold">Professional Background</h3>
              <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                <p>
                  As an Automation Engineer with 7+ years of experience, I specialize in designing and implementing comprehensive automation frameworks that drive efficiency and quality. Currently at Jifiti, I lead E2E automation initiatives using Playwright while developing advanced testing infrastructure and performance monitoring solutions.
                </p>
                <p>
                  My journey includes significant roles at companies like Moovit, where I developed custom tools including SQL analytics platforms handling 100K+ data rows, and ironSource, where I honed my API testing and AWS expertise. I'm passionate about creating automation solutions that seamlessly integrate with CI/CD pipelines and cloud infrastructure.
                </p>
                <p className="font-medium text-foreground">
                  I'm a highly enthusiastic and motivated engineer, always eager to learn new technologies and frameworks. My commitment to data-driven testing, clean code practices, and continuous improvement drives me to build tools that not only solve today's problems but scale for tomorrow's challenges.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;

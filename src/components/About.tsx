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
      title: "Frontend Development",
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
                <p className="whitespace-pre-line">
                  <span className="font-bold">Senior QA Automation Engineer</span>, specializing in building scalable, 
                  reliable and data-driven automation systems.
                  I focus on creating solutions that simplify testing, improve product quality, and integrate smoothly into modern CI/CD and cloud environments.<br/>
                  </p>
                  <p className="whitespace-pre-line">
                  In my current role at<span className="font-bold"> Jifiti</span>, I design automation using Playwright, and Oxygen (a Selenium based framework), develop infrastructure improvements, develop DB scripts for CRUD procedure and validation.
                  Develop performance testing, and monitoring. I enjoy working on systems that combine automation, cloud, and data, work closely with the Devops team.<br/>
                  </p>
                  <p className="whitespace-pre-line">
                  Previously at <span className="font-bold">Moovit</span>, I developed internal tools, Develop a streamlined tool for fetching and analyzing live logs from EC2 servers, significantly improving debugging efficiency and QA testing time. Develop SQL analytics platform capable of processing 100K+ records and renders it to the user’s screen, a solutions that support large-scale analytics workflows and can be connected to deferent data services such as Redshift, BigQuery, Postgres, etc.
                  </p>
                  <p className="whitespace-pre-line">
                  My time at <span className="font-bold">ironSource</span> strengthened my API testing, debugging, and AWS skills, while also giving me exposure to performance analysis and traffic inspection tools.
                  </p>
                  <p className="whitespace-pre-line">
                  What drives me is solving real engineering problems with clean, maintainable code. I enjoy building tools teams actually use - solutions that remove friction, automate processes, improve workflow speed, and scale with the product. I'm constantly experimenting with new technologies, automation patterns, and architectural approaches to deliver smarter, more efficient testing systems.
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

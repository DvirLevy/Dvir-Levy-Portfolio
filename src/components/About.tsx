import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, MessageCircleQuestion, Code2, Workflow, Zap, TestTube } from "lucide-react";

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
                  <span className="font-bold">Senior Automation Engineer</span>, with hands-on experience designing and
                  developing end-to-end automation frameworks and internal tools. 
                  Strong background in building automation solutions that include frontend components using React and TypeScript, alongside cloud-based
                  implementations on AWS. Experienced in integrating automation with backend services, CI/CD pipelines,
                  and infrastructure-driven workflows in production environments.
                  </p>
                  
                  <div className="whitespace-pre-line">
                    In my current role at<span className="font-bold"> Jifiti, as a Senior Automation Engineer</span>,
                    I work closely with Frontend, Backend,
                    and DevOps teams to support and validate complex web-based flows
                    within a SaaS ecosystem. My responsibilities include developing automation and infrastructure improvements,
                    integrating solutions into CI/CD pipelines,
                    and collaborating across teams to ensure high-quality,
                    production-ready systems.
                  </div>
                  
                  <div className="whitespace-pre-line">
                    Previously at <span className="font-bold">Moovit, as a senior QA Automation Engineer</span>,
                    I was promoted to Tools Developer, where I designed and developed API test with Playwright and develop
                    internal tools used daily by engineering teams.
                    I built Electron-based applications with React and Vite frontends, 
                    integrated with Node.js and Express backends, and developed data-intensive dashboards capable of rendering 100K+ records efficiently.
                    These tools supported large-scale analytics workflows and integrated with multiple data services such as Redshift, BigQuery, and PostgreSQL.
                  </div>
                  
                  <div className="whitespace-pre-line">
                    My time at <span className="font-bold">ironSource as a QA Automation Engineer</span>,
                    strengthened my API testing, UI Automation within the browser context,
                    debugging, and AWS skills, while also giving me exposure to performance analysis and traffic inspection tools.
                  </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;

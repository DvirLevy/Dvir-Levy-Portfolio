import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Skills = () => {
  const skillCategories = [
    {
      title: "Test Automation",
      icon: "🤖",
      skills: ["Playwright", "Selenium", "Oxygen Platform", "Cypress", "E2E Testing", "UI Automation", "API Testing", "DB Validation"]
    },
    {
      title: "Performance & Monitoring",
      icon: "⚡",
      skills: ["JMeter", "Coralogix", "Performance Testing", "Load Testing", "Trace Analysis", "Postman", "Fiddler", "Charles"]
    },
    {
      title: "Development & Frameworks",
      icon: "⚛️",
      skills: ["React", "TypeScript", "JavaScript", "Node.js", "Express.js", "Vite", "Redux", "Material-UI"]
    },
    {
      title: "Cloud & DevOps",
      icon: "☁️",
      skills: ["Azure", "CloudBeat", "AWS (S3, CloudFront)", "CI/CD", "GitHub Actions", "Docker", "VMware", "Git"]
    },
    {
      title: "Databases & Analytics",
      icon: "🗄️",
      skills: ["SQL", "PostgreSQL", "MySQL", "MongoDB", "Oracle", "Redshift", "BigQuery", "SSMS", "NoSQL"]
    }
  ];

  return (
    <section className="py-20 sm:py-24 md:py-32" id="skills">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Skills & Technologies
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              My automation and development expertise
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {skillCategories.map((category, index) => (
              <Card 
                key={index}
                className="p-6 sm:p-8 card-hover bg-card/50 backdrop-blur-sm border-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl">{category.icon}</span>
                    <h3 className="text-xl sm:text-2xl font-semibold">{category.title}</h3>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <Badge 
                        key={skillIndex}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <Card className="p-6 sm:p-8 bg-primary/5 border-primary/20">
            <p className="text-center text-base sm:text-lg text-muted-foreground">
              🎯 It's not about how hard you hit. It's about how hard you can get hit and keep moving forward. How much you can take and keep moving forward (Rocky Balboa) 🎯
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Skills = () => {
  const skillCategories = [
    {
      title: "אוטומציה & Testing",
      icon: "🤖",
      skills: ["Python", "Selenium", "Playwright", "Pytest", "API Testing", "CI/CD", "Jenkins", "GitHub Actions"]
    },
    {
      title: "Frontend Development",
      icon: "⚛️",
      skills: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3", "Responsive Design", "Next.js"]
    },
    {
      title: "Backend & Databases",
      icon: "⚙️",
      skills: ["Node.js", "REST APIs", "PostgreSQL", "MongoDB", "SQL", "Express", "Authentication", "WebSockets"]
    },
    {
      title: "כלים ופלטפורמות",
      icon: "🛠️",
      skills: ["Git", "Docker", "VS Code", "Postman", "Linux", "AWS", "Vercel", "Chrome DevTools"]
    }
  ];

  return (
    <section className="py-20 sm:py-24 md:py-32" id="skills">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              כישורים וטכנולוגיות
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              מגוון רחב של כלים וטכנולוגיות מודרניות
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
              🚀 תמיד לומד טכנולוגיות חדשות ומתעדכן בטרנדים האחרונים בעולם הפיתוח
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "מערכת אוטומציה לבדיקות Web",
      description: "פיתוח מערכת אוטומציה מקיפה לבדיקות regression על אפליקציית web מורכבת. המערכת כוללת דוחות מפורטים, אינטגרציה עם CI/CD, והרצה מקבילית של בדיקות.",
      tags: ["Python", "Selenium", "Pytest", "Jenkins", "API Testing"],
      type: "אוטומציה",
      highlight: true
    },
    {
      title: "כלי אוטומציה לניהול נתונים",
      description: "בניית כלי אוטומציה שמעבד ומנהל כמויות גדולות של נתונים. כולל scraping של מידע, עיבוד, וסנכרון אוטומטי עם מסדי נתונים.",
      tags: ["Python", "Playwright", "PostgreSQL", "REST API"],
      type: "אוטומציה",
      highlight: true
    },
    {
      title: "פלטפורמת ניהול פרויקטים",
      description: "אפליקציית React מתקדמת לניהול פרויקטים ומשימות. ממשק משתמש אינטואיטיבי, real-time updates, ואינטגרציה עם APIs חיצוניים.",
      tags: ["React", "TypeScript", "Tailwind CSS", "REST API"],
      type: "React"
    },
    {
      title: "Dashboard אנליטי",
      description: "בניית dashboard אינטראקטיבי להצגת נתונים ומדדים. כולל גרפים דינמיים, פילטרים מתקדמים, וexport של דוחות.",
      tags: ["React", "TypeScript", "Chart.js", "API Integration"],
      type: "React"
    },
    {
      title: "בוט אוטומציה למדיה חברתית",
      description: "פיתוח בוט חכם לאוטומציה של פעילויות במדיה חברתית. כולל תזמון פוסטים, איסוף analytics, ותגובות אוטומטיות.",
      tags: ["Python", "API Integration", "Scheduling", "Database"],
      type: "אוטומציה"
    },
    {
      title: "מערכת E-commerce",
      description: "אפליקציית React מלאה לחנות אונליין. כוללת עגלת קניות, מערכת תשלומים, ניהול מלאי, ופאנל ניהול.",
      tags: ["React", "Node.js", "MongoDB", "Stripe", "Authentication"],
      type: "React"
    }
  ];

  return (
    <section className="py-20 sm:py-24 md:py-32 bg-muted/30" id="projects">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              פרויקטים נבחרים
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              דוגמאות לעבודות שביצעתי בתחום האוטומציה ופיתוח React
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <Card 
                key={index}
                className={`p-6 sm:p-8 card-hover bg-card/50 backdrop-blur-sm ${
                  project.highlight ? 'border-primary/50 border-2 shadow-glow' : 'border-2'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4">
                  {/* Project Type Badge */}
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={project.type === "אוטומציה" ? "default" : "secondary"}
                      className="font-medium"
                    >
                      {project.type}
                    </Badge>
                    {project.highlight && (
                      <Badge variant="outline" className="border-primary text-primary">
                        מומלץ ⭐
                      </Badge>
                    )}
                  </div>

                  {/* Project Title */}
                  <h3 className="text-xl sm:text-2xl font-semibold leading-tight">
                    {project.title}
                  </h3>

                  {/* Project Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex}
                        variant="outline"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      <ExternalLink className="ml-2 h-4 w-4" />
                      צפה בפרויקט
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="px-3"
                    >
                      <Github className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* More Projects CTA */}
          <div className="text-center pt-8">
            <Button size="lg" variant="outline">
              צפה בכל הפרויקטים ב-GitHub
              <Github className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;

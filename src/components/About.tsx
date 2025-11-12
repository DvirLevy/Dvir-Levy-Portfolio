import { Card } from "@/components/ui/card";
import { Code2, Workflow, Zap } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: Code2,
      title: "פיתוח React מתקדם",
      description: "יצירת ממשקי משתמש מודרניים עם React, TypeScript ו-Tailwind CSS"
    },
    {
      icon: Workflow,
      title: "אוטומציה ו-Testing",
      description: "בניית פתרונות אוטומציה חכמים עם Python, Selenium ו-Playwright"
    },
    {
      icon: Zap,
      title: "ביצועים ואיכות",
      description: "דגש על קוד נקי, יעיל ובעל ביצועים גבוהים"
    }
  ];

  return (
    <section className="py-20 sm:py-24 md:py-32 bg-muted/30" id="about">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              אודות
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              מפתח עם תשוקה לטכנולוגיה ופתרונות יעילים
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
            <div className="space-y-6 text-center md:text-right">
              <h3 className="text-2xl sm:text-3xl font-bold">רקע מקצועי</h3>
              <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                <p>
                  אני מפתח Full-Stack עם התמחות באוטומציה ופיתוח צד לקוח. 
                  מתמקד ביצירת פתרונות טכנולוגיים יעילים שמשפרים תהליכים ומייעלים עבודה.
                </p>
                <p>
                  בעל ניסיון בבניית מערכות אוטומציה מורכבות, פיתוח אפליקציות React מודרניות,
                  ואינטגרציות עם API שונים. אוהב ללמוד טכנולוגיות חדשות ולהתמודד עם אתגרים טכניים.
                </p>
                <p className="font-medium text-foreground">
                  שואף למצוינות בכל פרויקט ומחפש תמיד דרכים לשפר ולהתייעל.
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

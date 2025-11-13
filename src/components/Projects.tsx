import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import e2eAutomationImg from "@/assets/projects/e2e-automation.jpg";
import sqlAnalyticsImg from "@/assets/projects/sql-analytics.jpg";
import liveLogsImg from "@/assets/projects/live-logs.jpg";
import analyticsConfigImg from "@/assets/projects/analytics-config.jpg";
import performanceTestingImg from "@/assets/projects/performance-testing.jpg";
import pwaImg from "@/assets/projects/pwa.jpg";
import housewarmingImg from "@/assets/projects/housewarming.jpg";

const Projects = () => {
  const projects = [
    {
      title: "E2E Automation Framework",
      description: "Architected and implemented comprehensive E2E testing framework using Playwright from scratch at Jifiti. Includes project architecture, test design patterns, and best practices implementation.",
      tags: ["Playwright", "TypeScript", "CI/CD", "Test Automation"],
      type: "Automation",
      highlight: true,
      image: e2eAutomationImg,
      githubUrl: null
    },
    {
      title: "SQL Analytics Platform",
      description: "Developed a powerful SQL analytics tool at Moovit capable of rendering 100K+ data rows with support for multiple database platforms including Redshift, BigQuery, PostgreSQL, and more.",
      tags: ["SQL", "React", "Node.js", "BigQuery", "Redshift"],
      type: "Development",
      highlight: true,
      image: sqlAnalyticsImg,
      githubUrl: "https://github.com/DvirLevy/Meron"
    },
    {
      title: "Live Logs Fetching Tool",
      description: "Built a streamlined tool at Moovit for fetching and analyzing live logs from EC2 servers, significantly improving debugging efficiency and system monitoring capabilities.",
      tags: ["AWS", "Node.js", "EC2", "Monitoring"],
      type: "Development",
      image: liveLogsImg,
      githubUrl: null
    },
    {
      title: "Analytics Config Generator",
      description: "Created an automated tool at Moovit for generating analytics configurations that map client-side events to Redshift, streamlining the analytics pipeline setup process.",
      tags: ["Python", "Redshift", "Automation", "ETL"],
      type: "Automation",
      image: analyticsConfigImg,
      githubUrl: "https://github.com/DvirLevy/Meron"
    },
    {
      title: "Performance Testing Suite",
      description: "Designed and executed comprehensive performance testing at Jifiti using JMeter with Coralogix integration for Pod monitoring and trace analysis.",
      tags: ["JMeter", "Coralogix", "Performance", "Azure"],
      type: "Automation",
      highlight: true,
      image: performanceTestingImg,
      githubUrl: null
    },
    {
      title: "Progressive Web App",
      description: "Volunteered as frontend developer for Code for Israel, implementing design systems with MUI, creating responsive React components from Figma designs, and managing full development cycle.",
      tags: ["React", "Material-UI", "Vite", "PWA"],
      type: "Development",
      image: pwaImg,
      githubUrl: "https://github.com/Code-For-Israel/reuth-fe"
    },
    {
      title: "Housewarming Invitation",
      description: "Designed and developed an elegant digital invitation platform for a housewarming celebration. Features interactive RSVP functionality, responsive design, and a beautiful user experience.",
      tags: ["React", "Lovable", "UI/UX", "Frontend"],
      type: "Development",
      image: housewarmingImg,
      githubUrl: "https://github.com/DvirLevy/levys",
      liveUrl: "https://levys.lovable.app/"
    }
  ];

  return (
    <section className="py-20 sm:py-24 md:py-32 bg-muted/30" id="projects">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Projects
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Tools, frameworks, and applications I've built
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <Card 
                key={index}
                className={`overflow-hidden card-hover bg-card/50 backdrop-blur-sm ${
                  project.highlight ? 'border-primary/50 border-2 shadow-glow' : 'border-2'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  {/* Project Type Badge & Links */}
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={project.type === "Automation" ? "default" : "secondary"}
                      className="font-medium"
                    >
                      {project.type}
                    </Badge>
                    <div className="flex gap-2">
                      {project.highlight && (
                        <Badge variant="outline" className="border-primary text-primary">
                          Featured ⭐
                        </Badge>
                      )}
                    </div>
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
                    {project.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          View Code
                        </a>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button
                        variant="default"
                        size="sm"
                        asChild
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* More Projects CTA */}
          <div className="text-center pt-8">
            <Button 
              size="lg" 
              variant="outline"
              asChild
            >
              <a href="https://github.com/DvirLevy" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                View More on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;

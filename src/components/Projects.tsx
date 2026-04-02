import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";
import { AwsRouts, LambdaService } from "@/utils/lambdaService";
import PopupAutomationRunner from "./PopupAutomationRunner";


const Projects = () => {
  const [openDialg, setOpenDialg] = useState(false)
  const [repo, setRepo] = useState('')

  const [cooldown, setCooldown] = useState({
    fof: false,
    cloudDrivenAuthomation: false
  })

  const projects = [
    {
      id: "cloudDrivenAuthomation",
      title: "Cloud-Driven E2E Automation System",
      description: `Architected & Developed a Cloud-Driven E2E Automation System using Playwright and TypeScript, 
                    exposed via AWS API Gateway and Lambda to trigger GitHub Actions workflows. 
                    Each execution runs cross-browser tests, publishes Playwright reports to GitHub Pages, 
                    and sends automated email notifications — simulating a real-world CI/CD testing platform.`,
      tags: ["Playwright", "MCP", "TypeScript", "GitHub Actions", "CI/CD", "Page Object Model", "Github Pages", "Docker", "Jenkins", "Kubernetes"],
      type: "Automation",
      highlight: true,
      runAutomation: true,
      report: true,
      runBtnText: 'Run Portfolio Automation Test',
      reportUrl: 'https://dvirlevy.github.io/protofolio-automation-test/',
      imgS3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/projects/protfolio-automation-report.jpeg",
      githubUrl: "https://github.com/DvirLevy/protofolio-automation-test"
    },
    {
      id: "fof",
      title: "API Automation - Fish of Fortune Game",
      description: `Develop an automated API testing for MicroServie Backend framework.
        A Lambda-triggered workflow executes Playwright tests,
        publishes reports to GitHub Pages, and sends execution notifications.`,
      tags: ["Playwright", "TypeScript", "CI/CD", "API Automation", "Newman", "AWS-Lambda", "Kuberneties", "Node.js", "GitHub Pages"],
      type: "Automation",
      highlight: true,
      runAutomation: false,
      report: false,
      runBtnText: 'Run Fish of Fortune Automation Test',
      reportUrl: 'https://dvirlevy.github.io/whalo-api-automtation-assignment/',
      imgS3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/projects/FOF-image2.PNG",
      githubUrl: "https://github.com/DvirLevy/whalo-api-automtation-assignment",
      whaloLogo: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/projects/whalo-logo.png"
    },
    {
      id: " e2eAutomation",
      title: "E2E Automation Framework",
      description: "Architected and implemented comprehensive E2E testing framework using Playwright from scratch at Jifiti. Includes project architecture, test design patterns, and best practices implementation.",
      tags: ["Playwright", "TypeScript", "CI/CD", "Test Automation", "Azure DevOps"],
      type: "Automation",
      highlight: true,
      imgS3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/projects/e2e-automation.jpg",
      githubUrl: null
    },
    {
      id: "ec2Logger",
      title: "Live Logs Fetching Tool",
      description: "Develop a streamlined tool at Moovit for fetching and analyzing live logs from EC2 servers, significantly improving debugging efficiency and QA testing time.",
      tags: ["AWS", "Node.js", "EC2 Servers", "Monitoring", "Electron", "React", "MUI", "Vite"],
      type: "Development",
      imgS3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/projects/live-logs.jpg",
      githubUrl: "https://github.com/DvirLevy/Meron/tree/main/src/renderer/src/components/Puttier",
      linkedinPost: "https://www.linkedin.com/feed/update/urn:li:activity:7185871122930749441/"
    },
    {
      id: "sqlAnalytics",
      title: "SQL Analytics Platform",
      description: "Developed a powerful SQL analytics tool at Moovit capable of rendering 100K+ data rows with support for multiple database platforms including Redshift, BigQuery, PostgreSQL, and more.",
      tags: ["SQL", "React", "Vite", "Node.js", "Redshift", "Electron", "React", "MUI"],
      type: "Development",
      highlight: true,
      imgS3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/projects/sql-analytics.jpg",
      githubUrl: "https://github.com/DvirLevy/Meron/tree/main/src/renderer/src/components/Analytics"
    },
    {
      id: "dataFetcher",
      title: "Data Fetcher",
      description: "Develop a tool that queries the database and retrieves user-specific data based on the provided environment and user ID.",
      tags: ["JavaScript", "React", "Electorn", "Vite", "Electron", "React", "MUI"],
      type: "Development",
      imgS3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/projects/analytics-config.jpg",
      githubUrl: "https://github.com/DvirLevy/Meron/tree/main/src/renderer/src/components/UserId"
    },
    {
      id: "preformance",
      title: "Performance Testing Suite",
      description: "Designed and executed comprehensive performance testing at Jifiti using JMeter with Coralogix integration for Pod monitoring and trace analysis.",
      tags: ["JMeter", "Coralogix", "Performance", "Azure DevOps"],
      type: "Automation",
      highlight: true,
      imgS3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/projects/performance-testing.jpg",
      githubUrl: null
    },
    {
      id: "cfi",
      title: "Progressive Web App",
      description: "Volunteered as frontend developer for Code for Israel, implementing design systems with MUI, creating responsive React components from Figma designs, and managing full development cycle.",
      tags: ["React", "Material-UI", "Vite", "PWA", "Figma"],
      type: "Development",
      imgS3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/projects/pwa.jpg",
      githubUrl: "https://github.com/Code-For-Israel/reuth-fe"
    },
    {
      id: "invitation",
      title: "Housewarming Invitation",
      description: "Designed and developed an elegant digital invitation platform for a housewarming celebration. Features interactive RSVP functionality, responsive design, and a beautiful user experience.",
      tags: ["React", "Lovable", "Vite", "Frontend"],
      type: "Development",
      imgS3: "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/projects/housewarming.jpg",
      githubUrl: "https://github.com/DvirLevy/levys",
      liveUrl: "https://levys.lovable.app/"
    }
  ];

  const handleDisableBtn = (repo: string) => {
    const COOL_DOWN = 60000 * 20 // 20 minutes
    //disabling the button
    setCooldown(prev => ({
      ...prev,
      [repo]: true
    }))

    //enabling the button after 20min
    setTimeout(() => {
      setCooldown((prev) => ({
        ...prev,
        [repo]: false,
      }));
    }, COOL_DOWN);

  }

  const runAutomation = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const COOL_DOWN = 60000 * 20 // 20 minutes
    const repo = event.currentTarget.value
    setRepo(repo)
    if (cooldown[repo]) {
      alert("Cooldown active. Please wait before running the test again.");
    }
    else {
      // setOpenDialg(true)
      await LambdaService.regressionTest(repo)
    }

  }

  useEffect(() => {
    if (!sessionStorage.getItem('analyticsSent')) {
      LambdaService.DataAnalytics({
        awsRoute: AwsRouts.PORTFOLIO,
        eventName: "portfolio",
        date: new Date().toString()
      }).catch(err => console.error("Analytics error:", err))
    }
    sessionStorage.setItem('analyticsSent', 'true')
  }, [])

  return (
    <>
      <section className="py-20 sm:py-24 md:py-32 bg-muted/30" id="projects">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4 animate-fade-in">
              <h2 id="projects-title" className="text-3xl sm:text-4xl md:text-5xl font-bold">
                Projects
              </h2>
              <p id="projects-subtitle" className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Tools, frameworks, and applications I've built
              </p>
            </div>

            {/* Projects Grid */}
            <div id="project-cards" className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {projects.map((project, index) => (
                <Card
                  id={`${project.id}`}
                  key={index}
                  className={`overflow-hidden card-hover bg-card/50 backdrop-blur-sm ${project.highlight ? 'border-primary/50 border-2 shadow-glow ' : 'border-2'
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.imgS3}
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
                    <h3 className="card-title text-xl sm:text-2xl font-semibold leading-tight">
                      {project.title}
                    </h3>

                    {/* Project Description */}
                    <p className="card-description text-muted-foreground leading-relaxed">
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
                    <div className="card-link-ref flex flex-wrap gap-3 pt-4">
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
                      {project.linkedinPost && (
                        <Button
                          variant="default"
                          size="sm"
                          asChild
                        >
                          <a href={project.linkedinPost} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View my Post <Linkedin className="h-5 w-5" />
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
                      {project.runAutomation && (
                        // <div> 
                        <Button

                          value={project.id}
                          onClick={runAutomation}
                          size="sm"
                          // asChild
                          // onClick={runAutomation}
                          disabled={cooldown[project.id]}
                        >

                          {project.runBtnText}

                        </Button>
                        // </div>
                      )}
                      {project.report && (
                        <Button
                          variant="default"
                          size="sm"
                          asChild
                        >
                          <a href={project.reportUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Last Run Report
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
                <a id="gitHubLinkProj" href="https://github.com/DvirLevy" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  View More on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* {openDialg ? <PopupAutomationRunner coolDown={cooldown} repo={repo} handleDisableBtn={handleDisableBtn} /> : null} */}
    </>
  );
};

export default Projects;

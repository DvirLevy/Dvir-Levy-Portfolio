import { Card } from "@/components/ui/card"
import {
  Code2,
  Workflow,
  Zap,
  ServerCog
} from "lucide-react"

const About = () => {
  const highlights = [
    {
      icon: Zap,
      title: "AI Systems & RAG",
      description:
        "Building AI-powered systems using LangChain, OpenAI, and vector databases with semantic search and LLM integration.",
    },
    {
      icon: ServerCog,
      title: "Backend Development",
      description:
        "Designing scalable backend systems with Node.js, TypeScript, and API-driven architectures.",
    },
    {
      icon: Code2,
      title: "Full-Stack Development",
      description:
        "Building internal tools and applications using React, Vite, and Node.js for real-world production use.",
    },
    {
      icon: Workflow,
      title: "CI/CD & Cloud",
      description:
        "Working with AWS, CI/CD pipelines, and distributed systems to deploy and scale production environments.",
    },
  ]

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
              AI Software Engineer focused on building AI-driven systems, intelligent workflows, and scalable cloud-based architectures.
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
              <h3 className="text-2xl sm:text-3xl font-bold">
                Professional Background
              </h3>
              <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                {/* <p className="whitespace-pre-line">
                  <span className="font-bold">Senior Automation Engineer</span>,
                  with hands-on experience designing and developing end-to-end
                  automation frameworks and internal tools. Strong background in
                  building automation solutions that include frontend components
                  using React and TypeScript, alongside cloud-based
                  implementations on AWS. Experienced in integrating automation
                  with backend services, CI/CD pipelines, and
                  infrastructure-driven workflows in production environments.
                </p> */}

                <div className="whitespace-pre-line">
                  In my current role at
                  <span className="font-bold">
                    {" "}
                    Jifiti, as AI Software Engineer
                  </span>
                  , I work on integrating systems across APIs, databases, and CI/CD workflows, while incorporating AI capabilities such as LLM-based logic, agents, and MCP server integrations to support complex distributed environments.
                  Collaborating closely with frontend, backend, and DevOps teams, I contribute to building production-ready systems that combine automation, infrastructure, and AI-driven decision flows.
                </div>

                <div className="whitespace-pre-line">
                  Previously at{" "}
                  <span className="font-bold">
                    Moovit, as a Software Engineer
                  </span>
                  , I built full-stack internal tools using React, Node.js, and Electron, including real-time log streaming systems and data-driven applications that improved observability and engineering productivity.
                </div>

                <div className="whitespace-pre-line">
                  My time at{" "}
                  <span className="font-bold">
                    ironSource as a Software Engineer in test
                  </span>
                  , I worked with APIs, cloud services, and system-level analysis through logs and network traffic.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default About

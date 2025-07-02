'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock, FileText, HelpCircle } from 'lucide-react'

export default function CourseDetails() {
  const [openSections, setOpenSections] = useState<number[]>([])

  const syllabus = [
    {
      title: "Introduction",
      duration: "6 lessons",
      topics: [
        "About this course",
        "Introduction",
        "What is DevOps?",
        "What is Continuous Integration?",
        "What is Continuous Delivery?",
        "Quiz 1: DevOps Quiz"
      ]
    },
    {
      title: "Prerequisites Info & Setup",
      duration: "8 lessons",
      topics: [
        "Tools Prerequisite Information",
        "Chocolatey for Windows",
        "Homebrew for MacOS",
        "Installing Softwares",
        "Tools Prerequisites for Centos 9, RHEL9 & Rocky Linux",
        "Tools Prerequisites for Ubuntu 24",
        "Signups",
        "AWS Setup"
      ]
    },
    {
      title: "Python",
      duration: "21 lessons",
      topics: [
        "Introduction",
        "Python on Linux, Versions & Indentation",
        "Quotes and Comments",
        "Variables",
        "Print Format",
        "Slicing",
        "Operators",
        "Conditions",
        "Loops",
        "Break & Continue",
        "Built-in Functions or Methods",
        "Functions part-1",
        "Functions part-2",
        "Modules",
        "OS Tasks",
        "Python Fabric",
        "Exception Handling",
        "Cloud Interaction with Boto3",
        "AI for Cloud Automation",
        "Copilot AI for Cloud Automation",
        "Python Scripts"
      ]
    },
    {
      title: "Linux",
      duration: "17 lessons + 13 quizzes",
      topics: [
        "Introduction to Linux",
        "Quiz 3: Linux Intro questions",
        "Commands and File systems",
        "Quiz 4: Test Basic Command in Linux",
        "More Commands (mkdir, cp, mv, touch etc)",
        "Vim editor",
        "Quiz 5: Test vim editor",
        "File Types",
        "Quiz 6: Test File types",
        "Filters",
        "Quiz 7: Test filters command",
        "Redirections",
        "Quiz 8: Test Redirection",
        "Users and Groups",
        "Quiz 9: Test Users & Group",
        "File permissions",
        "Quiz 10: Test File Permissions",
        "Sudo",
        "Quiz 11: Sudo quiz",
        "Package Management",
        "Quiz 12: Package Management Quiz",
        "Services",
        "Quiz 13: Services Quiz",
        "Processes",
        "Quiz 14: Processes quiz",
        "Archiving",
        "Ubuntu commands",
        "Quiz 15: Linux OS Quiz",
        "Linux Commands",
        "Outro"
      ]
    },
    {
      title: "Git",
      duration: "8 lessons",
      topics: [
        "Introduction",
        "Versioning",
        "Branches & More",
        "Rollback",
        "Git Ssh Login",
        "Git Tags, Semantic Versioning & More",
        "Setup Github Copilot",
        "Git Commands"
      ]
    },
    {
      title: "Vagrant & Linux Servers",
      duration: "11 lessons + 1 quiz",
      topics: [
        "Vagrant-vms",
        "Vagrant IP, RAM & CPU",
        "Vagrant Sync Directories",
        "Provisioning",
        "Website Setup",
        "Wordpress Setup",
        "Automate Website setup",
        "Automate Wordpress Setup",
        "Copilot AI for Coding",
        "Multi VM Vagrant file",
        "Systemctl & Tomcat 10",
        "Quiz 16: IAC Quiz"
      ]
    },
    {
      title: "Variables, JSON & YAML",
      duration: "3 lessons",
      topics: [
        "Introduction",
        "Variables & Python DS",
        "JSON & YAML"
      ]
    },
    {
      title: "Vprofile Project Setup Manual & Automated",
      duration: "12 lessons + 1 quiz",
      topics: [
        "Welcome to the Project",
        "Introduction",
        "VM Setup",
        "MySQL Setup",
        "Memcache Setup",
        "RabbitMQ Setup",
        "App setup",
        "Nginx Setup",
        "Validate",
        "Automated - Introduction",
        "Automated - Code",
        "Automated - Execution",
        "Quiz 17: Vprofile Project quiz"
      ]
    },
    {
      title: "Networking",
      duration: "4 lessons + 1 quiz",
      topics: [
        "ISO",
        "Understanding Networks & IP",
        "Protocols, ports etc",
        "Networking Commands",
        "Quiz 18: Networking Quiz"
      ]
    },
    {
      title: "Introducing Containers",
      duration: "6 lessons + 3 quizzes",
      topics: [
        "What are containers",
        "Quiz 19: Container Quiz",
        "What is Docker",
        "Quiz 20: Docker Intro Quiz",
        "Hands on Docker Containers",
        "Quiz 21: Docker Quiz",
        "Vprofile Project on Containers",
        "Microservices",
        "Microservice Project"
      ]
    },
    {
      title: "Bash Scripting",
      duration: "22 lessons + 6 quizzes",
      topics: [
        "Bash Scripts",
        "Introduction",
        "VM Setup",
        "First Script",
        "Sample Script",
        "ChatGPT",
        "Variables",
        "Quiz 22: Variables Quiz",
        "Command line arguments",
        "System Variables",
        "Quiz 23: Arguments Quiz",
        "Quotes",
        "Command Substitution",
        "Quiz 24: Quote quiz",
        "Exporting Variables",
        "Quiz 25: Variable Quiz",
        "User Input",
        "Decision Making part1",
        "Decision Making part2",
        "Quiz 26: Conditions Quiz",
        "Script For Monitoring",
        "Loops",
        "Quiz 27: For loop quiz",
        "While Loops",
        "Remote Command Execution",
        "SSH Key Exchange",
        "Finale Part1",
        "Finale Part2"
      ]
    },
    {
      title: "AWS Part - 1",
      duration: "20 lessons",
      topics: [
        "What is Cloud Computing",
        "Introduction",
        "Ec2 Introduction",
        "Ec2 Quick Start",
        "More In Ec2 Part1",
        "More in Ec2 Part2",
        "AWS CLI",
        "EBS",
        "EBS Snapshots",
        "ELB Introduction",
        "ELB Hands On",
        "Cloudwatch Introduction",
        "Cloudwatch Hands On",
        "EFS",
        "Autoscaling Group Introduction",
        "Autoscaling Group Hands On",
        "S3 Introduction",
        "S3 Website Hosting",
        "More in S3",
        "RDS"
      ]
    },
    {
      title: "AWS Cloud For Project Setup | Lift & Shift",
      duration: "8 lessons",
      topics: [
        "Introduction",
        "Security Group & Keypairs",
        "EC2 Instances",
        "DNS Route 53",
        "Build and Deploy Artifacts",
        "Load Balancer & DNS",
        "Autoscaling Group",
        "Validate & Summarize"
      ]
    },
    {
      title: "Re-Architecturing Web App on AWS Cloud [PAAS & SAAS]",
      duration: "11 lessons",
      topics: [
        "Introduction",
        "Security Group And Keypairs",
        "RDS",
        "Elastic Cache",
        "Amazon MQ",
        "DB Initialization",
        "Beanstalk",
        "Update on Security Group & ELB",
        "Build & Deploy Artifact",
        "Cloud front",
        "Validate and Summarize"
      ]
    },
    {
      title: "Continuous Integration With Jenkins",
      duration: "32 lessons",
      topics: [
        "Introduction",
        "Installation",
        "Freestyle Vs Pipeline As A Code",
        "Installing tools in Jenkins",
        "First Job",
        "First Build Job",
        "Plugins, Versioning & more",
        "Disk Space Issue",
        "Flow of Continuous Integration Pipeline",
        "Steps for Continuous Integration Pipeline",
        "Jenkins, Nexus & Sonarqube Setup",
        "Plugins for CI",
        "Pipeline As A Code Introduction",
        "Code Analysis",
        "Code Analysis Demonstration",
        "Quality Gates",
        "Software Repositories Intro (Nexus)",
        "Nexus PAAC Demo",
        "Notification, Slack",
        "CI for Docker | Intro",
        "Docker PAAC Prereqs info",
        "Docker PAAC Demo",
        "Docker CICD Intro",
        "Docker CICD Code",
        "AWS ECS Setup",
        "Docker CICD Demonstration",
        "Cleanup",
        "Build Triggers Intro",
        "Build Triggers Demo",
        "Agent/Node/Slave in Jenkins",
        "Using Agent/Node/Slave",
        "Authentication & Authorization"
      ]
    },
    {
      title: "Learn Terraform",
      duration: "10 lessons",
      topics: [
        "Introduction",
        "Basics of Terraform",
        "Code Structure",
        "Code Structure Part 2",
        "Plan, Apply, Update & Destroy",
        "Variables",
        "Provisioners",
        "Outputs",
        "Backend",
        "What Next?"
      ]
    },
    {
      title: "Ansible",
      duration: "19 lessons",
      topics: [
        "Introduction",
        "Setup Ansible & Infra",
        "Inventory & Ping Module",
        "Inventory Part 2",
        "YAML & JSON",
        "Ad Hoc Commands",
        "Playbook & Modules",
        "Modules - Find, Use, Troubleshoot & Repeat",
        "Ansible Configuration",
        "Variables & Debug",
        "Group & Host Variables",
        "Fact Variables",
        "Decision Making",
        "Loops",
        "File, copy & template modules",
        "Handlers",
        "Roles",
        "Ansible for AWS",
        "Vprofile code"
      ]
    },
    {
      title: "AWS Part -2",
      duration: "18 lessons",
      topics: [
        "VPC Introduction",
        "VPC Design & Components",
        "VPC Setup Details",
        "Default VPC",
        "Create VPC",
        "Subnets",
        "Internet Gateway",
        "Route Tables",
        "NAT Gateway",
        "Bastion Host",
        "Website in VPC",
        "Peering",
        "Terraform for VPC Setup",
        "Ec2 Logs",
        "Links",
        "buildspec",
        "Links",
        "S3 policy"
      ]
    },
    {
      title: "AWS CI/CD Project",
      duration: "6 lessons",
      topics: [
        "Introduction",
        "Beanstalk",
        "RDS & App Setup on Beanstalk",
        "Code Commit",
        "Code build",
        "Build, Deploy & Code Pipeline"
      ]
    },
    {
      title: "Docker",
      duration: "22 lessons",
      topics: [
        "Introduction",
        "Docker Setup",
        "Docker commands & concepts",
        "Docker Logs",
        "Docker volumes",
        "Building images",
        "Entrypoint and CMD",
        "Docker Compose",
        "Multi Stage Dockerfile",
        "Introduction",
        "Overview of Base Image",
        "Dockerhub Setup",
        "Setup Docker Engine",
        "Dockerhub & Dockerfile References",
        "App Image Dockerfile",
        "DB Image Dockerfile",
        "Web Image Dockerfile",
        "Docker Compose",
        "Build and Run",
        "Summarize",
        "Containerizing Microservice Project",
        "Build & Run Microservice App"
      ]
    },
    {
      title: "Kubernetes",
      duration: "23 lessons",
      topics: [
        "Introduction",
        "Minikube for K8s Setup",
        "Kops for K8s Setup",
        "Objects and Documentation",
        "Kube Config",
        "Pods",
        "Namespace",
        "Different levels of Logging",
        "Service",
        "Replica Set",
        "Deployment",
        "Command and Arguments",
        "Volumes",
        "Config Map",
        "Secret",
        "Ingress",
        "Kubectl CLI & Cheatsheet",
        "Extras",
        "Helm Introduction",
        "Helm Hands On",
        "Helm with AI",
        "Lens",
        "Terraform For EKS Setup"
      ]
    },
    {
      title: "App Deployment on Kubernetes Cluster",
      duration: "14 lessons",
      topics: [
        "Introduction",
        "Architecture",
        "Source Code Overview",
        "Secret",
        "Persistent Volume for DB [PVC]",
        "MySQL App",
        "MySQL Service",
        "Memcache App & Service",
        "RabbitMQ App & Service",
        "Tomcat App & Service",
        "Ingress",
        "K8s Cluster Setup & Source Code",
        "Deploy App on K8s Cluster",
        "Summarize"
      ]
    },
    {
      title: "GitOps Project",
      duration: "9 lessons",
      topics: [
        "GitOps Introduction",
        "Project Architecture",
        "Prepare Github Repo",
        "Github Secrets",
        "Terraform Code",
        "Staging Workflow for Terraform code",
        "Main Workflow for Terraform code",
        "Workflow for Vprofile app code",
        "Docker Build & Publish",
        "Deploy to EKS",
        "Clean up",
        "Resumes"
      ]
    },
    {
      title: "Vibe Coding - SaaS Tech Stack",
      duration: "22 lessons",
      topics: [
        "Tech Stack Overview",
        "Language (TypeScript)",
        "React Overview",
        "Components Overview",
        "Props Overview",
        "State Overview",
        "Hooks Overview",
        "React events",
        "NextJS Overview",
        "NextJS Structure",
        "NextJS Routing",
        "NextJS Structure Example",
        "NextJS Default Files",
        "APIs Overview",
        "Async / Await",
        "API Endpoints",
        "API Workflow",
        "API Conclusion",
        "Common AI Errors",
        "Error States",
        "Debugging Workflow",
        "Git Overview"
      ]
    },
    {
      title: "Vibe Coding - Building Full-Stack SaaS With Cursor AI",
      duration: "31 lessons",
      topics: [
        "Git Overview",
        "Building SaaS Workflow (Cursor AI)",
        "Recipe Sharing Platform Overview",
        "Creating PRD",
        "Creating NextJS Project",
        "Creating Landing Page",
        "Setting Up Supabase",
        "Supabase Authentication Settings",
        "Creating Data Table Structure",
        "Supabase Profile Database",
        "Supabase Recipe Data Table",
        "Initial Supabase Setup",
        "Supabase API Keys",
        "Testing Supabase Connection",
        "Supabase Authentication",
        "Testing Sign Up / Login",
        "Simplifying Landing Page",
        "Setting Up Dashboard",
        "Adding Database Functionality",
        "Debugging Database",
        "Initial Profiles Functionality",
        "Implementing Recipes",
        "Recipe Detail Page",
        "Recipe Detail Functionality",
        "Implementing Search",
        "Loading States",
        "Implementing Social Features",
        "Troubleshooting Features",
        "Adding Saved Recipes",
        "Deploying App"
      ]
    }
  ]

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold mb-2">Detailed Curriculum</h2>
        <p className="text-gray-600">
          Our comprehensive 25-section program covers DevOps fundamentals, cloud technologies, containerization, automation, and modern full-stack development with AI integration.
        </p>
      </div>
      
      <div className="divide-y">
        {syllabus.map((section, index) => (
          <div key={index} className="p-6">
            <button
              onClick={() => toggleSection(index)}
              className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  Section {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {section.duration}
                  </div>
                </div>
              </div>
              {openSections.includes(index) ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {openSections.includes(index) && (
              <div className="mt-4 ml-6 pl-6 border-l-2 border-blue-100">
                <ul className="space-y-2">
                  {section.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-start space-x-2">
                      <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{topic}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-blue-700 text-sm">
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Includes: Interactive quizzes, hands-on projects, and practical assignments
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
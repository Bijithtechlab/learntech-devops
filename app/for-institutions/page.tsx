'use client'
import Link from 'next/link'
import Image from 'next/image'
import { 
  GraduationCap, 
  Brain, 
  Cloud, 
  Code, 
  Rocket, 
  CheckCircle, 
  Award, 
  Users, 
  Building2, 
  Calendar, 
  FileText, 
  ArrowRight,
  Globe,
  Briefcase,
  Shield,
  Zap
} from 'lucide-react'

export default function ForInstitutionsPage() {
  const careerRoles = [
    'AI Software Engineer',
    'Full Stack AI Developer',
    'Prompt Engineer',
    'AI Automation Engineer',
    'AI Solutions Architect',
    'AI Product Developer'
  ]

  const learningOutcomes = [
    {
      icon: Brain,
      title: 'AI-Powered Application Development',
      description: 'Building applications using LLMs (OpenAI, Claude, AWS Bedrock)'
    },
    {
      icon: Zap,
      title: 'Prompt Engineering & Structured Output',
      description: 'Techniques for real-world AI application development'
    },
    {
      icon: Code,
      title: 'RAG Systems',
      description: 'Retrieval Augmented Generation — intelligent search and Q&A systems'
    },
    {
      icon: Users,
      title: 'Multi-Agent AI Systems',
      description: 'Designing autonomous AI workflows and agent architectures'
    },
    {
      icon: Cloud,
      title: 'Cloud Computing on AWS',
      description: 'Deploying scalable, production-ready applications'
    },
    {
      icon: Rocket,
      title: 'Full-Stack Development with AI',
      description: 'React, Python, FastAPI with AI integration'
    },
    {
      icon: Shield,
      title: 'CI/CD & DevOps',
      description: 'Modern deployment practices and automation pipelines'
    },
    {
      icon: Briefcase,
      title: 'Real-World Project Delivery',
      description: 'Students build and deploy a working AI application'
    }
  ]

  const partnerBenefits = [
    {
      icon: Building2,
      title: 'On-Campus Delivery',
      description: 'Training delivered at your institution — no travel required for students'
    },
    {
      icon: Briefcase,
      title: 'Industry-Current Curriculum',
      description: 'Designed by practitioners actively building AI systems, not academics'
    },
    {
      icon: Code,
      title: 'Project-Based Learning',
      description: 'Students leave with a professional portfolio of deployed applications'
    },
    {
      icon: Award,
      title: 'Certification of Completion',
      description: 'Course completion certificates for all participants'
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Program designed to complement your academic calendar seamlessly'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Artificial Intelligence is Redefining the Future of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Software Engineering
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6 max-w-4xl mx-auto">
              The era of writing code line by line is rapidly giving way to AI-powered software development. 
              Professionals who can effectively collaborate with AI will lead the next generation of innovation.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-4xl mx-auto">
              Students who acquire expertise in AI, Large Language Models, Prompt Engineering, Cloud Computing, 
              and modern software technologies will possess the skills most sought after by global employers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#contact" 
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
              >
                Schedule a Demo Session
                <ArrowRight className="h-5 w-5" />
              </a>
              <a 
                href="#curriculum" 
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
              >
                View Curriculum
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Career Transformation Section */}
      <section className="py-10 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              The Career Transformation
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              The question is no longer whether AI will transform careers — it already has. The real advantage belongs to those who learn to harness AI today.
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 md:gap-3 items-center max-w-4xl mx-auto">
            {/* Before - Traditional Graduate */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Traditional Graduate</h3>
                  <p className="text-xs text-gray-500">Without AI & Cloud skills</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  'Junior Developer',
                  'Manual Tester',
                  'IT Support Engineer',
                  'Data Entry Operator',
                  'Basic Web Developer',
                  'Technical Support'
                ].map((role, index) => (
                  <div key={index} className="flex items-center gap-2 py-1.5 px-3 bg-gray-50 rounded-md">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <span className="text-xs text-gray-600">{role}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Salary Potential</p>
                <p className="text-base font-bold text-gray-500">Baseline</p>
              </div>
            </div>

            {/* Arrow / Transformation Indicator */}
            <div className="flex flex-col items-center justify-center">
              <div className="hidden md:flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">After Our</p>
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wide">Program</p>
              </div>
              <div className="md:hidden flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg rotate-90">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-bold text-blue-600">After Our Program</p>
              </div>
            </div>

            {/* After - AI-Ready Graduate */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">HIGH DEMAND</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">AI-Ready Graduate</h3>
                  <p className="text-xs text-blue-600">After completing our program</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  'AI Software Engineer',
                  'Full Stack AI Developer',
                  'Prompt Engineer',
                  'AI Automation Engineer',
                  'AI Solutions Architect',
                  'AI Product Developer'
                ].map((role, index) => (
                  <div key={index} className="flex items-center gap-2 py-1.5 px-3 bg-white/70 rounded-md border border-blue-100">
                    <CheckCircle className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-800">{role}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-blue-100">
                <p className="text-xs text-blue-500 uppercase tracking-wide font-medium">Salary Potential</p>
                <p className="text-base font-bold text-blue-700">Up to 4x Higher</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              AI-related job postings grew <span className="font-bold text-gray-800">3.5x in 2024</span> — the demand is only accelerating.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Industry-Aligned Training, Delivered at Your Institution
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-5">
                We deliver this industry-aligned training program directly at your institution, providing students 
                with practical, hands-on exposure to the latest AI and software technologies. Our mission is to equip them with future-ready skills that enhance employability 
                and prepare them to excel in the global technology workforce.
              </p>
              <div className="space-y-3">
                {partnerBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <benefit.icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{benefit.title}</span>
                      <span className="text-gray-500 text-sm"> — {benefit.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Program Highlights</h3>
              <div className="space-y-3">
                {[
                  'Hands-on, project-based learning methodology',
                  'Students deploy a working AI application by course end',
                  'Curriculum designed by active industry practitioners',
                  'Real-world tools: AWS, LLMs, React, Python, FastAPI',
                  'Industry-recognized certification upon completion',
                  'Flexible scheduling aligned with academic calendar'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="py-12 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3">Curriculum</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              What Students Will Learn
            </h2>
            <div className="w-14 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-3"></div>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              From foundational AI concepts to production-ready deployments — every module maps directly to industry job requirements
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningOutcomes.map((outcome, index) => {
              const colors = [
                { border: 'border-t-blue-500', bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconText: 'text-blue-600', hoverBorder: 'hover:border-blue-200' },
                { border: 'border-t-purple-500', bg: 'bg-purple-50', iconBg: 'bg-purple-100', iconText: 'text-purple-600', hoverBorder: 'hover:border-purple-200' },
                { border: 'border-t-emerald-500', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', hoverBorder: 'hover:border-emerald-200' },
                { border: 'border-t-orange-500', bg: 'bg-orange-50', iconBg: 'bg-orange-100', iconText: 'text-orange-600', hoverBorder: 'hover:border-orange-200' },
                { border: 'border-t-cyan-500', bg: 'bg-cyan-50', iconBg: 'bg-cyan-100', iconText: 'text-cyan-600', hoverBorder: 'hover:border-cyan-200' },
                { border: 'border-t-rose-500', bg: 'bg-rose-50', iconBg: 'bg-rose-100', iconText: 'text-rose-600', hoverBorder: 'hover:border-rose-200' },
                { border: 'border-t-indigo-500', bg: 'bg-indigo-50', iconBg: 'bg-indigo-100', iconText: 'text-indigo-600', hoverBorder: 'hover:border-indigo-200' },
                { border: 'border-t-amber-500', bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconText: 'text-amber-600', hoverBorder: 'hover:border-amber-200' },
              ]
              const color = colors[index % colors.length]
              const tags = ['Core', 'High Demand', 'Advanced', 'Trending', 'Essential', 'In Demand', 'Industry Standard', 'Capstone']
              return (
                <div 
                  key={index} 
                  className={`bg-white rounded-lg p-4 border border-gray-200 border-t-4 ${color.border} ${color.hoverBorder} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 ${color.iconBg} rounded-lg flex items-center justify-center`}>
                      <outcome.icon className={`h-4 w-4 ${color.iconText}`} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${color.iconText} ${color.bg} px-2 py-0.5 rounded-full`}>{tags[index]}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{outcome.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{outcome.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Lead Trainer Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Our Training Faculty
            </h2>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto">
              Our program is led by industry practitioners who are actively building AI systems for global clients — 
              not just teaching theory, but sharing real-world production experience.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Left - Photo */}
              <div className="relative rounded-xl overflow-hidden shadow-xl h-[380px]">
                <Image src="/images/bijith-trainer.jpeg" alt="Bijith Meethale Kondayattu" width={500} height={380} className="w-full h-full object-cover object-[center_40%] scale-110" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-lg font-bold text-white">Bijith Meethale Kondayattu</h3>
                  <p className="text-blue-300 text-xs font-medium">Lead Trainer — GenAI & Cloud Architecture</p>
                </div>
              </div>

              {/* Right - Bio */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1 w-6 bg-blue-600 rounded"></div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Industry Practitioner</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-5">
                  14+ years of industry experience across AI solution architecture, enterprise cloud delivery, 
                  and technical project leadership. International delivery across Asia-Pacific, North America, and Europe.
                </p>

                <div className="mb-5">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">Core Expertise</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Agentic AI',
                      'RAG Pipelines',
                      'Prompt Engineering',
                      'AWS Cloud Architecture',
                      'Full-Stack Development',
                      'LLM Integration',
                      'CI/CD',
                      'Infrastructure as Code',
                      'Project Management'
                    ].map((skill, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                    <Award className="h-3.5 w-3.5" /> PMP® | PMI-CPMAI™
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-100">
                    <Cloud className="h-3.5 w-3.5" /> AWS Certified
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-100">
                    <Globe className="h-3.5 w-3.5" /> Based in Singapore
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium border border-amber-100">
                    <CheckCircle className="h-3.5 w-3.5" /> GenAI & Agentic AI Certified
                  </span>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-blue-800 italic">
                    &ldquo;Our students don&apos;t just learn theory — they build and deploy real AI applications 
                    using the same tools and practices we use in production for global clients.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-12 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Why Partner With Us
            </h2>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto">
              A partnership designed to deliver measurable outcomes for your institution and students
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-colors">
              <Building2 className="h-7 w-7 text-blue-400 mb-3" />
              <h3 className="text-base font-bold mb-1">On-Campus Delivery</h3>
              <p className="text-xs text-gray-300">
                Training delivered at your institution. No travel logistics, no disruption to student routines.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-colors">
              <Briefcase className="h-7 w-7 text-purple-400 mb-3" />
              <h3 className="text-base font-bold mb-1">Practitioner-Designed Curriculum</h3>
              <p className="text-xs text-gray-300">
                Every module is built by engineers actively shipping AI products — not adapted from outdated textbooks.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-colors">
              <Code className="h-7 w-7 text-green-400 mb-3" />
              <h3 className="text-base font-bold mb-1">Portfolio-Ready Graduates</h3>
              <p className="text-xs text-gray-300">
                Students leave with deployed applications on their GitHub — tangible proof of capability for employers.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-colors">
              <Award className="h-7 w-7 text-yellow-400 mb-3" />
              <h3 className="text-base font-bold mb-1">Course Completion Certificate</h3>
              <p className="text-xs text-gray-300">
                Every participant receives a certificate of completion, adding credibility to their professional profile.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-colors">
              <Calendar className="h-7 w-7 text-red-400 mb-3" />
              <h3 className="text-base font-bold mb-1">Flexible Scheduling</h3>
              <p className="text-xs text-gray-300">
                Program structure adapts to your academic calendar — weekdays, weekends, or intensive bootcamp format.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-colors">
              <Rocket className="h-7 w-7 text-orange-400 mb-3" />
              <h3 className="text-base font-bold mb-1">Placement-Ready Skills</h3>
              <p className="text-xs text-gray-300">
                Curriculum directly maps to job descriptions at top tech companies — students are interview-ready on day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA Section */}
      <section id="contact" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Let&apos;s Discuss How This Program Can Benefit Your Students
            </h2>
            <p className="text-sm text-gray-600">
              We welcome the opportunity to share a detailed curriculum, arrange a demo session, 
              or answer any questions about our institutional training partnership.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Vinod Kumar */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-lg font-bold text-white">VK</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-0.5">Vinod Kumar</h3>
              <p className="text-blue-600 text-xs font-medium mb-0.5">Program Director</p>
              <p className="text-gray-500 text-[11px]">Senior Technology Training Expert</p>
              <p className="text-gray-500 text-[11px]">39+ Years in Technology Education</p>
              <p className="text-gray-500 text-[11px] mb-3">15,000+ Students Trained</p>
              <a 
                href="tel:+918438468048" 
                className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span>📞</span>
                <span className="font-medium">+91 8438468048</span>
              </a>
            </div>

            {/* Bijith */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 text-center">
              <div className="w-14 h-14 bg-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-lg font-bold text-white">BMK</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-0.5">Bijith Meethale Kondayattu</h3>
              <p className="text-purple-600 text-xs font-medium mb-0.5">Lead Trainer — GenAI & Cloud Architecture</p>
              <p className="text-gray-500 text-[11px] mb-3">PMP® | PMI-CPMAI™ | AWS Certified</p>
              <div className="space-y-1.5">
                <a href="tel:+6598872280" className="flex items-center justify-center gap-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                  <span>📞</span><span className="font-medium">(+65) 9887 2280</span>
                </a>
                <a href="https://linkedin.com/in/bijithmk" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                  <span>🔗</span><span className="font-medium">linkedin.com/in/bijithmk</span>
                </a>
                <a href="https://bijithmk.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                  <span>🌐</span><span className="font-medium">bijithmk.com</span>
                </a>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-xs">
              Email us directly at{' '}
              <a href="mailto:info@learntechlab.com" className="text-blue-600 hover:underline">
                info@learntechlab.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

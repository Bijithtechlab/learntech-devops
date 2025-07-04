export interface SyllabusItem {
  id: string
  title: string
  duration?: string
  isQuiz?: boolean
}

export interface SyllabusSection {
  id: string
  title: string
  items: SyllabusItem[]
}

export const aiDevOpsSyllabus: SyllabusSection[] = [
  {
    id: 'section-1',
    title: 'Section 1: Introduction',
    items: [
      { id: '1', title: 'About this course', duration: '2min' },
      { id: '2', title: 'Introduction', duration: '2min' },
      { id: '3', title: 'What is DevOps?', duration: '15min' },
      { id: '5', title: 'What is Continuous Integration?', duration: '8min' },
      { id: '6', title: 'What is Continuous Delivery?', duration: '5min' },
      { id: 'quiz-1', title: 'DevOps Quiz', isQuiz: true }
    ]
  },
  {
    id: 'section-2',
    title: 'Section 2: Prerequisites Info & Setup',
    items: [
      { id: '8', title: 'Tools Prerequisite Information', duration: '4min' },
      { id: '11', title: 'Installing Softwares', duration: '7min' },
      { id: '14', title: 'Signups', duration: '8min' },
      { id: '15', title: 'AWS Setup', duration: '30min' }
    ]
  },
  {
    id: 'section-3',
    title: 'Section 03: Python',
    items: [
      { id: '184', title: 'Introduction', duration: '10min' },
      { id: '185', title: 'Python on Linux, Versions & Indentation', duration: '10min' },
      { id: '186', title: 'Quotes and Comments', duration: '4min' },
      { id: '187', title: 'Variables', duration: '15min' },
      { id: '188', title: 'Print Format', duration: '5min' },
      { id: '189', title: 'Slicing', duration: '16min' },
      { id: '190', title: 'Operators', duration: '17min' },
      { id: '191', title: 'Conditions', duration: '15min' },
      { id: '192', title: 'Loops', duration: '14min' },
      { id: '193', title: 'Break & Continue', duration: '12min' },
      { id: '194', title: 'Built-in Functions or Methods', duration: '17min' },
      { id: '195', title: 'Functions part-1', duration: '17min' },
      { id: '196', title: 'Functions part-2', duration: '11min' },
      { id: '197', title: 'Modules', duration: '7min' },
      { id: '198', title: 'OS Tasks', duration: '23min' },
      { id: '199', title: 'Python Fabric', duration: '32min' },
      { id: '200', title: 'Exception Handling', duration: '10min' },
      { id: '201', title: 'Cloud Interaction with Boto3', duration: '11min' },
      { id: '202', title: 'AI for Cloud Automation', duration: '17min' },
      { id: '203', title: 'Copilot AI for Cloud Automation', duration: '14min' },
      { id: '204', title: 'Python Scripts', duration: '0min' }
    ]
  },
  {
    id: 'section-4',
    title: 'Section 04: Variables, JSON & YAML',
    items: [
      { id: '60', title: 'Introduction', duration: '2min' },
      { id: '61', title: 'Variables & Python DS', duration: '18min' },
      { id: '62', title: 'JSON & YAML', duration: '12min' }
    ]
  },
  {
    id: 'section-5',
    title: 'Section 05: Git',
    items: [
      { id: '41', title: 'Introduction', duration: '15min' },
      { id: '42', title: 'Versioning', duration: '17min' },
      { id: '43', title: 'Branches & More', duration: '12min' },
      { id: '44', title: 'Rollback', duration: '9min' },
      { id: '45', title: 'Git Ssh Login', duration: '4min' },
      { id: '46', title: 'Git Tags, Semantic Versioning & More', duration: '11min' },
      { id: '47', title: 'Setup Github Copilot', duration: '4min' },
      { id: '48', title: 'Git Commands', duration: '0min' }
    ]
  },
  {
    id: 'section-6',
    title: 'Section 06: Gitops Project',
    items: [
      { id: '317', title: 'GitOps Introduction', duration: '7min' },
      { id: '318', title: 'Project Architecture', duration: '6min' },
      { id: '319', title: 'Prepare Github Repo', duration: '8min' },
      { id: '320', title: 'Github Secrets', duration: '7min' },
      { id: '325', title: 'Docker Build & Publish', duration: '5min' },
      { id: '326', title: 'Deploy to EKS', duration: '17min' },
      { id: '327', title: 'Clean up', duration: '5min' },
      { id: '328', title: 'Resumes', duration: '6min' }
    ]
  },
  {
    id: 'section-7',
    title: 'Section 07: Introducing Containers',
    items: [
      { id: '79', title: 'What are containers', duration: '6min' },
      { id: 'quiz-19', title: 'Container Quiz', isQuiz: true },
      { id: '80', title: 'What is Docker', duration: '3min' },
      { id: 'quiz-20', title: 'Docker Intro Quiz', isQuiz: true },
      { id: '81', title: 'Hands on Docker Containers', duration: '11min' },
      { id: 'quiz-21', title: 'Docker Quiz', isQuiz: true },
      { id: '82', title: 'Vprofile Project on Containers', duration: '11min' },
      { id: '83', title: 'Microservices', duration: '8min' },
      { id: '84', title: 'Microservice Project', duration: '9min' }
    ]
  },
  {
    id: 'section-8',
    title: 'Section 08: Docker',
    items: [
      { id: '258', title: 'Introduction', duration: '19min' },
      { id: '259', title: 'Docker Setup', duration: '9min' },
      { id: '260', title: 'Docker commands & concepts', duration: '22min' },
      { id: '261', title: 'Docker Logs', duration: '8min' },
      { id: '262', title: 'Docker volumes', duration: '17min' },
      { id: '263', title: 'Building images', duration: '21min' },
      { id: '264', title: 'Entrypoint and CMD', duration: '7min' },
      { id: '265', title: 'Docker Compose', duration: '15min' },
      { id: '266', title: 'Multi Stage Dockerfile', duration: '10min' },
      { id: '267', title: 'Introduction', duration: '10min' },
      { id: '268', title: 'Overview of Base Image', duration: '9min' },
      { id: '269', title: 'Dockerhub Setup', duration: '3min' },
      { id: '270', title: 'Setup Docker Engine', duration: '6min' },
      { id: '271', title: 'Dockerhub & Dockerfile References', duration: '7min' },
      { id: '272', title: 'App Image Dockerfile', duration: '10min' },
      { id: '273', title: 'DB Image Dockerfile', duration: '7min' },
      { id: '274', title: 'Web Image Dockerfile', duration: '6min' },
      { id: '275', title: 'Docker Compose', duration: '19min' },
      { id: '276', title: 'Build and Run', duration: '11min' },
      { id: '277', title: 'Summarize', duration: '6min' },
      { id: '278', title: 'Containerizing Microservice Project', duration: '22min' },
      { id: '279', title: 'Build & Run Microservice App', duration: '12min' }
    ]
  },
  {
    id: 'section-9',
    title: 'Section 09: AWS Cloud',
    items: [
      { id: '111', title: 'What is Cloud Computing', duration: '5min' },
      { id: '112', title: 'Introduction', duration: '11min' },
      { id: '113', title: 'Ec2 Introduction', duration: '5min' },
      { id: '114', title: 'Ec2 Quick Start', duration: '24min' },
      { id: '115', title: 'More In Ec2 Part1', duration: '18min' },
      { id: '116', title: 'More in Ec2 Part2', duration: '10min' },
      { id: '117', title: 'AWS CLI', duration: '13min' },
      { id: '118', title: 'EBS', duration: '21min' },
      { id: '119', title: 'EBS Snapshots', duration: '15min' },
      { id: '120', title: 'ELB Introduction', duration: '6min' },
      { id: '121', title: 'ELB Hands On', duration: '21min' },
      { id: '122', title: 'Cloudwatch Introduction', duration: '5min' },
      { id: '123', title: 'Cloudwatch Hands On', duration: '14min' },
      { id: '124', title: 'EFS', duration: '15min' },
      { id: '125', title: 'Autoscaling Group Introduction', duration: '4min' },
      { id: '126', title: 'Autoscaling Group Hands On', duration: '19min' },
      { id: '127', title: 'S3 Introduction', duration: '22min' },
      { id: '128', title: 'S3 Website Hosting', duration: '12min' },
      { id: '129', title: 'More in S3', duration: '11min' },
      { id: '130', title: 'RDS', duration: '26min' }
    ]
  },
  {
    id: 'section-10',
    title: 'Section 10: AWS Cloud For Project Setup | Lift & Shift',
    items: [
      { id: '131', title: 'Introduction', duration: '11min' },
      { id: '132', title: 'Security Group & Keypairs', duration: '10min' },
      { id: '133', title: 'EC2 Instances', duration: '19min' },
      { id: '134', title: 'DNS Route 53', duration: '7min' },
      { id: '135', title: 'Build and Deploy Artifacts', duration: '16min' },
      { id: '136', title: 'Load Balancer & DNS', duration: '11min' },
      { id: '137', title: 'Autoscaling Group', duration: '12min' },
      { id: '138', title: 'Validate & Summarize', duration: '8min' }
    ]
  },
  {
    id: 'section-11',
    title: 'Section 11: Re-Architecturing Web App on AWS Cloud [PASS & SAAS]',
    items: [
      { id: '139', title: 'Introduction', duration: '13min' },
      { id: '140', title: 'Security Group And Keypairs', duration: '4min' },
      { id: '141', title: 'RDS', duration: '11min' },
      { id: '142', title: 'Elastic Cache', duration: '5min' },
      { id: '143', title: 'Amazon MQ', duration: '3min' },
      { id: '144', title: 'DB Initialization', duration: '6min' },
      { id: '145', title: 'Beanstalk', duration: '19min' },
      { id: '146', title: 'Update on Security Group & ELB', duration: '2min' },
      { id: '147', title: 'Build & Deploy Artifact', duration: '13min' },
      { id: '148', title: 'Cloud front', duration: '7min' },
      { id: '149', title: 'Validate and Summarize', duration: '8min' }
    ]
  },
  {
    id: 'section-12',
    title: 'Section 12: AWS CI/CD Project',
    items: [
      { id: '252', title: 'Introduction', duration: '4min' },
      { id: '253', title: 'Beanstalk', duration: '7min' },
      { id: '254', title: 'RDS & App Setup on Beanstalk', duration: '12min' },
      { id: '255', title: 'Code Commit', duration: '14min' },
      { id: '256', title: 'Code build', duration: '22min' },
      { id: '257', title: 'Build, Deploy & Code Pipeline', duration: '14min' }
    ]
  },
  {
    id: 'section-13',
    title: 'Section 13: Vibe Coding - The future Software Development - SaaS Tech Stack',
    items: [
      { id: '21', title: 'Tech Stack Overview', duration: '3min' },
      { id: '22', title: 'Language (TypeScript)', duration: '3min' },
      { id: '23', title: 'React Overview', duration: '1min' },
      { id: '24', title: 'Components Overview', duration: '7min' },
      { id: '25', title: 'Props Overview', duration: '3min' },
      { id: '26', title: 'State Overview', duration: '3min' },
      { id: '27', title: 'Hooks Overview', duration: '3min' },
      { id: '28', title: 'React events', duration: '3min' },
      { id: '29', title: 'NextJS Overview', duration: '1min' },
      { id: '30', title: 'NextJS Structure', duration: '3min' },
      { id: '31', title: 'NextJS Routing', duration: '5min' },
      { id: '32', title: 'NextJS Structure Example', duration: '3min' },
      { id: '33', title: 'NextJS Default Files', duration: '6min' },
      { id: '34', title: 'APIs Overview', duration: '4min' },
      { id: '35', title: 'Async / Await', duration: '4min' },
      { id: '36', title: 'API Endpoints', duration: '4min' },
      { id: '37', title: 'API Workflow', duration: '7min' },
      { id: '38', title: 'API Conclusion', duration: '2min' },
      { id: '39', title: 'Common AI Errors', duration: '3min' },
      { id: '40', title: 'Error States', duration: '5min' },
      { id: '41', title: 'Debugging Workflow', duration: '1min' }
    ]
  },
  {
    id: 'section-14',
    title: 'Section 14: Vibe Coding - Building Full-Stack Application with no-code',
    items: [
      { id: '44', title: 'Building SaaS Workflow (Cursor AI)', duration: '3min' },
      { id: '46', title: 'Creating PRD - Project Requirement Document', duration: '1min' },
      { id: '47', title: 'Creating NextJS Project', duration: '3min' },
      { id: '49', title: 'Creating Landing Page', duration: '4min' },
      { id: '50', title: 'Setting Up Backend', duration: '2min' },
      { id: '51', title: 'Backend Authentication Settings', duration: '5min' },
      { id: '52', title: 'Creating Data Table Structure', duration: '4min' },
      { id: '53', title: 'DynamoDB Profile Database', duration: '11min' },
      { id: '54', title: 'DynamoDBRecipe Data Table', duration: '6min' },
      { id: '55', title: 'Initial DynamoDB Setup', duration: '5min' },
      { id: '56', title: 'DynamoDB Environment Variable setup', duration: '1min' },
      { id: '57', title: 'Testing DynamoDB Connection', duration: '3min' },
      { id: '58', title: 'DynamoDB Authentication', duration: '3min' },
      { id: '59', title: 'Testing Sign Up / Login', duration: '3min' },
      { id: '60', title: 'Simplifying Landing Page', duration: '3min' },
      { id: '61', title: 'Setting Up Dashboard', duration: '3min' },
      { id: '62', title: 'Adding Database Functionality', duration: '2min' },
      { id: '63', title: 'Debugging Database', duration: '2min' },
      { id: '64', title: 'Initial Profiles Functionality', duration: '5min' },
      { id: '65', title: 'Implementing Additional functionality to the App', duration: '6min' },
      { id: '66', title: 'Implement Detail Page & functionality', duration: '4min' },
      { id: '68', title: 'Implementing Search option in the App', duration: '3min' },
      { id: '69', title: 'Loading States', duration: '5min' },
      { id: '70', title: 'Implementing Social Features, Comment, Like, Share', duration: '9min' },
      { id: '71', title: 'Troubleshooting Features', duration: '11min' },
      { id: '73a', title: 'Deploying App Using CI/CD Pipeline (IDE->Github -> AWS Amplify)', duration: '4min' },
      { id: '73b', title: 'Test the App Developed using no-code', duration: '4min' }
    ]
  }
]
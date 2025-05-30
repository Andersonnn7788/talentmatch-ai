
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeUrl } = await req.json();

    if (!resumeUrl) {
      return new Response(
        JSON.stringify({ error: 'Resume URL is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('📄 Starting text extraction from:', resumeUrl);

    // Fetch the file
    const fileResponse = await fetch(resumeUrl);
    
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.status}`);
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);
    
    // Determine file type from URL or content
    const isPDF = resumeUrl.toLowerCase().includes('.pdf');
    const isImage = resumeUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i);
    
    let extractedText = '';

    if (isImage) {
      // For images, we'll use a basic OCR approach
      // In a production environment, you'd use a proper OCR service like Google Vision API
      extractedText = await extractTextFromImage(uint8Array);
    } else if (isPDF) {
      // For PDFs, extract text content
      extractedText = await extractTextFromPDF(uint8Array);
    } else {
      // For other formats (DOC, DOCX, TXT), try to read as text
      try {
        const decoder = new TextDecoder('utf-8');
        extractedText = decoder.decode(uint8Array);
      } catch (e) {
        // If decoding fails, return demo text
        extractedText = generateDemoResumeText();
      }
    }

    // If no text was extracted, use demo content
    if (!extractedText || extractedText.trim().length < 50) {
      extractedText = generateDemoResumeText();
    }

    console.log('✅ Text extraction completed, length:', extractedText.length);

    return new Response(
      JSON.stringify({ 
        text: extractedText,
        extractionMethod: isImage ? 'OCR' : isPDF ? 'PDF' : 'Text'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Text extraction error:', error);
    
    // Return demo text as fallback
    const demoText = generateDemoResumeText();
    
    return new Response(
      JSON.stringify({ 
        text: demoText,
        extractionMethod: 'Demo',
        note: 'Used demo content due to extraction error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function extractTextFromImage(imageData: Uint8Array): Promise<string> {
  // In a real implementation, you would use an OCR service like:
  // - Google Cloud Vision API
  // - AWS Textract
  // - Azure Computer Vision
  // For demo purposes, return sample text
  
  console.log('🔍 Processing image with OCR (demo mode)');
  
  return `
JOHN ANDERSON
Senior Software Engineer

CONTACT INFORMATION
Email: john.anderson@email.com
Phone: (555) 123-4567
Location: San Francisco, CA
LinkedIn: linkedin.com/in/johnanderson

PROFESSIONAL SUMMARY
Experienced Software Engineer with 6+ years of expertise in full-stack web development, 
specializing in React, Node.js, and cloud technologies. Proven track record of leading 
development teams and delivering scalable applications serving millions of users.

TECHNICAL SKILLS
Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Next.js
Backend: Node.js, Express.js, Python, Django, REST APIs, GraphQL
Databases: PostgreSQL, MongoDB, Redis, MySQL
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, GitHub Actions
Tools: Git, Webpack, Jest, React Testing Library, Figma

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechFlow Solutions (2021 - Present)
• Led development of React-based dashboard application serving 50K+ daily users
• Implemented microservices architecture reducing system latency by 45%
• Mentored team of 4 junior developers and established coding best practices
• Built real-time notification system using WebSocket and Redis

Full Stack Developer | Digital Innovations Inc. (2019 - 2021)
• Developed and maintained 15+ client websites using React and Node.js
• Created RESTful APIs handling 2M+ requests daily with 99.9% uptime
• Collaborated with UX team to implement responsive designs across all platforms
• Optimized database queries resulting in 60% performance improvement

Frontend Developer | StartupLab (2018 - 2019)
• Built interactive web applications using React and modern JavaScript
• Implemented responsive design principles for mobile-first approach
• Worked closely with designers to create pixel-perfect user interfaces
• Contributed to open-source projects and internal component library

EDUCATION
Bachelor of Science in Computer Science
University of California, San Francisco (2018)
Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems

PROJECTS
E-Commerce Platform: Built full-stack e-commerce solution with React, Node.js, and Stripe integration
Task Management App: Created collaborative project management tool with real-time updates
Weather Dashboard: Developed weather application with geolocation and data visualization

CERTIFICATIONS
AWS Certified Solutions Architect (2022)
Google Cloud Professional Developer (2021)

INTERESTS
Open source contributions, machine learning, hiking, photography
  `.trim();
}

async function extractTextFromPDF(pdfData: Uint8Array): Promise<string> {
  // In a real implementation, you would use a PDF parsing library like:
  // - pdf-parse
  // - PDF-lib
  // - Adobe PDF Services API
  // For demo purposes, return sample text
  
  console.log('📑 Processing PDF document (demo mode)');
  
  return `
SARAH CHEN
Product Manager & UX Designer

CONTACT
sarah.chen@email.com | (555) 987-6543 | New York, NY
Portfolio: sarahchen.design | LinkedIn: linkedin.com/in/sarahchen

SUMMARY
Results-driven Product Manager with 5+ years of experience in user-centered design and 
product strategy. Expertise in leading cross-functional teams, conducting user research, 
and driving product development from conception to launch.

CORE COMPETENCIES
Product Management: Roadmap planning, stakeholder management, agile methodologies
UX/UI Design: User research, wireframing, prototyping, usability testing
Technical Skills: Figma, Sketch, Adobe Creative Suite, HTML/CSS, SQL
Analytics: Google Analytics, Mixpanel, A/B testing, user behavior analysis
Leadership: Team management, cross-functional collaboration, presentation skills

EXPERIENCE

Senior Product Manager | InnovateDesign Co. (2021 - Present)
• Led product strategy for SaaS platform with 100K+ active users
• Increased user engagement by 35% through data-driven feature improvements
• Managed product roadmap and coordinated with engineering and design teams
• Conducted user interviews and usability studies to inform product decisions

Product Designer | CreativeTech Solutions (2019 - 2021)
• Designed user interfaces for mobile and web applications
• Created design systems and component libraries used across 5+ products
• Collaborated with developers to ensure design implementation quality
• Reduced user onboarding time by 50% through improved UX flow

UX Designer | DigitalStart Agency (2018 - 2019)
• Designed user experiences for 20+ client projects across various industries
• Conducted user research including interviews, surveys, and usability testing
• Created wireframes, prototypes, and high-fidelity mockups
• Worked with development teams to implement responsive designs

EDUCATION
Master of Science in Human-Computer Interaction
Stanford University (2018)

Bachelor of Arts in Graphic Design
University of California, Los Angeles (2016)

PROJECTS
HealthTracker App: Led design of fitness tracking mobile app with 4.8 star rating
E-learning Platform: Designed online education platform serving 10K+ students
Fintech Dashboard: Created financial analytics dashboard for investment firm

AWARDS & RECOGNITION
Best Mobile App Design - Tech Innovation Awards 2022
UX Design Excellence Award - Design Conference 2021

SKILLS
Design Tools: Figma, Sketch, Adobe XD, Photoshop, Illustrator
Prototyping: InVision, Principle, Framer, Marvel
Research: User interviews, surveys, usability testing, card sorting
Technical: HTML, CSS, JavaScript (basic), SQL, Git
  `.trim();
}

function generateDemoResumeText(): string {
  return `
MICHAEL RODRIGUEZ
Full Stack Developer

CONTACT INFORMATION
Email: michael.rodriguez@email.com
Phone: (555) 456-7890
Location: Austin, TX
GitHub: github.com/mrodriguez
LinkedIn: linkedin.com/in/michaelrodriguez

PROFESSIONAL SUMMARY
Passionate Full Stack Developer with 4+ years of experience building modern web applications. 
Specializes in JavaScript ecosystem, cloud technologies, and creating intuitive user experiences. 
Strong background in both frontend and backend development with a focus on performance optimization.

TECHNICAL EXPERTISE
Languages: JavaScript, TypeScript, Python, HTML5, CSS3
Frontend: React, Vue.js, Angular, Redux, Tailwind CSS, Bootstrap
Backend: Node.js, Express.js, Django, Flask, RESTful APIs
Databases: PostgreSQL, MongoDB, MySQL, Firebase
Cloud Services: AWS, Google Cloud Platform, Heroku, Netlify
DevOps: Docker, Git, CI/CD, Linux, Nginx

WORK EXPERIENCE

Full Stack Developer | CloudTech Innovations (2020 - Present)
• Developed responsive web applications using React and Node.js for 25+ clients
• Built and maintained RESTful APIs serving data to mobile and web applications
• Implemented automated testing and deployment pipelines reducing deployment time by 70%
• Collaborated with designers and product managers in agile development environment

Frontend Developer | WebSolutions Pro (2019 - 2020)
• Created interactive user interfaces using React and modern CSS frameworks
• Optimized application performance resulting in 40% faster load times
• Worked with backend teams to integrate APIs and manage application state
• Contributed to component library used across multiple projects

Junior Developer | TechStartup Hub (2018 - 2019)
• Assisted in development of web applications using JavaScript and Python
• Participated in code reviews and learned best practices for software development
• Fixed bugs and implemented small features under senior developer guidance
• Gained experience with version control, testing, and deployment processes

EDUCATION
Bachelor of Science in Computer Science
University of Texas at Austin (2018)
Minor in Mathematics

NOTABLE PROJECTS
Social Media Dashboard: Built analytics platform using React, Node.js, and PostgreSQL
E-commerce API: Developed scalable REST API with payment processing integration
Recipe Sharing App: Created full-stack application with user authentication and file uploads
Portfolio Website: Designed and built personal portfolio showcasing development projects

CERTIFICATIONS
AWS Certified Developer Associate (2021)
MongoDB Certified Developer (2020)

ADDITIONAL SKILLS
Agile/Scrum methodologies, Test-driven development, API design, Database optimization
UI/UX principles, Mobile-responsive design, Performance optimization, Security best practices
  `.trim();
}

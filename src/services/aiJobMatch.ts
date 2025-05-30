
import { supabase } from '../integrations/supabase/client';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary?: string;
}

export interface JobMatch {
  jobId: string;
  jobTitle: string;
  company: string;
  explanation: string;
  location: string;
  salary?: string;
}

export interface ResumeAnalysis {
  summary: string;
  keySkills: string[];
  experienceLevel: string;
  careerFocus: string;
}

export interface AIJobMatchResult {
  success: boolean;
  matches?: JobMatch[];
  analysis?: ResumeAnalysis;
  error?: string;
}

export const getAIJobMatches = async (
  resumeText: string,
  jobListings: JobListing[]
): Promise<AIJobMatchResult> => {
  try {
    console.log('🤖 Starting AI job matching with resume analysis...');
    
    const { data, error } = await supabase.functions.invoke('ai-job-match', {
      body: {
        resumeText,
        jobListings
      }
    });

    if (error) {
      console.error('❌ AI job match error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get AI job matches'
      };
    }

    if (!data?.matches) {
      return {
        success: false,
        error: 'No matches returned from AI'
      };
    }

    console.log('✅ AI job matches and analysis received:', data.matches.length);
    return {
      success: true,
      matches: data.matches,
      analysis: data.analysis
    };

  } catch (error) {
    console.error('❌ AI job match service error:', error);
    return {
      success: false,
      error: 'Failed to connect to AI service'
    };
  }
};

// Generate personalized job listings based on resume
export const generatePersonalizedJobListings = (resumeText: string): JobListing[] => {
  // This would be enhanced by AI in a real implementation
  // For now, we'll return a mix of relevant jobs based on common skills
  return [
    {
      id: 'job_1',
      title: 'Senior Frontend Developer',
      company: 'TechVision Solutions',
      description: 'We are looking for an experienced frontend developer with expertise in React, TypeScript, and modern web technologies. The ideal candidate will have 5+ years of experience building scalable web applications and a passion for creating exceptional user experiences.',
      location: 'Remote',
      salary: '$120K - $140K'
    },
    {
      id: 'job_2',
      title: 'Full Stack Engineer',
      company: 'InnovateFlow Labs',
      description: 'Join our team as a full stack engineer working with React, Node.js, PostgreSQL, and AWS. We need someone who can work across the entire technology stack and contribute to product development in an agile environment.',
      location: 'San Francisco, CA (Hybrid)',
      salary: '$130K - $150K'
    },
    {
      id: 'job_3',
      title: 'UI/UX Developer',
      company: 'DesignCraft Studios',
      description: 'We are seeking a UI/UX developer with strong design sensibilities and frontend development skills. Experience with Figma, React, CSS animations, and responsive design is highly valued.',
      location: 'New York, NY (Hybrid)',
      salary: '$110K - $130K'
    },
    {
      id: 'job_4',
      title: 'Backend Engineer',
      company: 'CloudScale Systems',
      description: 'Looking for a backend engineer with experience in Node.js, Python, database design, and cloud infrastructure. Must have experience with microservices architecture and API development.',
      location: 'Remote',
      salary: '$125K - $145K'
    },
    {
      id: 'job_5',
      title: 'Product Engineer',
      company: 'NextGen Technologies',
      description: 'Seeking an experienced product engineer to lead feature development and technical strategy. Ideal candidate has full-stack experience and enjoys working closely with product and design teams.',
      location: 'Austin, TX (Hybrid)',
      salary: '$140K - $160K'
    },
    {
      id: 'job_6',
      title: 'DevOps Engineer',
      company: 'Infrastructure Pro',
      description: 'Join our DevOps team to build and maintain scalable cloud infrastructure. Experience with AWS, Docker, Kubernetes, and CI/CD pipelines required.',
      location: 'Remote',
      salary: '$135K - $155K'
    }
  ];
};

// Sample job listings for demo purposes
export const getSampleJobListings = (): JobListing[] => [
  {
    id: 'job_1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    description: 'We are looking for an experienced frontend developer with expertise in React, TypeScript, and modern web technologies. The ideal candidate will have 5+ years of experience building scalable web applications.',
    location: 'Remote',
    salary: '$120K - $140K'
  },
  {
    id: 'job_2',
    title: 'Full Stack Engineer',
    company: 'DataWorks Labs',
    description: 'Join our team as a full stack engineer working with React, Node.js, PostgreSQL, and AWS. We need someone who can work across the entire technology stack and contribute to product development.',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$130K - $150K'
  },
  {
    id: 'job_3',
    title: 'UI/UX Developer',
    company: 'Creative Solutions',
    description: 'We are seeking a UI/UX developer with strong design sensibilities and frontend development skills. Experience with Figma, React, and CSS animations is highly valued.',
    location: 'New York, NY (On-site)',
    salary: '$110K - $130K'
  },
  {
    id: 'job_4',
    title: 'Backend Engineer',
    company: 'CloudTech Systems',
    description: 'Looking for a backend engineer with experience in Node.js, Python, database design, and cloud infrastructure. Must have experience with microservices architecture.',
    location: 'Remote',
    salary: '$125K - $145K'
  },
  {
    id: 'job_5',
    title: 'Product Manager',
    company: 'InnovateLabs',
    description: 'Seeking an experienced product manager to lead product strategy and development. Ideal candidate has technical background and experience working with engineering teams.',
    location: 'Austin, TX (Hybrid)',
    salary: '$140K - $160K'
  }
];

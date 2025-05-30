
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

export interface AIJobMatchResult {
  success: boolean;
  matches?: JobMatch[];
  error?: string;
}

export const getAIJobMatches = async (
  resumeText: string,
  jobListings: JobListing[]
): Promise<AIJobMatchResult> => {
  try {
    console.log('🤖 Starting AI job matching...');
    
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

    console.log('✅ AI job matches received:', data.matches.length);
    return {
      success: true,
      matches: data.matches
    };

  } catch (error) {
    console.error('❌ AI job match service error:', error);
    return {
      success: false,
      error: 'Failed to connect to AI service'
    };
  }
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

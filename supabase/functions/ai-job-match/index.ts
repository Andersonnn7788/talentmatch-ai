
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary?: string;
}

interface JobMatch {
  jobTitle: string;
  company: string;
  explanation: string;
  jobId: string;
  location: string;
  salary?: string;
}

interface ResumeAnalysis {
  summary: string;
  keySkills: string[];
  experienceLevel: string;
  careerFocus: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobListings } = await req.json();

    if (!resumeText || !jobListings) {
      return new Response(
        JSON.stringify({ error: 'Resume text and job listings are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // First, analyze the resume
    console.log('📝 Analyzing resume...');
    const analysisPrompt = `Analyze the following resume and provide insights:

Resume:
${resumeText}

Please provide a JSON response with the following structure:
{
  "summary": "2-3 sentence summary of the candidate's profile",
  "keySkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "experienceLevel": "Junior/Mid-level/Senior/Executive",
  "careerFocus": "Brief description of their career focus area"
}

Focus on extracting the most relevant technical skills, experience level, and career direction.`;

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert resume analyzer. Always respond with valid JSON.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`OpenAI API error: ${analysisResponse.status}`);
    }

    const analysisData = await analysisResponse.json();
    let analysisResult: ResumeAnalysis;
    
    try {
      const analysisText = analysisData.choices[0].message.content;
      const cleanedText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      analysisResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Analysis parsing error:', parseError);
      // Provide fallback analysis
      analysisResult = {
        summary: "Experienced professional with a strong technical background and proven track record in software development.",
        keySkills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
        experienceLevel: "Mid-level",
        careerFocus: "Full-stack development and technology solutions"
      };
    }

    // Generate personalized job listings based on resume analysis
    const personalizedJobs = generatePersonalizedJobs(analysisResult, jobListings);

    // Format job listings for the matching prompt
    const formattedJobs = personalizedJobs.map((job: JobListing) => 
      `Job ID: ${job.id}\nTitle: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nSalary: ${job.salary}\nDescription: ${job.description}\n---`
    ).join('\n');

    // Now get job matches
    console.log('🎯 Getting job matches...');
    const matchPrompt = `You're an intelligent job match assistant.

Given the following resume, analyze the candidate's skills, experience, and interests. Recommend the 3 most suitable job opportunities from the job list provided, and explain briefly why each job is a good fit.

Resume:
${resumeText}

Available Job Listings:
${formattedJobs}

Return your response as a JSON array with exactly 3 job matches in this format:
[
  {
    "jobId": "job_id_from_listing",
    "jobTitle": "Job Title",
    "company": "Company Name",
    "explanation": "1-2 sentence explanation of why this is a good fit based on specific skills and experience from the resume"
  }
]

Focus on matching specific skills, experience level, and career progression. Be specific about why each job matches the candidate's background.`;

    const matchResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert job matching assistant. Always respond with valid JSON arrays containing exactly 3 job matches.' 
          },
          { role: 'user', content: matchPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!matchResponse.ok) {
      throw new Error(`OpenAI API error: ${matchResponse.status}`);
    }

    const matchData = await matchResponse.json();
    let aiResponse = matchData.choices[0].message.content;

    // Parse the AI response to extract JSON
    try {
      // Remove any markdown formatting if present
      aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const matches = JSON.parse(aiResponse);

      // Enhance matches with additional job details
      const enhancedMatches = matches.map((match: any) => {
        const jobDetails = personalizedJobs.find((job: JobListing) => job.id === match.jobId);
        return {
          ...match,
          location: jobDetails?.location || '',
          salary: jobDetails?.salary || ''
        };
      });

      return new Response(
        JSON.stringify({ 
          matches: enhancedMatches,
          analysis: analysisResult
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('Error in ai-job-match function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generatePersonalizedJobs(analysis: ResumeAnalysis, baseJobs: JobListing[]): JobListing[] {
  // Generate more personalized job listings based on the resume analysis
  const personalizedJobs: JobListing[] = [];
  
  // Create variations based on skills and experience level
  const { keySkills, experienceLevel, careerFocus } = analysis;
  
  // Base companies that will be customized
  const companies = [
    'TechVision Solutions', 'InnovateFlow Labs', 'DesignCraft Studios', 
    'CloudScale Systems', 'NextGen Technologies', 'Infrastructure Pro',
    'DevSpark Inc.', 'CodeCraft Labs', 'DigitalWave Technologies'
  ];
  
  // Generate jobs based on detected skills
  if (keySkills.some(skill => skill.toLowerCase().includes('react') || skill.toLowerCase().includes('frontend'))) {
    personalizedJobs.push({
      id: 'job_frontend_1',
      title: `${experienceLevel} Frontend Developer`,
      company: companies[0],
      description: `We're seeking a ${experienceLevel.toLowerCase()} frontend developer with expertise in ${keySkills.slice(0, 3).join(', ')}. Perfect for someone focused on ${careerFocus.toLowerCase()}.`,
      location: 'Remote',
      salary: experienceLevel === 'Senior' ? '$130K - $150K' : experienceLevel === 'Mid-level' ? '$100K - $120K' : '$80K - $100K'
    });
  }
  
  if (keySkills.some(skill => skill.toLowerCase().includes('node') || skill.toLowerCase().includes('backend') || skill.toLowerCase().includes('python'))) {
    personalizedJobs.push({
      id: 'job_backend_1',
      title: `${experienceLevel} Backend Engineer`,
      company: companies[1],
      description: `Looking for a ${experienceLevel.toLowerCase()} backend engineer skilled in ${keySkills.filter(s => s.toLowerCase().includes('node') || s.toLowerCase().includes('python') || s.toLowerCase().includes('sql')).slice(0, 2).join(' and ')}. Great opportunity for ${careerFocus.toLowerCase()}.`,
      location: 'San Francisco, CA (Hybrid)',
      salary: experienceLevel === 'Senior' ? '$140K - $160K' : experienceLevel === 'Mid-level' ? '$110K - $130K' : '$85K - $105K'
    });
  }
  
  // Add full-stack opportunity
  personalizedJobs.push({
    id: 'job_fullstack_1',
    title: `${experienceLevel} Full Stack Developer`,
    company: companies[2],
    description: `Full stack role combining ${keySkills.slice(0, 4).join(', ')}. Ideal for someone with ${analysis.summary.toLowerCase()} looking to grow in ${careerFocus.toLowerCase()}.`,
    location: 'New York, NY (Hybrid)',
    salary: experienceLevel === 'Senior' ? '$135K - $155K' : experienceLevel === 'Mid-level' ? '$105K - $125K' : '$82K - $102K'
  });
  
  // Fill remaining slots with base jobs or variations
  const remainingSlots = 6 - personalizedJobs.length;
  for (let i = 0; i < remainingSlots && i < baseJobs.length; i++) {
    personalizedJobs.push({
      ...baseJobs[i],
      company: companies[personalizedJobs.length % companies.length]
    });
  }
  
  return personalizedJobs;
}

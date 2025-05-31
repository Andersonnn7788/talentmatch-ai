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

    console.log('📝 Analyzing resume text, length:', resumeText.length);
    console.log('📄 Resume preview:', resumeText.substring(0, 300) + '...');

    // Validate that we have actual resume content
    if (resumeText.length < 100) {
      return new Response(
        JSON.stringify({ error: 'Resume text is too short for meaningful analysis' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if the text looks meaningful (has proper words and structure)
    const words = resumeText.toLowerCase().split(/\s+/);
    const commonResumeWords = ['experience', 'skills', 'education', 'work', 'developed', 'managed', 'led', 'created', 'implemented', 'engineer', 'developer', 'manager', 'analyst', 'university', 'bachelor', 'master', 'years', 'team', 'project', 'software', 'technology', 'programming', 'javascript', 'python', 'react', 'node'];
    
    const resumeWordCount = words.filter(word => commonResumeWords.includes(word.toLowerCase())).length;
    const resumeWordRatio = resumeWordCount / Math.min(words.length, 100); // Check first 100 words
    
    console.log('📊 Resume analysis - Word count:', words.length, 'Resume words found:', resumeWordCount, 'Ratio:', resumeWordRatio);
    
    if (resumeWordRatio < 0.05 && words.length > 50) {
      console.log('⚠️ Resume text appears to lack professional content');
      return new Response(
        JSON.stringify({ error: 'Resume text does not appear to contain professional content. Please ensure the file was extracted correctly.' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const analysisPrompt = `Analyze the following resume text and provide detailed insights about this candidate:

RESUME TEXT:
${resumeText}

Based on the actual content above, please provide a JSON response with the following structure:
{
  "summary": "2-3 sentence professional summary of this specific candidate based on their actual resume content",
  "keySkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "experienceLevel": "Junior/Mid-level/Senior/Executive",
  "careerFocus": "Brief description of their specific career focus based on their actual experience"
}

IMPORTANT: 
- Analyze ONLY the actual resume text provided above
- Extract real skills, experience, and background from this specific person's resume
- Do not use placeholder or generic content
- Base the experience level on years of experience and job titles mentioned
- If you cannot determine something clearly from the resume, use reasonable inference based on the content provided`;

    console.log('🤖 Sending resume to GPT-4o-mini for analysis...');

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
            content: 'You are an expert resume analyzer. Analyze the ACTUAL resume content provided and give specific insights about this particular candidate. Always respond with valid JSON. Focus on real content extracted from the resume.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!analysisResponse.ok) {
      console.error('OpenAI analysis API error:', analysisResponse.status);
      throw new Error(`OpenAI API error: ${analysisResponse.status}`);
    }

    const analysisData = await analysisResponse.json();
    let analysisResult: ResumeAnalysis;
    
    try {
      const analysisText = analysisData.choices[0].message.content;
      console.log('🤖 Raw AI analysis response:', analysisText);
      const cleanedText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      analysisResult = JSON.parse(cleanedText);
      
      console.log('✅ Parsed analysis result:', analysisResult);
      
      // Validate analysis result
      if (!analysisResult.summary || !analysisResult.experienceLevel || !analysisResult.careerFocus) {
        throw new Error('Incomplete analysis result');
      }
      
    } catch (parseError) {
      console.error('Analysis parsing error:', parseError);
      throw new Error('Failed to parse AI analysis response');
    }

    // Generate personalized job listings based on the actual resume analysis
    const personalizedJobs = generatePersonalizedJobs(analysisResult, jobListings);

    // Format job listings for the matching prompt
    const formattedJobs = personalizedJobs.map((job: JobListing) => 
      `Job ID: ${job.id}\nTitle: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nSalary: ${job.salary}\nDescription: ${job.description}\n---`
    ).join('\n');

    console.log('🎯 Getting job matches based on actual resume analysis...');
    
    const matchPrompt = `Based on the following ACTUAL resume analysis, recommend the 3 most suitable jobs from the available listings:

RESUME ANALYSIS:
- Summary: ${analysisResult.summary}
- Key Skills: ${analysisResult.keySkills.join(', ')}
- Experience Level: ${analysisResult.experienceLevel}
- Career Focus: ${analysisResult.careerFocus}

Available Job Listings:
${formattedJobs}

Return exactly 3 job matches as a JSON array, selecting the most relevant jobs from the listings:
[
  {
    "jobId": "job_id_from_listing",
    "jobTitle": "Job Title",
    "company": "Company Name",
    "explanation": "1-2 sentence explanation based on specific skills and experience from this candidate's resume and why this job is a good match"
  }
]

Base recommendations on the candidate's actual skills (${analysisResult.keySkills.join(', ')}) and experience level (${analysisResult.experienceLevel}).`;

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
            content: 'You are an expert job matching assistant. Match candidates to jobs based on their ACTUAL resume content and skills. Always respond with valid JSON arrays containing exactly 3 job matches from the provided listings.' 
          },
          { role: 'user', content: matchPrompt }
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!matchResponse.ok) {
      console.error('OpenAI matching API error:', matchResponse.status);
      throw new Error(`OpenAI API error: ${matchResponse.status}`);
    }

    const matchData = await matchResponse.json();
    let aiResponse = matchData.choices[0].message.content;

    console.log('🤖 Raw job matching response:', aiResponse);

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

      console.log('✅ Final enhanced matches:', enhancedMatches);

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

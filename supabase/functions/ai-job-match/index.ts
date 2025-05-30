
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

    // Format job listings for the prompt
    const formattedJobs = jobListings.map((job: JobListing) => 
      `Job ID: ${job.id}\nTitle: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nDescription: ${job.description}\n---`
    ).join('\n');

    const prompt = `You're an intelligent job match assistant.

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
    "explanation": "1-2 sentence explanation of why this is a good fit"
  }
]

Focus on matching skills, experience level, and career progression. Be specific about why each job matches the candidate's background.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;

    // Parse the AI response to extract JSON
    try {
      // Remove any markdown formatting if present
      aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const matches = JSON.parse(aiResponse);

      // Enhance matches with additional job details
      const enhancedMatches = matches.map((match: any) => {
        const jobDetails = jobListings.find((job: JobListing) => job.id === match.jobId);
        return {
          ...match,
          location: jobDetails?.location || '',
          salary: jobDetails?.salary || ''
        };
      });

      return new Response(
        JSON.stringify({ matches: enhancedMatches }),
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

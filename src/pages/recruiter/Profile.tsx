
import React from 'react';
import Navbar from '@/components/Navbar';
import ProfileSection from '@/components/ProfileSection';
import { Button } from "@/components/ui/button";
import { PencilLine } from 'lucide-react';

// Sample profile data for demo
const sampleRecruiterProfile = {
  name: 'Jessica Taylor',
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
  location: 'New York, NY',
  about: 'Senior Technical Recruiter with 7+ years of experience in talent acquisition for tech companies. Specialized in recruiting software engineers, data scientists, and product managers for startups and enterprise companies.',
  experience: [
    {
      title: 'Senior Technical Recruiter',
      company: 'TechHire Solutions',
      duration: '2019 - Present',
      description: 'Lead technical recruitment for multiple high-growth tech companies, managing the full recruitment lifecycle and maintaining a pipeline of qualified candidates.'
    },
    {
      title: 'Technical Recruiter',
      company: 'Talent Acquisition Inc.',
      duration: '2016 - 2019',
      description: 'Recruited software engineers and product managers for various tech companies in the Bay Area.'
    },
    {
      title: 'Recruiting Coordinator',
      company: 'RecruitCo',
      duration: '2014 - 2016',
      description: 'Coordinated interviews and managed the recruitment process for tech positions.'
    }
  ],
  skills: [
    'Technical Recruiting', 'Talent Acquisition', 'Candidate Sourcing', 
    'Interview Coordination', 'ATS Management', 'Employer Branding',
    'Diversity & Inclusion', 'Compensation Negotiation', 'Recruitment Marketing'
  ],
  achievements: [
    'Reduced average time-to-hire by 35% through optimized recruitment processes',
    'Achieved 92% retention rate for placed candidates after one year',
    'Implemented diversity recruiting initiatives that increased diversity hires by 40%',
    'Developed and led a mentorship program for junior recruiters'
  ]
};

const RecruiterProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="recruiter" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold animate-fade-in">My Profile</h1>
            <Button variant="outline" className="flex items-center gap-2 animate-fade-in">
              <PencilLine size={16} />
              Edit Profile
            </Button>
          </div>
          
          <ProfileSection profile={sampleRecruiterProfile} type="recruiter" />
        </div>
      </main>
    </div>
  );
};

export default RecruiterProfile;

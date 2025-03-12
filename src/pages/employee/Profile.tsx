
import React from 'react';
import Navbar from '@/components/Navbar';
import ProfileSection from '@/components/ProfileSection';
import { Button } from "@/components/ui/button";
import { PencilLine } from 'lucide-react';

// Sample profile data for demo
const sampleProfile = {
  name: 'Alex Johnson',
  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
  location: 'San Francisco, CA',
  degree: 'B.S. Computer Science',
  university: 'Stanford University',
  graduationYear: '2018',
  about: 'Passionate frontend developer with 5+ years of experience building beautiful, responsive, and accessible web applications. Specialized in React and modern JavaScript frameworks with a focus on creating intuitive user experiences.',
  experience: [
    {
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      duration: '2020 - Present',
      description: 'Lead frontend development for multiple products, implementing modern React architectures and optimizing performance.'
    },
    {
      title: 'Frontend Developer',
      company: 'WebDesign Studio',
      duration: '2018 - 2020',
      description: 'Developed responsive web applications using React, Redux, and modern CSS frameworks.'
    },
    {
      title: 'Web Development Intern',
      company: 'StartupX',
      duration: 'Summer 2017',
      description: 'Assisted in frontend development tasks and learned modern web development practices.'
    }
  ],
  skills: [
    'JavaScript', 'TypeScript', 'React', 'Redux', 'CSS/SASS', 'HTML5', 
    'Responsive Design', 'Git', 'Agile Methodology', 'UI/UX', 'Performance Optimization'
  ],
  achievements: [
    'Led development of a React component library that reduced development time by 40%',
    'Improved application performance by 60% through code splitting and lazy loading',
    'Speaker at React Conference 2022',
    'Published multiple articles on modern frontend development practices'
  ]
};

const EmployeeProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="employee" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold animate-fade-in">My Profile</h1>
            <Button variant="outline" className="flex items-center gap-2 animate-fade-in">
              <PencilLine size={16} />
              Edit Profile
            </Button>
          </div>
          
          <ProfileSection profile={sampleProfile} type="employee" />
        </div>
      </main>
    </div>
  );
};

export default EmployeeProfile;

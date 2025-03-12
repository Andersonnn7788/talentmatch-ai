
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import CandidateCard from '@/components/CandidateCard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Users, BarChart, Clock, PlusCircle } from 'lucide-react';

// Sample candidate data for demo
const sampleCandidates = [
  {
    id: '1',
    name: 'Sarah Chen',
    matchScore: 95,
    university: 'MIT',
    degree: 'M.S. Computer Science',
    experience: ['Senior Developer at TechX', '5 years experience'],
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Machine Learning'],
    status: 'new' as const,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    matchScore: 88,
    university: 'Stanford',
    degree: 'B.S. Data Science',
    experience: ['Data Analyst at DataWorks', '3 years experience'],
    skills: ['SQL', 'Python', 'Tableau', 'R', 'Statistics'],
    status: 'new' as const,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
  },
  {
    id: '3',
    name: 'Emily Johnson',
    matchScore: 82,
    university: 'UCLA',
    degree: 'B.A. Graphic Design',
    experience: ['UI Designer at DesignHub', '4 years experience'],
    skills: ['Figma', 'Adobe XD', 'Sketch', 'UI/UX', 'Prototyping'],
    status: 'reviewed' as const,
  },
];

const RecruiterHome = () => {
  const [candidateMatches, setCandidateMatches] = useState(sampleCandidates);
  
  const metrics = [
    { title: 'Candidates Screened', value: '125', icon: Users, color: 'bg-primary/10 text-primary' },
    { title: 'Open Positions', value: '8', icon: BarChart, color: 'bg-purple-100 text-purple-600' },
    { title: 'Time Saved', value: '45h', icon: Clock, color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="recruiter" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 animate-fade-in">Recruiter Dashboard</h1>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
                Manage your recruitment process and view candidate matches
              </p>
            </div>
            
            <Button className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <PlusCircle size={16} />
              <span>Upload Job</span>
            </Button>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6 flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 ${metric.color}`}>
                    <metric.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <h3 className="text-2xl font-bold">{metric.value}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Top Candidate Matches */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                Top Candidate Matches
              </h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {candidateMatches.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterHome;

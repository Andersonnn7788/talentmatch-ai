import React from 'react';
import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BarChart3, BriefcaseBusiness, Calendar, ListChecks, Sparkles, Users, TrendingUp, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAIJobMatches, generatePersonalizedJobListings, JobListing, JobMatch } from '@/services/aiJobMatch';
import PricingPlans from '@/components/PricingPlans';

const EmployeeHome = () => {
  const { user } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [analysisSummary, setAnalysisSummary] = useState('');

  useEffect(() => {
    // Simulate fetching user's resume text and job preferences
    // In a real app, this would come from an API or database
    const fetchResumeAndJobs = async () => {
      // Simulate fetching resume text
      const sampleResumeText = `
        Alex Johnson
        Frontend Developer with 5+ years of experience in React, TypeScript, and JavaScript.
        Passionate about building scalable and maintainable web applications.
      `;
      setResumeText(sampleResumeText);

      // Generate personalized job listings based on resume
      const generatedJobs = generatePersonalizedJobListings(sampleResumeText);
      setJobListings(generatedJobs);
    };

    fetchResumeAndJobs();
  }, []);

  // Trigger AI job matching when resume text and job listings are available
  useEffect(() => {
    if (resumeText && jobListings.length > 0) {
      const performAIJobMatch = async () => {
        const aiMatchResult = await getAIJobMatches(resumeText, jobListings);
        if (aiMatchResult.success) {
          setJobMatches(aiMatchResult.matches || []);
          setAnalysisSummary(aiMatchResult.analysis?.summary || 'AI analysis complete.');
        } else {
          console.error('AI Job Match Error:', aiMatchResult.error);
          setAnalysisSummary('Error fetching AI job matches.');
        }
      };
      performAIJobMatch();
    }
  }, [resumeText, jobListings]);

  // Sample data for AI matching visualization
  const matchingData = [
    { name: 'Skills Match', match: 92 },
    { name: 'Experience', match: 85 },
    { name: 'Culture Fit', match: 78 },
    { name: 'Job Type', match: 88 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar userType="employee" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Welcome back, Alex
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Explore personalized job matches and AI-driven career insights
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" className="gap-2 h-11 px-6">
                <Link to="/employee/job-matches">
                  <BriefcaseBusiness size={18} />
                  View Job Matches
                  <ArrowUpRight size={16} />
                </Link>
              </Button>
              <Button asChild className="gap-2 h-11 px-6 bg-blue-600 hover:bg-blue-700">
                <Link to="/employee/profile">
                  <Users size={18} />
                  Update Profile
                  <ArrowUpRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Resume Analysis Section */}
        <section className="mb-12">
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-slate-900">AI Resume Analysis</CardTitle>
                    <CardDescription className="text-slate-600 mt-1">
                      Get insights into your resume and personalized job matches
                    </CardDescription>
                  </div>
                </div>
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/employee/profile">
                    Improve Resume
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Job Match Analysis</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={matchingData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Bar dataKey="match" fill="#2563eb" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">AI Analysis Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                      <div>
                        <p className="text-sm text-slate-600 mt-1">{analysisSummary}</p>
                      </div>
                    </div>
                    <div className="flex justify-center mt-6">
                      <Button variant="outline" asChild className="gap-2">
                        <Link to="/employee/job-matches">
                          <Award size={16} />
                          See AI-Ranked Jobs
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              title: "Job Matches",
              value: jobMatches.length.toString(),
              change: "↑ 12 new",
              period: "this week",
              icon: BriefcaseBusiness,
              color: "blue"
            },
            {
              title: "Applications Sent",
              value: "28",
              change: "↑ 8 new",
              period: "this month",
              icon: ListChecks,
              color: "green"
            },
            {
              title: "Interviews",
              value: "4",
              change: "↑ 1 new",
              period: "scheduled",
              icon: Calendar,
              color: "purple"
            },
            {
              title: "Profile Views",
              value: "65",
              change: "↓ 5%",
              period: "last week",
              icon: Users,
              color: "orange"
            }
          ].map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-emerald-600 font-medium">{stat.change}</span> {stat.period}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* AI Assistant and Job Matches */}
        <section className="mb-12">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">AI Job Matches</CardTitle>
                  <CardDescription>Top jobs matched to your resume</CardDescription>
                </div>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobMatches.map((job, index) => (
                  <div key={index} className="flex items-center p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-semibold mr-4 shrink-0">
                      {job.company.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900">{job.jobTitle}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-1">
                        <span className="text-slate-600">{job.company}</span>
                        <span className="text-slate-500">{job.location}</span>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 bg-green-100 text-green-700`}>
                        {job.salary}
                      </span>
                    </div>
                    <div className="flex flex-col items-end ml-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Sparkles size={14} className="text-amber-500" />
                        <span className="font-semibold text-sm text-slate-900">95% Match</span>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 px-3">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 h-11" asChild>
                <Link to="/employee/job-matches">View all matches</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Add Pricing Plans Section */}
        <PricingPlans />
      </main>
      
      {/* Add the AI Assistant */}
      <AIAssistant userType="employee" userName="Alex" />
    </div>
  );
};

export default EmployeeHome;

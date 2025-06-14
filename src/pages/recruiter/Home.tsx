
import React from 'react';
import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BarChart3, BriefcaseBusiness, Calendar, ListChecks, Sparkles, Users, TrendingUp, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const RecruiterHome = () => {
  // Sample data for AI matching visualization
  const matchingData = [
    { name: 'Technical Skills', match: 92 },
    { name: 'Experience', match: 85 },
    { name: 'Education', match: 78 },
    { name: 'Soft Skills', match: 88 },
    { name: 'Culture Fit', match: 90 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar userType="recruiter" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Welcome back, Rebecca
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Here's an overview of your recruitment pipeline and AI-powered insights
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" className="gap-2 h-11 px-6">
                <Link to="/recruiter/candidates">
                  <Users size={18} />
                  View Candidates
                  <ArrowUpRight size={16} />
                </Link>
              </Button>
              <Button asChild className="gap-2 h-11 px-6 bg-blue-600 hover:bg-blue-700">
                <Link to="/recruiter/interviews">
                  <Calendar size={18} />
                  Schedule Interviews
                  <ArrowUpRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* AI Resume Screening Highlight */}
        <section className="mb-12">
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-slate-900">AI Resume Screening</CardTitle>
                    <CardDescription className="text-slate-600 mt-1">
                      Advanced AI analysis of candidate resumes with intelligent matching
                    </CardDescription>
                  </div>
                </div>
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/recruiter/candidates">
                    View All Candidates
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Candidate Match Analysis</h3>
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
                  <h3 className="text-lg font-semibold text-slate-900">How AI Screening Works</h3>
                  <div className="space-y-4">
                    {[
                      {
                        step: "1",
                        title: "Resume Analysis",
                        description: "AI extracts key information from resumes including skills, experience, and education"
                      },
                      {
                        step: "2", 
                        title: "Job Matching",
                        description: "Algorithms compare candidate qualifications against job requirements"
                      },
                      {
                        step: "3",
                        title: "Percentage Scoring", 
                        description: "Candidates receive match scores across multiple criteria for quick assessment"
                      }
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                        <div className="rounded-full bg-blue-100 p-2 mt-0.5 min-w-[32px] h-8 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">{item.step}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{item.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-center mt-6">
                      <Button variant="outline" asChild className="gap-2">
                        <Link to="/recruiter/candidates">
                          <Award size={16} />
                          See AI-Ranked Candidates
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
              title: "Active Positions",
              value: "8",
              change: "↑ 2 new",
              period: "this month",
              icon: BriefcaseBusiness,
              color: "blue"
            },
            {
              title: "Candidates",
              value: "142", 
              change: "↑ 28 new",
              period: "this week",
              icon: Users,
              color: "green"
            },
            {
              title: "Interviews",
              value: "12",
              change: "↑ 5 new", 
              period: "scheduled",
              icon: Calendar,
              color: "purple"
            },
            {
              title: "Time-to-Fill",
              value: "18d",
              change: "↓ 12%",
              period: "improvement", 
              icon: Clock,
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

        {/* Top Candidates and Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Candidates */}
          <section className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Top Candidates</CardTitle>
                    <CardDescription>AI-ranked candidates for open positions</CardDescription>
                  </div>
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Alex Johnson",
                      position: "Senior Front-End Developer",
                      match: 96,
                      experience: "8 years",
                      status: "Interview scheduled",
                      statusColor: "bg-green-100 text-green-700"
                    },
                    {
                      name: "Morgan Smith",
                      position: "Full Stack Engineer",
                      match: 92,
                      experience: "6 years",
                      status: "Assessment completed",
                      statusColor: "bg-blue-100 text-blue-700"
                    },
                    {
                      name: "Jamie Wilson",
                      position: "UI/UX Developer",
                      match: 88,
                      experience: "5 years",
                      status: "Application received",
                      statusColor: "bg-gray-100 text-gray-700"
                    }
                  ].map((candidate, index) => (
                    <div key={index} className="flex items-center p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-semibold mr-4 shrink-0">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900">{candidate.name}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-1">
                          <span className="text-slate-600">{candidate.position}</span>
                          <span className="text-slate-500">{candidate.experience} exp.</span>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${candidate.statusColor}`}>
                          {candidate.status}
                        </span>
                      </div>
                      <div className="flex flex-col items-end ml-4">
                        <div className="flex items-center gap-1 mb-2">
                          <Sparkles size={14} className="text-amber-500" />
                          <span className="font-semibold text-sm text-slate-900">{candidate.match}% Match</span>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 px-3">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-6 h-11" asChild>
                  <Link to="/recruiter/candidates">View all candidates</Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Pending Tasks */}
          <section>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Pending Tasks</CardTitle>
                <CardDescription>Action items that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: Users,
                      title: "Review Applications",
                      description: "12 new applications to review",
                      action: "Review Now",
                      link: "/recruiter/candidates",
                      urgent: true
                    },
                    {
                      icon: Calendar,
                      title: "Schedule Interviews", 
                      description: "5 candidates awaiting interviews",
                      action: "Schedule",
                      link: "/recruiter/interviews",
                      urgent: false
                    },
                    {
                      icon: ListChecks,
                      title: "Update Job Description",
                      description: "Front-End Developer position",
                      action: "Update",
                      link: "#",
                      urgent: false
                    }
                  ].map((task, index) => (
                    <div key={index} className="flex items-start p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-4 shrink-0 ${
                        task.urgent ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <task.icon size={20} className={task.urgent ? 'text-red-600' : 'text-blue-600'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900">{task.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                        <Button 
                          size="sm" 
                          variant={task.urgent ? "default" : "outline"} 
                          className="mt-3 h-8" 
                          asChild={task.link !== "#"}
                        >
                          {task.link !== "#" ? (
                            <Link to={task.link}>{task.action}</Link>
                          ) : (
                            <span>{task.action}</span>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      
      {/* Add the AI Assistant */}
      <AIAssistant userType="recruiter" userName="Rebecca" />
    </div>
  );
};

export default RecruiterHome;

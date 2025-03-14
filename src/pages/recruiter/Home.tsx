
import React from 'react';
import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BarChart3, BriefcaseBusiness, Calendar, ListChecks, Sparkles, Users } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <Navbar userType="recruiter" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, Rebecca</h1>
              <p className="text-muted-foreground text-lg">Here's an overview of your recruitment pipeline</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="gap-1">
                <Link to="/recruiter/candidates">
                  View candidates <ArrowUpRight size={16} />
                </Link>
              </Button>
              <Button asChild className="gap-1">
                <Link to="/recruiter/interviews">
                  Schedule interviews <ArrowUpRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* AI Resume Screening Highlight */}
        <section className="mb-10">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> 
                  AI Resume Screening
                </CardTitle>
                <Button asChild size="sm">
                  <Link to="/recruiter/candidates">
                    View All Candidates
                  </Link>
                </Button>
              </div>
              <CardDescription>
                Our AI has analyzed all candidate resumes and matched them to your open positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium mb-3">Candidate Match Analysis</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={matchingData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Bar dataKey="match" fill="#3498db" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium mb-3">How AI Screening Works</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                        <span className="text-primary font-medium">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Resume Analysis</h4>
                        <p className="text-sm text-muted-foreground">AI extracts key information from resumes including skills, experience, and education</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                        <span className="text-primary font-medium">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Job Matching</h4>
                        <p className="text-sm text-muted-foreground">Algorithms compare candidate qualifications against job requirements</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                        <span className="text-primary font-medium">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Percentage Scoring</h4>
                        <p className="text-sm text-muted-foreground">Candidates receive match scores across multiple criteria for quick assessment</p>
                      </div>
                    </div>
                    <div className="flex justify-center mt-3">
                      <Button variant="outline" asChild>
                        <Link to="/recruiter/candidates">
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
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Positions</CardTitle>
              <BriefcaseBusiness className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-medium">↑ 2 new</span> this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Candidates</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-medium">↑ 28 new</span> this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-medium">↑ 5 new</span> scheduled
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Time-to-Fill</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18d</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-medium">↓ 12%</span> improvement
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Top Candidates and Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Candidates */}
          <section className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Candidates</CardTitle>
                <CardDescription>AI-ranked candidates for open positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Alex Johnson",
                      position: "Senior Front-End Developer",
                      match: 96,
                      experience: "8 years",
                      status: "Interview scheduled"
                    },
                    {
                      name: "Morgan Smith",
                      position: "Full Stack Engineer",
                      match: 92,
                      experience: "6 years",
                      status: "Assessment completed"
                    },
                    {
                      name: "Jamie Wilson",
                      position: "UI/UX Developer",
                      match: 88,
                      experience: "5 years",
                      status: "Application received"
                    }
                  ].map((candidate, index) => (
                    <div key={index} className="flex items-start p-3 rounded-lg border">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 shrink-0">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="grid gap-1">
                        <h3 className="font-semibold">{candidate.name}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          <span className="text-muted-foreground">{candidate.position}</span>
                          <span className="text-muted-foreground">{candidate.experience} exp.</span>
                          <span className="text-muted-foreground">{candidate.status}</span>
                        </div>
                      </div>
                      <div className="ml-auto pl-4 flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <Sparkles size={14} className="text-amber-500" />
                          <span className="font-medium text-sm">{candidate.match}% Match</span>
                        </div>
                        <Button size="sm" variant="ghost" className="mt-2 h-8">View Profile</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/recruiter/candidates">View all candidates</Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Upcoming Tasks */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Action items that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start p-3 rounded-lg border">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 shrink-0">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Review Applications</h3>
                      <p className="text-sm text-muted-foreground">12 new applications to review</p>
                      <Button size="sm" variant="outline" className="mt-2 h-8" asChild>
                        <Link to="/recruiter/candidates">Review Now</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start p-3 rounded-lg border">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Schedule Interviews</h3>
                      <p className="text-sm text-muted-foreground">5 candidates awaiting interviews</p>
                      <Button size="sm" variant="outline" className="mt-2 h-8" asChild>
                        <Link to="/recruiter/interviews">Schedule</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start p-3 rounded-lg border">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 shrink-0">
                      <ListChecks size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Update Job Description</h3>
                      <p className="text-sm text-muted-foreground">Front-End Developer position</p>
                      <Button size="sm" variant="outline" className="mt-2 h-8">Update</Button>
                    </div>
                  </div>
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

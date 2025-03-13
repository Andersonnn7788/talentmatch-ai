
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import CandidateCard from '@/components/CandidateCard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, Users, BarChart, Clock, PlusCircle, Sparkles, Brain } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeInsightTab, setActiveInsightTab] = useState("skills");
  
  const metrics = [
    { title: 'Candidates Screened', value: '125', icon: Users, color: 'bg-primary/10 text-primary' },
    { title: 'Open Positions', value: '8', icon: BarChart, color: 'bg-purple-100 text-purple-600' },
    { title: 'Time Saved', value: '45h', icon: Clock, color: 'bg-green-100 text-green-600' },
  ];
  
  const handleGenerateAIInsights = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

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
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '150ms' }}>
                <Sparkles size={16} />
                <span>AI Match</span>
              </Button>
              
              <Button className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <PlusCircle size={16} />
                <span>Upload Job</span>
              </Button>
            </div>
          </div>
          
          {/* AI Talent Insights Card */}
          <Card className="mb-8 bg-primary/5 border-primary/20 animate-slide-up">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain size={20} className="text-primary" />
                  AI Talent Insights
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 text-primary"
                  onClick={handleGenerateAIInsights}
                  disabled={isGenerating}
                >
                  <Sparkles size={16} className={isGenerating ? "animate-spin" : ""} />
                  {isGenerating ? "Analyzing..." : "Refresh Insights"}
                </Button>
              </div>
              <CardDescription>
                AI-powered analysis of your candidate pool and market trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="skills" onValueChange={setActiveInsightTab}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="skills">Skills Gap</TabsTrigger>
                  <TabsTrigger value="diversity">Diversity</TabsTrigger>
                  <TabsTrigger value="trends">Market Trends</TabsTrigger>
                </TabsList>
                
                <TabsContent value="skills" className="mt-0">
                  <div className="space-y-4">
                    <p className="text-sm">Your candidate pool is strong in frontend skills but lacks in cloud architecture expertise. Consider focusing recruitment efforts on candidates with AWS/Azure experience.</p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium">Frontend Development</span>
                          <span className="text-xs font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium">Backend Development</span>
                          <span className="text-xs font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium">Cloud Architecture</span>
                          <span className="text-xs font-medium">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium">Cybersecurity</span>
                          <span className="text-xs font-medium">33%</span>
                        </div>
                        <Progress value={33} className="h-2" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="diversity" className="mt-0">
                  <div className="space-y-4">
                    <p className="text-sm">Your candidate pool shows good gender diversity but could improve in age distribution and educational background variety.</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium">Gender Balance</span>
                          <span className="text-xs font-medium">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium">Age Distribution</span>
                          <span className="text-xs font-medium">62%</span>
                        </div>
                        <Progress value={62} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium">Educational Background</span>
                          <span className="text-xs font-medium">55%</span>
                        </div>
                        <Progress value={55} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium">Geographic Distribution</span>
                          <span className="text-xs font-medium">72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="trends" className="mt-0">
                  <div className="space-y-4">
                    <p className="text-sm">Market analysis shows increasing demand for AI/ML skills and remote work flexibility. Salaries for senior developers have increased 12% in the last 6 months.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="bg-background">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-sm">Hottest Skills</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <ol className="text-xs space-y-1 list-decimal ml-4">
                            <li>AI/Machine Learning</li>
                            <li>Cloud Architecture</li>
                            <li>Cybersecurity</li>
                            <li>React/TypeScript</li>
                            <li>Data Engineering</li>
                          </ol>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-background">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-sm">Work Model Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs">Remote</span>
                                <span className="text-xs">68%</span>
                              </div>
                              <Progress value={68} className="h-1.5" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs">Hybrid</span>
                                <span className="text-xs">24%</span>
                              </div>
                              <Progress value={24} className="h-1.5" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs">On-site</span>
                                <span className="text-xs">8%</span>
                              </div>
                              <Progress value={8} className="h-1.5" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
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

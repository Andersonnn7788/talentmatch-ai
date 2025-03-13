
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookUser, Briefcase, Check, Plus, FileText, Sparkles, Brain } from 'lucide-react';
import Navbar from "@/components/Navbar";
import AptitudeTestCard from "@/components/AptitudeTestCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Sample aptitude test data
const sampleTests = [
  {
    id: "1",
    title: "Software Development Skills",
    description: "Assess coding knowledge and problem-solving abilities",
    questions: 15,
    timeLimit: 45,
    category: "technical" as const,
    created: "2 weeks ago",
    responses: 24
  },
  {
    id: "2",
    title: "Leadership Assessment",
    description: "Evaluate leadership potential and team management skills",
    questions: 10,
    timeLimit: 30,
    category: "soft" as const,
    created: "1 month ago",
    responses: 18
  },
  {
    id: "3",
    title: "Marketing Strategy Test",
    description: "Test knowledge of marketing fundamentals and strategy",
    questions: 20,
    timeLimit: 60,
    category: "technical" as const,
    created: "3 days ago",
    responses: 5
  },
  {
    id: "4",
    title: "Communication Skills",
    description: "Assess written and verbal communication abilities",
    questions: 12,
    timeLimit: 40,
    category: "soft" as const,
    created: "1 week ago",
    responses: 32
  }
];

const AptitudeTests = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  
  // Filter tests based on active tab
  const filteredTests = activeTab === "all" 
    ? sampleTests 
    : sampleTests.filter(test => test.category === activeTab);
    
  const handleGenerateAITest = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      // Simulating AI generated test
      const newTest = {
        id: (sampleTests.length + 1).toString(),
        title: "AI-Generated Full-Stack Developer Assessment",
        description: "Comprehensive assessment of front-end, back-end, and system design skills",
        questions: 18,
        timeLimit: 60,
        category: "technical" as const,
        created: "Just now",
        responses: 0
      };
      sampleTests.unshift(newTest);
      setActiveTab("all");
    }, 2000);
  };
  
  const handleGenerateInsights = () => {
    setAiInsights(null);
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      setAiInsights("Based on test results, 72% of candidates exceed expectations in problem-solving but underperform in communication skills. Consider revising your interview process to focus more on soft skills. Top candidates showed proficiency in React, TypeScript, and Node.js but scored lower on system design. Recommend adding a dedicated system design interview stage.");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="recruiter" />
      
      <main className="container mx-auto px-4 pt-24 pb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Aptitude Tests</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage assessments for evaluating candidate skills
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleGenerateAITest}
              disabled={aiGenerating}
            >
              <Sparkles size={18} className={aiGenerating ? "animate-pulse" : ""} />
              {aiGenerating ? "Generating..." : "AI Generate Test"}
            </Button>
            
            <Button>
              <Plus size={18} className="mr-1" />
              Create New Test
            </Button>
          </div>
        </div>
        
        {/* AI Insights Card */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain size={20} className="text-primary" />
                AI Test Insights
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 text-primary"
                onClick={handleGenerateInsights}
                disabled={aiGenerating}
              >
                <Sparkles size={16} className={aiGenerating ? "animate-spin" : ""} />
                {aiGenerating ? "Analyzing..." : "Generate Insights"}
              </Button>
            </div>
            <CardDescription>
              Automated analysis of candidate performance and test effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aiInsights ? (
              <div className="text-sm">
                <p>{aiInsights}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium">Problem Solving</span>
                      <span className="text-xs font-medium">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium">Communication</span>
                      <span className="text-xs font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-3 text-muted-foreground text-sm">
                Click "Generate Insights" to analyze test results
              </div>
            )}
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="flex items-center">
              <FileText size={16} className="mr-1" />
              All Tests
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center">
              <GraduationCap size={16} className="mr-1" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="soft" className="flex items-center">
              <BookUser size={16} className="mr-1" />
              Soft Skills
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map(test => (
                <AptitudeTestCard key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="technical" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map(test => (
                <AptitudeTestCard key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="soft" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map(test => (
                <AptitudeTestCard key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AptitudeTests;


import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookUser, Briefcase, Check, Clock } from 'lucide-react';
import Navbar from "@/components/Navbar";
import AptitudeTestItem from "@/components/AptitudeTestItem";

type TestStatus = 'completed' | 'available' | 'in-progress';

interface AptitudeTest {
  id: string;
  title: string;
  description: string;
  questions: number;
  timeLimit: number;
  category: 'technical' | 'soft';
  company: string;
  status: TestStatus;
}

// Sample aptitude test data
const sampleTests: AptitudeTest[] = [
  {
    id: "1",
    title: "Software Development Skills",
    description: "Assess coding knowledge and problem-solving abilities",
    questions: 15,
    timeLimit: 45,
    category: "technical",
    company: "TechCorp Inc.",
    status: "available"
  },
  {
    id: "2",
    title: "Leadership Assessment",
    description: "Evaluate leadership potential and team management skills",
    questions: 10,
    timeLimit: 30,
    category: "soft",
    company: "InnovateTech",
    status: "available"
  },
  {
    id: "3",
    title: "Marketing Strategy Test",
    description: "Test knowledge of marketing fundamentals and strategy",
    questions: 20,
    timeLimit: 60,
    category: "technical",
    company: "GrowthHackers",
    status: "in-progress"
  },
  {
    id: "4",
    title: "Communication Skills",
    description: "Assess written and verbal communication abilities",
    questions: 12,
    timeLimit: 40,
    category: "soft",
    company: "DesignStudio",
    status: "completed"
  },
  {
    id: "5",
    title: "Data Science Fundamentals",
    description: "Test knowledge of statistics, machine learning, and data visualization",
    questions: 25,
    timeLimit: 60,
    category: "technical",
    company: "DataWorks Labs",
    status: "completed"
  }
];

const AptitudeTests = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Filter tests based on active tab
  const filteredTests = activeTab === "all" 
    ? sampleTests 
    : activeTab === "completed" 
      ? sampleTests.filter(test => test.status === "completed")
      : activeTab === "available"
        ? sampleTests.filter(test => test.status === "available")
        : sampleTests.filter(test => test.status === "in-progress");

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="employee" />
      
      <main className="container mx-auto px-4 pt-24 pb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Aptitude Tests</h1>
            <p className="text-muted-foreground mt-1">
              Complete assessments to showcase your skills to potential employers
            </p>
          </div>
          
          <Button className="mt-4 md:mt-0">
            View My Results
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="flex items-center">
              <GraduationCap size={16} className="mr-1" />
              All Tests
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center">
              <BookUser size={16} className="mr-1" />
              Available
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="flex items-center">
              <Clock size={16} className="mr-1" />
              In Progress
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <Check size={16} className="mr-1" />
              Completed
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="space-y-4">
              {filteredTests.map(test => (
                <AptitudeTestItem key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="available" className="mt-0">
            <div className="space-y-4">
              {filteredTests.map(test => (
                <AptitudeTestItem key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="in-progress" className="mt-0">
            <div className="space-y-4">
              {filteredTests.map(test => (
                <AptitudeTestItem key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            <div className="space-y-4">
              {filteredTests.map(test => (
                <AptitudeTestItem key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AptitudeTests;

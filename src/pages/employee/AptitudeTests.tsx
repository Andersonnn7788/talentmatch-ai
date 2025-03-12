
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookUser, Clock, CheckCircle, Timer } from 'lucide-react';
import Navbar from "@/components/Navbar";
import AptitudeTestItem from "@/components/AptitudeTestItem";

// Sample aptitude test data for employee
const availableTests = [
  {
    id: "1",
    title: "Software Development Skills",
    description: "Assess coding knowledge and problem-solving abilities",
    questions: 15,
    timeLimit: 45,
    category: "technical" as const,
    company: "TechCorp Inc.",
    status: "available"
  },
  {
    id: "2",
    title: "Leadership Assessment",
    description: "Evaluate leadership potential and team management skills",
    questions: 10,
    timeLimit: 30,
    category: "soft" as const,
    company: "Management Solutions",
    status: "available"
  },
  {
    id: "3",
    title: "Marketing Strategy Test",
    description: "Test knowledge of marketing fundamentals and strategy",
    questions: 20,
    timeLimit: 60,
    category: "technical" as const,
    company: "BrandGrowth Agency",
    status: "completed"
  },
  {
    id: "4",
    title: "Communication Skills",
    description: "Assess written and verbal communication abilities",
    questions: 12,
    timeLimit: 40,
    category: "soft" as const,
    company: "Global Enterprises",
    status: "in-progress"
  }
];

const AptitudeTests = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter tests based on active tab
  const filteredTests = activeTab === "all" 
    ? availableTests 
    : activeTab === "completed"
    ? availableTests.filter(test => test.status === "completed")
    : activeTab === "available"
    ? availableTests.filter(test => test.status === "available")
    : availableTests.filter(test => test.category === activeTab);

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
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="flex items-center">
              <GraduationCap size={16} className="mr-1" />
              All Tests
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center">
              <Timer size={16} className="mr-1" />
              Available
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <CheckCircle size={16} className="mr-1" />
              Completed
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
            <div className="grid grid-cols-1 gap-4">
              {filteredTests.map(test => (
                <AptitudeTestItem key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="available" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              {filteredTests.map(test => (
                <AptitudeTestItem key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              {filteredTests.map(test => (
                <AptitudeTestItem key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="technical" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              {filteredTests.map(test => (
                <AptitudeTestItem key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="soft" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
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

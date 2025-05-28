import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Landing page without authentication
const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          TalentMatch AI
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Revolutionary AI-powered talent matching platform that connects exceptional candidates with leading companies
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-blue-600">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Get matched with perfect job opportunities using our AI-powered matching algorithm.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-indigo-600">For Recruiters</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Find the best candidates faster with intelligent screening and matching technology.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-purple-600">AI-Powered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Advanced machine learning algorithms ensure the most accurate job matches.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="space-x-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Get Started as Job Seeker
          </Button>
          <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            I'm a Recruiter
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Join thousands of professionals already using TalentMatch AI
        </p>
      </div>
    </div>
  </div>
);

// Simple test page
const TestPage = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">System Status</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Frontend Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>React:</span>
                <span className="text-green-600">✅ Working</span>
              </div>
              <div className="flex justify-between">
                <span>Routing:</span>
                <span className="text-green-600">✅ Working</span>
              </div>
              <div className="flex justify-between">
                <span>UI Components:</span>
                <span className="text-green-600">✅ Working</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Current URL:</span>
                <span className="text-sm">{window.location.pathname}</span>
              </div>
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span className="text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button onClick={() => window.location.href = '/'}>
          ← Back to Home
        </Button>
      </div>
    </div>
  </div>
);

const AppFixed = () => {
  console.log('🚀 AppFixed rendering...');
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppFixed;

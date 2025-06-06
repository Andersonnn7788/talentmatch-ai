
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Briefcase, Target, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Only redirect if we have a user and haven't already navigated
    if (!loading && user && !hasNavigated.current) {
      const userType = user.user_metadata?.user_type || 'employee';
      hasNavigated.current = true;
      navigate(`/${userType}/home`);
    }
    
    // Reset navigation flag when user becomes null (signed out)
    if (!user) {
      hasNavigated.current = false;
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated but we haven't navigated yet, show loading
  if (user && !hasNavigated.current) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">TalentMatch.AI</div>
          <Button onClick={() => navigate('/auth')} variant="outline">
            Sign In
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Connect Talent with <span className="text-primary">Opportunity</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered talent matching platform that bridges the gap between job seekers and recruiters, 
            creating meaningful connections that drive career success.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={() => navigate('/auth')} className="animate-fade-in">
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow animate-slide-up">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">AI-powered algorithms match candidates with perfect job opportunities based on skills and preferences.</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Video Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Seamless video interview experience with integrated scheduling and assessment tools.</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Skill Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Comprehensive aptitude tests and skill evaluations to showcase candidate capabilities.</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Data-driven insights and analytics to optimize recruitment strategies and career growth.</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career Journey?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their perfect match through TalentMatch.AI
          </p>
          <Button size="lg" onClick={() => navigate('/auth')}>
            Start Your Journey Today
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;

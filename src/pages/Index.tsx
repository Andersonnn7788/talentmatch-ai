
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Briefcase, Target, Zap, MapPin, Shield, Award, Globe } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/ead5aa05-428c-4c27-9ecc-e16084d736ba.png" 
              alt="TM.AI Logo" 
              className="h-12 w-auto"
            />
            <span className="text-2xl font-bold text-gray-800">TalentMatch.AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Malaysia</span>
            </div>
            <Button onClick={() => navigate('/auth')} variant="outline">
              Sign In
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              🇲🇾 Proudly Malaysian - Globally Connected
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            Malaysia's Leading <span className="text-blue-600">AI-Powered</span> 
            <br />Talent Matching Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Connecting Malaysian professionals with global opportunities and local businesses with world-class talent. 
            Experience the future of recruitment with our advanced AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700 px-8">
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="border-blue-600 text-blue-600 hover:bg-blue-50">
              For Employers
            </Button>
          </div>
        </div>

        {/* Malaysia-specific Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose TalentMatch.AI Malaysia?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Local Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Deep understanding of Malaysian job market, cultural nuances, and local business practices across all states.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Multilingual Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Full support in Bahasa Malaysia, English, Mandarin, and Tamil to serve Malaysia's diverse workforce.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Compliance Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Fully compliant with Malaysian employment laws, PDPA regulations, and local hiring requirements.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Advanced AI-Powered Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow animate-slide-up bg-white">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">AI algorithms trained on Malaysian job market data for precise candidate-role matching.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow animate-slide-up bg-white" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <CardTitle className="text-lg">Video Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Seamless video interviews with real-time language translation and cultural adaptation.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow animate-slide-up bg-white" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Skill Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Comprehensive skills testing including technical abilities and soft skills evaluation.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow animate-slide-up bg-white" style={{ animationDelay: '300ms' }}>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced analytics dashboard with insights into Malaysian hiring trends and market data.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by Malaysian Businesses</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Active Job Seekers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Partner Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Successful Matches</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">13</div>
              <div className="text-blue-100">States Covered</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-xl">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Ready to Transform Your Career in Malaysia?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of Malaysian professionals who have found their perfect match through TalentMatch.AI. 
            Your next opportunity is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700 px-8">
              Join as Job Seeker
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8">
              Hire Top Talent
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            🔒 Your data is protected under Malaysia's PDPA compliance standards
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/ead5aa05-428c-4c27-9ecc-e16084d736ba.png" 
                alt="TM.AI Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold">TalentMatch.AI Malaysia</span>
            </div>
            <p className="text-gray-400 mb-4">Connecting Malaysian talent with global opportunities</p>
            <p className="text-sm text-gray-500">© 2024 TalentMatch.AI. All rights reserved. | Made in Malaysia 🇲🇾</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

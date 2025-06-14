import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Briefcase, Target, Zap, MapPin, Shield, Award, Globe, TrendingUp, CheckCircle, ArrowRight, Star } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated but we haven't navigated yet, show loading
  if (user && !hasNavigated.current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/3c685baf-1e73-4882-b8e4-97cc329d1c66.png" 
                alt="TalentMatch.AI Logo" 
                className="h-12 w-auto"
              />
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#solutions" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Solutions</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Contact</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4 mr-1" />
                <span>🇲🇾 Malaysia</span>
              </div>
              <Button onClick={() => navigate('/auth')} variant="outline" className="border-gray-300">
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8">
              <Award className="w-4 h-4 mr-2" />
              Malaysia's Premier AI-Powered Talent Platform
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 text-gray-900 leading-tight">
              Revolutionizing Talent 
              <span className="text-blue-600 block">Acquisition in Malaysia</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect exceptional Malaysian professionals with global opportunities through our advanced AI-powered matching platform. 
              Trusted by leading enterprises and top talent across Malaysia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')} 
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg font-semibold"
              >
                Start Hiring Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/auth')} 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
              >
                Find Your Dream Job
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>PDPA Compliant</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-gray-500 font-medium">Trusted by Malaysia's Leading Organizations</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div className="text-center">
              <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-600 font-bold">PETRONAS</span>
              </div>
            </div>
            <div className="text-center">
              <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-600 font-bold">GENTING</span>
              </div>
            </div>
            <div className="text-center">
              <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-600 font-bold">MAYBANK</span>
              </div>
            </div>
            <div className="text-center">
              <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-600 font-bold">AXIATA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Active Professionals</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-blue-100">Partner Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Match Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">13</div>
              <div className="text-blue-100">States Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Advanced AI-Powered Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our cutting-edge technology stack delivers unparalleled accuracy in talent matching, 
              streamlined processes, and data-driven insights for optimal hiring decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Precision Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced algorithms analyze 200+ data points to ensure perfect candidate-role alignment with 98% accuracy.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Smart Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">AI-powered video interviews with real-time language processing and cultural competency assessment.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Skills Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Comprehensive assessment platform covering technical skills, soft skills, and industry-specific competencies.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-cyan-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Market Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Real-time insights into Malaysian talent trends, salary benchmarks, and competitive intelligence.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Connect Malaysian talent with international opportunities and global companies with local expertise.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Bank-level security with PDPA compliance, data encryption, and comprehensive audit trails.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions by Industry */}
      <section id="solutions" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Industry-Specific Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored recruitment solutions designed for Malaysia's key industries, 
              understanding local market dynamics and regulatory requirements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Financial Services</h3>
              <p className="text-gray-600 mb-4">Specialized solutions for banks, insurance, and fintech companies with regulatory compliance built-in.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• BNM compliance ready</li>
                <li>• Risk assessment protocols</li>
                <li>• Specialized skill validation</li>
              </ul>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Technology</h3>
              <p className="text-gray-600 mb-4">Advanced technical assessments and coding challenges for Malaysia's growing tech sector.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Live coding assessments</li>
                <li>• Technical stack matching</li>
                <li>• Open source contribution analysis</li>
              </ul>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Manufacturing</h3>
              <p className="text-gray-600 mb-4">Comprehensive solutions for Malaysia's manufacturing excellence with safety and quality focus.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Safety certification tracking</li>
                <li>• Quality management skills</li>
                <li>• Multi-language capabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">What Our Clients Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 border-0 shadow-lg">
              <CardContent>
                <div className="flex mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "TalentMatch.AI transformed our hiring process. We reduced time-to-hire by 60% while improving candidate quality significantly."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Lim</div>
                    <div className="text-gray-600 text-sm">HR Director, Tech Innovate Sdn Bhd</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <CardContent>
                <div className="flex mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "The cultural fit assessment is remarkable. We're now hiring candidates who truly align with our Malaysian corporate values."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold text-gray-900">Ahmad Rahman</div>
                    <div className="text-gray-600 text-sm">CEO, Malayan Heritage Group</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Talent Strategy?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-blue-100">
            Join Malaysia's leading companies in revolutionizing their recruitment process. 
            Start your journey with TalentMatch.AI today and experience the future of hiring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')} 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/auth')} 
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            🔒 Enterprise-grade security • PDPA compliant • 30-day free trial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/lovable-uploads/3c685baf-1e73-4882-b8e4-97cc329d1c66.png" 
                  alt="TM.AI Logo" 
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold">TalentMatch.AI</span>
              </div>
              <p className="text-gray-400 mb-4">
                Malaysia's premier AI-powered talent acquisition platform, connecting exceptional professionals with leading organizations.
              </p>
              <div className="text-sm text-gray-500">
                🇲🇾 Proudly Malaysian • Globally Connected
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">For Employers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Job Seekers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Integration</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 TalentMatch.AI Malaysia. All rights reserved. | 
              <span className="ml-2">Made with ❤️ in Malaysia</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

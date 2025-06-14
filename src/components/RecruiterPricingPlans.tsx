
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Crown, Zap } from 'lucide-react';

const RecruiterPricingPlans = () => {
  const plans = [
    {
      name: "Basic",
      monthlyPrice: "RM 1,500",
      successFee: "20%",
      description: "Perfect for small recruitment agencies getting started with AI",
      icon: <Zap className="h-6 w-6" />,
      color: "border-blue-200 bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: false,
      features: {
        "AI Candidate Matching": "Basic algorithm",
        "Monthly Job Slots": "50 active jobs",
        "CRM Seats": "3 users",
        "Predictive Analytics": <X className="h-4 w-4 text-red-500" />,
        "Advanced Reporting": <X className="h-4 w-4 text-red-500" />,
        "Bias Filters": <X className="h-4 w-4 text-red-500" />,
        "API Integrations": "1 integration",
        "Support Level": "Email support",
        "SLA": "48-hour response",
        "AI Credits": "5,000 credits/month",
        "Analytics Dashboard": "Basic metrics"
      }
    },
    {
      name: "Pro",
      monthlyPrice: "RM 4,500",
      successFee: "18%",
      description: "Advanced AI tools for growing recruitment teams",
      icon: <Star className="h-6 w-6" />,
      color: "border-green-200 bg-green-50",
      buttonColor: "bg-green-600 hover:bg-green-700",
      popular: true,
      savingsNote: "Save 25% vs Basic + success fees on multiple hires",
      features: {
        "AI Candidate Matching": "Advanced ML algorithm",
        "Monthly Job Slots": "200 active jobs",
        "CRM Seats": "10 users",
        "Predictive Analytics": <Check className="h-4 w-4 text-green-500" />,
        "Advanced Reporting": "Custom reports",
        "Bias Filters": <Check className="h-4 w-4 text-green-500" />,
        "API Integrations": "5 integrations",
        "Support Level": "Priority phone & email",
        "SLA": "24-hour response",
        "AI Credits": "20,000 credits/month",
        "Analytics Dashboard": "Advanced insights"
      }
    },
    {
      name: "Premium",
      monthlyPrice: "RM 9,000",
      annualPrice: "RM 8,000/month",
      successFee: "15%",
      annualSuccessFee: "14%",
      description: "Enterprise-grade AI recruitment platform",
      icon: <Crown className="h-6 w-6" />,
      color: "border-purple-200 bg-purple-50",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: false,
      enterpriseNote: "Annual plan: RM 8,000/month + 14% success fee",
      features: {
        "AI Candidate Matching": "Proprietary neural network",
        "Monthly Job Slots": "Unlimited",
        "CRM Seats": "Unlimited users",
        "Predictive Analytics": "Full suite with forecasting",
        "Advanced Reporting": "White-label reports",
        "Bias Filters": "Advanced multi-layer filters",
        "API Integrations": "Unlimited + custom",
        "Support Level": "Dedicated account manager",
        "SLA": "4-hour response",
        "AI Credits": "100,000 credits/month",
        "Analytics Dashboard": "Custom enterprise analytics"
      }
    }
  ];

  const renderFeature = (feature: any) => {
    if (typeof feature === 'string') {
      return <span className="text-sm text-gray-700">{feature}</span>;
    }
    return feature;
  };

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          AI-Powered Recruitment Pricing
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Hybrid subscription model combining stable monthly revenue with performance-aligned success fees. 
          Transparent AI usage with capped inference consumption.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-4xl mx-auto">
          <p className="text-blue-800 font-medium">
            🇲🇾 Designed specifically for Malaysian recruitment agencies and HR teams
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-green-500' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white px-4 py-1">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                <div className={`p-3 rounded-full ${plan.buttonColor.replace('bg-', 'bg-opacity-10 bg-')}`}>
                  {plan.icon}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-sm">{plan.description}</CardDescription>
              
              <div className="space-y-2 mt-4">
                <div className="text-3xl font-bold text-gray-900">
                  {plan.monthlyPrice}
                  <span className="text-sm font-normal text-gray-600">/month</span>
                </div>
                {plan.annualPrice && (
                  <div className="text-lg text-green-600 font-semibold">
                    Annual: {plan.annualPrice}
                  </div>
                )}
                <div className="text-lg">
                  <span className="font-semibold text-orange-600">{plan.successFee}</span>
                  <span className="text-sm text-gray-600"> success fee</span>
                </div>
                {plan.annualSuccessFee && (
                  <div className="text-sm text-green-600">
                    Annual: {plan.annualSuccessFee} success fee
                  </div>
                )}
              </div>
              
              {plan.savingsNote && (
                <div className="bg-green-100 border border-green-200 rounded-lg p-2 mt-3">
                  <p className="text-xs text-green-700 font-medium">{plan.savingsNote}</p>
                </div>
              )}
              
              {plan.enterpriseNote && (
                <div className="bg-purple-100 border border-purple-200 rounded-lg p-2 mt-3">
                  <p className="text-xs text-purple-700 font-medium">{plan.enterpriseNote}</p>
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              <Button className={`w-full mb-6 ${plan.buttonColor}`}>
                Get Started
              </Button>
              
              <div className="space-y-3">
                {Object.entries(plan.features).map(([feature, value]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                    {renderFeature(value)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="text-2xl font-bold text-gray-900">Feature Comparison Matrix</h3>
          <p className="text-gray-600 mt-1">Detailed breakdown of AI capabilities and platform features</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Basic</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Pro</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.keys(plans[0].features).map((feature) => (
                <tr key={feature} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{feature}</td>
                  {plans.map((plan, index) => (
                    <td key={index} className="px-6 py-4 text-center">
                      {renderFeature(plan.features[feature as keyof typeof plan.features])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Why Choose Our Hybrid Pricing Model?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-blue-600 mb-3">
              <Zap className="h-8 w-8" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Predictable Revenue</h4>
            <p className="text-sm text-gray-600">
              Stable monthly subscription fees provide predictable cash flow for your business planning.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-green-600 mb-3">
              <Star className="h-8 w-8" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Performance Aligned</h4>
            <p className="text-sm text-gray-600">
              Success fees ensure we're invested in your hiring success - you only pay more when you succeed.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-purple-600 mb-3">
              <Crown className="h-8 w-8" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">AI Cost Transparency</h4>
            <p className="text-sm text-gray-600">
              Clear AI credit system with capped inference consumption - no surprise bills or hidden costs.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-lg text-gray-700 mb-4">
            <strong>Ready to transform your recruitment process?</strong>
          </p>
          <p className="text-gray-600 mb-6">
            Join hundreds of Malaysian recruitment agencies already using our AI-powered platform to find better candidates faster.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
            Schedule a Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterPricingPlans;

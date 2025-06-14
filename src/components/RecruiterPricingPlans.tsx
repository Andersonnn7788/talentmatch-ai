
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Star, Crown } from 'lucide-react';

const RecruiterPricingPlans = () => {
  const plans = [
    {
      name: "Basic",
      monthlyPrice: "1,500",
      successFee: "20%",
      description: "Perfect for small recruitment agencies getting started with AI",
      icon: <Zap className="h-6 w-6" />,
      color: "border-gray-200 bg-white",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      popular: false,
      features: [
        "Basic AI candidate matching",
        "50 active job slots",
        "3 CRM user seats",
        "Email support",
        "5,000 AI credits/month",
        "Basic analytics dashboard"
      ]
    },
    {
      name: "Pro",
      monthlyPrice: "3,000",
      successFee: "18%",
      description: "Advanced AI tools for growing recruitment teams",
      icon: <Star className="h-6 w-6" />,
      color: "border-green-500 bg-white",
      buttonColor: "bg-green-600 hover:bg-green-700",
      popular: true,
      features: [
        "Everything in Basic",
        "Advanced ML algorithm matching",
        "200 active job slots",
        "10 CRM user seats",
        "Predictive analytics",
        "Advanced reporting & bias filters",
        "Priority phone & email support",
        "20,000 AI credits/month"
      ]
    },
    {
      name: "Premium",
      monthlyPrice: "5,000",
      successFee: "15%",
      description: "Enterprise-grade AI recruitment platform",
      icon: <Crown className="h-6 w-6" />,
      color: "border-purple-200 bg-white",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: false,
      features: [
        "Everything in Pro",
        "Proprietary neural network matching",
        "Unlimited job slots & users",
        "White-label custom reports",
        "Advanced multi-layer bias filters",
        "Dedicated account manager",
        "100,000 AI credits/month",
        "Custom enterprise analytics"
      ]
    }
  ];

  return (
    <div className="py-16 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Upgrade Your Recruitment Process
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Choose the plan that best fits your agency goals and unlock the full potential of AI-powered recruitment matching
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-3xl mx-auto">
          <p className="text-blue-800 font-medium">
            🇲🇾 Designed specifically for Malaysian recruitment agencies
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-green-500 scale-105' : ''} shadow-lg`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white px-4 py-1 text-sm font-semibold">POPULAR</Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
              
              <div className="mb-4">
                <div className="text-4xl font-bold text-gray-900">
                  RM{plan.monthlyPrice}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  + <span className="font-semibold text-orange-600">{plan.successFee}</span> success fee per hire
                </div>
              </div>
              
              <CardDescription className="text-sm text-gray-600 mb-4">
                {plan.description}
              </CardDescription>
              
              <Button className={`w-full ${plan.buttonColor} text-white font-semibold py-3`}>
                Get {plan.name}
              </Button>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Why Choose Our AI-Powered Platform?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="text-blue-600 mb-3 flex justify-center">
              <Zap className="h-8 w-8" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Predictable Costs</h4>
            <p className="text-sm text-gray-600">
              Fixed monthly fees with performance-based success fees only when you make successful placements.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="text-green-600 mb-3 flex justify-center">
              <Star className="h-8 w-8" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Matching</h4>
            <p className="text-sm text-gray-600">
              Advanced machine learning algorithms find the best candidates faster and more accurately.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="text-purple-600 mb-3 flex justify-center">
              <Crown className="h-8 w-8" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Transparent Pricing</h4>
            <p className="text-sm text-gray-600">
              No hidden costs or surprise bills. Clear AI credit system with capped monthly usage.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-lg text-gray-700 mb-4">
            <strong>Ready to transform your recruitment process?</strong>
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

import { Check, Zap, Rocket, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

const plans = [
  {
    name: "Starter",
    price: "R2,500",
    description: "Perfect for small projects and startups",
    icon: <Zap className="w-6 h-6" />,
    features: [
      "Single page website",
      "Basic UI/UX design",
      "Mobile responsive",
      "Contact form integration",
      "1 month support",
      "Social media links",
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    name: "Professional",
    price: "R7,500",
    description: "Ideal for growing businesses",
    icon: <Rocket className="w-6 h-6" />,
    features: [
      "Up to 5 pages",
      "Custom UI/UX design",
      "Mobile responsive",
      "Contact form + email",
      "Basic SEO optimization",
      "3 months support",
      "CMS integration",
      "Social media integration",
    ],
    popular: true,
    cta: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "R15,000+",
    description: "For large-scale applications",
    icon: <Crown className="w-6 h-6" />,
    features: [
      "Unlimited pages",
      "Full-stack development",
      "Custom web application",
      "Database integration",
      "API development",
      "Advanced SEO",
      "6 months support",
      "E-commerce ready",
      "Third-party integrations",
    ],
    popular: false,
    cta: "Contact Us",
  },
];

const addons = [
  { name: "Additional Pages", price: "R500/page" },
  { name: "E-commerce Functionality", price: "R5,000" },
  { name: "CMS Admin Panel", price: "R3,000" },
  { name: "API Development", price: "R4,000" },
  { name: "SEO Premium", price: "R2,500" },
  { name: "Speed Optimization", price: "R1,500" },
  { name: "Extra Support Month", price: "R1,000/month" },
];

export default function Pricing() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-4">
              Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Transparent Pricing for Quality Work
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Choose the perfect plan for your project. All plans include custom development tailored to your needs.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular ? "border-blue-500 relative" : "border-gray-100"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.popular ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== "R15,000+" && <span className="text-gray-500">/project</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700">
                      <Check size={18} className="text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/booking"
                  className={`block w-full py-3 rounded-xl font-medium text-center transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Add-on Services</h2>
            <p className="text-gray-600">Enhance your project with additional features</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {addons.map((addon, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-900">{addon.name}</span>
                <span className="text-blue-600 font-semibold">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Quote CTA */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Quote?</h2>
          <p className="text-xl text-white/90 mb-8">
            Tell us about your project and we'll create a tailored proposal for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Get Custom Quote
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              to="/invoice"
              className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold border border-white/30 hover:bg-white/30 transition-all"
            >
              Generate Invoice
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

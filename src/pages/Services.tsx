import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    id: "web-development",
    title: "Web Development",
    description:
      "Custom web applications that are responsive, scalable, and secure.",
    features: [
      "Custom web design",
      "Front-end development",
      "Back-end development",
      "E-commerce solutions",
      "Content Management Systems",
      "API Development & Integration",
    ],
    icon: "🌐",
  },
  {
    id: "mobile-development",
    title: "Mobile App Development",
    description:
      "Native and hybrid mobile apps for iOS and Android devices.",
    features: [
      "Native app development",
      "Hybrid app development",
      "Mobile UI/UX design",
      "App testing and deployment",
      "App Store optimization",
      "Maintenance & support",
    ],
    icon: "📱",
  },
  {
    id: "desktop-development",
    title: "Desktop Development",
    description:
      "Custom desktop applications for Windows, macOS, and Linux.",
    features: [
      "Custom desktop design",
      "Desktop UI/UX design",
      "Cross-platform development",
      "Desktop testing",
      "System integration",
      "Performance optimization",
    ],
    icon: "💻",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    description:
      "User-centered designs that are intuitive and visually appealing.",
    features: [
      "User research and analysis",
      "Wireframing and prototyping",
      "Visual design and branding",
      "Usability testing",
      "Design systems",
      "Interaction design",
    ],
    icon: "🎨",
  },
  {
    id: "cloud-solutions",
    title: "Cloud Solutions",
    description:
      "Scalable cloud infrastructure and deployment solutions.",
    features: [
      "Cloud architecture design",
      "AWS, Azure, GCP setup",
      "DevOps & CI/CD",
      "Containerization (Docker/Kubernetes)",
      "Cloud migration",
      "Serverless solutions",
    ],
    icon: "☁️",
  },
  {
    id: "data-analytics",
    title: "Data Analytics",
    description:
      "Transform your data into actionable insights for better decision-making.",
    features: [
      "Data visualization",
      "Business intelligence",
      "Predictive analytics",
      "Data warehousing",
      "Machine learning integration",
      "Custom dashboards",
    ],
    icon: "📊",
  },
];

export default function Services() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Our Services
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive technology solutions tailored to your business
              needs. From web development to data analytics, we've got you
              covered.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                id={service.id}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-600"
                    >
                      <CheckCircle
                        size={18}
                        className="text-blue-600 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/booking"
                  className="inline-flex items-center mt-6 text-blue-600 font-medium hover:text-blue-700"
                >
                  Get Started
                  <ArrowRight className="ml-2" size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We follow a proven methodology to deliver exceptional results
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discovery",
                description:
                  "We learn about your business, goals, and requirements",
              },
              {
                step: "02",
                title: "Design",
                description:
                  "We create detailed wireframes and design mockups",
              },
              {
                step: "03",
                title: "Development",
                description:
                  "We build your solution using cutting-edge technologies",
              },
              {
                step: "04",
                title: "Delivery",
                description:
                  "We deploy, test, and provide ongoing support",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-blue-100 mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Let's discuss how we can help you achieve your goals with our expert
            solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Book a Consultation
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-transparent text-white px-8 py-4 rounded-lg font-medium border-2 border-white hover:bg-white/10 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              Made By{" "}
              <span className="font-semibold">Tevroc Technologies</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

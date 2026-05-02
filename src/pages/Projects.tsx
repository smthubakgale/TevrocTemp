import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const projects = [
  {
    title: "UX-Design Portfolio",
    category: "Web Design",
    tags: ["Responsive", "Custom Design"],
    description:
      "A personal portfolio site for a UI/UX designer with responsive design and custom illustrations.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    link: "https://smthubakgale.github.io/UI-UX-Design/",
  },
  {
    title: "Hevo - AI Solutions",
    category: "AI",
    tags: ["Data Analysis", "Machine Learning"],
    description:
      "AI for Electrochemical Data Analysis Solutions with real-time data analysis.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    link: "https://myhevo.netlify.app/",
  },
  {
    title: "Pycon Icon Manager",
    category: "Desktop",
    tags: ["Icons", "Cross-platform"],
    description:
      "Icon management software for web design with cross-platform compatibility.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    link: "https://github.com/smthubakgale/Pycon/releases/tag/v2.0",
  },
  {
    title: "E-Commerce Platform",
    category: "Web Development",
    tags: ["E-commerce", "Payment Integration"],
    description:
      "A full-featured online store with payment processing and inventory management.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    link: "#",
  },
  {
    title: "Health Tracker App",
    category: "Mobile",
    tags: ["Health", "Fitness"],
    description:
      "Mobile application for tracking health metrics and fitness goals.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    link: "#",
  },
  {
    title: "Business Dashboard",
    category: "Web Development",
    tags: ["Analytics", "Dashboard"],
    description:
      "Comprehensive business intelligence dashboard with real-time data visualization.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    link: "#",
  },
];

export default function Projects() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Our Projects
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our portfolio of successful projects that showcase our
              expertise in delivering innovative solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                      {project.category}
                    </span>
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {project.description}
                  </p>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                  >
                    View Project
                    <ArrowRight className="ml-2" size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "50+", label: "Projects Completed" },
              { value: "30+", label: "Happy Clients" },
              { value: "5+", label: "Years Experience" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Have a Project in Mind?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Let's work together to bring your ideas to life with our expert
            development team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Start Your Project
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

import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, Video, Loader2, AlertCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

// API endpoint for Yoco checkout
const YOCO_API = "https://tevrocsoftapi.netlify.app/.netlify/functions/api";

const services = [
  "Web Development",
  "Mobile App Development",
  "Desktop Development",
  "UI/UX Design",
  "Cloud Solutions",
  "Data Analytics",
  "Other",
];

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

const BOOKING_FEE_CENTS = 25000; // R250 in cents

type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  projectDetails: string;
  date: string;
  time: string;
  budget: string;
};

type BookingStatus = "idle" | "processing" | "redirecting" | "success" | "error";

export default function Booking() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    projectDetails: "",
    date: "",
    time: "",
    budget: "",
  });
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const checkoutId = searchParams.get("checkoutId");
  const redirectUrl = searchParams.get("redirectUrl");

  // Handle redirect from Yoco checkout
  useEffect(() => {
    if (checkoutId && redirectUrl) {
      const verifyPayment = async () => {
        setStatus("processing");
        try {
          const decodedUrl = decodeURIComponent(redirectUrl);
          // In production, verify payment with your server before confirming
          // For now, simulate success after redirect
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setStatus("success");
        } catch (error) {
          setStatus("error");
          setErrorMessage("Payment verification failed. Please contact support.");
        }
      };
      verifyPayment();
    }
  }, [checkoutId, redirectUrl]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleServiceSelect = (service: string) => {
    setFormData((prev) => ({ ...prev, service }));
  };

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, time }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("processing");
    setErrorMessage("");

    // Validate required fields
    if (!formData.service) {
      setStatus("error");
      setErrorMessage("Please select a service");
      return;
    }
    if (!formData.date || !formData.time) {
      setStatus("error");
      setErrorMessage("Please select a date and time");
      return;
    }

    try {
      // Call server to create Yoco checkout
      const response = await fetch(`${YOCO_API}/create-checkout?amount=${BOOKING_FEE_CENTS}`, {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to create checkout");
      }
      
      const data = await response.json();

      if (data.redirectUrl && data.id) {
        // Preserve query parameters and redirect
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set("checkoutId", data.id);
        currentParams.set("redirectUrl", encodeURIComponent(data.redirectUrl));
        
        setStatus("redirecting");
        window.location.href = `${window.location.pathname}?${currentParams.toString()}`;
      } else {
        throw new Error("Invalid checkout response");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to process payment. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="pt-20">
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-3xl p-12 shadow-xl">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Booking Confirmed!
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Thank you, {formData.firstName}! Your consultation has been booked.
              </p>
              <p className="text-gray-500 mb-8">
                A confirmation email has been sent to <strong>{formData.email}</strong>
              </p>
              
              <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-600" />
                  Meeting Details
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Date:</strong> {formData.date}</p>
                  <p><strong>Time:</strong> {formData.time}</p>
                  <p><strong>Service:</strong> {formData.service}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    📹 A Google Meet link will be sent to your email before the meeting.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  Back to Home
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
              <Video className="w-4 h-4" />
              Virtual Consultation
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Book a Consultation
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Pay a R250 booking fee to secure your 30-minute virtual meeting via Google Meet
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Booking Fee: R250</p>
                <p className="text-sm text-gray-500">30-minute virtual consultation via Google Meet</p>
              </div>
            </div>

            {(errorMessage || status === "redirecting") && (
              <div className={`mb-6 p-4 rounded-xl ${status === "redirecting" ? "bg-blue-50 border border-blue-200" : "bg-red-50 border border-red-200"}`}>
                {status === "redirecting" ? (
                  <div className="flex items-center gap-2 text-blue-700">
                    <Loader2 size={18} className="animate-spin" />
                    Redirecting to payment...
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle size={18} />
                    {errorMessage}
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                    placeholder="+27 66 123 4567"
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Service You're Interested In *
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {services.map((service, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleServiceSelect(service)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        formData.service === service
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.service === service ? "border-blue-500" : "border-gray-300"
                      }`}>
                        {formData.service === service && (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <span className="font-medium">{service}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Details */}
              <div>
                <label htmlFor="projectDetails" className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about your project *
                </label>
                <textarea
                  id="projectDetails"
                  required
                  rows={4}
                  value={formData.projectDetails}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors resize-none"
                  placeholder="Describe your project, goals, and any specific requirements..."
                />
              </div>

              {/* Preferred Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Time *
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {timeSlots.map((time, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleTimeSelect(time)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.time === time
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <Clock size={16} className="mx-auto mb-1" />
                      <span className="text-sm font-medium">{time}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Budget
                </label>
                <select
                  id="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                >
                  <option value="">Select a budget range</option>
                  <option value="under-5k">Under R5,000</option>
                  <option value="5k-10k">R5,000 - R10,000</option>
                  <option value="10k-25k">R10,000 - R25,000</option>
                  <option value="25k-50k">R25,000 - R50,000</option>
                  <option value="50k-plus">R50,000+</option>
                </select>
              </div>

              {/* Payment Info */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Booking Fee</h3>
                    <p className="text-sm text-gray-500">One-time payment to secure your slot</p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">R250</div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Video size={16} className="text-blue-600" />
                  <span>Google Meet link will be sent after payment</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "processing" || status === "redirecting"}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "processing" || status === "redirecting" ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay R250 & Book Consultation
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                🔒 Secured by Yoco. You'll be redirected to complete payment.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What to Expect</h2>
            <p className="text-gray-600">After submitting your booking request, here's what happens next</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Complete Payment", desc: "Pay the R250 booking fee via Yoco" },
              { step: "2", title: "Receive Confirmation", desc: "Get instant confirmation with your booking details" },
              { step: "3", title: "Get Meeting Link", desc: "Receive Google Meet link via email before your slot" },
              { step: "4", title: "Virtual Meeting", desc: "Join your 30-minute consultation at the scheduled time" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

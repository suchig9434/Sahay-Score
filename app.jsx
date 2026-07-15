import React, { useEffect, useState, useMemo } from "react";

import {
  TrendingUp,
  Shield,
  FileText,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Users,
  Clock,
  DollarSign,
  Upload,
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  X,
  Zap,
  Target,
  Award,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  SCORING_WEIGHTS, 
  CLASSIFICATION_THRESHOLDS, 
  LOAN_CONFIG,
  FILE_CONFIG,
  STATUS 
} from './constants.js';
import { 
  validateAadhar, 
  validatePhone, 
  validateFile, 
  parseNumber,
  api 
} from './utils.js';

// Single-file React component: SahayScoreApp
// Tailwind classes assumed available in the project.

export default function SahayScoreApp() {
  // Navigation
  const [currentPage, setCurrentPage] = useState("landing");
  const [currentAppId, setCurrentAppId] = useState(null);

  // State for API loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Load sample/default apps from localStorage or fallback
  const defaultApps = [
    {
      id: "SHS001",
      name: "Ramesh Kumar",
      repaymentScore: 420,
      needScore: 380,
      compositeScore: 800,
      status: "approved",
      amount: 50000,
      date: "2025-01-15",
      category: "Repeat Borrower",
      electricityBill: 1200,
      mobileRecharge: 200,
      previousLoans: 3,
      classification: "High Need + Good Repayment"
    },
    {
      id: "SHS002",
      name: "Savita Devi",
      repaymentScore: 280,
      needScore: 420,
      compositeScore: 700,
      status: "pending",
      amount: 30000,
      date: "2025-01-14",
      category: "New Borrower",
      electricityBill: 800,
      mobileRecharge: 150,
      previousLoans: 0,
      classification: "High Need + Risky Repayment - Manual Review"
    },
    {
      id: "SHS003",
      name: "Amit Singh",
      repaymentScore: 180,
      needScore: 150,
      compositeScore: 330,
      status: "rejected",
      amount: 75000,
      date: "2025-01-13",
      category: "Repeat Borrower",
      electricityBill: 3500,
      mobileRecharge: 800,
      previousLoans: 5,
      classification: "Low Need + Poor Repayment"
    },
    {
      id: "SHS004",
      name: "Priya Sharma",
      repaymentScore: 380,
      needScore: 250,
      compositeScore: 630,
      status: "pending",
      amount: 40000,
      date: "2025-01-12",
      category: "Repeat Borrower",
      electricityBill: 2000,
      mobileRecharge: 400,
      previousLoans: 2,
      classification: "Good Repayment + Lower Need - Manual Review"
    }
  ];

  const [applications, setApplications] = useState([]);

  // Fetch applications from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      // Try localStorage first for faster load
      try {
        const raw = localStorage.getItem("sahay_apps_v1");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setApplications(parsed);
            setLoading(false);
          }
        }
      } catch (e) {
        console.warn('Failed to load from localStorage:', e);
      }

      // Then try to fetch from backend in background
      try {
        const apps = await api.fetchApplications();
        setApplications(apps);
        setError(null);
      } catch (err) {
        console.warn('Backend not available, using local data:', err.message);
        // Only set error if we have no data at all
        if (applications.length === 0) {
          setApplications(defaultApps);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Persist applications to localStorage as backup
  useEffect(() => {
    if (applications.length > 0) {
      try {
        localStorage.setItem("sahay_apps_v1", JSON.stringify(applications));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
    }
  }, [applications]);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    aadhar: "",
    category: "",
    loanAmount: "",
    purpose: "",
    previousLoans: "0",
    electricityBill: "",
    mobileRecharge: "",
    utilityPayments: "",
    businessIncome: "",
    documents: []
  });

  useEffect(() => {
    // restore last viewed app id if exists
    const last = localStorage.getItem("sahay_last_view");
    if (last) setCurrentAppId(last);
  }, []);

  useEffect(() => {
    if (currentAppId) localStorage.setItem("sahay_last_view", currentAppId);
  }, [currentAppId]);

  const navigate = (page, appId = null) => {
    setCurrentPage(page);
    if (appId) setCurrentAppId(appId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Memoized input change handler to prevent re-renders
  const handleInputChange = React.useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Use parseNumber from utils
  const n = parseNumber;

  // Small helpers for class mappings (avoid dynamic tailwind strings)
  const featureBg = (colorKey) =>
    ({
      orange: "bg-orange-100",
      green: "bg-green-100",
      blue: "bg-blue-100",
      purple: "bg-purple-100"
    }[colorKey] || "bg-gray-100");

  const featureIconBg = (colorKey) =>
    ({
      orange: "bg-orange-500 text-white",
      green: "bg-green-500 text-white",
      blue: "bg-blue-500 text-white",
      purple: "bg-purple-500 text-white"
    }[colorKey] || "bg-gray-500 text-white");

  // ---------- Pages ---------- //

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white/95 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">SahayScore</div>
              <div className="text-xs text-gray-600 font-medium">Powered by NBCFDC</div>
            </div>
          </div>

          <div className="hidden md:flex gap-6 items-center">
            <button onClick={() => navigate("dashboard")} className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors">Dashboard</button>
            <button onClick={() => navigate("admin")} className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors">Admin</button>
            <button onClick={() => navigate("apply")} className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">Apply Now</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section with Enhanced Animations */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-100 to-green-100 text-orange-700 rounded-full text-sm font-semibold mb-6 shadow-md" role="banner" aria-label="AI-Powered Dual Credit Scoring System">
                <Zap size={16} aria-hidden="true" className="animate-pulse" /> 
                AI-Powered Dual Credit Scoring
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Credit Scoring for <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 bg-clip-text text-transparent">Inclusive Lending</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">Empowering backward classes with faster, fairer access to concessional loans through NBCFDC's innovative dual-score system.</p>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate("apply")} 
                  className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl shadow-lg flex items-center gap-2 hover:from-orange-700 hover:to-orange-600 transform hover:scale-105 transition-all focus:ring-4 focus:ring-orange-300 focus:outline-none font-semibold"
                  aria-label="Start new loan application"
                >
                  Start Application <ArrowRight size={20} aria-hidden="true" />
                </button>
                <button 
                  className="px-8 py-4 border-2 border-orange-300 text-orange-600 rounded-xl hover:bg-orange-50 transition-all focus:ring-4 focus:ring-orange-200 focus:outline-none font-semibold"
                  aria-label="Learn more about SahayScore"
                >
                  Learn More
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span>Government Backed</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.6, delay: 0.2 }} 
              className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-orange-200 relative overflow-hidden"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-green-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-200 to-blue-200 rounded-full -ml-12 -mb-12 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="text-sm text-gray-600 mb-3 font-medium" id="composite-score-label">Composite Score</div>
                  <div className="text-7xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 bg-clip-text text-transparent mb-2" aria-labelledby="composite-score-label" aria-describedby="composite-score-desc">800</div>
                  <div className="text-gray-600 text-sm font-medium" id="composite-score-desc">out of 1000</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-2xl border border-orange-200 shadow-sm" role="region" aria-label="Repayment score details">
                    <div className="text-sm text-gray-600 mb-2 font-medium">Repayment Score</div>
                    <div className="text-3xl font-bold text-orange-600" aria-label="Repayment score 420 out of 500">420</div>
                    <div className="text-xs text-gray-500 mt-1">/ 500</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl border border-green-200 shadow-sm" role="region" aria-label="Need score details">
                    <div className="text-sm text-gray-600 mb-2 font-medium">Need Score</div>
                    <div className="text-3xl font-bold text-green-600" aria-label="Need score 380 out of 500">380</div>
                    <div className="text-xs text-gray-500 mt-1">/ 500</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
                    <span className="text-gray-700 font-semibold flex items-center gap-2">
                      <Award className="text-green-600" size={18} />
                      Classification
                    </span>
                    <span className="text-green-600 font-bold text-sm">Auto-Approve</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                    <span className="text-gray-700 font-semibold flex items-center gap-2">
                      <Clock className="text-blue-600" size={18} />
                      Processing Time
                    </span>
                    <span className="text-blue-600 font-bold">Same Day</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm">
                    <span className="text-gray-700 font-semibold flex items-center gap-2">
                      <DollarSign className="text-purple-600" size={18} />
                      Interest Rate
                    </span>
                    <span className="text-purple-600 font-bold">4% APR</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* How it works - Enhanced Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Three simple steps to get your loan approved with our AI-powered dual credit scoring system</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Data Collection",
                desc: "Channel partners provide loan history and beneficiaries upload consumption data like electricity bills.",
                items: ["Loan history", "Payment patterns", "Utility bills", "Mobile recharges"],
                color: "orange",
                gradient: "from-orange-500 to-orange-600"
              },
              {
                icon: BarChart3,
                title: "AI Scoring",
                desc: "Two ML models generate dual scores that paint a complete picture of the applicant.",
                items: ["Repayment score", "Need score"],
                color: "green",
                gradient: "from-green-500 to-green-600"
              },
              {
                icon: Target,
                title: "Classification",
                desc: "2D matrix places applicants into clear categories for instant decisions.",
                items: ["Auto-approve", "Manual review", "Reject"],
                color: "blue",
                gradient: "from-blue-500 to-blue-600"
              }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }} 
                className={`bg-white p-8 rounded-2xl shadow-xl border-2 hover:shadow-2xl transition-all ${i === 0 ? "border-orange-200" : i === 1 ? "border-green-200" : "border-blue-200"}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <f.icon className="text-white" size={28} />
                </div>
                <div className={`inline-block px-3 py-1 bg-${f.color}-100 text-${f.color}-700 rounded-full text-xs font-semibold mb-3`}>
                  Step {i + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">{f.desc}</p>
                <div className="space-y-2">
                  {f.items.map((it, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-700">
                      <ChevronRight className={`text-${f.color}-600`} size={16} />
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Impact - Enhanced Section */}
        <section className="mt-20 bg-gradient-to-br from-orange-500 via-orange-600 to-green-600 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center mb-4">Real Impact</h2>
            <p className="text-center text-orange-100 mb-10 max-w-2xl mx-auto text-lg">Making a difference in financial inclusion with measurable results</p>
            <div className="grid md:grid-cols-4 gap-8">
              <StatCard title={"7→1"} subtitle={"Days to Hours"} />
              <StatCard title={"95%"} subtitle={"Accuracy Rate"} />
              <StatCard title={"50K+"} subtitle={"Beneficiaries"} />
              <StatCard title={"100%"} subtitle={"Financial Inclusion"} />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">Real people, real impact</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ramesh Kumar",
                role: "Small Business Owner",
                quote: "Got my loan approved in hours, not days. The process was simple and transparent.",
                score: 800
              },
              {
                name: "Savita Devi",
                role: "First-time Borrower",
                quote: "As a new borrower, I was worried. But SahayScore gave me a fair evaluation based on my actual needs.",
                score: 700
              },
              {
                name: "Priya Sharma",
                role: "Repeat Borrower",
                quote: "The dual scoring system understood both my repayment ability and genuine financial need.",
                score: 630
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Award key={j} className="text-yellow-400 fill-yellow-400" size={18} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{testimonial.score}</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 text-center bg-gradient-to-r from-orange-50 to-green-50 rounded-3xl p-12 border-2 border-orange-200">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Join thousands of beneficiaries who have received faster, fairer access to loans</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate("apply")}
              className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-semibold text-lg"
            >
              Apply for Loan Now
            </button>
            <button 
              onClick={() => navigate("dashboard")}
              className="px-10 py-4 bg-white text-orange-600 border-2 border-orange-300 rounded-xl shadow hover:shadow-lg transition-all font-semibold text-lg"
            >
              View Dashboard
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-xl font-bold">SahayScore</div>
                  <div className="text-xs text-gray-400">NBCFDC</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering financial inclusion through AI-powered dual credit scoring for backward classes.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button onClick={() => navigate("apply")} className="hover:text-orange-400 transition-colors">Apply for Loan</button>
                </li>
                <li>
                  <button onClick={() => navigate("dashboard")} className="hover:text-orange-400 transition-colors">Dashboard</button>
                </li>
                <li>
                  <button onClick={() => navigate("admin")} className="hover:text-orange-400 transition-colors">Admin Panel</button>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-orange-400 transition-colors">How It Works</a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors">Help Center</a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors">FAQs</a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <FileText size={16} className="mt-1 flex-shrink-0" />
                  <span>National Backward Classes Finance & Development Corporation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users size={16} />
                  <span>support@sahayscore.gov.in</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Mon - Fri: 9AM - 6PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                © 2025 SahayScore - NBCFDC. All rights reserved.
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <Users size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <FileText size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <Shield size={20} />
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield size={16} className="text-green-400" />
                <span>Secured by Government of India</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  function StatCard({ title, subtitle }) {
    return (
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
      >
        <div className="text-5xl md:text-6xl font-bold mb-3">{title}</div>
        <div className="text-orange-100 text-lg font-medium">{subtitle}</div>
      </motion.div>
    );
  }

  // ---------- Application Form ---------- //
const ApplicationForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormErrors({});
    const errors = {};

    // Validate Aadhar
    const aadharValidation = validateAadhar(formData.aadhar);
    if (!aadharValidation.valid) {
      errors.aadhar = aadharValidation.error;
    }

    // Validate Phone
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.valid) {
      errors.phone = phoneValidation.error;
    }

    // Validate loan amount
    const loanAmount = n(formData.loanAmount);
    if (loanAmount < LOAN_CONFIG.MIN_LOAN_AMOUNT) {
      errors.loanAmount = `Minimum loan amount is ₹${LOAN_CONFIG.MIN_LOAN_AMOUNT.toLocaleString()}`;
    }
    if (loanAmount > LOAN_CONFIG.MAX_LOAN_AMOUNT) {
      errors.loanAmount = `Maximum loan amount is ₹${LOAN_CONFIG.MAX_LOAN_AMOUNT.toLocaleString()}`;
    }

    // Validate files
    if (formData.documents && formData.documents.length > FILE_CONFIG.MAX_FILES) {
      errors.documents = `Maximum ${FILE_CONFIG.MAX_FILES} files allowed`;
    }

    // If there are errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Calculate Repayment Score (0-500) using constants
    const previousLoanScore = Math.min(
      n(formData.previousLoans) * SCORING_WEIGHTS.PREVIOUS_LOAN_MULTIPLIER, 
      SCORING_WEIGHTS.PREVIOUS_LOAN_MAX
    );
    const businessScore = Math.min(
      (n(formData.businessIncome) / SCORING_WEIGHTS.BUSINESS_INCOME_DIVISOR) * SCORING_WEIGHTS.BUSINESS_INCOME_MULTIPLIER, 
      SCORING_WEIGHTS.BUSINESS_INCOME_MAX
    );
    const repaymentScore = Math.min(
      SCORING_WEIGHTS.BASE_REPAYMENT_SCORE + previousLoanScore + businessScore, 
      SCORING_WEIGHTS.MAX_REPAYMENT_SCORE
    );

    // Need Score (lower consumption => higher need) using constants
    const electricityScore = Math.max(
      SCORING_WEIGHTS.ELECTRICITY_BASE - n(formData.electricityBill) / SCORING_WEIGHTS.ELECTRICITY_DIVISOR, 
      0
    );
    const mobileScore = Math.max(
      SCORING_WEIGHTS.MOBILE_BASE - n(formData.mobileRecharge) / SCORING_WEIGHTS.MOBILE_DIVISOR, 
      0
    );
    const utilityScore = Math.max(
      SCORING_WEIGHTS.UTILITY_BASE - n(formData.utilityPayments) / SCORING_WEIGHTS.UTILITY_DIVISOR, 
      0
    );
    const needScore = Math.min(
      electricityScore + mobileScore + utilityScore, 
      SCORING_WEIGHTS.MAX_NEED_SCORE
    );

    const compositeScore = Math.round(repaymentScore + needScore);

    // Classification using constants with proper 2x2 matrix logic
    let classification = "Manual Review Required";
    let status = STATUS.PENDING;
    
    // High Repayment + High Need = Auto-Approve (Best case)
    if (repaymentScore >= CLASSIFICATION_THRESHOLDS.HIGH_REPAYMENT_THRESHOLD && 
        needScore >= CLASSIFICATION_THRESHOLDS.HIGH_NEED_THRESHOLD) {
      classification = "High Need + Good Repayment";
      status = STATUS.APPROVED;
    } 
    // Low Repayment + Low Need = Reject (Worst case)
    else if (repaymentScore < CLASSIFICATION_THRESHOLDS.LOW_REPAYMENT_THRESHOLD && 
             needScore < CLASSIFICATION_THRESHOLDS.LOW_NEED_THRESHOLD) {
      classification = "Low Need + Poor Repayment";
      status = STATUS.REJECTED;
    }
    // High Repayment + Low Need = Manual Review (Good repayment but low need)
    else if (repaymentScore >= CLASSIFICATION_THRESHOLDS.HIGH_REPAYMENT_THRESHOLD && 
             needScore < CLASSIFICATION_THRESHOLDS.HIGH_NEED_THRESHOLD) {
      classification = "Good Repayment + Lower Need - Manual Review";
      status = STATUS.PENDING;
    }
    // Low Repayment + High Need = Manual Review (High need but poor repayment)
    else if (repaymentScore < CLASSIFICATION_THRESHOLDS.HIGH_REPAYMENT_THRESHOLD && 
             needScore >= CLASSIFICATION_THRESHOLDS.HIGH_NEED_THRESHOLD) {
      classification = "High Need + Risky Repayment - Manual Review";
      status = STATUS.PENDING;
    }
    // Everything else = Manual Review (Middle range scores)
    else {
      classification = "Medium Scores - Manual Review Required";
      status = STATUS.PENDING;
    }

    const newApp = {
      name: formData.name || "--",
      repaymentScore: Math.round(repaymentScore),
      needScore: Math.round(needScore),
      compositeScore,
      status,
      amount: loanAmount,
      category: formData.category || "Unspecified",
      electricityBill: n(formData.electricityBill),
      mobileRecharge: n(formData.mobileRecharge),
      previousLoans: Math.round(n(formData.previousLoans)),
      classification
    };

    try {
      setLoading(true);
      // Send to backend
      const createdApp = await api.createApplication(newApp);
      
      // Update local state
      setApplications((prev) => [createdApp, ...prev]);
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        aadhar: "",
        category: "",
        loanAmount: "",
        purpose: "",
        previousLoans: "0",
        electricityBill: "",
        mobileRecharge: "",
        utilityPayments: "",
        businessIncome: "",
        documents: []
      });
      
      navigate("score", createdApp.id);
    } catch (err) {
      console.error('Failed to create application:', err);
      setFormErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // File handler with validation
  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    
    const errors = {};
    const validFiles = [];
    
    Array.from(files).slice(0, FILE_CONFIG.MAX_FILES).forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push({ name: file.name, size: file.size });
      } else {
        errors.documents = validation.error;
      }
    });
    
    if (validFiles.length > 0) {
      setFormData((prev) => ({ ...prev, documents: validFiles }));
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    }
  };

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <button 
            onClick={() => navigate("landing")} 
            className="mb-6 text-orange-600 hover:text-orange-700 flex items-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-2 py-1"
            aria-label="Go back to home page"
          >
            ← Back to Home
          </button>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-orange-200">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">SahayScore Loan Application</h1>
              <p className="text-gray-600">Complete the form to get your dual credit score instantly</p>
            </div>

            {/* Error Display */}
            {formErrors.submit && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2" role="alert" aria-live="assertive">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
                <div>
                  <div className="font-semibold text-red-800">Submission Error</div>
                  <div className="text-sm text-red-700">{formErrors.submit}</div>
                </div>
              </div>
            )}

            {Object.keys(formErrors).length > 0 && !formErrors.submit && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg" role="alert" aria-live="polite">
                <div className="font-semibold text-yellow-800 mb-2">Please correct the following errors:</div>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  {Object.entries(formErrors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Personal Information */}
            <section className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name-input">Full Name *</label>
                <input 
                  id="name-input"
                  type="text"
                  required 
                  value={formData.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)} 
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Ramesh Kumar"
                  aria-required="true"
                  aria-invalid={!!formErrors.name}
                  aria-describedby={formErrors.name ? "name-error" : undefined}
                />
                {formErrors.name && <p id="name-error" className="text-xs text-red-600 mt-1" role="alert">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone-input">Mobile Number *</label>
                <input 
                  id="phone-input"
                  type="tel"
                  required 
                  value={formData.phone} 
                  onChange={(e) => handleInputChange('phone', e.target.value)} 
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="9876543210"
                  aria-required="true"
                  aria-invalid={!!formErrors.phone}
                  aria-describedby={formErrors.phone ? "phone-error" : undefined}
                />
                {formErrors.phone && <p id="phone-error" className="text-xs text-red-600 mt-1" role="alert">{formErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="aadhar-input">Aadhar Number *</label>
                <input 
                  id="aadhar-input"
                  type="text"
                  required 
                  value={formData.aadhar} 
                  onChange={(e) => handleInputChange('aadhar', e.target.value)} 
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${formErrors.aadhar ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="1234 5678 9012"
                  aria-required="true"
                  aria-invalid={!!formErrors.aadhar}
                  aria-describedby={formErrors.aadhar ? "aadhar-error" : undefined}
                />
                {formErrors.aadhar && <p id="aadhar-error" className="text-xs text-red-600 mt-1" role="alert">{formErrors.aadhar}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category-input">Borrower Category *</label>
                <select 
                  id="category-input"
                  required 
                  value={formData.category} 
                  onChange={(e) => handleInputChange('category', e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  aria-required="true"
                >
                  <option value="">Select...</option>
                  <option value="New Borrower">New Borrower</option>
                  <option value="Repeat Borrower">Repeat Borrower</option>
                </select>
              </div>
            </section>

            {/* Loan Details */}
            <section className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="loan-amount-input">Loan Amount (₹) *</label>
                <input 
                  id="loan-amount-input"
                  type="number" 
                  required 
                  min={LOAN_CONFIG.MIN_LOAN_AMOUNT}
                  max={LOAN_CONFIG.MAX_LOAN_AMOUNT}
                  value={formData.loanAmount} 
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)} 
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${formErrors.loanAmount ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="50000"
                  aria-required="true"
                  aria-invalid={!!formErrors.loanAmount}
                  aria-describedby={formErrors.loanAmount ? "loan-amount-error" : "loan-amount-hint"}
                />
                <div id="loan-amount-hint" className="text-xs text-gray-500 mt-1">
                  Min: ₹{LOAN_CONFIG.MIN_LOAN_AMOUNT.toLocaleString()}, Max: ₹{LOAN_CONFIG.MAX_LOAN_AMOUNT.toLocaleString()}
                </div>
                {formErrors.loanAmount && <p id="loan-amount-error" className="text-xs text-red-600 mt-1" role="alert">{formErrors.loanAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="purpose-input">Loan Purpose *</label>
                <select 
                  id="purpose-input"
                  required 
                  value={formData.purpose} 
                  onChange={(e) => handleInputChange('purpose', e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="">Select...</option>
                  <option value="Business Expansion">Business Expansion</option>
                  <option value="Working Capital">Working Capital</option>
                  <option value="Equipment Purchase">Equipment Purchase</option>
                  <option value="Education">Education</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="previous-loans-input">Number of Previous Loans</label>
                <input 
                  id="previous-loans-input"
                  type="number" 
                  min="0" 
                  value={formData.previousLoans} 
                  onChange={(e) => handleInputChange('previousLoans', e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" 
                  placeholder="0"
                />
                <div className="text-xs text-gray-500 mt-1">Enter 0 if you're a new borrower</div>
              </div>
            </section>

            {/* Consumption Proxies */}
            <section className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="text-green-600" size={20} />
                  <div className="font-semibold text-gray-900">Consumption Proxies</div>
                </div>
                <div className="text-xs text-gray-500">Used to assess need without salary slips</div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1" htmlFor="electricity-bill-input">Monthly Electricity Bill (₹) *</label>
                  <input 
                    id="electricity-bill-input"
                    required 
                    type="number" 
                    min="0"
                    value={formData.electricityBill} 
                    onChange={(e) => handleInputChange('electricityBill', e.target.value)} 
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all" 
                    placeholder="800" 
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1" htmlFor="mobile-recharge-input">Monthly Mobile Recharge (₹) *</label>
                  <input 
                    id="mobile-recharge-input"
                    required 
                    type="number" 
                    min="0"
                    value={formData.mobileRecharge} 
                    onChange={(e) => handleInputChange('mobileRecharge', e.target.value)} 
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all" 
                    placeholder="200" 
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1" htmlFor="utility-payments-input">Other Utility Payments (₹) *</label>
                  <input 
                    id="utility-payments-input"
                    required 
                    type="number" 
                    min="0"
                    value={formData.utilityPayments} 
                    onChange={(e) => handleInputChange('utilityPayments', e.target.value)} 
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all" 
                    placeholder="500" 
                  />
                </div>
              </div>
            </section>

            {/* Business Activity */}
            <section>
              <div className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp size={18} className="text-orange-600" /> 
                Business Activity (Optional)
              </div>
              <input 
                id="business-income-input"
                type="number" 
                min="0"
                value={formData.businessIncome} 
                onChange={(e) => handleInputChange('businessIncome', e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" 
                placeholder="Estimated monthly business income" 
              />
            </section>

            {/* File Upload */}
            <section>
              <div className="font-semibold mb-3 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" /> 
                Supporting Documents
              </div>
              
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                <div className="text-sm text-gray-600 mb-2">
                  Click to upload or drag and drop
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  PDF, JPG, PNG up to 5MB (Aadhar, electricity bills, etc.)
                </div>
                
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFiles(e.target.files)} 
                  className="hidden" 
                />

                {formData.documents && formData.documents.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="font-medium text-sm text-gray-700 mb-2">📎 Uploaded Files:</div>
                    <div className="space-y-1">
                      {formData.documents.map((d, idx) => (
                        <div key={idx} className="text-xs text-gray-600 bg-white px-3 py-2 rounded border border-gray-200">
                          📄 {d.name} ({(d.size / 1024).toFixed(1)} KB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </label>
            </section>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                aria-label="Submit application and calculate SahayScore"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  'Calculate My SahayScore'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

  // ---------- Score Result ---------- //
  const ScoreResult = () => {
    const app = applications.find((a) => a.id === currentAppId) || applications[0];
    if (!app) return <div className="p-8">Application not found</div>;

    const getScoreColor = (score, max) => {
      const pct = (score / max) * 100;
      if (pct >= 70) return "text-green-600";
      if (pct >= 50) return "text-yellow-600";
      return "text-red-600";
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <button onClick={() => navigate("dashboard")} className="mb-6 text-orange-600 hover:text-orange-700">← Back to Dashboard</button>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-2xl p-6 border border-orange-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full text-sm">Application ID: {app.id}</div>
              <h2 className="text-2xl font-bold mt-3">{app.name}</h2>
              <div className="text-sm text-gray-600">SahayScore Result</div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center">
                <div className="relative inline-block">
                  <svg width="200" height="200" className="transform -rotate-90">
                    <circle cx="100" cy="100" r="80" stroke="#e5e7eb" strokeWidth="18" fill="none" />
                    <circle cx="100" cy="100" r="80" stroke={app.compositeScore >= 700 ? "#10b981" : app.compositeScore >= 500 ? "#f59e0b" : "#ef4444"} strokeWidth="18" fill="none" strokeDasharray={`${(app.compositeScore / 1000) * 502} 502`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-4xl font-bold ${getScoreColor(app.compositeScore, 1000)}`}>{app.compositeScore}</div>
                    <div className="text-xs text-gray-500">Composite Score</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="grid grid-cols-1 gap-4">
                  <ScoreTile title="Repayment Score" score={app.repaymentScore} max={500} accent="orange" />
                  <ScoreTile title="Income Need Score" score={app.needScore} max={500} accent="green" />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg mt-6 ${app.status === STATUS.APPROVED ? "bg-green-50 border border-green-200" : app.status === STATUS.PENDING ? "bg-yellow-50 border border-yellow-200" : "bg-red-50 border border-red-200"}`} role="region" aria-label="Application status">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Classification</div>
                  <div className="text-lg font-semibold">{app.classification}</div>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${app.status === STATUS.APPROVED ? "bg-green-200 text-green-800" : app.status === STATUS.PENDING ? "bg-yellow-200 text-yellow-800" : "bg-red-200 text-red-800"}`}>
                  {app.status === STATUS.APPROVED ? (
                    <><CheckCircle size={16} aria-hidden="true" /> Auto-Approved</>
                  ) : app.status === STATUS.PENDING ? (
                    <><Clock size={16} aria-hidden="true" /> Manual Review</>
                  ) : (
                    <><X size={16} aria-hidden="true" /> Not Approved</>
                  )}
                </div>
              </div>

              {app.status === STATUS.APPROVED && (
                <div className="mt-3 bg-white rounded-md p-3">
                  <div className="flex justify-between text-sm text-gray-700"><span>Approved Amount:</span><strong>₹{app.amount.toLocaleString()}</strong></div>
                  <div className="flex justify-between text-sm text-gray-700"><span>Interest Rate:</span><strong>{LOAN_CONFIG.INTEREST_RATE}</strong></div>
                  <div className="flex justify-between text-sm text-gray-700"><span>Processing Time:</span><strong>{LOAN_CONFIG.PROCESSING_TIME}</strong></div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">Score Components Breakdown</h3>
              <div className="grid md:grid-cols-2 gap-4 mt-3 text-sm text-gray-700">
                <div>
                  <div className="font-medium">Repayment Factors</div>
                  <div className="mt-2">Previous Loans: <strong>{app.previousLoans}</strong></div>
                  <div>Payment History: <strong className="text-green-600">Good</strong></div>
                </div>
                <div>
                  <div className="font-medium">Need Indicators</div>
                  <div className="mt-2">Electricity Bill: <strong>₹{app.electricityBill}/month</strong></div>
                  <div>Mobile Recharge: <strong>₹{app.mobileRecharge}/month</strong></div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold mb-2">Next Steps</h3>
              {app.status === STATUS.APPROVED ? (
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Complete KYC verification</li>
                  <li>Sign loan agreement (Aadhar OTP)</li>
                  <li>Receive funds via bank transfer</li>
                </ol>
              ) : (
                <div className="text-sm text-gray-700">Application under review. Our team may contact you within 2-3 business days.</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  function ScoreTile({ title, score, max, accent = "orange" }) {
    return (
      <div className={`p-4 rounded-lg border ${accent === "green" ? "border-green-100" : "border-orange-100"} bg-white`}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-700">{title}</div>
          <div className={`font-bold ${accent === "green" ? "text-green-600" : "text-orange-600"}`}>{score}</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div style={{ width: `${(score / max) * 100}%` }} className={`h-2 rounded-full ${accent === "green" ? "bg-green-600" : "bg-orange-600"}`} />
        </div>
      </div>
    );
  }

  // ---------- Dashboard ---------- //
  const Dashboard = () => {
    const [searchFilter, setSearchFilter] = useState("");

    const stats = {
      approved: applications.filter((a) => a.status === STATUS.APPROVED).length,
      pending: applications.filter((a) => a.status === STATUS.PENDING).length,
      rejected: applications.filter((a) => a.status === STATUS.REJECTED).length,
      total: applications.length
    };

    const avgComposite = applications.length ? Math.round(applications.reduce((s, a) => s + a.compositeScore, 0) / applications.length) : 0;

    // Memoized filtered applications
    const filteredApplications = useMemo(() => {
      if (!searchFilter) return applications;
      const search = searchFilter.toLowerCase();
      return applications.filter((app) => 
        app.name.toLowerCase().includes(search) || 
        app.id.toLowerCase().includes(search)
      );
    }, [applications, searchFilter]);

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
              <div className="text-sm text-gray-600">Overview of all SahayScore applications</div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate("landing")} className="px-3 py-2 text-orange-600">← Home</button>
              <button onClick={() => navigate("apply")} className="px-3 py-2 bg-orange-600 text-white rounded">New Application</button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-xs text-gray-500">Total Applications</div>
              <div className="text-xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-xs text-gray-500">Auto-Approved</div>
              <div className="text-xl font-bold text-green-600">{stats.approved}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-xs text-gray-500">Under Review</div>
              <div className="text-xl font-bold text-yellow-600">{stats.pending}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-xs text-gray-500">Rejected</div>
              <div className="text-xl font-bold text-red-600">{stats.rejected}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg text-white">
              <div className="text-2xl font-bold">{avgComposite}</div>
              <div className="text-sm">Average Composite Score</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
              <div className="text-2xl font-bold">{stats.total ? ((stats.approved / stats.total) * 100).toFixed(0) : 0}%</div>
              <div className="text-sm">Auto-Approval Rate</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
              <div className="text-2xl font-bold">₹{(applications.filter((a) => a.status === "approved").reduce((s, a) => s + a.amount, 0) / 100000).toFixed(1)}L</div>
              <div className="text-sm">Total Approved Amount</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Recent Applications</h3>
                  <p className="text-xs text-gray-500 mt-1">{filteredApplications.length} of {applications.length} applications</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} aria-hidden="true" />
                    <input 
                      placeholder="Search name or ID" 
                      className="pl-9 pr-3 py-2 border rounded focus:ring-2 focus:ring-orange-500 focus:outline-none" 
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      aria-label="Search applications by name or ID"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Applicant</th>
                    <th className="px-4 py-3 text-left">Composite</th>
                    <th className="px-4 py-3 text-left">Repayment</th>
                    <th className="px-4 py-3 text-left">Need</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <tr key={app.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{app.id}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{app.name}</div>
                          <div className="text-xs text-gray-500">{app.date}</div>
                        </td>
                        <td className="px-4 py-3 font-bold">{app.compositeScore}</td>
                        <td className="px-4 py-3 text-orange-600">{app.repaymentScore}</td>
                        <td className="px-4 py-3 text-green-600">{app.needScore}</td>
                        <td className="px-4 py-3">₹{app.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${app.status === STATUS.APPROVED ? "bg-green-100 text-green-800" : app.status === STATUS.PENDING ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                            {app.status === STATUS.APPROVED && <CheckCircle size={12} aria-hidden="true" />}
                            {app.status === STATUS.PENDING && <Clock size={12} aria-hidden="true" />}
                            {app.status === STATUS.REJECTED && <X size={12} aria-hidden="true" />}
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => navigate("score", app.id)} 
                            className="text-orange-600 hover:underline flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-2 py-1"
                            aria-label={`View details for application ${app.id}`}
                          >
                            <Eye size={14} aria-hidden="true" /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                        {searchFilter ? `No applications found matching "${searchFilter}"` : 'No applications available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Memoized filtered applications for Admin Panel
  const useFilteredApplications = (searchTerm, filterStatus) => {
    return useMemo(() => {
      return applications.filter((app) => {
        const search = (searchTerm || "").toLowerCase();
        const matchesSearch = !search || app.name.toLowerCase().includes(search) || app.id.toLowerCase().includes(search);
        const matchesStatus = filterStatus === "all" || app.status === filterStatus;
        return matchesSearch && matchesStatus;
      });
    }, [applications, searchTerm, filterStatus]);
  };

  // ---------- Admin Panel ---------- //
  const AdminPanel = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const filteredApps = useFilteredApplications(searchTerm, filterStatus);

    const handleAdminChangeStatus = async (id, newStatus) => {
      try {
        await api.updateApplication(id, { status: newStatus });
        setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
      } catch (err) {
        console.error('Failed to update status:', err);
        alert('Failed to update application status. Please try again.');
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Admin Panel</h2>
              <div className="text-sm text-gray-600">Manage applications</div>
            </div>
            <div>
              <button onClick={() => navigate("landing")} className="px-3 py-2 text-orange-600">← Home</button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} aria-hidden="true" />
                <input 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Search by name or ID" 
                  className="w-full pl-10 pr-3 py-2 border rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  aria-label="Search applications by name or ID"
                />
              </div>

              <div>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)} 
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredApps.map((app) => (
              <motion.div key={app.id} whileHover={{ y: -4 }} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold">{app.name}</h3>
                      <div className="text-xs text-gray-500">{app.id}</div>
                      <div className={`px-2 py-0.5 rounded-full text-xs ${app.status === "approved" ? "bg-green-100 text-green-800" : app.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{app.status}</div>
                    </div>
                    <div className="text-sm text-gray-600">{app.category} • Applied on {app.date} • ₹{app.amount.toLocaleString()}</div>

                    <div className="grid md:grid-cols-4 gap-2 mt-3 text-sm text-gray-700">
                      <div className="p-2 bg-gray-50 rounded">Composite: <strong>{app.compositeScore}</strong></div>
                      <div className="p-2 bg-gray-50 rounded">Repayment: <strong>{app.repaymentScore}</strong></div>
                      <div className="p-2 bg-gray-50 rounded">Need: <strong>{app.needScore}</strong></div>
                      <div className="p-2 bg-gray-50 rounded">Prev loans: <strong>{app.previousLoans}</strong></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => navigate("score", app.id)} 
                      className="px-3 py-2 bg-orange-600 text-white rounded shadow flex items-center gap-2 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      aria-label={`View details for application ${app.id}`}
                    >
                      <Eye size={14} aria-hidden="true" /> View
                    </button>
                    <button 
                      onClick={() => handleAdminChangeStatus(app.id, STATUS.APPROVED)} 
                      className="px-3 py-2 border rounded hover:bg-green-50 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      aria-label={`Approve application ${app.id}`}
                      disabled={app.status === STATUS.APPROVED}
                    >
                      {app.status === STATUS.APPROVED ? '✓ Approved' : 'Approve'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredApps.length === 0 && (
              <div className="text-center text-gray-500 py-8" role="status">
                {searchTerm || filterStatus !== 'all' ? 'No applications found matching your filters' : 'No applications found'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Admin helper to change status - moved inside AdminPanel
  // (now handled within AdminPanel component)

  // ---------- Router-like render ---------- //
  return (
    <div className="font-sans text-gray-900">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="status" aria-live="polite">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <div className="mt-4 text-gray-700">Loading...</div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="fixed top-4 right-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg shadow-lg z-40 max-w-md" role="alert" aria-live="assertive">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
            <div>
              <div className="font-semibold text-yellow-800">Warning</div>
              <div className="text-sm text-yellow-700">{error}</div>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-yellow-600 hover:text-yellow-800" aria-label="Dismiss warning">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {currentPage === "landing" && <LandingPage />}
      {currentPage === "apply" && <ApplicationForm key="application-form" />}
      {currentPage === "score" && <ScoreResult />}
      {currentPage === "dashboard" && <Dashboard />}
      {currentPage === "admin" && <AdminPanel />}

      {/* Floating quick actions with accessibility */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-3" role="navigation" aria-label="Quick actions">
        <button 
          onClick={() => navigate('apply')} 
          title="New application" 
          className="bg-orange-600 p-3 rounded-full shadow text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          aria-label="Create new application"
        >
          <Zap size={18} aria-hidden="true" />
        </button>
        <button 
          onClick={() => navigate('dashboard')} 
          title="Dashboard" 
          className="bg-white p-3 rounded-full shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          aria-label="Go to dashboard"
        >
          <BarChart3 size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

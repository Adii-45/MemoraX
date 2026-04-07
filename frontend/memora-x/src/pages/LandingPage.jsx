import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Brain,
  BarChart3,
  MessageCircle,
  TrendingUp,
  FileText,
  Upload,
  Cpu,
  Target,
  CheckCircle2,
  Star,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-xl font-bold">MemoraX</span>
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm text-gray-300 hover:text-white transition">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-gray-300 hover:text-white transition">
              How it Works
            </a>
            <a href="#pricing" className="text-sm text-gray-300 hover:text-white transition">
              Pricing
            </a>
            <a href="#contact" className="text-sm text-gray-300 hover:text-white transition">
              Contact
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-32 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div>
            <div className="inline-block bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              🧠 Powered Learning
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Study smarter.
              <br />
              Retain everything.
              <br />
              With AI.
            </h1>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Leverage AI to turn your study materials into flashcards, and quizzes instantly — so you spend less time creating and more time actually learning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition text-center"
              >
                Get Started Free →
              </Link>
              <button className="border border-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-900 transition flex items-center justify-center gap-2">
                ▶ Watch Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-slate-950"
                  ></div>
                ))}
              </div>
              <span>Join 5000+ students learning smarter</span>
            </div>
          </div>

          {/* Right Content - Feature Preview */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl">
              {/* Mock Dashboard */}
              <div className="space-y-6">
                {/* Progress bars */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Documents</span>
                    <span className="text-xs text-gray-500">75%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-3/4"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Flashcards</span>
                    <span className="text-xs text-gray-500">342</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-2/3"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Quizzes Done</span>
                    <span className="text-xs text-gray-500">74</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-1/2"></div>
                  </div>
                </div>
              </div>

              {/* Decorative dots */}
              <div className="flex justify-center gap-2 mt-8">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-8 -right-8 bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl w-48 hidden lg:block">
              <div className="text-xs text-gray-400 mb-2">Response Speed</div>
              <div className="text-2xl font-bold text-blue-400">2.4s</div>
              <div className="text-xs text-gray-500 mt-1">Faster than average</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to learn faster</h2>
            <p className="text-gray-400 text-lg">
              Powerful AI tools designed to transform how you study, retain, and master any subject.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Summaries</h3>
              <p className="text-gray-400">
                Instantly distill complex documents and quizzes into bite-sized summaries that capture key concepts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 hover:border-green-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Flashcard Generator</h3>
              <p className="text-gray-400">
                Auto-generate smart flashcards from your PDFs, notes, and documents — organizing them intelligently.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quiz Generator</h3>
              <p className="text-gray-400">
                Create practice quizzes tailored to your material and receive instant feedback on what you need to learn.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Chat Assistant</h3>
              <p className="text-gray-400">
                Get instant answers to your questions, clarify confusing concepts, and keep learning seamlessly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 hover:border-orange-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
              <p className="text-gray-400">
                Visualize your learning journey with detailed progress tracking, insights, and smart recommendations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 hover:border-pink-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Document Hub</h3>
              <p className="text-gray-400">
                One place for all your study materials, organized, searchable, and ready to be transformed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              How it Works
            </div>
            <h2 className="text-4xl font-bold mb-4">From PDF to mastery in minutes</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">1. Upload PDF</h3>
                <p className="text-gray-400 text-sm">
                  Drop any document in pdf or any format
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-blue-500">
                →
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cpu className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">2. AI Processes</h3>
                <p className="text-gray-400 text-sm">
                  Our AI extracts key concepts and synthesizes learning materials
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-green-500">
                →
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">3. Get Study Tools</h3>
                <p className="text-gray-400 text-sm">
                  Receive personalized quizzes tailored to your material
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-cyan-500">
                →
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">4. Track & Improve</h3>
                <p className="text-gray-400 text-sm">
                  Monitor your progress, track knowledge gaps, and repeat consistently
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                10+ hrs
              </div>
              <p className="text-gray-400 mt-2">Time saved per week on average</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                92%
              </div>
              <p className="text-gray-400 mt-2">Retention improvement among users</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                12000+
              </div>
              <p className="text-gray-400 mt-2">Happy students worldwide</p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "MemoraX completely changed how I study. I use to spend hours just reviewing flashcards, and quizzes instantly — so you spend less time creating and more time actually learning."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                <div>
                  <div className="font-bold">Sarah Chen</div>
                  <div className="text-gray-500 text-sm">Medical Student</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "I've tried countless studying apps, but MemoraX is genuinely different. The AI-powered features are intuitive, fast, and make studying a joy instead of a chore."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                <div>
                  <div className="font-bold">James Miller</div>
                  <div className="text-gray-500 text-sm">Law Student</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "Finally, an app that understands the burden of studying. MemoraX made it possible to ace my exams without losing my mind to boring repetition or pointless cramming."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></div>
                <div>
                  <div className="font-bold">Priya Patel</div>
                  <div className="text-gray-500 text-sm">Engineering Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-block bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Get Started
          </div>
          <h2 className="text-4xl font-bold mb-4">Ready to study smarter?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of students who are acing their exams with less effort, no credit card required.
          </p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="text-lg font-bold">MemoraX</span>
              </div>
              <p className="text-gray-500 text-sm">
                AI-powered learning platform helping students study smarter, retain more, and ace their exams.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2026 MemoraX. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

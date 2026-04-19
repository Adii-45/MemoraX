import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  ArrowRight,
  Play
} from "lucide-react";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="bg-neutral-950 text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-black/30 backdrop-blur-lg border-white/10 py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="MemoraX Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-blue-500/20 object-cover" />
            <span className="text-xl font-bold tracking-tight">MemoraX</span>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
              >
                Sign Up
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 relative min-h-screen flex items-center">
        {/* Advanced Background gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-transparent blur-3xl rounded-full opacity-70 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Brain className="w-4 h-4" />
              <span>Powered Learning</span>
            </div>

            <h1 className="text-5xl lg:text-[4rem] font-bold leading-tight lg:leading-[1.1] mb-6 tracking-tight max-w-[600px]">
              Study smarter.
              <br />
              <span className="text-neutral-400">Retain everything.</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                With AI.
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-neutral-400 mb-8 max-w-lg leading-relaxed">
              Leverage top-tier AI to turn your study materials into powerful flashcards and dynamic quizzes instantly. Master any subject with zero busywork.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-600 text-white w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 text-white w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </motion.button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                    alt="Student avatar"
                    className="w-10 h-10 rounded-full border-2 border-neutral-950 bg-neutral-800 object-cover"
                  />
                ))}
              </div>
              <span className="font-medium">Joined by <span className="text-white font-bold">5,000+</span> students</span>
            </div>
          </motion.div>

          {/* Right Content - Real Product Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="group relative lg:h-[480px] w-full max-w-[420px] mx-auto flex items-center justify-center mt-6 lg:mt-0 perspective-[1000px]"
          >
            {/* Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full z-0 transition-opacity duration-500 group-hover:opacity-100 opacity-70"></div>

            {/* Main Center Card (Flashcard Preview) */}
            <div className="relative z-30 w-full max-w-[340px] bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-[0_20px_60px_rgba(59,130,246,0.15)] animate-[float_6s_ease-in-out_infinite] scale-105 ring-1 ring-blue-500/20 group-hover:-translate-y-1 group-hover:shadow-[0_25px_65px_rgba(59,130,246,0.25)] transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                 <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md">
                   Biology - Cell Structure
                 </div>
                 <span className="text-xs text-neutral-400 font-medium">1 / 42</span>
              </div>
              <h4 className="text-white font-medium text-lg leading-snug mb-8">
                What is the primary function of the mitochondria in a eukaryotic cell?
              </h4>
              <button className="w-full bg-white/5 hover:bg-blue-500/10 border border-white/10 text-neutral-300 hover:text-white py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-md">
                Reveal Answer
              </button>
            </div>

            {/* Overlay Card 1 - Top Right (Stat) */}
            <div 
              className="absolute z-10 w-48 -top-4 -right-2 lg:-right-8 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl opacity-90 animate-[float_5s_ease-in-out_infinite] scale-95 group-hover:-translate-y-1 group-hover:shadow-blue-500/20 transition-all duration-300"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Quiz Score</span>
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-0.5">92%</div>
              <div className="text-xs text-blue-400 font-medium">Excellent form</div>
            </div>

            {/* Overlay Card 2 - Bottom Left (Generating UI) */}
            <div 
              className="absolute z-20 w-[260px] -bottom-8 -left-4 lg:-left-12 bg-neutral-900/80 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-xl opacity-90 animate-[float_7s_ease-in-out_infinite] scale-95 group-hover:-translate-y-1 group-hover:shadow-blue-500/20 transition-all duration-300"
              style={{ animationDelay: '1s' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <Brain className="w-4 h-4 text-blue-400 relative z-10" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-lg animate-ping"></div>
                </div>
                <div>
                  <span className="text-sm font-medium text-white block">AI Generating...</span>
                  <span className="text-xs text-neutral-400">Chapter 4 Notes</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 w-[75%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
                  <span>Processing text</span>
                  <span className="text-blue-400">75%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="py-32 px-4 sm:px-6 lg:px-8 bg-neutral-900/30 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUpVariant}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">Everything you need to master it</h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Professional-grade study tools tailored automatically from your course materials.
            </p>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
          >
            {/* Feature 1 */}
            <motion.div variants={fadeUpVariant} className="group bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
              <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">AI Summaries</h3>
              <p className="text-neutral-400 leading-relaxed text-sm">
                Instantly distill complex documents and dense texts into concise, easy-to-absorb concept maps.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeUpVariant} className="group bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
              <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">Smart Flashcards</h3>
              <p className="text-neutral-400 leading-relaxed text-sm">
                Auto-generate spaced repetition flashcards from your PDFs ensuring you never forget a key term.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeUpVariant} className="group bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
               <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">Adaptive Quizzes</h3>
              <p className="text-neutral-400 leading-relaxed text-sm">
                Generate practice exams tailored to your weak points. Get instant scoring and feedback.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={fadeUpVariant} className="group bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
               <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">Tutor Chat</h3>
              <p className="text-neutral-400 leading-relaxed text-sm">
                Chat directly with an AI trained on your specific lecture slides to resolve doubts instantly.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div variants={fadeUpVariant} className="group bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
               <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">Deep Tracking</h3>
              <p className="text-neutral-400 leading-relaxed text-sm">
                Visualize your learning curves. Identify exactly which topics require more focus before finals.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div variants={fadeUpVariant} className="group bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
               <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">Unified Hub</h3>
              <p className="text-neutral-400 leading-relaxed text-sm">
                A single, searchable central database for all your course documents, notes, and study guides.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        id="how-it-works" 
        className="py-32 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUpVariant}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">From upload to insights in seconds</h2>
          </div>

          <motion.div className="grid md:grid-cols-4 gap-6" variants={staggerContainer}>
            {/* Step 1 */}
            <motion.div variants={fadeUpVariant} className="relative group">
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center h-full hover:border-blue-500/40 transition-colors">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">1. Upload Focus</h3>
                <p className="text-neutral-400 text-sm">
                  Drop your PDF, slides, or raw notes into the engine.
                </p>
              </div>
              <div className="hidden md:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center z-10 text-neutral-600">
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeUpVariant} className="relative group">
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center h-full hover:border-blue-500/40 transition-colors">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Cpu className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">2. Processing</h3>
                <p className="text-neutral-400 text-sm">
                  Our LLM extracts logic, categorizes data, and builds context.
                </p>
              </div>
              <div className="hidden md:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center z-10 text-neutral-600">
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeUpVariant} className="relative group">
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center h-full hover:border-blue-500/40 transition-colors">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">3. Master Kit</h3>
                <p className="text-neutral-400 text-sm">
                  Receive personalized quizzes and flashcard decks instantly.
                </p>
              </div>
              <div className="hidden md:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center z-10 text-neutral-600">
                 <ArrowRight className="w-5 h-5" />
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={fadeUpVariant} className="group">
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center h-full hover:border-blue-500/40 transition-colors">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">4. Retain</h3>
                <p className="text-neutral-400 text-sm">
                  Use spaced repetition to commit concepts to long-term memory.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats & Testimonials Section */}
      <motion.section 
        className="py-32 px-4 sm:px-6 lg:px-8 bg-neutral-900/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUpVariant}
      >
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <motion.div className="grid md:grid-cols-3 gap-8 mb-32" variants={staggerContainer}>
            <motion.div variants={fadeUpVariant} className="text-center">
              <div className="text-6xl font-bold text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.3)] mb-4">
                10+ <span className="text-2xl">hrs</span>
              </div>
              <p className="text-neutral-400 font-medium tracking-wide text-sm uppercase">Saved per week</p>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="text-center border-y md:border-y-0 md:border-x border-white/10 py-8 md:py-0">
              <div className="text-6xl font-bold text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.3)] mb-4">
                92%
              </div>
              <p className="text-neutral-400 font-medium tracking-wide text-sm uppercase">Grade Improvement</p>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="text-center">
              <div className="text-6xl font-bold text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.3)] mb-4">
                12k+
              </div>
              <p className="text-neutral-400 font-medium tracking-wide text-sm uppercase">Active Students</p>
            </motion.div>
          </motion.div>

          {/* Testimonials */}
          <motion.div className="grid md:grid-cols-3 gap-6" variants={staggerContainer}>
            {/* Testimonial 1 */}
            <motion.div variants={fadeUpVariant} className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500 opacity-80" />
                ))}
              </div>
              <p className="text-neutral-300 mb-8 text-sm leading-relaxed">
                "MemoraX completely changed how I study. I use to spend hours just reviewing flashcards; now I just upload my slides and immediately start testing myself."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-800 rounded-full ring-2 ring-blue-500/30"></div>
                <div>
                  <div className="font-bold text-white text-sm">Sarah Chen</div>
                  <div className="text-blue-400 text-xs font-medium tracking-wide">Medical Student</div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div variants={fadeUpVariant} className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500 opacity-80" />
                ))}
              </div>
              <p className="text-neutral-300 mb-8 text-sm leading-relaxed">
                "I've tried countless studying apps, but the workflow here is genuinely different. The AI is shockingly good at picking up nuanced legal definitions."
              </p>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-neutral-800 rounded-full ring-2 ring-blue-500/30"></div>
                <div>
                  <div className="font-bold text-white text-sm">James Miller</div>
                  <div className="text-blue-400 text-xs font-medium tracking-wide">Law Student</div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div variants={fadeUpVariant} className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500 opacity-80" />
                ))}
              </div>
              <p className="text-neutral-300 mb-8 text-sm leading-relaxed">
                "Finally, an application that understands the burden of STEM. It makes dense engineering PDFs actionable and lets me focus purely on problem-solving."
              </p>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-neutral-800 rounded-full ring-2 ring-blue-500/30"></div>
                <div>
                  <div className="font-bold text-white text-sm">Priya Patel</div>
                  <div className="text-blue-400 text-xs font-medium tracking-wide">Engineering Major</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUpVariant}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-800/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10 px-6 py-10 lg:px-10 lg:py-14 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Get started with your AI study companion</h2>
          <p className="text-neutral-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Upload your material, generate flashcards, and start learning instantly.
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 mx-auto text-lg"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <p className="mt-6 text-xs text-neutral-400">No credit card required. Cancel anytime.</p>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <img src="/logo.png" alt="MemoraX Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-blue-500/20 object-cover" />
                <span className="text-lg font-bold tracking-tight">MemoraX</span>
              </Link>
              <p className="text-neutral-400 text-sm leading-relaxed tracking-tight">
                Study less randomly. Learn more intentionally.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">How it works</a></li>
                <li><a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Linear</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-neutral-500 text-sm mb-4 md:mb-0">
              © 2026 MemoraX Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
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

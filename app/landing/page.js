'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, MessageSquare, BookMarked, Lightbulb, Zap, Brain } from 'lucide-react'
import { SignIn, SignUp } from '@clerk/nextjs'

// ============================================================================
// SVG LOGO COMPONENTS (Custom built for Platform fidelity)
// ============================================================================

const PlatformIcons = {
  YouTube: () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current text-[#FF0000]" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Vimeo: () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current text-[#1AB7EA]" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.396 7.164c-.093 2.026-1.507 4.8-4.245 8.32C15.323 19.161 12.935 21 10.97 21c-1.214 0-2.246-1.12-3.097-3.36-.55-2.007-1.101-4.013-1.652-6.02-.61-2.333-1.267-3.5-1.969-3.5-.153 0-.687.318-1.599.957l-.958-1.229c1.01-.892 2.012-1.784 3.014-2.677C6.014 3.987 7.02 3.14 8.71 3.111c1.558-.029 2.512.115 2.863 3.111.428 3.65.731 5.913.914 6.784.428 2.028.916 3.041 1.467 3.041.427 0 1.07-.638 1.924-1.913.856-1.275 1.314-2.246 1.376-2.912.123-1.129-.306-1.693-1.286-1.693-.459 0-.932.106-1.422.316 1.008-3.3 2.928-4.908 5.759-4.819 2.079.064 3.064 1.442 2.956 4.138z"/>
    </svg>
  ),
  Dailymotion: () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current text-[#0066DC]" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.66 18.04c-3.13 0-5.71-2.58-5.71-5.71s2.58-5.71 5.71-5.71c3.13 0 5.71 2.58 5.71 5.71s-2.58 5.71-5.71 5.71zm0-10.29c-2.53 0-4.58 2.05-4.58 4.58s2.05 4.58 4.58 4.58 4.58-2.05 4.58-4.58-2.05-4.58-4.58-4.58zM24 12c0 6.63-5.37 12-12 12S0 18.63 0 12 5.37 0 12 0s12 5.37 12 12z"/>
    </svg>
  ),
  Coursera: () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current text-[#0056D2]" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.462c-3.564 0-6.462-2.898-6.462-6.462S8.436 5.538 12 5.538s6.462 2.898 6.462 6.462-2.898 6.462-6.462 6.462z"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current text-[#0A66C2]" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 .001-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  KhanAcademy: () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current text-[#14BF63]" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.462c-3.564 0-6.462-2.898-6.462-6.462S8.436 5.538 12 5.538s6.462 2.898 6.462 6.462-2.898 6.462-6.462 6.462z"/>
    </svg>
  )
}

// ============================================================================
// CONSTANTS
// ============================================================================

const NAV_ITEMS = [
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
  { label: 'Demo', href: '#demo' },
  { label: 'Join', href: '#join' },
]

const AVATAR_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop', alt: 'Avatar 1' },
  { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', alt: 'Avatar 2' },
  { src: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop', alt: 'Avatar 3' },
  { src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', alt: 'Avatar 4' },
  { src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', alt: 'Avatar 5' },
]

const LOGO_PLATFORMS = [
  { name: 'YouTube', icon: PlatformIcons.YouTube },
  { name: 'Vimeo', icon: PlatformIcons.Vimeo },
  { name: 'Dailymotion', icon: PlatformIcons.Dailymotion },
  { name: 'LinkedIn Learning', icon: PlatformIcons.LinkedIn },
  { name: 'Coursera', icon: PlatformIcons.Coursera },
  { name: 'Khan Academy', icon: PlatformIcons.KhanAcademy },
]

const FEATURES = [
  {
    icon: BookMarked,
    title: 'Collaborative Notes',
    description: 'Add notes to any educational video across platforms, share with the community, and upvote the most useful explanations.',
  },
  {
    icon: MessageSquare,
    title: 'Real-Time Doubt Solving',
    description: 'Ask doubts while watching videos and get community-driven answers for faster clarity.',
  },
  {
    icon: Lightbulb,
    title: 'Quick Revision Tools',
    description: 'Get AI-generated summaries, key tips, and highlights for fast concept revision without rewatching.',
  },
  {
    icon: Zap,
    title: 'Multi-Platform Content',
    description: 'Access curated content from YouTube, Vimeo, Dailymotion, and more directly on Library.',
  },
  {
    icon: Brain,
    title: 'Universal Focus Mode',
    description: 'Works across all platforms to block distractions and keep learning sessions clean and productive.',
  },
]

const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'Demo', 'Changelog'],
  Learning: ['YouTube Content', 'Community Notes', 'Doubt Solving', 'Guides'],
  Company: ['About', 'Careers', 'Blog', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
}

// ============================================================================
// HELPERS & COMPONENTS
// ============================================================================

const AnimatedLetter = ({ letter, index, color = 'text-white' }) => {
  return (
    <motion.span
      className={`inline-block ${color}`}
      initial={{ y: -100, opacity: 0, rotateX: 90 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.05,
        ease: [0.34, 1.56, 0.64, 1],
        type: 'spring',
      }}
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
    >
      {letter === ' ' ? '\u00A0' : letter}
    </motion.span>
  )
}

const AnimatedHeadline = ({ children, className = '', color = 'text-white' }) => {
  const letters = children.split('')
  return (
    <div className={`inline-block ${className}`}>
      {letters.map((letter, index) => (
        <AnimatedLetter key={`${letter}-${index}`} letter={letter} index={index} color={color} />
      ))}
    </div>
  )
}

const FloatingElement = ({ delay = 0, duration = 4, offset = 20, children, className = '' }) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -offset, 0],
        x: [0, offset * 0.5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// LOGO COMPONENT
// ============================================================================

const Logo = ({ variant = 'navbar' }) => {
  const isNavbar = variant === 'navbar'
  const isFooter = variant === 'footer'

  if (isNavbar) {
    return (
      <a href="/" className="flex items-center flex-shrink-0 gap-1 bg-white rounded-full px-3 py-2">
        <div className="w-8 h-8 text-blue-500 rounded-lg flex items-center justify-center font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-library"><path d="m16 6 4 14"></path><path d="M12 6v14"></path><path d="M8 8v12"></path><path d="M4 4v16"></path></svg>
        </div>
        <span className="font-bold text-lg tracking-tight text-blue-500">Library</span>
      </a>
    )
  }

  if (isFooter) {
    return (
      <a href="/" className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-library text-white"><path d="m16 6 4 14"></path><path d="M12 6v14"></path><path d="M8 8v12"></path><path d="M4 4v16"></path></svg>
        </div>
        <span className="font-bold text-2xl tracking-tight text-white">Library</span>
      </a>
    )
  }

  return null
}

// ============================================================================
// NAVBAR COMPONENT
// ============================================================================

const Navbar = ({ showSignIn, showSignUp }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between px-6 py-3 rounded-full bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-2xl">
          {/* Logo */}
          <Logo variant="navbar" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors relative rounded-lg"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="relative z-10">{item.label}</span>
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 bg-zinc-800 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <button onClick={showSignIn} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg">
              Login
            </button>
            <button onClick={showSignUp} className="px-5 py-2 text-sm font-semibold rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-zinc-400 hover:text-white bg-zinc-800/50 rounded-full" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mt-3 p-4 rounded-3xl bg-zinc-900/95 backdrop-blur-2xl border border-zinc-800 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-4 py-3 text-base font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <hr className="border-zinc-800 my-2" />
                <button onClick={() => { showSignIn(); setMobileMenuOpen(false); }} className="px-4 py-3 text-base font-medium text-zinc-400 text-left hover:text-white rounded-lg w-full text-left">Login</button>
                <button onClick={() => { showSignUp(); setMobileMenuOpen(false); }} className="px-4 py-4 text-base font-bold rounded-2xl bg-blue-500 text-white hover:bg-blue-600 w-full shadow-lg shadow-blue-500/20">
                  Start Learning
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

// ============================================================================
// MAIN PAGE SECTIONS
// ============================================================================

const HeroSection = ({ showSignIn, showSignUp }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-32 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />
      <div className="text-center max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/50 border border-blue-800/50 mb-12 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm font-medium text-blue-300">Multi-Platform Learning Hub</span>
        </motion.div>

        <div className="mb-6">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-4">
            <div className="block">
              <AnimatedHeadline color="text-white">Learn Smarter.</AnimatedHeadline>
            </div>
            <div className="block mt-2">
              <AnimatedHeadline color="text-blue-400">Together.</AnimatedHeadline>
            </div>
          </h1>
        </div>

        <FloatingElement offset={8} duration={5} delay={0.5}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Turn YouTube, Vimeo, and more into focused, collaborative learning experiences
            with real-time doubt solving and smart AI tools.
          </motion.p>
        </FloatingElement>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button onClick={showSignUp} className="group flex items-center gap-2 px-8 py-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/30 font-bold active:scale-95">
            Start Learning Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-900 transition-all font-semibold active:scale-95">
            Watch Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center -space-x-3">
            {AVATAR_IMAGES.map((avatar, index) => (
              <motion.img
                key={index}
                src={avatar.src}
                alt={avatar.alt}
                className="w-12 h-12 rounded-full border-4 border-zinc-950 object-cover shadow-xl"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              />
            ))}
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Joined by <span className="text-white">5,000+</span> learners worldwide
          </p>
        </motion.div>
      </div>
    </section>
  )
}

const LogoMarquee = () => {
  return (
    <section className="py-20 border-y border-zinc-900 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        <p className="text-xs text-zinc-600 uppercase tracking-[0.2em] font-bold text-center mb-12">Powering learning across platforms</p>
        <div className="relative flex overflow-x-hidden">
          <motion.div
            className="flex whitespace-nowrap gap-16 items-center"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...LOGO_PLATFORMS, ...LOGO_PLATFORMS].map((logo, index) => {
              const IconComponent = logo.icon
              return (
                <div key={index} className="flex items-center gap-4 px-6 group cursor-default">
                  <div className="opacity-30 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                    <IconComponent />
                  </div>
                  <span className="text-2xl font-black text-zinc-800 group-hover:text-zinc-200 transition-colors tracking-tight select-none">
                    {logo.name}
                  </span>
                </div>
              )
            })}
          </motion.div>
          {/* Edge Fades */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  )
}

const FeaturesSection = () => {
  return (
    <section className="py-32 px-4 relative overflow-hidden" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">Built for results.</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            Standard video players aren't built for education. We built a layer on top that turns passive watching into active mastery.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 transition-all duration-500 hover:bg-zinc-900/50"
              >
                <div className="p-3 rounded-2xl bg-blue-500/10 w-fit mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="bg-zinc-950 pt-24 pb-12 px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2">
             <Logo variant="footer" />
            <p className="text-zinc-500 text-lg mb-8 max-w-sm">The ultimate companion for the lifelong learner in the digital age.</p>
            <div className="flex gap-4">
              {['Twitter', 'GitHub', 'LinkedIn'].map(s => (
                <a key={s} href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-700 transition-all">{s[0]}</a>
              ))}
            </div>
          </div>
          {Object.entries(FOOTER_LINKS).map(([cat, links]) => (
            <div key={cat} className="col-span-1">
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">{cat}</h4>
              <ul className="space-y-4">
                {links.map(l => (
                  <li key={l}><a href="#" className="text-zinc-500 hover:text-blue-500 transition-colors font-medium">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 font-medium text-sm">
          <p>© {new Date().getFullYear()} Library Labs Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)

  return (
    <div className="bg-zinc-950 text-white min-h-screen selection:bg-blue-500/30 selection:text-blue-200 ">
      <Navbar showSignIn={() => setShowSignIn(true)} showSignUp={() => setShowSignUp(true)} />
      <HeroSection showSignIn={() => setShowSignIn(true)} showSignUp={() => setShowSignUp(true)} />
      <LogoMarquee />
      <FeaturesSection />
      <section className="py-32 px-4 bg-blue-600 rounded-[3rem] mx-4 my-8 text-center shadow-2xl shadow-blue-500/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-8">Ready to master any subject?</h2>
          <p className="text-blue-100 text-xl mb-12 font-medium opacity-90 max-w-2xl mx-auto">
            Join thousands of students and professionals who have leveled up their learning game.
          </p>
          <button onClick={showSignUp} className="px-10 py-5 bg-white text-blue-600 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl active:scale-95">
            Get Started for Free
          </button>
        </div>
      </section>
      <Footer />

      {/* Clerk Sign In Modal */}
      <AnimatePresence>
        {showSignIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSignIn(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <button
                onClick={() => setShowSignIn(false)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-zinc-800 transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
              <SignIn routing="hash" appearance={{ layout: 'modal' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clerk Sign Up Modal */}
      <AnimatePresence>
        {showSignUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSignUp(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <button
                onClick={() => setShowSignUp(false)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-zinc-800 transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
              <SignUp routing="hash" appearance={{ layout: 'modal' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
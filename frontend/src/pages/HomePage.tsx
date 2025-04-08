import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { JobsProvider } from '@/contexts/JobsContext';
import { Button } from '@/components/ui/button';

// Component imports
import SearchSection from '@/components/home/SearchSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturedJobsSection from '@/components/home/FeaturedJobsSection';
import FeaturedCompaniesSection from '@/components/home/FeaturedCompaniesSection';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroSectionRef = useRef<HTMLElement>(null);

  // Animation configurations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  };

  // Intersection observers for animations
  const [heroRef, heroInView] = useInView({
    triggerOnce: false,
    threshold: 0.1
  });

  const [searchRef, searchInView] = useInView({
    triggerOnce: false,
    threshold: 0.1
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: false,
    threshold: 0.1
  });

  const [jobsRef, jobsInView] = useInView({
    triggerOnce: false,
    threshold: 0.1
  });

  const [companiesRef, companiesInView] = useInView({
    triggerOnce: false,
    threshold: 0.1
  });

  // Handle mouse movement for cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroSectionRef.current) {
        const rect = heroSectionRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    const heroSection = heroSectionRef.current;
    if (heroSection) {
      heroSection.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (heroSection) {
        heroSection.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    
    if (searchKeyword) {
      searchParams.append('keyword', searchKeyword);
    }
    
    if (searchLocation) {
      searchParams.append('location', searchLocation);
    }
    
    const queryString = searchParams.toString();
    navigate(`/jobs${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <motion.section
        ref={(node) => {
          // Assign to both refs
          heroRef(node);
          if (node) heroSectionRef.current = node;
        }}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="bg-gray-50 pt-16 md:!pt-24 pb-24 md:!pb-32 relative overflow-hidden"
        style={{
          backgroundImage: mousePosition.x > 0 ? 
            `radial-gradient(
              circle 400px at ${mousePosition.x}px ${mousePosition.y}px,
              rgba(249, 250, 251, 1) 0%,
              rgba(243, 244, 246, 0.8) 40%,
              rgba(243, 244, 246, 0.4) 60%,
              rgba(243, 244, 246, 0) 70%
            )` : undefined
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              className="inline-block px-4 py-1.5 bg-gray-100 text-gray-400 rounded-full text-xs md:text-sm font-medium mb-6"
              variants={fadeIn}
            >
              Over 10,000+ Jobs Available
            </motion.span>
            
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-700 tracking-tight leading-tight"
              variants={fadeIn}
            >
              Find Your <span className="text-gray-900">Dream Job</span> Today
            </motion.h1>
            
            <motion.p 
              className="text-sm md:text-base text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto"
              variants={fadeIn}
            >
              Join thousands of job seekers who have found their perfect career match with our platform. Browse jobs from top companies and start your career journey.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:!flex-row justify-center gap-3 sm:gap-4 mt-8"
              variants={fadeIn}
            >
              <Button 
                asChild
                size="lg"
                className="bg-jobboard-purple text-white hover:bg-jobbard-purple/90 font-medium transition-all duration-300 text-sm md:text-base shadow-sm"
              >
                <Link to="/jobs">
                  Find Jobs
                </Link>
              </Button>
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="border-jobboard-purple text-jobboard-purple hover:bg-[#836FFF] hover:text-white font-medium transition-all duration-300 text-sm md:text-base"
              >
                <Link to="/employer/jobs/create">
                  Post a Job
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Search Section */}
      <SearchSection 
        searchRef={searchRef}
        searchInView={searchInView}
        fadeIn={fadeIn}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        handleSearch={handleSearch}
      />

      {/* Stats Section */}
      <StatsSection 
        statsRef={statsRef}
        statsInView={statsInView}
        fadeIn={fadeIn}
        staggerContainer={staggerContainer}
      />

      {/* Featured Jobs Section - Wrapped in JobsProvider */}
      <JobsProvider>
        <FeaturedJobsSection 
          jobsRef={jobsRef} 
          jobsInView={jobsInView}
          fadeIn={fadeIn}
          staggerContainer={staggerContainer}
          cardVariants={cardVariants}
        />
      </JobsProvider>

      {/* Featured Companies Section */}
      <FeaturedCompaniesSection 
        companiesRef={companiesRef}
        companiesInView={companiesInView}
        fadeIn={fadeIn}
        staggerContainer={staggerContainer}
        cardVariants={cardVariants}
      />
    </div>
  );
};

export default HomePage;

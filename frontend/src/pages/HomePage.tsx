import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, ChevronRight, Star, Building, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useFeaturedJobs from '@/hooks/react-queries/job/useFeaturedJobs';
import { formatDistanceToNow } from 'date-fns';
import { Job } from '@/types/job.types';
import { JobsProvider, useJobsContext } from '@/contexts/JobsContext';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
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
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: {
    y: -8,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Inner component that uses the JobsContext
const HomePageContent: React.FC = () => {
  const navigate = useNavigate();
  const { handleJobView } = useJobsContext();
  const { data: featuredJobsData, isLoading: isLoadingFeaturedJobs } = useFeaturedJobs();

  // Local state for search form
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // Create refs for scroll animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [searchRef, searchInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuredRef, featuredInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [companiesRef, companiesInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build query params
    const params = new URLSearchParams();
    if (searchKeyword) params.append('keyword', searchKeyword);
    if (searchLocation) params.append('location', searchLocation);

    // Navigate to jobs page with search params
    navigate({
      pathname: '/jobs',
      search: params.toString()
    });
  };

  // Handle job card click
  const handleJobClick = (job: Job) => {
    handleJobView(job);
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="relative bg-gradient-to-r from-jobboard-light to-[#f5f5ff] text-jobboard-darkblue overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
          <motion.div
            className="max-w-3xl relative z-10"
            variants={staggerContainer}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            <motion.h1
              className="text-4xl text-primary md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              variants={fadeIn}
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#211951] to-[#836FFF]">
                Find Your Dream Job Today
              </span>
            </motion.h1>
            <motion.p
              className="text-xl mb-8 opacity-90 text-gray-700"
              variants={fadeIn}
            >
              Connect with top employers and discover opportunities that match your skills and career goals.
            </motion.p>
            <motion.div
              className="flex flex-row gap-4"
              variants={fadeIn}
            >
              <Button
                asChild
                size="lg"
                variant="teal"
                className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to="/jobs">Find Jobs</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="tealOutline"
                className="transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to="/post-job">Post a Job</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Abstract shapes for visual interest */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <motion.div
              className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-[#836FFF] blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            ></motion.div>
            <motion.div
              className="absolute bottom-1/4 right-20 w-48 h-48 rounded-full bg-[#211951] blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            ></motion.div>
          </div>
        </div>
      </motion.section>

      {/* Job Search Section */}
      <motion.section
        ref={searchRef}
        initial="hidden"
        animate={searchInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="py-12 relative"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <Card className="bg-white rounded-xl shadow-lg p-6 md:p-8 -mt-20 border-none transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold mb-6 text-jobboard-darkblue">Search for Jobs</h2>
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  <div className="space-y-2 md:col-span-3">
                    <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                      What
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="keyword"
                        placeholder="Job title, keywords, or company"
                        className="pl-10 border-gray-300 focus:border-jobboard-purple focus:ring-jobboard-purple/30 w-full transition-all duration-200"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Where
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="location"
                        placeholder="City, state, or remote"
                        className="pl-10 border-gray-300 focus:border-jobboard-purple focus:ring-jobboard-purple/30 w-full transition-all duration-200"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-end md:col-span-1">
                    <Button
                      type="submit"
                      className="w-full bg-jobboard-purple hover:bg-jobboard-purple/90 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                      size="lg"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Statistics Section - New Addition */}
      <motion.section
        ref={statsRef}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="py-12 bg-white"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:!grid-cols-4 gap-6 text-center">
            <motion.div
              className="p-6 transform transition-transform hover:scale-105 duration-300"
              variants={cardVariants}
            >
              <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-jobboard-light text-jobboard-purple">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-jobboard-darkblue mb-1">5k+</h3>
              <p className="text-gray-600">Active Jobs</p>
            </motion.div>

            <motion.div
              className="p-6 transform transition-transform hover:scale-105 duration-300"
              variants={cardVariants}
            >
              <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-jobboard-light text-jobboard-purple">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-jobboard-darkblue mb-1">1.2k+</h3>
              <p className="text-gray-600">Companies</p>
            </motion.div>

            <motion.div
              className="p-6 transform transition-transform hover:scale-105 duration-300"
              variants={cardVariants}
            >
              <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-jobboard-light text-jobboard-purple">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-jobboard-darkblue mb-1">98%</h3>
              <p className="text-gray-600">Client Satisfaction</p>
            </motion.div>

            <motion.div
              className="p-6 transform transition-transform hover:scale-105 duration-300"
              variants={cardVariants}
            >
              <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-jobboard-light text-jobboard-purple">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-jobboard-darkblue mb-1">24k+</h3>
              <p className="text-gray-600">Job Seekers</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Jobs Section */}
      <motion.section
        ref={featuredRef}
        initial="hidden"
        animate={featuredInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="py-12 bg-gray-50"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-jobboard-darkblue relative">
              Featured Jobs
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-jobboard-purple"></span>
            </h2>
            <Link
              to="/jobs"
              className="text-jobboard-purple hover:text-jobboard-darkblue font-medium transition-colors flex items-center group"
            >
              View All Jobs
              <ChevronRight className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoadingFeaturedJobs ? (
            // Loading skeleton for featured jobs
            <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <Card key={index} className="overflow-hidden border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Skeleton className="w-12 h-12 rounded-md mr-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="flex gap-2 mb-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-14 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 gap-6"
              variants={staggerContainer}
            >
              {featuredJobsData?.jobs && featuredJobsData.jobs.length > 0 ? (
                featuredJobsData.jobs.map((job) => {
                  // Format data for display
                  const companyInitials = job.company?.name?.substring(0, 2).toUpperCase() || 'CO';
                  const postedDate = job.createdAt
                    ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
                    : 'Recently';

                  // Limit skills to show (to prevent overflow)
                  const displaySkills = job.requiredSkills.slice(0, 3);

                  return (
                    <motion.div
                      key={job.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      onClick={() => handleJobClick(job)}
                      className="cursor-pointer"
                    >
                      <Card className="overflow-hidden border-none shadow-md bg-white h-full">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            {job.company?.logo ? (
                              <img
                                src={job.company.logo}
                                alt={job.company.name || 'Company'}
                                className="w-12 h-12 rounded-md object-cover mr-4 shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-jobboard-light to-jobboard-teal/30 rounded-md flex items-center justify-center mr-4 shadow-sm">
                                <span className="text-jobboard-darkblue font-bold">{companyInitials}</span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-lg text-jobboard-darkblue line-clamp-1">{job.title}</h3>
                              <p className="text-sm text-gray-600 line-clamp-1">{job.company?.name}</p>
                            </div>
                          </div>
                          <p className="mb-4 text-gray-700 line-clamp-2">{job.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-jobboard-purple/70" />
                              <span className="truncate">{job.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Briefcase className="w-4 h-4 mr-2 flex-shrink-0 text-jobboard-purple/70" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center text-gray-600 sm:col-span-2">
                              <Clock className="w-4 h-4 mr-2 flex-shrink-0 text-jobboard-purple/70" />
                              <span>Posted {postedDate}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {displaySkills.map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-jobboard-light/50 text-jobboard-darkblue border-jobboard-teal/30 transition-colors hover:bg-jobboard-light"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Button
                              asChild
                              variant="outline"
                              className="w-full border-jobboard-purple text-jobboard-purple hover:bg-[#836FFF] hover:text-white transition-all duration-300"
                            >
                              <Link to={`/jobs/${job.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                  <p className="text-gray-500">No jobs available at the moment. Check back soon!</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="py-16 bg-gradient-to-r from-[#211951] to-[#836FFF] text-white mt-auto relative overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.h2
            className="text-3xl font-bold mb-6"
            variants={fadeIn}
          >Ready to Take the Next Step in Your Career?</motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-3xl mx-auto opacity-90"
            variants={fadeIn}
          >
            Join thousands of job seekers who have found their dream jobs through our platform.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Button
                asChild
                size="lg"
                className="bg-jobboard-teal hover:bg-jobboard-teal/90 text-jobboard-darkblue font-semibold w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to="/register">Create an Account</Link>
              </Button>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20 w-full sm:w-auto transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
          <motion.div
            className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-white blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>
          <motion.div
            className="absolute bottom-1/4 right-10 w-72 h-72 rounded-full bg-white blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          ></motion.div>
        </div>
      </motion.section>

      {/* Featured Companies Section */}
      <motion.section
        ref={companiesRef}
        initial="hidden"
        animate={companiesInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="py-12 bg-white"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <motion.h2
              className="text-2xl font-bold text-jobboard-darkblue mb-4 inline-block relative"
              variants={fadeIn}
            >
              Featured Companies
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-jobboard-purple"></span>
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto mt-4"
              variants={fadeIn}
            >
              Discover top companies that are currently hiring and find your perfect match.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            variants={staggerContainer}
          >
            {[1, 2, 3, 4, 5, 6].map((company) => (
              <motion.div
                key={company}
                variants={cardVariants}
                whileHover="hover"
              >
                <Card className="bg-white border-none shadow-sm h-full">
                  <CardContent className="p-4 flex items-center justify-center h-24">
                    <div className="w-16 h-16 bg-gradient-to-br from-jobboard-light to-jobboard-teal/30 rounded-md flex items-center justify-center">
                      <span className="text-jobboard-darkblue font-bold">CO</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

// Wrapper component that provides the JobsContext
const HomePage: React.FC = () => {
  return (
    <JobsProvider>
      <HomePageContent />
    </JobsProvider>
  );
};

export default HomePage;

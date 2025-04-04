import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, MapPin, Star, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Job, JobType } from '@/types/job.types';
import { useJobsContext } from '@/contexts/JobsContext';
import useFeaturedJobs from '@/hooks/react-queries/job/useFeaturedJobs';

interface FeaturedJobsSectionProps {
  jobsRef: React.RefCallback<HTMLElement>;
  jobsInView: boolean;
  fadeIn: any; // Animation variant
  staggerContainer: any; // Animation variant
  cardVariants: any; // Animation variant
}

const FeaturedJobsSection: React.FC<FeaturedJobsSectionProps> = ({
  jobsRef,
  jobsInView,
  fadeIn,
  staggerContainer,
  cardVariants,
}) => {
  const { handleJobView } = useJobsContext();
  const { data: featuredJobs, isLoading } = useFeaturedJobs();

  // Helper function to get badge color based on job type
  const getJobTypeBadgeColor = (type: JobType): string => {
    switch (type) {
      case 'FULL_TIME':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'PART_TIME':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'CONTRACT':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  // Helper function to format job type display
  const formatJobType = (type: JobType): string => {
    switch (type) {
      case 'FULL_TIME':
        return 'Full Time';
      case 'PART_TIME':
        return 'Part Time';
      case 'CONTRACT':
        return 'Contract';
      default:
        return type;
    }
  };

  const renderJobCard = (job: Job) => (
    <motion.div 
      key={job.id}
      variants={cardVariants}
      whileHover="hover"
    >
      <Link to={`/jobs/${job.id}`} onClick={() => handleJobView(job)}>
        <Card className="h-full bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 bg-jobboard-light rounded-md flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-jobboard-purple" />
              </div>
              <Badge 
                className={`${getJobTypeBadgeColor(job.type)} rounded-full text-xs font-medium py-1`}
              >
                {formatJobType(job.type)}
              </Badge>
            </div>
            
            <h3 className="text-base font-semibold text-jobboard-darkblue mb-1 line-clamp-1">{job.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-1">{job.company?.name || 'Company'}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-500 text-xs">
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                <span className="line-clamp-1">{job.location}</span>
              </div>
              <div className="flex items-center text-gray-500 text-xs">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                <span>Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center text-gray-500 text-xs">
                <Star className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
                <span>${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()} / year</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {job.requiredSkills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-gray-50 text-xs font-medium py-1">
                  {skill}
                </Badge>
              ))}
              {job.requiredSkills.length > 3 && (
                <Badge variant="outline" className="bg-gray-50 text-xs font-medium py-1">
                  +{job.requiredSkills.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );

  const renderSkeletonCard = (index: number) => (
    <motion.div 
      key={`skeleton-${index}`}
      variants={cardVariants}
    >
      <Card className="h-full bg-white border-none shadow-sm">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <Skeleton className="w-10 h-10 rounded-md" />
            <Skeleton className="w-20 h-6 rounded-full" />
          </div>
          
          <Skeleton className="h-5 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/2 mb-3" />
          
          <div className="space-y-2 mb-4">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.section
      ref={jobsRef}
      initial="hidden"
      animate={jobsInView ? "visible" : "hidden"}
      variants={fadeIn}
      className="py-16 bg-gray-50"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.h2
            className="text-2xl font-bold text-jobboard-darkblue mb-4 inline-block relative"
            variants={fadeIn}
          >
            Featured Jobs
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-jobboard-purple"></span>
          </motion.h2>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto mt-4"
            variants={fadeIn}
          >
            Discover opportunities from top companies and find your perfect role.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 gap-6"
          variants={staggerContainer}
        >
          {isLoading ? (
            Array(8).fill(0).map((_, index) => renderSkeletonCard(index))
          ) : (
            featuredJobs?.jobs.map((job) => renderJobCard(job))
          )}
        </motion.div>
        
        <div className="mt-10 text-center">
          <Button
            asChild
            variant="outline"
            className="border-jobboard-purple text-jobboard-purple hover:bg-[#836FFF] hover:text-white transition-all duration-300"
          >
            <Link to="/jobs" className="inline-flex items-center">
              View All Jobs
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedJobsSection;

import React from 'react';
import { JobsProvider } from '@/contexts/JobsContext';
import JobFilters from '@/components/jobs/JobFilters';
import JobList from '@/components/jobs/JobList';
import RecentlyViewedJobs from '@/components/jobs/RecentlyViewedJobs';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

const JobsPage: React.FC = () => {
  return (
    <JobsProvider>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-jobboard-light to-jobboard-light/70 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-jobboard-darkblue mb-4">Find Your Dream Job</h1>
            <p className="text-gray-700 text-lg mb-6">
              Discover thousands of job opportunities with the top employers
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Desktop Layout */}
          <div className="hidden md:!flex md:!gap-6">
            {/* Sidebar with filters - Always on left for larger screens */}
            <div className="w-1/4 flex-shrink-0">
              <div className="sticky top-4">
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <Briefcase className="w-5 h-5 text-jobboard-purple mr-2" />
                    <h2 className="text-lg font-semibold text-jobboard-darkblue">Filters</h2>
                  </div>
                  <JobFilters />
                </div>
              </div>
            </div>

            {/* Main content with job listings */}
            <div className="w-3/4">
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-6">
                <JobList />
              </div>
              
              {/* Recently Viewed Jobs Section */}
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-6">
                <div className="flex items-center mb-4">
                  <h2 className="text-lg font-semibold text-jobboard-darkblue">Recently Viewed Jobs</h2>
                </div>
                <RecentlyViewedJobs />
              </div>
              
              {/* Employer Call-to-Action Section - Below job list on desktop */}
              <div className="bg-gradient-to-r from-[#211951] to-[#836FFF] rounded-lg shadow-sm p-6 text-center">
                <h2 className="text-xl font-bold text-white mb-3">Looking to Hire?</h2>
                <p className="text-jobboard-light opacity-90 mb-4 text-sm">
                  Post your job openings and connect with qualified candidates.
                </p>
                <Link to="/post-job">
                  <Button className="bg-white hover:bg-gray-100 text-jobboard-darkblue cursor-pointer font-semibold">
                    Post a Job
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:!hidden flex flex-col gap-6">
            {/* Filters first on mobile */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex items-center mb-4">
                <Briefcase className="w-5 h-5 text-jobboard-purple mr-2" />
                <h2 className="text-lg font-semibold text-jobboard-darkblue">Filters</h2>
              </div>
              <JobFilters />
            </div>

            {/* Job listings */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <JobList />
            </div>
            
            {/* Recently Viewed Jobs Section */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-jobboard-darkblue">Recently Viewed Jobs</h2>
              </div>
              <RecentlyViewedJobs />
            </div>
            
            {/* Employer Call-to-Action Section - Below job list on mobile */}
            <div className="bg-gradient-to-r from-[#211951] to-[#836FFF] rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-xl font-bold text-white mb-3">Looking to Hire?</h2>
              <p className="text-jobboard-light opacity-90 mb-4 text-sm">
                Post your job openings and connect with qualified candidates.
              </p>
              <Link to="/post-job">
                <Button className="bg-white hover:bg-gray-100 text-jobboard-darkblue cursor-pointer font-semibold w-full">
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </JobsProvider>
  );
};

export default JobsPage;

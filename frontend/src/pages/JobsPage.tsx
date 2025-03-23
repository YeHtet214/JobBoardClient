import React from 'react';
import { JobsProvider } from '../contexts/JobsContext';
import JobFilters from '../components/jobs/JobFilters';
import JobList from '../components/jobs/JobList';
import RecentlyViewedJobs from '../components/jobs/RecentlyViewedJobs';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const JobsPage: React.FC = () => {
  return (
    <JobsProvider>
      <section>
        <div className="bg-jobboard-light py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-jobboard-darkblue mb-8">Browse Jobs</h1>

            <div className="grid grid-cols-1 md:!grid-cols-5 lg:!grid-cols-4 gap-6">
              {/* Sidebar with filters */}
              <div className="md:col-span-2 lg:col-span-1">
                <JobFilters />
                {/* Employer Call-to-Action Section */}
                <div className="mt-12 bg-gradient-to-r from-[#211951] to-[#836FFF] rounded-lg shadow-lg p-8 text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Looking to Hire? Reach the Best Talent Today!</h2>
                  <p className="text-jobboard-light/90 mb-6 max-w-2xl mx-auto">
                    Post your job openings and connect with qualified candidates who are ready to bring value to your company.
                  </p>
                  <Link to="/post-job">
                    <Button className="bg-jobboard-teal hover:bg-jobboard-teal/90 text-jobboard-darkblue cursor-pointer font-semibold px-6 py-3 text-lg">
                      Post a Job
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Main content with job listings */}
              <div className="md:col-span-3 lg:col-span-3">
                <JobList />
                <RecentlyViewedJobs />
              </div>
            </div>
          </div>
        </div>
      </section>
    </JobsProvider>
  );
};

export default JobsPage;

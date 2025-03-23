import React from 'react';
import { useJobsContext } from '../../contexts/JobsContext';
import JobCard from './JobCard';
import { Job } from '../../types/job.types';

const RecentlyViewedJobs: React.FC = () => {
  const { recentlyViewedJobs } = useJobsContext();

  if (recentlyViewedJobs.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-jobboard-darkblue mb-6">Recently Viewed Jobs</h2>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No recently viewed jobs. Start exploring jobs above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-jobboard-darkblue mb-6">Recently Viewed Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recentlyViewedJobs.map((job: Job, index: number) => (
          <JobCard key={index} job={job} isCompact={true} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedJobs;

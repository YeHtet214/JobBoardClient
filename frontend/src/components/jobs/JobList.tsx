import React from 'react';
import { useJobsContext } from '../../contexts/JobsContext';
import JobCard from './JobCard';
import Pagination from './Pagination';
import { Job } from '../../types/job.types';

const JobList: React.FC = () => {
  const { jobs, isLoading, error } = useJobsContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jobboard-purple"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error instanceof Error ? error.message : 'An error occurred'}
      </div>
    );
  }

  if (jobs?.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
        <p className="text-gray-600">Try adjusting your search filters or check back later for new opportunities.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* For the demo, we're using mock data. In a real app, this would map over actual job data */}
      {jobs?.length > 0 ? (
        jobs.map((job: Job) => (
          <JobCard key={job.id} job={job} />
        ))
      ) : (
        // Fallback to mock data if no real jobs are available
        [1, 2].map((id) => (
          <JobCard
            key={id}
            job={{
              id: id.toString(),
              title: 'Mocked Job',
              description: 'Lorem ipsum dolor sit amet',
              companyId: '1',
              postedById: '1',
              location: 'San Francisco, CA (Remote)',
              type: 'FULL_TIME',
              salaryMin: 120,
              salaryMax: 150,
              requiredSkills: ['React', 'TypeScript', 'Node.js'],
              experienceLevel: 'mid',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              company: { name: 'Company Name' }
            }}
          />
        ))
      )}

      <Pagination />
    </div>
  );
};

export default JobList;

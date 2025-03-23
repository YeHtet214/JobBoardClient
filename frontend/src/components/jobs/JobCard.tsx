import React from 'react';
import { Job } from '../../types/job.types';
import { Link } from 'react-router-dom';
import { useJobsContext } from '../../contexts/JobsContext';

interface JobCardProps {
  job: Job;
  isCompact?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, isCompact = false }) => {
  const { handleJobView } = useJobsContext();

  // For demo purposes, using mock data where needed
  const companyInitials = job.company?.name?.substring(0, 2).toUpperCase() || 'CO';
  const formattedSalary = `$${job.salaryMin}K - $${job.salaryMax}K`;

  const handleClick = () => {
    handleJobView(job);
  };

  if (isCompact) {
    return (
      <div
        className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
        onClick={handleClick}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 bg-jobboard-light rounded-md flex items-center justify-center mr-3">
            <span className="text-jobboard-darkblue font-bold text-sm">{companyInitials}</span>
          </div>
          <div>
            <h3 className="font-semibold text-jobboard-darkblue">{job.title}</h3>
            <p className="text-gray-600 text-sm">{job.company?.name || 'Company Name'}</p>
          </div>
        </div>
        <Link to={`/jobs/${job.id}`}>
          <button className="mt-3 w-full bg-jobboard-light hover:bg-jobboard-light/80 text-jobboard-darkblue px-4 py-1.5 rounded-md font-medium text-sm">
            View Details
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-jobboard-light rounded-md flex items-center justify-center mr-4">
            <span className="text-jobboard-darkblue font-bold">{companyInitials}</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-jobboard-darkblue">{job.title}</h3>
            <p className="text-gray-600">{job.company?.name || 'Company Name'}</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            <span className="inline-block mr-2">
              <svg className="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </span>
            {job.location}
          </p>
          <p className="text-gray-600">
            <span className="inline-block mr-2">
              <svg className="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </span>
            {job.type}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {job.requiredSkills.map((skill, index) => (
            <span key={index} className="bg-jobboard-light text-jobboard-darkblue text-xs px-2 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-green-600 font-medium">{formattedSalary}</span>
          <Link to={`/jobs/${job.id}/apply`}>
            <button className="bg-jobboard-purple hover:bg-jobboard-purple/90 text-white px-4 py-2 rounded-md font-medium">
              Apply Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

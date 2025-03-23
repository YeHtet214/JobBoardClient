import React from 'react';
import Sidebar from '../layouts/Sidebar';
import { useJobsContext } from '../../contexts/JobsContext';

const JobFilters: React.FC = () => {
  const {
    keyword,
    setKeyword,
    location,
    setLocation,
    jobTypes,
    handleJobTypeChange,
    experienceLevel,
    setExperienceLevel,
    handleSearch
  } = useJobsContext();

  return (
    <Sidebar title="Filter Jobs">
      <form onSubmit={handleSearch}>
        <div className="mb-4">
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
            Keyword
          </label>
          <input
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title or keyword"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-jobboard-purple focus:border-jobboard-purple"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, state, or remote"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-jobboard-purple focus:border-jobboard-purple"
          />
        </div>

        <div className="mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Job Type
          </span>
          <div className="space-y-2">
            {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={`job-type-${type}`}
                  checked={jobTypes.includes(type)}
                  onChange={() => handleJobTypeChange(type)}
                  className="h-4 w-4 text-jobboard-purple focus:ring-jobboard-purple border-gray-300 rounded"
                />
                <label htmlFor={`job-type-${type}`} className="ml-2 text-sm text-gray-700">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Experience Level
          </label>
          <select
            id="experience"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-jobboard-purple focus:border-jobboard-purple"
          >
            <option value="">Any Experience</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="executive">Executive</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-jobboard-purple hover:bg-jobboard-purple/90 text-white p-2 rounded-md font-medium"
        >
          Apply Filters
        </button>
      </form>
    </Sidebar>
  );
};

export default JobFilters;

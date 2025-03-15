import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Sidebar from '../components/layout/Sidebar';
import { Job } from '../types/job.types';
import jobService from '../services/job.service';

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [keyword, setKeyword] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsData = await jobService.getAllJobs();
        setJobs(jobsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs. Please try again later.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleJobTypeChange = (type: string) => {
    if (jobTypes.includes(type)) {
      setJobTypes(jobTypes.filter(t => t !== type));
    } else {
      setJobTypes([...jobTypes, type]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would call the search service with filters
    console.log('Searching with filters:', { keyword, location, jobTypes, experienceLevel });
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Browse Jobs</h1>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar with filters */}
            <div className="lg:w-1/4">
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-medium"
                  >
                    Apply Filters
                  </button>
                </form>
              </Sidebar>
            </div>
            
            {/* Main content with job listings */}
            <div className="lg:w-3/4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              ) : jobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your search filters or check back later for new opportunities.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* This would normally map over actual job data */}
                  {[1, 2, 3, 4, 5].map((job) => (
                    <div key={job} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                            <span className="text-gray-500 font-bold">CO</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">Software Engineer</h3>
                            <p className="text-gray-600">Company Name</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-gray-600 mb-2">
                            <span className="inline-block mr-2">
                              <svg className="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                            </span>
                            San Francisco, CA (Remote)
                          </p>
                          <p className="text-gray-600">
                            <span className="inline-block mr-2">
                              <svg className="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                            </span>
                            Full-time
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">React</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">TypeScript</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Node.js</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-600 font-medium">$120K - $150K</span>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobsPage;

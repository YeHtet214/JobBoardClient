import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl mb-8">
              Connect with top employers and discover opportunities that match your skills and career goals.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/jobs"
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-center"
              >
                Find Jobs
              </Link>
              <Link
                to="/post-job"
                className="border border-white text-white hover:bg-blue-700 px-6 py-3 rounded-md font-medium text-center"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Job Search Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 -mt-20">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Search for Jobs</h2>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                  What
                </label>
                <input
                  type="text"
                  id="keyword"
                  placeholder="Job title, keywords, or company"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Where
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="City, state, or remote"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-medium"
                >
                  Search Jobs
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Featured Jobs</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-800 font-medium">
              View All Jobs
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This would be mapped from actual job data */}
            {[1, 2, 3].map((job) => (
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
                  <Link
                    to={`/jobs/${job}`}
                    className="block w-full text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Companies</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover top companies that are currently hiring and find your perfect match.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((company) => (
              <div key={company} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-24 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 font-bold">CO</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Take the Next Step in Your Career?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of job seekers who have found their dream jobs through our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium"
            >
              Create an Account
            </Link>
            <Link
              to="/jobs"
              className="border border-white text-white hover:bg-blue-700 px-6 py-3 rounded-md font-medium"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

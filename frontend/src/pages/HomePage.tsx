import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-jobboard-light text-jobboard-darkblue">

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl text-primary md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Connect with top employers and discover opportunities that match your skills and career goals.
            </p>
            <div className="flex flex-row gap-4">
              <Button
                asChild
                size="lg"
                variant="teal"
              >
                <Link to="/jobs">Find Jobs</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="tealOutline"
              >
                <Link to="/post-job">Post a Job</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Search Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-white rounded-xl shadow-lg p-6 md:p-8 -mt-20 border-none">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold mb-6 text-jobboard-darkblue">Search for Jobs</h2>
              <form>
                <div className="grid grid-cols-1 md:!grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                      What
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="keyword"
                        placeholder="Job title, keywords, or company"
                        className="pl-10 border-gray-300 focus:border-jobboard-purple focus:ring-jobboard-purple/30 w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Where
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="location"
                        placeholder="City, state, or remote"
                        className="pl-10 border-gray-300 focus:border-jobboard-purple focus:ring-jobboard-purple/30 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="submit"
                      className="w-full bg-jobboard-purple hover:bg-jobboard-purple/90 text-white font-medium"
                      size="lg"
                    >
                      Search Jobs
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-jobboard-darkblue">Featured Jobs</h2>
            <Link to="/jobs" className="text-jobboard-purple hover:text-jobboard-darkblue font-medium transition-colors">
              View All Jobs
            </Link>
          </div>

          <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((job) => (
              <Card key={job} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-jobboard-light rounded-md flex items-center justify-center mr-4">
                      <span className="text-jobboard-darkblue font-bold">CO</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-jobboard-darkblue">Software Engineer</h3>
                      <p className="text-gray-600">Company Name</p>
                    </div>
                  </div>
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>San Francisco, CA (Remote)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Full-time</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Posted 2 days ago</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="bg-jobboard-light/50 text-jobboard-darkblue border-jobboard-teal/30">React</Badge>
                    <Badge variant="outline" className="bg-jobboard-light/50 text-jobboard-darkblue border-jobboard-teal/30">TypeScript</Badge>
                    <Badge variant="outline" className="bg-jobboard-light/50 text-jobboard-darkblue border-jobboard-teal/30">Node.js</Badge>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-jobboard-purple text-jobboard-purple hover:bg-jobboard-purple hover:text-white transition-colors"
                  >
                    <Link to={`/jobs/${job}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-[#211951] to-[#836FFF] text-white mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Take the Next Step in Your Career?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of job seekers who have found their dream jobs through our platform.
          </p>
          <div className="flex flex-col sm:!flex-row sm:justify-center sm:items-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-jobboard-teal hover:bg-jobboard-teal/90 text-jobboard-darkblue font-semibold w-full sm:!w-auto"
            >
              <Link to="/register">Create an Account</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-jobboard-darkblue hover:!bg-white/20 w-full sm:!w-auto"
            >
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="py-12 bg-jobboard-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-jobboard-darkblue mb-4">Featured Companies</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover top companies that are currently hiring and find your perfect match.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((company) => (
              <Card key={company} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-center h-24">
                  <div className="w-16 h-16 bg-jobboard-light rounded-md flex items-center justify-center">
                    <span className="text-jobboard-darkblue font-bold">CO</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default HomePage;

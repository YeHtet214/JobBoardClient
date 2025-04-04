import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SearchSectionProps {
  searchRef: React.RefCallback<HTMLElement>;
  searchInView: boolean;
  fadeIn: any; // Animation variant
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  searchLocation: string;
  setSearchLocation: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchRef,
  searchInView,
  fadeIn,
  searchKeyword,
  setSearchKeyword,
  searchLocation,
  setSearchLocation,
  handleSearch,
}) => {
  return (
    <motion.section
      ref={searchRef}
      initial="hidden"
      animate={searchInView ? "visible" : "hidden"}
      variants={fadeIn}
      className="py-12 relative"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <Card className="bg-white rounded-xl shadow-lg p-6 md:p-8 -mt-20 border-none transition-all duration-300 hover:shadow-xl">
          <CardContent className="p-0">
            <h2 className="text-2xl font-bold mb-6 text-jobboard-darkblue">Search for Jobs</h2>
            <form onSubmit={handleSearch} className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div className="space-y-2 md:col-span-3">
                  <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                    What
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="keyword"
                      placeholder="Job title, keywords, or company"
                      className="pl-10 border-gray-300 focus:border-jobboard-purple focus:ring-jobboard-purple/30 w-full transition-all duration-200"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-3">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Where
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="location"
                      placeholder="City, state, or remote"
                      className="pl-10 border-gray-300 focus:border-jobboard-purple focus:ring-jobboard-purple/30 w-full transition-all duration-200"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-end md:col-span-1">
                  <Button
                    type="submit"
                    className="w-full bg-jobboard-purple hover:bg-jobboard-purple/90 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    size="lg"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};

export default SearchSection;

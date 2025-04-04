import React from 'react';
import { motion } from 'framer-motion';
import { Building, TrendingUp, Users, Trophy } from 'lucide-react';

interface StatsSectionProps {
  statsRef: React.RefCallback<HTMLElement>;
  statsInView: boolean;
  fadeIn: any; // Animation variant
  staggerContainer: any; // Animation variant
}

const StatsSection: React.FC<StatsSectionProps> = ({
  statsRef,
  statsInView,
  fadeIn,
  staggerContainer,
}) => {
  const stats = [
    {
      icon: <Building className="w-6 h-6 md:w-7 md:h-7 text-jobboard-purple" />,
      count: '10K+',
      label: 'Active Jobs',
      description: 'Apply to thousands of active jobs across various industries'
    },
    {
      icon: <Trophy className="w-6 h-6 md:w-7 md:h-7 text-jobboard-purple" />,
      count: '500+',
      label: 'Companies',
      description: 'Connect with hundreds of top companies looking for talent'
    },
    {
      icon: <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-jobboard-purple" />,
      count: '98%',
      label: 'Client Satisfaction',
      description: 'Our companies report high satisfaction with candidate quality'
    },
    {
      icon: <Users className="w-6 h-6 md:w-7 md:h-7 text-jobboard-purple" />,
      count: '2M+',
      label: 'Job Seekers',
      description: 'Join millions of professionals finding their dream jobs'
    },
  ];

  return (
    <motion.section
      ref={statsRef}
      initial="hidden"
      animate={statsInView ? "visible" : "hidden"}
      variants={fadeIn}
      className="py-16 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-white rounded-xl shadow-sm p-6 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 bg-jobboard-light rounded-full flex items-center justify-center">
                {stat.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-jobboard-darkblue mb-2">{stat.count}</h3>
              <p className="text-lg font-medium text-jobboard-darkblue mb-2">{stat.label}</p>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default StatsSection;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from '../ui/badge';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Calendar, 
  FileText, 
  User, 
  Bookmark,
  ListChecks,
  Mail,
  Eye
} from 'lucide-react';

// Types for the job seeker dashboard
interface JobApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  status: 'PENDING' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED';
  applied: string; // ISO date string
  logo?: string;
}

interface SavedJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  savedAt: string; // ISO date string
  logo?: string;
}

interface RecentActivity {
  id: string;
  type: 'VIEW' | 'APPLY' | 'SAVE' | 'MESSAGE';
  title: string;
  timestamp: string; // ISO date string
  relatedEntity: string;
}

interface JobSeekerStats {
  totalApplications: number;
  interviews: number;
  offers: number;
  savedJobs: number;
}

interface JobSeekerDashboardProps {
  stats: JobSeekerStats;
  applications: JobApplication[];
  savedJobs: SavedJob[];
  recentActivity: RecentActivity[];
}

const JobSeekerDashboard: React.FC<JobSeekerDashboardProps> = ({
  stats,
  applications,
  savedJobs,
  recentActivity
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'INTERVIEW':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Interview</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case 'ACCEPTED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      default:
        return null;
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'VIEW':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'APPLY':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'SAVE':
        return <Bookmark className="h-4 w-4 text-purple-500" />;
      case 'MESSAGE':
        return <Mail className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:!grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-jobboard-darkblue">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold mt-1">{stats.totalApplications}</p>
              </div>
              <div className="h-12 w-12 bg-jobboard-darkblue/10 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-jobboard-darkblue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-jobboard-purple">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Interviews</p>
                <p className="text-2xl font-bold mt-1">{stats.interviews}</p>
              </div>
              <div className="h-12 w-12 bg-jobboard-purple/10 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-jobboard-purple" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-jobboard-teal">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Offers</p>
                <p className="text-2xl font-bold mt-1">{stats.offers}</p>
              </div>
              <div className="h-12 w-12 bg-jobboard-teal/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-jobboard-teal" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Saved Jobs</p>
                <p className="text-2xl font-bold mt-1">{stats.savedJobs}</p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Bookmark className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="applications" className="text-base">
                <ListChecks className="h-4 w-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-base">
                <Bookmark className="h-4 w-4 mr-2" />
                Saved Jobs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Your Job Applications</CardTitle>
                  <CardDescription>
                    Track and manage your job applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 grid grid-cols-1 md:!grid-cols-2 gap-4">
                    {applications.length > 0 ? (
                      applications.map((application) => (
                        <div
                          key={application.id}
                          className="p-4 border rounded-lg hover:border-jobboard-purple transition-colors group cursor-pointer"
                          onClick={() => navigate(`/applications/${application.id}`)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                <Briefcase className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-medium group-hover:text-jobboard-purple transition-colors">
                                  {application.jobTitle}
                                </h3>
                                <p className="text-sm text-gray-500">{application.companyName}</p>
                              </div>
                            </div>
                            {getStatusBadge(application.status)}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Applied on {formatDate(application.applied)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto" />
                        <p className="mt-4 text-gray-500">You haven't applied to any jobs yet.</p>
                        <Button
                          className="mt-4 bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
                          onClick={() => navigate('/jobs')}
                        >
                          Browse Jobs
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                {applications.length > 0 && (
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => navigate('/applications')}>
                      View All Applications
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Your Saved Jobs</CardTitle>
                  <CardDescription>
                    Jobs you've bookmarked for later
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {savedJobs.length > 0 ? (
                      savedJobs.map((job) => (
                        <div
                          key={job.id}
                          className="p-4 border rounded-lg hover:border-jobboard-purple transition-colors group cursor-pointer"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                <Briefcase className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-medium group-hover:text-jobboard-purple transition-colors">
                                  {job.title}
                                </h3>
                                <p className="text-sm text-gray-500">{job.companyName}</p>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className="text-xs font-normal">
                                    {job.location}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-yellow-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle unsave functionality
                                console.log('Unsaved job', job.id);
                              }}
                            >
                              <Bookmark className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Saved on {formatDate(job.savedAt)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Bookmark className="h-12 w-12 text-gray-300 mx-auto" />
                        <p className="mt-4 text-gray-500">You haven't saved any jobs yet.</p>
                        <Button
                          className="mt-4 bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
                          onClick={() => navigate('/jobs')}
                        >
                          Browse Jobs
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                {savedJobs.length > 0 && (
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => navigate('/saved-jobs')}>
                      View All Saved Jobs
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="mt-1">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">
                        {activity.relatedEntity} • {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>
                Complete your profile to increase visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium">Profile completion</p>
                    <p className="text-sm font-medium">75%</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-jobboard-purple w-3/4 rounded-full"></div>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Basic information completed</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Added 3 skills</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <div className="h-4 w-4 border border-gray-300 rounded-full mr-2"></div>
                    <span>Add work experience</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <div className="h-4 w-4 border border-gray-300 rounded-full mr-2"></div>
                    <span>Upload resume</span>
                  </li>
                </ul>

                <Button
                  className="w-full bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Complete Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;

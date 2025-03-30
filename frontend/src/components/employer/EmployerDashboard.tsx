import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Calendar, 
  FileText, 
  Building,
  User,
  Plus,
  Eye,
  UserCheck
} from 'lucide-react';

// Types for the employer dashboard
interface PostedJob {
  id: string;
  title: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  applicationsCount: number;
  status: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
  postedAt: string; // ISO date string
  expiresAt: string; // ISO date string
}

interface ReceivedApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantId: string;
  status: 'PENDING' | 'REVIEWING' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED';
  appliedAt: string; // ISO date string
}

interface EmployerActivity {
  id: string;
  type: 'NEW_APPLICATION' | 'APPLICATION_VIEWED' | 'JOB_POSTED' | 'JOB_EXPIRED' | 'INTERVIEW_SCHEDULED';
  title: string;
  timestamp: string; // ISO date string
  relatedEntity: string;
}

interface EmployerStats {
  activeJobs: number;
  totalApplications: number;
  reviewingApplications: number;
  interviewInvitations: number;
}

interface EmployerDashboardProps {
  stats: EmployerStats;
  postedJobs: PostedJob[];
  applications: ReceivedApplication[];
  recentActivity: EmployerActivity[];
  companyProfileComplete: boolean;
}

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  stats,
  postedJobs,
  applications,
  recentActivity,
  companyProfileComplete
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

  const getStatusBadge = (status: ReceivedApplication['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'REVIEWING':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Reviewing</Badge>;
      case 'INTERVIEW':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Interview</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case 'ACCEPTED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      default:
        return null;
    }
  };

  const getJobStatusBadge = (status: PostedJob['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'EXPIRED':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Expired</Badge>;
      case 'DRAFT':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Draft</Badge>;
      default:
        return null;
    }
  };

  const getActivityIcon = (type: EmployerActivity['type']) => {
    switch (type) {
      case 'NEW_APPLICATION':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'APPLICATION_VIEWED':
        return <Eye className="h-4 w-4 text-purple-500" />;
      case 'JOB_POSTED':
        return <Briefcase className="h-4 w-4 text-green-500" />;
      case 'JOB_EXPIRED':
        return <Clock className="h-4 w-4 text-red-500" />;
      case 'INTERVIEW_SCHEDULED':
        return <Calendar className="h-4 w-4 text-yellow-500" />;
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
                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                <p className="text-2xl font-bold mt-1">{stats.activeJobs}</p>
              </div>
              <div className="h-12 w-12 bg-jobboard-darkblue/10 rounded-full flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-jobboard-darkblue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-jobboard-purple">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Applications</p>
                <p className="text-2xl font-bold mt-1">{stats.totalApplications}</p>
              </div>
              <div className="h-12 w-12 bg-jobboard-purple/10 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-jobboard-purple" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-jobboard-teal">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Reviewing</p>
                <p className="text-2xl font-bold mt-1">{stats.reviewingApplications}</p>
              </div>
              <div className="h-12 w-12 bg-jobboard-teal/10 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-jobboard-teal" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Interviews</p>
                <p className="text-2xl font-bold mt-1">{stats.interviewInvitations}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="jobs" className="text-base">
                <Briefcase className="h-4 w-4 mr-2" />
                Posted Jobs
              </TabsTrigger>
              <TabsTrigger value="applications" className="text-base">
                <FileText className="h-4 w-4 mr-2" />
                Applications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Job Postings</CardTitle>
                    <CardDescription>
                      Manage your active and expired job listings
                    </CardDescription>
                  </div>
                  <Button 
                    className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
                    onClick={() => navigate('/employer/jobs/create')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post Job
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {postedJobs.length > 0 ? (
                      postedJobs.map((job) => (
                        <div
                          key={job.id}
                          className="p-4 border rounded-lg hover:border-jobboard-purple transition-colors group cursor-pointer"
                          onClick={() => navigate(`/employer/jobs/${job.id}`)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium group-hover:text-jobboard-purple transition-colors">
                                {job.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs font-normal">
                                  {job.location}
                                </Badge>
                                <Badge variant="outline" className="text-xs font-normal">
                                  {job.type}
                                </Badge>
                                {getJobStatusBadge(job.status)}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>{job.applicationsCount} applications</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Posted on {formatDate(job.postedAt)}</span>
                            </div>
                            {job.status !== 'EXPIRED' && (
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>Expires {formatDate(job.expiresAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Briefcase className="h-12 w-12 text-gray-300 mx-auto" />
                        <p className="mt-4 text-gray-500">You haven't posted any jobs yet.</p>
                        <Button
                          className="mt-4 bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
                          onClick={() => navigate('/jobs/create')}
                        >
                          Post Your First Job
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                {postedJobs.length > 0 && (
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => navigate('/employer/jobs')}>
                      View All Jobs
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Received Applications</CardTitle>
                  <CardDescription>
                    Review and manage applications to your job postings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.length > 0 ? (
                      applications.map((application) => (
                        <div
                          key={application.id}
                          className="p-4 border rounded-lg hover:border-jobboard-purple transition-colors group cursor-pointer"
                          onClick={() => navigate(`/employer/applications/${application.id}`)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-medium group-hover:text-jobboard-purple transition-colors">
                                  {application.applicantName}
                                </h3>
                                <p className="text-sm text-gray-500">Applied for {application.jobTitle}</p>
                              </div>
                            </div>
                            {getStatusBadge(application.status)}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Applied on {formatDate(application.appliedAt)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto" />
                        <p className="mt-4 text-gray-500">You haven't received any applications yet.</p>
                        <Button
                          className="mt-4 bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
                          onClick={() => navigate('/jobs/create')}
                        >
                          Post a Job
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                {applications.length > 0 && (
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => navigate('/employer/applications')}>
                      View All Applications
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
                Recent activity on your job postings
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
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>
                {companyProfileComplete 
                  ? "Your company profile looks great!" 
                  : "Complete your company profile to attract more applicants"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!companyProfileComplete && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">Profile completion</p>
                      <p className="text-sm font-medium">50%</p>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-jobboard-purple w-1/2 rounded-full"></div>
                    </div>
                  </div>
                )}

                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Basic company information added</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Company location set</span>
                  </li>
                  {!companyProfileComplete && (
                    <>
                      <li className="flex items-center text-sm text-gray-500">
                        <div className="h-4 w-4 border border-gray-300 rounded-full mr-2"></div>
                        <span>Add company logo</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-500">
                        <div className="h-4 w-4 border border-gray-300 rounded-full mr-2"></div>
                        <span>Complete company description</span>
                      </li>
                    </>
                  )}
                </ul>

                <Button
                  className="w-full bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
                  onClick={() => navigate('/company/profile')}
                >
                  <Building className="h-4 w-4 mr-2" />
                  {companyProfileComplete ? "Update Company Profile" : "Complete Company Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;

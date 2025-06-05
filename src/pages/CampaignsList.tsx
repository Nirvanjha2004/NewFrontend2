import React from 'react';
import { Plus, TrendingUp, Users, Send, MessageCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCampaignsQuery } from '@/hooks/useCampaignQueries';
import { CampaignState } from '@/types/campaigns';
import { format } from 'date-fns';
import DashboardLayout from '@/components/DashboardLayout';

const CampaignsListContent = () => {
  // Use the campaigns API hook
  const { data: campaigns = [], isLoading, error } = useCampaignsQuery();

  // Calculate total statistics
  const totalLeads = campaigns.reduce((sum, c) => sum + (c.leads?.data?.length || 0), 0);
  const totalSent = campaigns.reduce((sum, c) => {
    // If we have insights, use them, otherwise estimate from leads data
    if (c.insights) {
      return sum + (c.insights.connectionRequestsSent || 0);
    }
    return sum;
  }, 0);
  
  const totalAccepted = campaigns.reduce((sum, c) => {
    if (c.insights) {
      return sum + (c.insights.connectionRequestsAccepted || 0);
    }
    return sum;
  }, 0);
  
  const totalReplies = campaigns.reduce((sum, c) => {
    if (c.insights) {
      return sum + (c.insights.responses || 0);
    }
    return sum;
  }, 0);

  // Count active campaigns
  const activeCampaigns = campaigns.filter(c => c.state === CampaignState.RUNNING).length;

  // Map campaign state to UI status
  const getStatusFromState = (state: CampaignState | undefined) => {
    if (state === undefined) return 'Unknown';
    switch (state) {
      case CampaignState.RUNNING:
        return 'Active';
      case CampaignState.PAUSED:
        return 'Paused';
      case CampaignState.STOPPED:
        return 'Stopped';
      case CampaignState.COMPLETED:
        return 'Completed';
      default:
        return 'Draft';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'Paused':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Stopped':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'Completed':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // Format date
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Unknown';
    return format(new Date(timestamp), 'yyyy-MM-dd');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
            Campaign Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage and track your outreach campaigns with powerful analytics
          </p>
        </div>
        
        <Link to="/campaign">
          <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 px-6 py-3 text-base font-semibold">
            <Plus className="w-5 h-5" />
            Start New Campaign
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Campaigns</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : campaigns.length}
            </div>
            <p className="text-sm text-gray-500">All time</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Active Campaigns</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Send className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : activeCampaigns}
            </div>
            <p className="text-sm text-gray-500">Currently running</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : totalLeads}
            </div>
            <p className="text-sm text-gray-500">Prospects reached</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Replies</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <MessageCircle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : totalReplies}
            </div>
            <p className="text-sm text-gray-500">Engagement received</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="border-0 shadow-xl mb-8">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-900">Campaign Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg text-gray-700">Loading campaigns...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16 px-6">
              <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-4xl">!</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Error loading campaigns</h3>
              <p className="text-red-600 mb-8 max-w-md mx-auto">
                {error.message || "An unexpected error occurred"}
              </p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-purple-200 rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Ready to start your first campaign?</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Create targeted outreach campaigns and connect with your ideal prospects through personalized messaging.
              </p>
              <Link to="/campaign">
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-lg px-8 py-3">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Campaign
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Campaign Name</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Leads</TableHead>
                    <TableHead className="font-semibold text-gray-700">Sent</TableHead>
                    <TableHead className="font-semibold text-gray-700">Accepted</TableHead>
                    <TableHead className="font-semibold text-gray-700">Replies</TableHead>
                    <TableHead className="font-semibold text-gray-700">Created</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-semibold text-gray-900">{campaign.name}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(getStatusFromState(campaign.state))}`}>
                          {getStatusFromState(campaign.state)}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{campaign.leads?.data?.length || 0}</TableCell>
                      <TableCell className="font-medium">{campaign.insights?.connectionRequestsSent || 0}</TableCell>
                      <TableCell className="font-medium">{campaign.insights?.connectionRequestsAccepted || 0}</TableCell>
                      <TableCell className="font-medium">{campaign.insights?.responses || 0}</TableCell>
                      <TableCell className="text-gray-600">{formatDate(campaign.createdAt)}</TableCell>
                      <TableCell>
                        <Link to={`/campaigns/${campaign.id}/analytics`}>
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary font-medium">
                            View Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Main component wrapping the content in the layout
const CampaignsList = () => {
  return (
    <DashboardLayout activePage="campaigns">
      <CampaignsListContent />
    </DashboardLayout>
  );
};

export default CampaignsList;

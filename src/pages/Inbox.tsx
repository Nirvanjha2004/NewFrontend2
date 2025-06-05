<<<<<<< HEAD:src/pages/Inbox.tsx
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { InboxContent } from "@/components/Inbox/InboxContent";
import { ConversationView } from "@/components/Inbox/ConversationView";
import { ProfileSidebar } from "@/components/ProfileSidebar";
import { Conversation } from "@/types/inbox";
import DashboardLayout from "@/components/DashboardLayout";

const InboxMainContent = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState<Conversation | null>(null);

  const handleProfilePreview = (conversation: Conversation) => {
    setProfileData(conversation);
    setIsProfileSidebarOpen(true);
  };

  // const handleSidebarToggle = (expanded: boolean) => {
  //   setIsLeftSidebarExpanded(expanded);
  //   // Auto-open profile sidebar when left sidebar is contracted
  //   if (!expanded && selectedConversation) {
  //     setIsProfileSidebarOpen(true);
  //     setProfileData(selectedConversation);
  //   }
  // };
=======

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
>>>>>>> 8d8e8fcd446a13c1ad5cb5133b16ccdd079fa901:src/pages/Index.tsx

export default function Index() {
  return (
<<<<<<< HEAD:src/pages/Inbox.tsx
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <div 
        className={`flex-1 flex shadow-xl rounded-l-2xl bg-white transition-all duration-300 ${
          isProfileSidebarOpen ? 'mr-80' : 'mr-0'
        }`}
      >
        <InboxContent 
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          onProfilePreview={handleProfilePreview}
        />
        <ConversationView 
          conversation={selectedConversation}
          onClose={() => setSelectedConversation(null)}
          onProfilePreview={handleProfilePreview}
        />
=======
    <div className="min-h-full bg-slate-900 text-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">LinkedIn CRM Dashboard</h1>
          <p className="text-slate-400">Manage your LinkedIn connections and campaigns</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-slate-400">
                Get started with common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/accounts">
                <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white border-slate-600" variant="outline">
                  Manage Accounts
                </Button>
              </Link>
              <Link to="/leads">
                <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white border-slate-600" variant="outline">
                  Add Leads
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-slate-400">
                Latest updates and messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                No recent activity to display.
              </p>
            </CardContent>
          </Card>
        </div>
>>>>>>> 8d8e8fcd446a13c1ad5cb5133b16ccdd079fa901:src/pages/Index.tsx
      </div>
    </div>
  );
<<<<<<< HEAD:src/pages/Inbox.tsx
};

const Inbox = () => {
  return (
    <DashboardLayout activePage="inbox">
      <InboxMainContent />
    </DashboardLayout>
  );
};

export default Inbox;
=======
}
>>>>>>> 8d8e8fcd446a13c1ad5cb5133b16ccdd079fa901:src/pages/Index.tsx

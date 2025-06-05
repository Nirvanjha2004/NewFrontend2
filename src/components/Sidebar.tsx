import { 
  Home, 
  Search,
  MessageSquare, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ListPlus,
  LayoutDashboard
} from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
  activePage?: string;
}

export const Sidebar = ({ isExpanded, onToggle, activePage = 'campaigns' }: SidebarProps) => {
  const sidebarItems = [
    { icon: LayoutDashboard, path: "/", name: "Dashboard", id: "dashboard" },
    { icon: MessageSquare, path: "/inbox", name: "Inbox", id: "inbox" },
    { icon: Users, path: "/accounts", name: "Accounts", id: "accounts" },
    { icon: ListPlus, path: "/allcampaigns", name: "Campaigns", id: "campaigns" },
    { icon: Calendar, path: "/calendar", name: "Calendar", id: "calendar" },
    { icon: BarChart3, path: "/analytics", name: "Analytics", id: "analytics" },
    { icon: Settings, path: "/settings", name: "Settings", id: "settings" },
  ];

  return (
    <div 
      className={`${isExpanded ? 'w-64' : 'w-16'} flex flex-col py-6 transition-all duration-300 h-full`} 
      style={{ backgroundColor: '#28244c' }}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between px-4 mb-8">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
          </div>
          {isExpanded && (
            <div className="text-white font-bold text-xl">Outflo</div>
          )}
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={() => onToggle(!isExpanded)}
          className="text-white/60 hover:text-white p-1 rounded-md hover:bg-white/10 transition-all"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex flex-col space-y-2 px-3">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <Link
              to={item.path}
              key={item.id}
              className={`group relative flex items-center ${isExpanded ? 'px-4' : 'px-3'} py-3 rounded-xl transition-all duration-300 hover:bg-white/10 ${
                isActive 
                  ? 'bg-white/20 text-white shadow-md' 
                  : 'text-white/60 hover:text-white'
              }`}
              title={!isExpanded ? item.name : undefined}
            >
              <Icon size={20} className="transition-transform group-hover:scale-110 flex-shrink-0" />
              {isExpanded && (
                <span className="ml-3 font-medium">{item.name}</span>
              )}
              {isActive && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Add campaign button */}
      <div className="mt-auto px-3">
        <Link
          to="/campaign"
          className={`flex items-center justify-center ${
            isExpanded ? 'justify-start px-4' : 'px-3'
          } py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300`}
        >
          <span className="font-bold text-lg">+</span>
          {isExpanded && <span className="ml-2 font-medium">New Campaign</span>}
        </Link>
      </div>
    </div>
  );
};

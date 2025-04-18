import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { 
  LayoutDashboard, 
  Server, 
  AlertTriangle, 
  Clock, 
  Settings, 
  LogOut, 
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Restore sidebar state from local storage
    const savedState = localStorage.getItem("dashboard-sidebar-collapsed");
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === "true");
    }
  }, []);

  useEffect(() => {
    // Save sidebar state to local storage
    localStorage.setItem("dashboard-sidebar-collapsed", isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);

  useEffect(() => {
    // Redirect to login if not logged in
    if (isLoaded && !user) {
      navigate("/sign-in");
    }
  }, [isLoaded, user, navigate]);

  // Close mobile sidebar when navigating to a new route
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    signOut().then(() => {
      navigate("/sign-in");
    });
  };

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Services", path: "/dashboard/services", icon: Server },
    { name: "Incidents", path: "/dashboard/incidents", icon: AlertTriangle },
    { name: "Maintenance", path: "/dashboard/maintenance", icon: Clock },
    { name: "Uptime Monitor", path: "/dashboard/uptime", icon: Monitor },


    { 
      name: "Settings", 
      path: "/dashboard/settings", 
      icon: Settings
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  // Extract organization name from user metadata (if available)
  const organizationName = user.organizationMemberships?.[0]?.organization.name || "Your Organization";
  const userName = user.fullName || user.firstName || "User";
  const userEmail = user.primaryEmailAddress?.emailAddress || "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Mobile sidebar toggle button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      
      {/* Sidebar - Mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-20 w-64 transform bg-sidebar text-sidebar-foreground shadow-lg transition-transform duration-200 ease-in-out lg:hidden
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-sidebar-border">
            <h2 className="text-xl font-bold">Status Dashboard</h2>
            <div className="mt-2 text-sm text-sidebar-foreground/70">
              {organizationName}
            </div>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </div>
            ))}
          </nav>
          
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center mb-4">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8"
                  }
                }}
                signInUrl="/sign-in"
              />
              <div className="ml-3">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-sidebar-foreground/70">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-left text-destructive hover:bg-sidebar-accent/50 rounded-md"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div 
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300",
          isSidebarCollapsed ? "w-[70px]" : "w-64"
        )}
      >
        <div className={cn(
          "p-4 border-b border-sidebar-border flex items-center justify-between",
          isSidebarCollapsed && "justify-center p-2"
        )}>
          {!isSidebarCollapsed && (
            <h2 className="text-xl font-bold">Status Dashboard</h2>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className={cn("text-sidebar-foreground", isSidebarCollapsed && "mx-auto")}
          >
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigationItems.map((item) => (
            <div key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center rounded-md transition-colors",
                  isSidebarCollapsed ? "justify-center px-2 py-2" : "px-4 py-2",
                  location.pathname === item.path
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={cn("h-5 w-5", !isSidebarCollapsed && "mr-3")} />
                {!isSidebarCollapsed && item.name}
              </Link>
            </div>
          ))}
        </nav>
        
        <div className={cn(
          "p-4 border-t border-sidebar-border",
          isSidebarCollapsed && "p-2 flex flex-col items-center"
        )}>
          {!isSidebarCollapsed ? (
            <>
              <div className="flex items-center mb-4">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-8 w-8"
                    }
                  }}
                  signInUrl="/sign-in"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-sidebar-foreground/70">{userEmail}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-left text-destructive hover:bg-sidebar-accent/50 rounded-md"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8"
                  }
                }}
                signInUrl="/sign-in"
              />
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-8 h-8 mt-4 text-destructive hover:bg-sidebar-accent/50 rounded-md"
                title="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile overlay when sidebar is open */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        
        {/* Header */}
        <header className="bg-card text-card-foreground shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-semibold">
                {navigationItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
              </h1>
              
              <div className="flex items-center space-x-3">
                <ThemeToggle variant="ghost" />
                <Link to="/public" target="_blank" className="text-primary text-sm hover:underline">
                  View public status page
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

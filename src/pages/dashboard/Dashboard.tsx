import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, AlertCircle, Clock, ArrowUpCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format, subDays } from "date-fns";
import { useAuth } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [maintenanceEvents, setMaintenanceEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { toast } = useToast();

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        
        if (!token) {
          throw new Error("Authentication token is missing. Please log in again.");
        }
        
        // Fetch services
        const servicesResponse = await fetch('https://status-app-backend-kow1.onrender.com/api/services', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        
        if (!servicesResponse.ok) {
          throw new Error(`Services API request failed with status: ${servicesResponse.status}`);
        }
        
        // Fetch incidents
        const incidentsResponse = await fetch('https://status-app-backend-kow1.onrender.com/api/incidents', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        
        if (!incidentsResponse.ok) {
          throw new Error(`Incidents API request failed with status: ${incidentsResponse.status}`);
        }
        
        // Fetch maintenance events
        const maintenanceResponse = await fetch('https://status-app-backend-kow1.onrender.com/api/maintenance', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        
        if (!maintenanceResponse.ok) {
          throw new Error(`Maintenance API request failed with status: ${maintenanceResponse.status}`);
        }
        
        // Process responses
        const servicesData = await servicesResponse.json();
        const incidentsData = await incidentsResponse.json();
        const maintenanceData = await maintenanceResponse.json();
        
        // Handle various response formats
        if (Array.isArray(servicesData)) {
          setServices(servicesData);
        } else if (servicesData && typeof servicesData === 'object' && servicesData.services) {
          setServices(servicesData.services);
        } else {
          console.warn('Services API response is not in expected format:', servicesData);
          setServices([]);
        }
        
        if (incidentsData && incidentsData.incidents) {
          setIncidents(incidentsData.incidents);
        } else {
          console.warn('Incidents API response is not in expected format:', incidentsData);
          setIncidents([]);
        }
        
        if (maintenanceData && maintenanceData.maintenanceEvents) {
          setMaintenanceEvents(maintenanceData.maintenanceEvents);
        } else {
          console.warn('Maintenance API response is not in expected format:', maintenanceData);
          setMaintenanceEvents([]);
        }
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
        toast({
          title: "Error loading dashboard",
          description: err instanceof Error ? err.message : 'An error occurred',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast, getToken]);

  // Get active incidents and scheduled maintenance
  const activeIncidents = incidents.filter(incident => incident.status !== "resolved");
  const scheduledMaintenance = maintenanceEvents.filter(
    event => event.status === "scheduled" && new Date(event.scheduledStart) > new Date()
  );

  // Function to determine overall status based on services
  const getOverallStatus = () => {
    if (services.length === 0) return "operational";
    
    if (services.some(s => s.status === "major_outage")) return "major_outage";
    if (services.some(s => s.status === "partial_outage")) return "partial_outage";
    if (services.some(s => s.status === "degraded_performance" || s.status === "degraded")) return "degraded";
    if (services.some(s => s.status === "maintenance")) return "maintenance";
    
    return "operational";
  };

  const overallStatus = getOverallStatus();

  // Status distribution data for the pie chart
  const statusDistribution = [
    { name: "Operational", value: services.filter(s => s.status === "operational").length, color: "#10b981" },
    { name: "Degraded", value: services.filter(s => s.status === "degraded" || s.status === "degraded_performance").length, color: "#f59e0b" },
    { name: "Partial Outage", value: services.filter(s => s.status === "partial_outage").length, color: "#f97316" },
    { name: "Major Outage", value: services.filter(s => s.status === "major_outage").length, color: "#ef4444" },
    { name: "Maintenance", value: services.filter(s => s.status === "maintenance").length, color: "#6366f1" },
  ].filter(item => item.value > 0);

  // Incident history data (last 7 days)
  const generateIncidentHistoryData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const formattedDate = format(date, "MMM dd");
      const incidentsOnDate = incidents.filter(incident => {
        const incidentDate = new Date(incident.createdAt);
        return incidentDate.getDate() === date.getDate() &&
               incidentDate.getMonth() === date.getMonth() &&
               incidentDate.getFullYear() === date.getFullYear();
      });
      
      data.push({
        date: formattedDate,
        incidents: incidentsOnDate.length
      });
    }
    return data;
  };

  const incidentHistoryData = generateIncidentHistoryData();

  // Function to determine color based on overall status
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "operational":
        return "text-status-operational";
      case "degraded":
      case "degraded_performance":
        return "text-status-degraded";
      case "partial_outage":
        return "text-status-partial";
      case "major_outage":
        return "text-status-major";
      case "maintenance":
        return "text-status-maintenance";
      default:
        return "text-gray-500";
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-6 w-6 text-status-operational" />;
      case "degraded":
      case "degraded_performance":
        return <AlertTriangle className="h-6 w-6 text-status-degraded" />;
      case "partial_outage":
        return <AlertTriangle className="h-6 w-6 text-status-partial" />;
      case "major_outage":
        return <AlertCircle className="h-6 w-6 text-status-major" />;
      case "maintenance":
        return <Clock className="h-6 w-6 text-status-maintenance" />;
      default:
        return <CheckCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "operational":
        return "All systems operational";
      case "degraded":
      case "degraded_performance":
        return "Some systems experiencing degraded performance";
      case "partial_outage":
        return "Some systems experiencing a partial outage";
      case "major_outage":
        return "Major system outage in progress";
      case "maintenance":
        return "Scheduled maintenance in progress";
      default:
        return "System status unknown";
    }
  };

  // Calculate overall uptime
  const calculateOverallUptime = () => {
    if (services.length === 0) return 100;
    
    const totalUptime = services.reduce((sum, service) => {
      return sum + (service.uptime || 99.9);
    }, 0);
    
    return (totalUptime / services.length).toFixed(2);
  };

  const overallUptime = calculateOverallUptime();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="bg-destructive/15 text-destructive p-6 rounded-lg max-w-md text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">Error Loading Dashboard</h3>
          <p className="mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {getStatusIcon(overallStatus)}
              <div className="ml-3">
                <div className={`font-bold text-2xl ${getStatusColorClass(overallStatus)}`}>
                  {getStatusMessage(overallStatus)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {activeIncidents.length > 0 ? (
                <AlertCircle className="h-6 w-6 text-status-major" />
              ) : (
                <CheckCircle className="h-6 w-6 text-status-operational" />
              )}
              <div className="ml-3">
                <div className="font-bold text-2xl">
                  {activeIncidents.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  {activeIncidents.length === 0 
                    ? "No active incidents" 
                    : activeIncidents.length === 1 
                      ? "Active incident" 
                      : "Active incidents"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ArrowUpCircle className="h-6 w-6 text-status-operational" />
              <div className="ml-3">
                <div className="font-bold text-2xl">{overallUptime}%</div>
                <div className="text-xs text-muted-foreground">Last 30 days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Status Distribution</CardTitle>
            <CardDescription>Current status of all monitored services</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {services.length === 0 ? (
              <div className="text-center py-10">
                <Clock className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No services available</p>
              </div>
            ) : statusDistribution.length === 0 ? (
              <div className="text-center py-10">
                <CheckCircle className="mx-auto h-10 w-10 text-status-operational" />
                <p className="mt-2 text-muted-foreground">All services are operational</p>
              </div>
            ) : (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} services`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            {statusDistribution.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                  {statusDistribution.map((status, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: status.color }}></div>
                      <span className="text-xs">{status.name} ({status.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Incident History</CardTitle>
            <CardDescription>Incidents over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {incidents.length === 0 ? (
              <div className="text-center py-10">
                <CheckCircle className="mx-auto h-10 w-10 text-status-operational" />
                <p className="mt-2 text-muted-foreground">No incident history available</p>
              </div>
            ) : (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentHistoryData}>
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="incidents" name="Incidents" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest incidents and maintenance events</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="incidents" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="incidents" className="pt-4">
              {incidents.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-8 w-8 text-status-operational" />
                  <p className="mt-2 text-sm text-gray-500">No incidents reported</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incidents
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map(incident => (
                      <div key={incident._id} className="border-b pb-3 last:border-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{incident.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{incident.description || 'No description provided'}</p>
                          </div>
                          <div className={`px-2 py-1 text-xs rounded-full ${
                            incident.status === "resolved" 
                              ? "bg-green-100 text-green-800" 
                              : incident.status === "identified"
                              ? "bg-blue-100 text-blue-800"
                              : incident.status === "monitoring"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {format(new Date(incident.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="maintenance" className="pt-4">
              {maintenanceEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No maintenance events</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {maintenanceEvents
                    .sort((a, b) => new Date(b.scheduledStartDate || b.scheduledStart).getTime() - new Date(a.scheduledStartDate || a.scheduledStart).getTime())
                    .slice(0, 5)
                    .map(event => (
                      <div key={event._id} className="border-b pb-3 last:border-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          </div>
                          <div className={`px-2 py-1 text-xs rounded-full ${
                            event.status === "completed" 
                              ? "bg-green-100 text-green-800" 
                              : event.status === "in_progress" 
                              ? "bg-blue-100 text-blue-800" 
                              : event.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {event.status === "in_progress" 
                              ? "In Progress" 
                              : event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {format(new Date(event.scheduledStartDate || event.scheduledStart), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

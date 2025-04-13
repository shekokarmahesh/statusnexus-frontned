import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useServices, ServiceStatus, Service } from "@/contexts/ServiceContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, AlertCircle, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/clerk-react";

const StatusPage = () => {
  const { serviceGroups, getOverallStatus } = useServices();
  const [activeTab, setActiveTab] = useState("status");
  const [incidents, setIncidents] = useState([]);
  const [maintenanceEvents, setMaintenanceEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [maintenanceLoading, setMaintenanceLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servicesError, setServicesError] = useState(null);
  const [maintenanceError, setMaintenanceError] = useState(null);
  const { getToken } = useAuth();

  // Define backend URL
  const BACKEND_URL = 'status-app-backend-kow1.onrender.com';

  // Fetch incidents from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        
        if (!token) {
          throw new Error("Authentication token is missing. Please log in again.");
        }
        
        // Fetch incidents
        const incidentsResponse = await fetch(`https:/${BACKEND_URL}/api/incidents`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        
        if (!incidentsResponse.ok) {
          throw new Error(`API request failed with status: ${incidentsResponse.status}`);
        }
        
        const incidentsData = await incidentsResponse.json();
        
        // Ensure incidents is always an array
        if (Array.isArray(incidentsData)) {
          setIncidents(incidentsData);
        } else if (incidentsData && typeof incidentsData === 'object') {
          // If response is an object with incidents property
          if (Array.isArray(incidentsData.incidents)) {
            setIncidents(incidentsData.incidents);
          } else {
            // If response is another format, log it and set empty array
            console.warn('Unexpected incidents data format:', incidentsData);
            setIncidents([]);
          }
        } else {
          // Default to empty array for any other cases
          console.warn('Invalid incidents data format:', incidentsData);
          setIncidents([]);
        }
      } catch (err) {
        console.error("Error fetching incidents:", err);
        setError(err instanceof Error ? err.message : "Failed to load incidents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch maintenance events from API
  useEffect(() => {
    const fetchMaintenanceData = async () => {
      setMaintenanceLoading(true);
      setMaintenanceError(null);
      
      try {
        const token = await getToken();
        
        if (!token) {
          throw new Error("Authentication token is missing. Please log in again.");
        }
        
        // Fetch maintenance events
        const maintenanceResponse = await fetch(`https:/${BACKEND_URL}/api/maintenance`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        
        if (!maintenanceResponse.ok) {
          throw new Error(`API request failed with status: ${maintenanceResponse.status}`);
        }
        
        const maintenanceData = await maintenanceResponse.json();
        
        // Ensure maintenance events is always an array
        if (Array.isArray(maintenanceData)) {
          setMaintenanceEvents(maintenanceData);
        } else if (maintenanceData && typeof maintenanceData === 'object') {
          // If response is an object with maintenanceEvents property
          if (Array.isArray(maintenanceData.maintenanceEvents)) {
            setMaintenanceEvents(maintenanceData.maintenanceEvents);
          } else {
            // If response is another format, log it and set empty array
            console.warn('Unexpected maintenance data format:', maintenanceData);
            setMaintenanceEvents([]);
          }
        } else {
          // Default to empty array for any other cases
          console.warn('Invalid maintenance data format:', maintenanceData);
          setMaintenanceEvents([]);
        }
      } catch (err) {
        console.error("Error fetching maintenance events:", err);
        setMaintenanceError(err instanceof Error ? err.message : "Failed to load maintenance events. Please try again later.");
      } finally {
        setMaintenanceLoading(false);
      }
    };
    
    fetchMaintenanceData();
  }, []);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      setServicesLoading(true);
      setServicesError(null);
      
      try {
        const token = await getToken();
        
        if (!token) {
          throw new Error("Authentication token is missing. Please log in again.");
        }
        
        // Fetch services
        const servicesResponse = await fetch(`https:/${BACKEND_URL}/api/services`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        
        if (!servicesResponse.ok) {
          throw new Error(`API request failed with status: ${servicesResponse.status}`);
        }
        
        const servicesData = await servicesResponse.json();
        
        // Ensure services is always an array
        if (Array.isArray(servicesData)) {
          setServices(servicesData);
        } else if (servicesData && typeof servicesData === 'object') {
          // If response is an object with services property
          if (Array.isArray(servicesData.services)) {
            setServices(servicesData.services);
          } else {
            // If response is another format, log it and set empty array
            console.warn('Unexpected services data format:', servicesData);
            setServices([]);
          }
        } else {
          // Default to empty array for any other cases
          console.warn('Invalid services data format:', servicesData);
          setServices([]);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setServicesError(err instanceof Error ? err.message : "Failed to load services. Please try again later.");
      } finally {
        setServicesLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return "bg-status-operational";
      case "degraded_performance":
        return "bg-status-degraded";
      case "partial_outage":
        return "bg-status-partial";
      case "major_outage":
        return "bg-status-major";
      case "maintenance":
        return "bg-status-maintenance";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-status-operational hover:bg-status-operational">Operational</Badge>;
      case "degraded_performance":
        return <Badge className="bg-status-degraded hover:bg-status-degraded">Degraded</Badge>;
      case "partial_outage":
        return <Badge className="bg-status-partial hover:bg-status-partial">Partial Outage</Badge>;
      case "major_outage":
        return <Badge className="bg-status-major hover:bg-status-major">Major Outage</Badge>;
      case "maintenance":
        return <Badge className="bg-status-maintenance hover:bg-status-maintenance">Maintenance</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-6 w-6 text-status-operational" />;
      case "degraded_performance":
        return <AlertTriangle className="h-6 w-6 text-status-degraded" />;
      case "partial_outage":
        return <AlertTriangle className="h-6 w-6 text-status-partial" />;
      case "major_outage":
        return <AlertCircle className="h-6 w-6 text-status-major" />;
      case "maintenance":
        return <Clock className="h-6 w-6 text-status-maintenance" />;
      default:
        return <CheckCircle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusMessage = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return "All systems operational";
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

  const overallStatus: ServiceStatus = calculateOverallStatus(services) as ServiceStatus;

  // Calculate overall status based on fetched services
  function calculateOverallStatus(services) {
    if (!Array.isArray(services) || services.length === 0) {
      return "operational"; // Default status when no services available
    }
    
    const statusHierarchy = {
      "major_outage": 4,
      "partial_outage": 3,
      "degraded_performance": 2,
      "maintenance": 1,
      "operational": 0
    };
    
    let worstStatus = "operational";
    let worstSeverity = 0;
    
    for (const service of services) {
      const currentStatusSeverity = statusHierarchy[service.status] || 0;
      if (currentStatusSeverity > worstSeverity) {
        worstStatus = service.status;
        worstSeverity = currentStatusSeverity;
      }
    }
    
    return worstStatus;
  }

  // Make sure incidents is an array before filtering
  const activeIncidents = Array.isArray(incidents) 
    ? incidents.filter(incident => incident.status !== "resolved") 
    : [];

  // Make sure maintenanceEvents is an array before filtering
  const upcomingMaintenance = Array.isArray(maintenanceEvents) 
    ? maintenanceEvents.filter(
        event => event.status === "scheduled" && new Date(event.scheduledStartDate) > new Date()
      )
    : [];

  const ongoingMaintenance = Array.isArray(maintenanceEvents)
    ? maintenanceEvents.filter(
        event => event.status === "in_progress"
      )
    : [];

  // Group services by their service group
  const servicesByGroup = () => {
    if (!Array.isArray(services) || services.length === 0) return [];
    
    // Get unique groups
    const groups = [...new Set(services.filter(s => s.group).map(s => s.group))];
    console.log("Groups found:", groups);
    
    return groups.map(groupId => {
      // If groupId is already a string name, use it directly
      if (typeof groupId === 'string') {
        const servicesInGroup = services.filter(s => s.group === groupId);
        
        return {
          id: groupId,
          name: groupId, // Use the group string directly as the name
          services: servicesInGroup
        };
      }
      
      // For object-based groups (fallback to previous implementation)
      const serviceWithGroup = services.find(s => s.group === groupId);
      const groupDetails = 
        (serviceWithGroup?.groupDetails) || 
        (serviceWithGroup?.group && typeof serviceWithGroup.group === 'object' ? serviceWithGroup.group : null) ||
        { _id: groupId, name: `Service Group ${String(groupId).slice(-5)}` };
      
      const servicesInGroup = services.filter(s => s.group === groupId);
      
      return {
        id: groupDetails._id || groupId,
        name: groupDetails.name || `Service Group ${String(groupId).slice(-5)}`,
        services: servicesInGroup
      };
    });
  };

  // Find services that don't belong to any group
  const ungroupedServices = Array.isArray(services) 
    ? services.filter(service => !service.group)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
            <div>
              <Link to="/login">
                <Button variant="outline" className="mr-2">
                  Log in
                </Button>
              </Link>
              <Button>
                Subscribe to updates
              </Button>
            </div>
          </div>

          <div className="mt-6 flex items-center">
            {getStatusIcon(overallStatus)}
            <div className="ml-4">
              <h2 className="text-xl font-medium">{getStatusMessage(overallStatus)}</h2>
              <p className="text-sm text-gray-500">
                Last updated: {format(new Date(), "PPp")}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="status" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">Current Status</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          {/* Current Status Tab */}
          <TabsContent value="status" className="mt-6">
            {/* Active incidents summary if any */}
            {loading ? (
              <Card className="mb-6">
                <CardContent className="py-4">
                  <p className="text-center">Loading incidents...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="mb-6 border-l-4 border-l-status-major">
                <CardContent className="py-4">
                  <p className="text-center text-status-major">{error}</p>
                </CardContent>
              </Card>
            ) : activeIncidents.length > 0 && (
              <Card className="mb-6 border-l-4 border-l-status-major">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-status-major" />
                    Active Incidents ({activeIncidents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeIncidents.map(incident => (
                      <div key={incident.id} className="border-b pb-2 last:border-0 last:pb-0">
                        <h4 className="font-medium">{incident.title}</h4>
                        <p className="text-sm text-gray-600">
                          {formatDistanceToNow(new Date(incident.createdAt))} ago
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ongoing maintenance if any */}
            {maintenanceLoading ? (
              <Card className="mb-6">
                <CardContent className="py-4">
                  <p className="text-center">Loading maintenance events...</p>
                </CardContent>
              </Card>
            ) : maintenanceError ? (
              <Card className="mb-6 border-l-4 border-l-status-maintenance">
                <CardContent className="py-4">
                  <p className="text-center text-status-maintenance">{maintenanceError}</p>
                </CardContent>
              </Card>
            ) : ongoingMaintenance.length > 0 && (
              <Card className="mb-6 border-l-4 border-l-status-maintenance">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-status-maintenance" />
                    Ongoing Maintenance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ongoingMaintenance.map(maintenance => (
                      <div key={maintenance._id} className="border-b pb-2 last:border-0 last:pb-0">
                        <h4 className="font-medium">{maintenance.title}</h4>
                        <p className="text-sm text-gray-600">
                          Started {formatDistanceToNow(new Date(maintenance.scheduledStartDate))} ago
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service status by group */}
            {servicesLoading ? (
              <Card className="mb-6">
                <CardContent className="py-4 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                  <p>Loading services...</p>
                </CardContent>
              </Card>
            ) : servicesError ? (
              <Card className="mb-6 border-l-4 border-l-status-major">
                <CardContent className="py-4">
                  <p className="text-center text-status-major">{servicesError}</p>
                  <Button 
                    variant="outline" 
                    className="mt-2 mx-auto block"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </Button>
                </CardContent>
              </Card>
            ) : services.length === 0 ? (
              <Card className="mb-6">
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">No services found.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Service status by group */}
                {servicesByGroup().map(group => (
                  <Card key={group.id} className="mb-6">
                    <CardHeader className="pb-2">
                      <CardTitle>{group.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {group.services.map(service => (
                          <div key={service._id} className="flex items-center justify-between py-1 border-b last:border-0">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}></div>
                              <span className="ml-3">{service.name}</span>
                            </div>
                            <div>
                              {getStatusBadge(service.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Ungrouped services */}
                {ungroupedServices.length > 0 && (
                  <Card className="mb-6">
                    <CardHeader className="pb-2">
                      <CardTitle>Other Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {ungroupedServices.map(service => (
                          <div key={service._id} className="flex items-center justify-between py-1 border-b last:border-0">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}></div>
                              <span className="ml-3">{service.name}</span>
                            </div>
                            <div>
                              {getStatusBadge(service.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Incidents Tab */}
          <TabsContent value="incidents" className="mt-6">
            {incidents.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-status-operational" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No incidents reported</h3>
                <p className="mt-1 text-sm text-gray-500">All systems have been operational.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Active Incidents */}
                {activeIncidents.length > 0 && (
                  <div>
                    <h3 className="font-medium text-lg mb-3">Active Incidents</h3>
                    {activeIncidents.map(incident => (
                      <Card key={incident.id} className="mb-4 border-l-4 border-l-status-major">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{incident.title}</CardTitle>
                          <div className="flex mt-1 text-sm text-gray-500">
                            <Badge variant="outline" className="mr-2">
                              {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                            </Badge>
                            <span>
                              {format(new Date(incident.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 mb-4">{incident.description}</p>

                          <div className="border-t pt-3">
                            <h4 className="text-sm font-medium mb-2">Updates</h4>
                            <div className="space-y-3">
                              {incident.updates && incident.updates.map(update => (
                                <div key={update.id} className="text-sm border-t mt-2 pt-2">
                                  <div className="flex justify-between text-gray-500">
                                    <span className="font-medium">{update.status.charAt(0).toUpperCase() + update.status.slice(1)}</span>
                                    <span>{format(new Date(update.createdAt), "MMM d, h:mm a")}</span>
                                  </div>
                                  <p className="mt-1">{update.message}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Resolved Incidents */}
                <div>
                  <h3 className="font-medium text-lg mb-3">Past Incidents</h3>
                  {incidents
                    .filter(incident => incident.status === "resolved")
                    .map(incident => (
                      <Card key={incident.id} className="mb-4">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{incident.title}</CardTitle>
                          <div className="flex mt-1 text-sm text-gray-500">
                            <Badge variant="outline" className="bg-status-operational text-white mr-2">
                              Resolved
                            </Badge>
                            <span>
                              {format(new Date(incident.createdAt), "MMM d, yyyy")}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{incident.description}</p>
                          
                          {incident.updates && incident.updates.map(update => (
                            <div key={update.id} className="text-sm border-t mt-2 pt-2">
                              <div className="flex justify-between text-gray-500">
                                <span className="font-medium">{update.status.charAt(0).toUpperCase() + update.status.slice(1)}</span>
                                <span>{format(new Date(update.createdAt), "MMM d, h:mm a")}</span>
                              </div>
                              <p className="mt-1">{update.message}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="mt-6">
            {maintenanceLoading ? (
              <div className="text-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                <p>Loading maintenance events...</p>
              </div>
            ) : maintenanceError ? (
              <div className="bg-destructive/15 text-destructive p-4 rounded-md">
                <p className="font-semibold">Error loading maintenance events</p>
                <p className="text-sm">{maintenanceError}</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </Button>
              </div>
            ) : maintenanceEvents.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No maintenance scheduled</h3>
                <p className="mt-1 text-sm text-gray-500">There are no upcoming maintenance events.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Upcoming Maintenance */}
                {upcomingMaintenance.length > 0 && (
                  <div>
                    <h3 className="font-medium text-lg mb-3">Upcoming Maintenance</h3>
                    {upcomingMaintenance.map(maintenance => (
                      <Card key={maintenance._id} className="mb-4 border-l-4 border-l-status-maintenance">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{maintenance.title}</CardTitle>
                          <div className="flex mt-1 text-sm text-gray-500">
                            <Badge variant="outline" className="mr-2">
                              Scheduled
                            </Badge>
                            <span>
                              {format(new Date(maintenance.scheduledStartDate), "MMM d, yyyy 'at' h:mm a")} - 
                              {format(new Date(maintenance.scheduledEndDate), " h:mm a")}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{maintenance.description}</p>

                          <div className="mt-3 pt-3 border-t">
                            <h4 className="text-sm font-medium">Affected Services:</h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {maintenance.services && maintenance.services.map(service => (
                                <Badge key={service._id} variant="outline">{service.name}</Badge>
                              ))}
                              {(!maintenance.services || maintenance.services.length === 0) && (
                                <span className="text-sm text-muted-foreground">No services affected</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Ongoing Maintenance */}
                {ongoingMaintenance.length > 0 && (
                  <div>
                    <h3 className="font-medium text-lg mb-3">Ongoing Maintenance</h3>
                    {ongoingMaintenance.map(maintenance => (
                      <Card key={maintenance._id} className="mb-4 border-l-4 border-l-status-maintenance">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{maintenance.title}</CardTitle>
                          <div className="flex mt-1 text-sm text-gray-500">
                            <Badge variant="outline" className="mr-2">
                              In Progress
                            </Badge>
                            <span>
                              Started at {format(new Date(maintenance.scheduledStartDate), "h:mm a")}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{maintenance.description}</p>

                          <div className="mt-3 pt-3 border-t">
                            <h4 className="text-sm font-medium">Affected Services:</h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {maintenance.services && maintenance.services.map(service => (
                                <Badge key={service._id} variant="outline">{service.name}</Badge>
                              ))}
                              {(!maintenance.services || maintenance.services.length === 0) && (
                                <span className="text-sm text-muted-foreground">No services affected</span>
                              )}
                            </div>
                          </div>

                          {maintenance.updates && maintenance.updates.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <h4 className="text-sm font-medium mb-2">Updates</h4>
                              <div className="space-y-3">
                                {maintenance.updates.map(update => (
                                  <div key={update._id} className="text-sm border-t mt-2 pt-2">
                                    <div className="flex justify-between text-gray-500">
                                      <span className="font-medium">{update.status.charAt(0).toUpperCase() + update.status.slice(1).replace('_', ' ')}</span>
                                      <span>{format(new Date(update.createdAt), "MMM d, h:mm a")}</span>
                                    </div>
                                    <p className="mt-1">{update.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Past Maintenance */}
                <div>
                  <h3 className="font-medium text-lg mb-3">Past Maintenance</h3>
                  {maintenanceEvents
                    .filter(maintenance => maintenance.status === "completed")
                    .map(maintenance => (
                      <Card key={maintenance._id} className="mb-4">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{maintenance.title}</CardTitle>
                          <div className="flex mt-1 text-sm text-gray-500">
                            <Badge variant="outline" className="mr-2">
                              Completed
                            </Badge>
                            <span>
                              {format(new Date(maintenance.scheduledStartDate), "MMM d, yyyy")}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{maintenance.description}</p>
                          {maintenance.updates && maintenance.updates.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <h4 className="text-sm font-medium mb-2">Updates</h4>
                              <div className="space-y-3">
                                {maintenance.updates.map(update => (
                                  <div key={update._id} className="text-sm border-t mt-2 pt-2">
                                    <div className="flex justify-between text-gray-500">
                                      <span className="font-medium">{update.status.charAt(0).toUpperCase() + update.status.slice(1).replace('_', ' ')}</span>
                                      <span>{format(new Date(update.createdAt), "MMM d, h:mm a")}</span>
                                    </div>
                                    <p className="mt-1">{update.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  {maintenanceEvents.filter(maintenance => maintenance.status === "completed").length === 0 && (
                    <p className="text-center text-gray-500 py-4">No past maintenance events.</p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Status Dashboard. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">Admin Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StatusPage;
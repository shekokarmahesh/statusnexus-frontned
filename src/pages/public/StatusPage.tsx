
import { useState } from "react";
import { Link } from "react-router-dom";
import { useServices, ServiceStatus, Service } from "@/contexts/ServiceContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, AlertCircle, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const StatusPage = () => {
  const { services, incidents, maintenanceEvents, getOverallStatus, serviceGroups } = useServices();
  const [activeTab, setActiveTab] = useState("status");
  
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
  
  const overallStatus = getOverallStatus();
  const activeIncidents = incidents.filter(incident => incident.status !== "resolved");
  const upcomingMaintenance = maintenanceEvents.filter(
    event => event.status === "scheduled" && new Date(event.scheduledStart) > new Date()
  );
  const ongoingMaintenance = maintenanceEvents.filter(
    event => event.status === "in_progress"
  );
  
  // Group services by their service group
  const servicesByGroup = serviceGroups.map(group => {
    const servicesInGroup = services.filter(service => service.group === group.id);
    return {
      ...group,
      services: servicesInGroup
    };
  });
  
  // Find services that don't belong to any group
  const ungroupedServices = services.filter(service => !service.group);

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
            {activeIncidents.length > 0 && (
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
            {ongoingMaintenance.length > 0 && (
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
                      <div key={maintenance.id} className="border-b pb-2 last:border-0 last:pb-0">
                        <h4 className="font-medium">{maintenance.title}</h4>
                        <p className="text-sm text-gray-600">
                          Started {formatDistanceToNow(new Date(maintenance.scheduledStart))} ago
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Service status by group */}
            {servicesByGroup.map(group => (
              <Card key={group.id} className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle>{group.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {group.services.map(service => (
                      <div key={service.id} className="flex items-center justify-between py-1 border-b last:border-0">
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
                      <div key={service.id} className="flex items-center justify-between py-1 border-b last:border-0">
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
                              {incident.updates.map(update => (
                                <div key={update.id} className="text-sm">
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
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="mt-6">
            {maintenanceEvents.length === 0 ? (
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
                      <Card key={maintenance.id} className="mb-4 border-l-4 border-l-status-maintenance">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{maintenance.title}</CardTitle>
                          <div className="flex mt-1 text-sm text-gray-500">
                            <Badge variant="outline" className="mr-2">
                              Scheduled
                            </Badge>
                            <span>
                              {format(new Date(maintenance.scheduledStart), "MMM d, yyyy 'at' h:mm a")} - 
                              {format(new Date(maintenance.scheduledEnd), " h:mm a")}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{maintenance.description}</p>
                          
                          <div className="mt-3 pt-3 border-t">
                            <h4 className="text-sm font-medium">Affected Services:</h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {services
                                .filter(service => maintenance.affectedServices.includes(service.id))
                                .map(service => (
                                  <Badge key={service.id} variant="outline">{service.name}</Badge>
                                ))
                              }
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
                      <Card key={maintenance.id} className="mb-4 border-l-4 border-l-status-maintenance">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{maintenance.title}</CardTitle>
                          <div className="flex mt-1 text-sm text-gray-500">
                            <Badge variant="outline" className="mr-2">
                              In Progress
                            </Badge>
                            <span>
                              Started at {format(new Date(maintenance.scheduledStart), "h:mm a")}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{maintenance.description}</p>
                          
                          <div className="mt-3 pt-3 border-t">
                            <h4 className="text-sm font-medium">Affected Services:</h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {services
                                .filter(service => maintenance.affectedServices.includes(service.id))
                                .map(service => (
                                  <Badge key={service.id} variant="outline">{service.name}</Badge>
                                ))
                              }
                            </div>
                          </div>
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
                      <Card key={maintenance.id} className="mb-4">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{maintenance.title}</CardTitle>
                          <div className="flex mt-1 text-sm text-gray-500">
                            <Badge variant="outline" className="mr-2">
                              Completed
                            </Badge>
                            <span>
                              {format(new Date(maintenance.scheduledStart), "MMM d, yyyy")}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{maintenance.description}</p>
                        </CardContent>
                      </Card>
                    ))}
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

import { useState } from "react";
import { useServices, Incident, IncidentUpdate } from "@/contexts/ServiceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MoreVertical, 
  Trash2, 
  MessageSquarePlus,
  Search, 
  XCircle,
  AlertTriangle,
  AlertCircle,
  CheckCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const Incidents = () => {
  const { services, incidents, addIncident, addIncidentUpdate, deleteIncident } = useServices();
  const [isAddIncidentOpen, setIsAddIncidentOpen] = useState(false);
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [currentIncident, setCurrentIncident] = useState<Incident | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Form state for adding a new incident with proper typing
  const [newIncident, setNewIncident] = useState<{
    title: string;
    description: string;
    status: "investigating" | "identified" | "monitoring" | "resolved";
    severity: "minor" | "major" | "critical";
    affectedServices: string[];
  }>({
    title: "",
    description: "",
    status: "investigating",
    severity: "minor",
    affectedServices: [],
  });
  
  // Form state for adding a new update with proper typing
  const [newUpdate, setNewUpdate] = useState<{
    message: string;
    status: "investigating" | "identified" | "monitoring" | "resolved";
    user: string;
  }>({
    message: "",
    status: "investigating",
    user: "System Administrator",
  });
  
  // Filter incidents based on search query
  const filteredIncidents = incidents.filter(incident => 
    incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle add incident form submission
  const handleAddIncident = () => {
    addIncident(newIncident);
    
    toast({
      title: "Incident created",
      description: "The incident has been created and published."
    });
    
    // Reset form and close dialog
    setNewIncident({
      title: "",
      description: "",
      status: "investigating",
      severity: "minor",
      affectedServices: [],
    });
    setIsAddIncidentOpen(false);
  };
  
  // Open add update dialog
  const openAddUpdateDialog = (incident: Incident) => {
    setCurrentIncident(incident);
    setNewUpdate({
      message: "",
      status: incident.status,
      user: "System Administrator",
    });
    setIsAddUpdateOpen(true);
  };
  
  // Handle add update form submission
  const handleAddUpdate = () => {
    if (currentIncident) {
      addIncidentUpdate(currentIncident.id, newUpdate);
      
      toast({
        title: "Update added",
        description: "The incident has been updated."
      });
      
      setIsAddUpdateOpen(false);
      setCurrentIncident(null);
    }
  };
  
  // Handle delete incident
  const handleDeleteIncident = (incidentId: string) => {
    const incidentToDelete = incidents.find(i => i.id === incidentId);
    if (incidentToDelete) {
      deleteIncident(incidentId);
      
      toast({
        title: "Incident deleted",
        description: `"${incidentToDelete.title}" has been deleted.`
      });
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "investigating":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            Investigating
          </Badge>
        );
      case "identified":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Identified
          </Badge>
        );
      case "monitoring":
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">
            Monitoring
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Resolved
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "minor":
        return (
          <Badge className="bg-yellow-500">Minor</Badge>
        );
      case "major":
        return (
          <Badge className="bg-orange-500">Major</Badge>
        );
      case "critical":
        return (
          <Badge className="bg-red-500">Critical</Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "investigating":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "identified":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "monitoring":
        return <AlertCircle className="h-4 w-4 text-indigo-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Incidents</h2>
          <p className="text-muted-foreground">
            Manage and report incidents affecting your services.
          </p>
        </div>
        
        <Button onClick={() => setIsAddIncidentOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Incident
        </Button>
      </div>
      
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Incident list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Incident List</CardTitle>
          <CardDescription>
            Total incidents: {incidents.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredIncidents.length === 0 ? (
            <div className="text-center py-10">
              {searchQuery ? (
                <p className="text-muted-foreground">No incidents matching your search.</p>
              ) : (
                <>
                  <p className="text-muted-foreground">No incidents have been reported.</p>
                  <Button
                    variant="link"
                    onClick={() => setIsAddIncidentOpen(true)}
                    className="mt-2"
                  >
                    Create your first incident
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Affected Services</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">{incident.title}</TableCell>
                      <TableCell>{getStatusBadge(incident.status)}</TableCell>
                      <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {incident.affectedServices.map(serviceId => {
                            const service = services.find(s => s.id === serviceId);
                            return service ? (
                              <Badge key={serviceId} variant="outline">{service.name}</Badge>
                            ) : null;
                          })}
                          {incident.affectedServices.length === 0 && (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(incident.createdAt), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {incident.status !== "resolved" && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openAddUpdateDialog(incident)}
                            >
                              <MessageSquarePlus className="h-4 w-4" />
                              <span className="sr-only">Add Update</span>
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {incident.status !== "resolved" && (
                                <DropdownMenuItem onClick={() => openAddUpdateDialog(incident)}>
                                  <MessageSquarePlus className="mr-2 h-4 w-4" />
                                  Add Update
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleDeleteIncident(incident.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Incident Dialog */}
      <Dialog open={isAddIncidentOpen} onOpenChange={setIsAddIncidentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Incident</DialogTitle>
            <DialogDescription>
              Report a new incident affecting your services.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Incident Title</Label>
              <Input
                id="title"
                placeholder="e.g., API Outage, Database Connectivity Issues"
                value={newIncident.title}
                onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what's happening with this incident..."
                rows={3}
                value={newIncident.description}
                onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newIncident.status} 
                  onValueChange={(value: "investigating" | "identified" | "monitoring" | "resolved") => 
                    setNewIncident({...newIncident, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="identified">Identified</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="severity">Severity</Label>
                <Select 
                  value={newIncident.severity} 
                  onValueChange={(value: "minor" | "major" | "critical") => 
                    setNewIncident({...newIncident, severity: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Affected Services</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                {services.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-1">No services available.</p>
                ) : (
                  services.map((service) => (
                    <Badge
                      key={service.id}
                      variant={newIncident.affectedServices.includes(service.id) ? "default" : "outline"}
                      className="cursor-pointer m-1"
                      onClick={() => {
                        const isSelected = newIncident.affectedServices.includes(service.id);
                        setNewIncident({
                          ...newIncident,
                          affectedServices: isSelected
                            ? newIncident.affectedServices.filter(id => id !== service.id)
                            : [...newIncident.affectedServices, service.id]
                        });
                      }}
                    >
                      {service.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddIncidentOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddIncident} 
              disabled={!newIncident.title || !newIncident.description}
            >
              Create Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Update Dialog */}
      <Dialog open={isAddUpdateOpen} onOpenChange={setIsAddUpdateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Incident Update</DialogTitle>
            <DialogDescription>
              {currentIncident && (
                <>
                  Provide an update for: <span className="font-medium">{currentIncident.title}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="message">Update Message</Label>
              <Textarea
                id="message"
                placeholder="Provide details about the current situation..."
                rows={4}
                value={newUpdate.message}
                onChange={(e) => setNewUpdate({...newUpdate, message: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="updateStatus">Status</Label>
              <Select 
                value={newUpdate.status} 
                onValueChange={(value: "investigating" | "identified" | "monitoring" | "resolved") => 
                  setNewUpdate({...newUpdate, status: value})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investigating">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                      Investigating
                    </div>
                  </SelectItem>
                  <SelectItem value="identified">
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
                      Identified
                    </div>
                  </SelectItem>
                  <SelectItem value="monitoring">
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-indigo-500" />
                      Monitoring
                    </div>
                  </SelectItem>
                  <SelectItem value="resolved">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Resolved
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUpdateOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddUpdate} 
              disabled={!newUpdate.message}
            >
              Post Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Incidents;

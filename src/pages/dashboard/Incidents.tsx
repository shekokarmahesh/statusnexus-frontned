import { useState, useEffect } from "react";
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
  MessageSquarePlus,
  Search, 
  XCircle,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Pencil
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/clerk-react";

// Incident types based on your API
interface IncidentUpdate {
  _id?: string;
  message: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  createdBy: string;
  createdAt?: Date;
}

interface Incident {
  _id: string;
  title: string;
  type: string;
  impact: "minor" | "major" | "critical";
  status: "investigating" | "identified" | "monitoring" | "resolved";
  services: Array<{
    _id: string;
    name: string;
    status: string;
  }>;
  updates: IncidentUpdate[];
  organizationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const Incidents = () => {
  const [isAddIncidentOpen, setIsAddIncidentOpen] = useState(false);
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [isEditIncidentOpen, setIsEditIncidentOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { getToken } = useAuth();
  
  // State for API data
  const [apiIncidents, setApiIncidents] = useState<Incident[]>([]);
  const [apiServices, setApiServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for editing
  const [currentIncident, setCurrentIncident] = useState<Incident | null>(null);
  
  // Form state for adding a new incident
  const [newIncident, setNewIncident] = useState({
    title: "",
    type: "incident", // Change from "outage" to "incident" to match backend schema
    impact: "minor" as "minor" | "major" | "critical",
    serviceIds: [] as string[],
  });
  
  // Form state for adding a new update
  const [newUpdate, setNewUpdate] = useState({
    message: "",
    status: "investigating" as "investigating" | "identified" | "monitoring" | "resolved",
  });
  
  // Form state for editing an incident
  const [editingIncident, setEditingIncident] = useState<{
    _id: string;
    status: "investigating" | "identified" | "monitoring" | "resolved";
    impact: "minor" | "major" | "critical";
  } | null>(null);
  
  // Fetch incidents and services on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        
        if (!token) {
          throw new Error("Authentication token is missing. Please log in again.");
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
          throw new Error(`API request failed with status: ${incidentsResponse.status}`);
        }
        
        const incidentsData = await incidentsResponse.json();
        
        // Fetch services for the dropdown
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
        
        const servicesData = await servicesResponse.json();
        
        if (incidentsData && incidentsData.incidents) {
          setApiIncidents(incidentsData.incidents);
        } else {
          console.warn('API response is not in expected format:', incidentsData);
          setApiIncidents([]);
        }
        
        if (Array.isArray(servicesData)) {
          setApiServices(servicesData);
        } else if (servicesData && typeof servicesData === 'object' && servicesData.services) {
          setApiServices(servicesData.services);
        } else {
          console.warn('Services API response is not in expected format:', servicesData);
          setApiServices([]);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        toast({
          title: "Error fetching incidents",
          description: err instanceof Error ? err.message : 'An error occurred',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast, getToken]);
  
  // Filter incidents based on search query
  const filteredIncidents = searchQuery.trim() === '' 
    ? apiIncidents
    : apiIncidents.filter(incident => 
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  // Handle adding a new incident
  const handleAddIncident = async () => {
    if (!newIncident.title || newIncident.serviceIds.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }
      
      const response = await fetch('https://status-app-backend-kow1.onrender.com/api/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newIncident.title,
          type: newIncident.type,
          impact: newIncident.impact,
          serviceIds: newIncident.serviceIds,
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create incident (Status: ${response.status})`);
      }
      
      const data = await response.json();
      
      setApiIncidents(prevIncidents => [...prevIncidents, data.incident]);
      
      toast({
        title: "Incident created",
        description: `${newIncident.title} has been created successfully.`
      });
      
      setNewIncident({
        title: "",
        type: "incident", // Change from "outage" to "incident"
        impact: "minor",
        serviceIds: [],
      });
      setIsAddIncidentOpen(false);
      
    } catch (err) {
      console.error('Error creating incident:', err);
      toast({
        title: "Error creating incident",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Open the edit incident dialog
  const handleOpenEditDialog = (incident: Incident) => {
    setEditingIncident({
      _id: incident._id,
      status: incident.status,
      impact: incident.impact,
    });
    setIsEditIncidentOpen(true);
  };
  
  // Handle editing an incident
  const handleEditIncident = async () => {
    if (!editingIncident) return;
    
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }
      
      const response = await fetch(`https://status-app-backend-kow1.onrender.com/api/incidents/${editingIncident._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: editingIncident.status,
          impact: editingIncident.impact,
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update incident (Status: ${response.status})`);
      }
      
      const data = await response.json();
      
      setApiIncidents(prevIncidents => prevIncidents.map(incident => 
        incident._id === editingIncident._id ? data.incident : incident
      ));
      
      toast({
        title: "Incident updated",
        description: "The incident has been updated successfully."
      });
      
      setEditingIncident(null);
      setIsEditIncidentOpen(false);
      
    } catch (err) {
      console.error('Error updating incident:', err);
      toast({
        title: "Error updating incident",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Open add update dialog
  const openAddUpdateDialog = (incident: Incident) => {
    setCurrentIncident(incident);
    setNewUpdate({
      message: "",
      status: incident.status,
    });
    setIsAddUpdateOpen(true);
  };
  
  // Handle adding an update to an incident
  const handleAddUpdate = async () => {
    if (!currentIncident || !newUpdate.message) return;
    
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }
      
      const response = await fetch(`https://status-app-backend-kow1.onrender.com/api/incidents/${currentIncident._id}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: newUpdate.message,
          status: newUpdate.status,
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to add update (Status: ${response.status})`);
      }
      
      const data = await response.json();
      
      setApiIncidents(prevIncidents => prevIncidents.map(incident => 
        incident._id === currentIncident._id ? data.incident : incident
      ));
      
      toast({
        title: "Update added",
        description: "The incident has been updated successfully."
      });
      
      setCurrentIncident(null);
      setNewUpdate({ message: "", status: "investigating" });
      setIsAddUpdateOpen(false);
      
    } catch (err) {
      console.error('Error adding update:', err);
      toast({
        title: "Error adding update",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "investigating":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Investigating
          </Badge>
        );
      case "identified":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            Identified
          </Badge>
        );
      case "monitoring":
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            Monitoring
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Resolved
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Get severity/impact badge
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "minor":
        return <Badge className="bg-yellow-500">Minor</Badge>;
      case "major":
        return <Badge className="bg-orange-500">Major</Badge>;
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
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
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button onClick={() => setIsAddIncidentOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Incident
          </Button>
        </div>
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
            {searchQuery.trim() !== '' ? 
              `Showing ${filteredIncidents.length} of ${apiIncidents.length} incidents` : 
              `Total incidents: ${apiIncidents.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="ml-3">Loading incidents...</span>
            </div>
          ) : error ? (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md">
              <p className="font-semibold">Error loading incidents</p>
              <p className="text-sm">{error}</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Try again
              </Button>
            </div>
          ) : apiIncidents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No incidents found.</p>
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No incidents matching "<span className="font-medium">{searchQuery}</span>".
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Affected Services</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.map((incident) => (
                    <TableRow key={incident._id}>
                      <TableCell className="font-medium">{incident.title}</TableCell>
                      <TableCell>{incident.type}</TableCell>
                      <TableCell>{getStatusBadge(incident.status)}</TableCell>
                      <TableCell>{getImpactBadge(incident.impact)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {incident.services.map(service => (
                            <Badge key={service._id} variant="outline">{service.name}</Badge>
                          ))}
                          {incident.services.length === 0 && (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(incident.createdAt), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenEditDialog(incident)}
                          title="Edit Incident"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
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
              <Label htmlFor="type">Incident Type</Label>
              <Select 
                value={newIncident.type} 
                onValueChange={(value) => setNewIncident({...newIncident, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incident">Incident</SelectItem>
                  <SelectItem value="maintenance">Scheduled Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="impact">Impact Level</Label>
              <Select 
                value={newIncident.impact} 
                onValueChange={(value: "minor" | "major" | "critical") => 
                  setNewIncident({...newIncident, impact: value})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select impact level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Affected Services</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md max-h-[150px] overflow-y-auto">
                {apiServices.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-1">No services available.</p>
                ) : (
                  apiServices.map((service) => (
                    <Badge
                      key={service._id}
                      variant={newIncident.serviceIds.includes(service._id) ? "default" : "outline"}
                      className="cursor-pointer m-1"
                      onClick={() => {
                        const isSelected = newIncident.serviceIds.includes(service._id);
                        setNewIncident({
                          ...newIncident,
                          serviceIds: isSelected
                            ? newIncident.serviceIds.filter(id => id !== service._id)
                            : [...newIncident.serviceIds, service._id]
                        });
                      }}
                    >
                      {service.name}
                    </Badge>
                  ))
                )}
              </div>
              {newIncident.serviceIds.length === 0 && (
                <p className="text-xs text-destructive mt-1">At least one service must be selected</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddIncidentOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddIncident} 
              disabled={isSubmitting || !newIncident.title || newIncident.serviceIds.length === 0}
            >
              {isSubmitting ? "Creating..." : "Create Incident"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Incident Dialog */}
      <Dialog open={isEditIncidentOpen} onOpenChange={setIsEditIncidentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Incident</DialogTitle>
            <DialogDescription>
              Update the status and impact of this incident.
            </DialogDescription>
          </DialogHeader>
          
          {editingIncident && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editingIncident.status} 
                  onValueChange={(value: "investigating" | "identified" | "monitoring" | "resolved") => 
                    setEditingIncident({...editingIncident, status: value})
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
              
              <div className="grid gap-2">
                <Label htmlFor="edit-impact">Impact Level</Label>
                <Select 
                  value={editingIncident.impact} 
                  onValueChange={(value: "minor" | "major" | "critical") => 
                    setEditingIncident({...editingIncident, impact: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact level" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditIncidentOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditIncident} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
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
              disabled={isSubmitting || !newUpdate.message}
            >
              {isSubmitting ? "Posting..." : "Post Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Incidents;

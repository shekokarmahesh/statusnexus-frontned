import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
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
  PenSquare,
  Search, 
  XCircle,
  Calendar,
  MessageSquarePlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Interface definitions for the maintenance data structure
interface MaintenanceUpdate {
  _id?: string;
  message: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  createdBy: string;
  createdAt?: Date;
}

interface Service {
  _id: string;
  name: string;
  status: string;
}

interface MaintenanceEvent {
  _id: string;
  title: string;
  description: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  impact: "none" | "minor" | "major" | "critical";
  services: Service[];
  updates: MaintenanceUpdate[];
  organizationId: string;
  createdBy: string;
  scheduledStartDate: string | Date;
  scheduledEndDate: string | Date;
  actualStartDate?: string | Date;
  actualEndDate?: string | Date;
  isPublic: boolean;
  notificationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const Maintenance = () => {
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
  const [isEditMaintenanceOpen, setIsEditMaintenanceOpen] = useState(false);
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { getToken } = useAuth();
  
  // State for API data
  const [maintenanceEvents, setMaintenanceEvents] = useState<MaintenanceEvent[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for editing and adding updates
  const [currentMaintenance, setCurrentMaintenance] = useState<MaintenanceEvent | null>(null);
  
  // Get current date/time for default values
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd'T'HH:mm");
  const tomorrowStr = format(new Date(today.getTime() + 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm");
  
  // Form state for adding new maintenance
  const [newMaintenance, setNewMaintenance] = useState({
    title: "",
    description: "",
    impact: "minor" as "none" | "minor" | "major" | "critical",
    serviceIds: [] as string[],
    scheduledStartDate: todayStr,
    scheduledEndDate: tomorrowStr,
    isPublic: true
  });
  
  // Form state for editing
  const [editingMaintenance, setEditingMaintenance] = useState<{
    _id: string;
    title?: string;
    description?: string;
    status?: "scheduled" | "in_progress" | "completed" | "cancelled";
    impact?: "none" | "minor" | "major" | "critical";
    serviceIds?: string[];
    scheduledStartDate?: string;
    scheduledEndDate?: string;
    isPublic?: boolean;
  } | null>(null);
  
  // Form state for adding an update
  const [newUpdate, setNewUpdate] = useState({
    message: "",
    status: "in_progress" as "scheduled" | "in_progress" | "completed" | "cancelled",
  });
  
  // Fetch maintenance events and services on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        
        if (!token) {
          throw new Error("Authentication token is missing. Please log in again.");
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
          throw new Error(`API request failed with status: ${maintenanceResponse.status}`);
        }
        
        const maintenanceData = await maintenanceResponse.json();
        
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
        
        if (maintenanceData && maintenanceData.maintenanceEvents) {
          setMaintenanceEvents(maintenanceData.maintenanceEvents);
        } else {
          console.warn('Maintenance API response is not in expected format:', maintenanceData);
          setMaintenanceEvents([]);
        }
        
        if (Array.isArray(servicesData)) {
          setServices(servicesData);
        } else if (servicesData && typeof servicesData === 'object' && servicesData.services) {
          setServices(servicesData.services);
        } else {
          console.warn('Services API response is not in expected format:', servicesData);
          setServices([]);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        toast({
          title: "Error fetching maintenance events",
          description: err instanceof Error ? err.message : 'An error occurred',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast, getToken]);
  
  // Filter maintenance events based on search query
  const filteredMaintenanceEvents = searchQuery.trim() === '' 
    ? maintenanceEvents
    : maintenanceEvents.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  // Handle adding a new maintenance event
  const handleAddMaintenance = async () => {
    if (!newMaintenance.title || !newMaintenance.description || newMaintenance.serviceIds.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }
      
      const response = await fetch('https://status-app-backend-kow1.onrender.com/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newMaintenance.title,
          description: newMaintenance.description,
          impact: newMaintenance.impact,
          serviceIds: newMaintenance.serviceIds,
          scheduledStartDate: newMaintenance.scheduledStartDate,
          scheduledEndDate: newMaintenance.scheduledEndDate,
          isPublic: newMaintenance.isPublic
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create maintenance (Status: ${response.status})`);
      }
      
      const data = await response.json();
      
      setMaintenanceEvents(prev => [...prev, data.maintenance]);
      
      toast({
        title: "Maintenance scheduled",
        description: `${newMaintenance.title} has been scheduled successfully.`
      });
      
      // Reset form and close dialog
      setNewMaintenance({
        title: "",
        description: "",
        impact: "minor",
        serviceIds: [],
        scheduledStartDate: todayStr,
        scheduledEndDate: tomorrowStr,
        isPublic: true
      });
      setIsAddMaintenanceOpen(false);
      
    } catch (err) {
      console.error('Error creating maintenance:', err);
      toast({
        title: "Error scheduling maintenance",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Open the edit maintenance dialog
  const handleOpenEditDialog = (maintenance: MaintenanceEvent) => {
    setEditingMaintenance({
      _id: maintenance._id,
      title: maintenance.title,
      description: maintenance.description,
      status: maintenance.status,
      impact: maintenance.impact,
      serviceIds: maintenance.services.map(s => s._id),
      scheduledStartDate: format(new Date(maintenance.scheduledStartDate), "yyyy-MM-dd'T'HH:mm"),
      scheduledEndDate: format(new Date(maintenance.scheduledEndDate), "yyyy-MM-dd'T'HH:mm"),
      isPublic: maintenance.isPublic
    });
    setIsEditMaintenanceOpen(true);
  };
  
  // Handle editing a maintenance event
  const handleEditMaintenance = async () => {
    if (!editingMaintenance) return;
    
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }
      
      const response = await fetch(`https://status-app-backend-kow1.onrender.com/api/maintenance/${editingMaintenance._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editingMaintenance.title,
          description: editingMaintenance.description,
          status: editingMaintenance.status,
          impact: editingMaintenance.impact,
          serviceIds: editingMaintenance.serviceIds,
          scheduledStartDate: editingMaintenance.scheduledStartDate,
          scheduledEndDate: editingMaintenance.scheduledEndDate,
          isPublic: editingMaintenance.isPublic
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update maintenance (Status: ${response.status})`);
      }
      
      const data = await response.json();
      
      setMaintenanceEvents(prev => prev.map(maintenance => 
        maintenance._id === editingMaintenance._id ? data.maintenance : maintenance
      ));
      
      toast({
        title: "Maintenance updated",
        description: "The maintenance event has been updated successfully."
      });
      
      setEditingMaintenance(null);
      setIsEditMaintenanceOpen(false);
      
    } catch (err) {
      console.error('Error updating maintenance:', err);
      toast({
        title: "Error updating maintenance",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle deleting a maintenance event
  const handleDeleteMaintenance = async (maintenanceId: string) => {
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }
      
      const response = await fetch(`https://status-app-backend-kow1.onrender.com/api/maintenance/${maintenanceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete maintenance (Status: ${response.status})`);
      }
      
      setMaintenanceEvents(prev => prev.filter(maintenance => maintenance._id !== maintenanceId));
      
      toast({
        title: "Maintenance deleted",
        description: "The maintenance event has been deleted successfully."
      });
      
    } catch (err) {
      console.error('Error deleting maintenance:', err);
      toast({
        title: "Error deleting maintenance",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    }
  };
  
  // Open add update dialog
  const openAddUpdateDialog = (maintenance: MaintenanceEvent) => {
    setCurrentMaintenance(maintenance);
    setNewUpdate({
      message: "",
      status: maintenance.status,
    });
    setIsAddUpdateOpen(true);
  };
  
  // Handle adding an update to a maintenance event
  const handleAddUpdate = async () => {
    if (!currentMaintenance || !newUpdate.message) return;
    
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }
      
      const response = await fetch(`https://status-app-backend-kow1.onrender.com/api/maintenance/${currentMaintenance._id}/updates`, {
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
      
      setMaintenanceEvents(prev => prev.map(maintenance => 
        maintenance._id === currentMaintenance._id ? data.maintenance : maintenance
      ));
      
      toast({
        title: "Update added",
        description: "The maintenance event has been updated successfully."
      });
      
      setCurrentMaintenance(null);
      setNewUpdate({ message: "", status: "scheduled" });
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
  
  // Update maintenance status
  const updateMaintenanceStatus = async (maintenanceId: string, newStatus: "scheduled" | "in_progress" | "completed" | "cancelled") => {
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }
      
      const response = await fetch(`https://status-app-backend-kow1.onrender.com/api/maintenance/${maintenanceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update status (Status: ${response.status})`);
      }
      
      const data = await response.json();
      
      setMaintenanceEvents(prev => prev.map(maintenance => 
        maintenance._id === maintenanceId ? data.maintenance : maintenance
      ));
      
      toast({
        title: "Status updated",
        description: `Maintenance status changed to ${newStatus.replace('_', ' ')}.`
      });
      
    } catch (err) {
      console.error('Error updating status:', err);
      toast({
        title: "Error updating status",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <Calendar className="mr-1 h-3 w-3" />
            Scheduled
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            Cancelled
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Get impact badge
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "none":
        return <Badge className="bg-gray-500">None</Badge>;
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
          <h2 className="text-2xl font-bold tracking-tight">Maintenance</h2>
          <p className="text-muted-foreground">
            Schedule and manage maintenance events for your services.
          </p>
        </div>
        
        <Button onClick={() => setIsAddMaintenanceOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Maintenance
        </Button>
      </div>
      
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search maintenance events..."
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
      
      {/* Maintenance list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Maintenance Events</CardTitle>
          <CardDescription>
            {searchQuery.trim() !== '' ? 
              `Showing ${filteredMaintenanceEvents.length} of ${maintenanceEvents.length} events` : 
              `Total events: ${maintenanceEvents.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="ml-3">Loading maintenance events...</span>
            </div>
          ) : error ? (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md">
              <p className="font-semibold">Error loading maintenance events</p>
              <p className="text-sm">{error}</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Try again
              </Button>
            </div>
          ) : filteredMaintenanceEvents.length === 0 ? (
            <div className="text-center py-10">
              {searchQuery ? (
                <p className="text-muted-foreground">No maintenance events matching your search.</p>
              ) : (
                <>
                  <p className="text-muted-foreground">No maintenance events have been scheduled.</p>
                  <Button
                    variant="link"
                    onClick={() => setIsAddMaintenanceOpen(true)}
                    className="mt-2"
                  >
                    Schedule your first maintenance
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
                    <TableHead>Impact</TableHead>
                    <TableHead>Scheduled Start</TableHead>
                    <TableHead>Scheduled End</TableHead>
                    <TableHead>Affected Services</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaintenanceEvents.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>{getImpactBadge(event.impact)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(event.scheduledStartDate), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(event.scheduledEndDate), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {event.services.map(service => (
                            <Badge key={service._id} variant="outline">{service.name}</Badge>
                          ))}
                          {event.services.length === 0 && (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenEditDialog(event)}>
                              <PenSquare className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openAddUpdateDialog(event)}>
                              <MessageSquarePlus className="mr-2 h-4 w-4" />
                              Add Update
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            
                            {event.status === "scheduled" && (
                              <DropdownMenuItem onClick={() => updateMaintenanceStatus(event._id, "in_progress")}>
                                Start Maintenance
                              </DropdownMenuItem>
                            )}
                            
                            {event.status === "in_progress" && (
                              <DropdownMenuItem onClick={() => updateMaintenanceStatus(event._id, "completed")}>
                                Complete Maintenance
                              </DropdownMenuItem>
                            )}
                            
                            {(event.status === "scheduled" || event.status === "in_progress") && (
                              <DropdownMenuItem onClick={() => updateMaintenanceStatus(event._id, "cancelled")}>
                                Cancel Maintenance
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMaintenance(event._id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Maintenance Dialog */}
      <Dialog open={isAddMaintenanceOpen} onOpenChange={setIsAddMaintenanceOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>
              Plan a maintenance window for your services.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Maintenance Title</Label>
              <Input
                id="title"
                placeholder="e.g., Database Upgrade, Server Maintenance"
                value={newMaintenance.title}
                onChange={(e) => setNewMaintenance({...newMaintenance, title: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what maintenance will be performed..."
                rows={3}
                value={newMaintenance.description}
                onChange={(e) => setNewMaintenance({...newMaintenance, description: e.target.value})}
              />
            </div>
            
            {/* Impact level field and isPublic field in same row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="impact">Impact Level</Label>
                <Select 
                  value={newMaintenance.impact} 
                  onValueChange={(value: "none" | "minor" | "major" | "critical") => 
                    setNewMaintenance({...newMaintenance, impact: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2 self-end pb-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newMaintenance.isPublic}
                    onChange={(e) => setNewMaintenance({...newMaintenance, isPublic: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isPublic" className="text-sm font-medium">
                    Make this maintenance public on status page
                  </Label>
                </div>
              </div>
            </div>
            
            {/* Scheduled Start and End arranged side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="scheduledStart">Scheduled Start</Label>
                <Input
                  id="scheduledStart"
                  type="datetime-local"
                  value={newMaintenance.scheduledStartDate}
                  onChange={(e) => setNewMaintenance({...newMaintenance, scheduledStartDate: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="scheduledEnd">Scheduled End</Label>
                <Input
                  id="scheduledEnd"
                  type="datetime-local"
                  value={newMaintenance.scheduledEndDate}
                  onChange={(e) => setNewMaintenance({...newMaintenance, scheduledEndDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Affected Services</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md max-h-[150px] overflow-y-auto">
                {services.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-1">No services available.</p>
                ) : (
                  services.map((service) => (
                    <Badge
                      key={service._id}
                      variant={newMaintenance.serviceIds.includes(service._id) ? "default" : "outline"}
                      className="cursor-pointer m-1"
                      onClick={() => {
                        const isSelected = newMaintenance.serviceIds.includes(service._id);
                        setNewMaintenance({
                          ...newMaintenance,
                          serviceIds: isSelected
                            ? newMaintenance.serviceIds.filter(id => id !== service._id)
                            : [...newMaintenance.serviceIds, service._id]
                        });
                      }}
                    >
                      {service.name}
                    </Badge>
                  ))
                )}
              </div>
              {newMaintenance.serviceIds.length === 0 && (
                <p className="text-xs text-destructive mt-1">At least one service must be selected</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMaintenanceOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddMaintenance} 
              disabled={isSubmitting || !newMaintenance.title || !newMaintenance.description || newMaintenance.serviceIds.length === 0}
            >
              {isSubmitting ? "Scheduling..." : "Schedule Maintenance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Maintenance Dialog */}
      <Dialog open={isEditMaintenanceOpen} onOpenChange={setIsEditMaintenanceOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Maintenance</DialogTitle>
            <DialogDescription>
              Update the details of this maintenance event.
            </DialogDescription>
          </DialogHeader>
          
          {editingMaintenance && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editTitle">Maintenance Title</Label>
                <Input
                  id="editTitle"
                  value={editingMaintenance.title}
                  onChange={(e) => setEditingMaintenance({...editingMaintenance, title: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  rows={3}
                  value={editingMaintenance.description}
                  onChange={(e) => setEditingMaintenance({...editingMaintenance, description: e.target.value})}
                />
              </div>
              
              {/* Status and Impact arranged side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editStatus">Status</Label>
                  <Select 
                    value={editingMaintenance.status} 
                    onValueChange={(value: "scheduled" | "in_progress" | "completed" | "cancelled") => 
                      setEditingMaintenance({...editingMaintenance, status: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="editImpact">Impact Level</Label>
                  <Select 
                    value={editingMaintenance.impact} 
                    onValueChange={(value: "none" | "minor" | "major" | "critical") => 
                      setEditingMaintenance({...editingMaintenance, impact: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select impact level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Scheduled Start and End arranged side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="scheduledStart">Scheduled Start</Label>
                  <Input
                    id="scheduledStart"
                    type="datetime-local"
                    value={editingMaintenance.scheduledStartDate}
                    onChange={(e) => setEditingMaintenance({...editingMaintenance, scheduledStartDate: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="scheduledEnd">Scheduled End</Label>
                  <Input
                    id="scheduledEnd"
                    type="datetime-local"
                    value={editingMaintenance.scheduledEndDate}
                    onChange={(e) => setEditingMaintenance({...editingMaintenance, scheduledEndDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Affected Services</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md max-h-[150px] overflow-y-auto">
                  {services.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-1">No services available.</p>
                  ) : (
                    services.map((service) => (
                      <Badge
                        key={service._id}
                        variant={editingMaintenance.serviceIds?.includes(service._id) ? "default" : "outline"}
                        className="cursor-pointer m-1"
                        onClick={() => {
                          const isSelected = editingMaintenance.serviceIds?.includes(service._id);
                          setEditingMaintenance({
                            ...editingMaintenance,
                            serviceIds: isSelected
                              ? editingMaintenance.serviceIds?.filter(id => id !== service._id)
                              : [...(editingMaintenance.serviceIds || []), service._id]
                          });
                        }}
                      >
                        {service.name}
                      </Badge>
                    ))
                  )}
                </div>
                {editingMaintenance.serviceIds?.length === 0 && (
                  <p className="text-xs text-destructive mt-1">At least one service must be selected</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editIsPublic"
                  checked={editingMaintenance.isPublic}
                  onChange={(e) => setEditingMaintenance({...editingMaintenance, isPublic: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="editIsPublic" className="text-sm font-medium">
                  Make this maintenance public on status page
                </Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMaintenanceOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditMaintenance} 
              disabled={isSubmitting || !editingMaintenance?.title || !editingMaintenance?.description || editingMaintenance?.serviceIds?.length === 0}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Update Dialog */}
      <Dialog open={isAddUpdateOpen} onOpenChange={setIsAddUpdateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Maintenance Update</DialogTitle>
            <DialogDescription>
              {currentMaintenance && (
                <>
                  Provide an update for: <span className="font-medium">{currentMaintenance.title}</span>
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
                onValueChange={(value: "scheduled" | "in_progress" | "completed" | "cancelled") => 
                  setNewUpdate({...newUpdate, status: value})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
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

export default Maintenance;

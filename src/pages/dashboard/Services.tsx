import { useState, useEffect } from "react";
import { useServices, Service, ServiceStatus } from "@/contexts/ServiceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
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
  SelectLabel,
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, MoreVertical, Trash2, Search, XCircle, Pencil } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/clerk-react";

const Services = () => {
  const { services, serviceGroups, addService, updateService, deleteService } = useServices();
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [apiServices, setApiServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  
  const [editingService, setEditingService] = useState<{
    _id: string;
    name: string;
    description: string;
    status: ServiceStatus;
    group: string;
  } | null>(null);

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    status: "operational" as ServiceStatus,
    group: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add a new state to control the confirmation dialog visibility
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<any>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        
        if (!token) {
          throw new Error("Authentication token is missing. Please log in again.");
        }
        
        const response = await fetch('https://status-app-backend-kow1.onrender.com/api/services', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setApiServices(data);
        } else if (data && typeof data === 'object' && data.services) {
          setApiServices(data.services);
        } else {
          console.warn('API response is not in expected format:', data);
          setApiServices([]);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
        setApiServices([]);
        toast({
          title: "Error fetching services",
          description: err instanceof Error ? err.message : 'An error occurred',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, [toast, getToken]);
  
  const filteredApiServices = searchQuery.trim() === '' 
    ? apiServices
    : apiServices.filter(service => 
        service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.group?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-status-operational hover:bg-status-operational">Operational</Badge>;
      case "degraded_performance":
        return <Badge className="bg-status-degraded hover:bg-status-degraded">Degraded Performance</Badge>;
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
  
  const handleAddService = async () => {
    if (!newService.name || !newService.description) return;
    
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }
      
      let groupName = "Other";
      if (newService.group && newService.group !== "none") {
        const selectedGroup = serviceGroups.find(g => g.id === newService.group);
        if (selectedGroup) {
          switch(selectedGroup.name) {
            case "Frontend":
              groupName = "Frontend Services";
              break;
            case "Backend":
              groupName = "Backend Services";
              break;
            case "Billing":
              groupName = "Billing Services";
              break;
            default:
              groupName = "Other";
          }
        }
      }
      
      const response = await fetch('https://status-app-backend-kow1.onrender.com/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newService.name,
          description: newService.description,
          group: groupName
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to add service (Status: ${response.status})`);
      }
      
      const data = await response.json();
      
      setApiServices(prevServices => [...prevServices, data.service]);
      
      toast({
        title: "Service added",
        description: `${newService.name} has been added successfully.`
      });
      
      setNewService({
        name: "",
        description: "",
        status: "operational",
        group: ""
      });
      setIsAddServiceOpen(false);
      
    } catch (err) {
      console.error('Error adding service:', err);
      toast({
        title: "Error adding service",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditDialog = (service: any) => {
    setEditingService({
      _id: service._id,
      name: service.name,
      description: service.description || "",
      status: service.status || "operational",
      group: service.group || "Other"
    });
    setIsEditServiceOpen(true);
  };
  
  const handleEditService = async () => {
    if (!editingService || !editingService.name || !editingService.description) return;
    
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }
      
      const response = await fetch(`https://status-app-backend-kow1.onrender.com/api/services/${editingService._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingService.name,
          description: editingService.description,
          status: editingService.status,
          group: editingService.group
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update service (Status: ${response.status})`);
      }
      
      const data = await response.json();
      
      setApiServices(prevServices => prevServices.map(service => 
        service._id === editingService._id ? data.service : service
      ));
      
      toast({
        title: "Service updated",
        description: `${editingService.name} has been updated successfully.`
      });
      
      setEditingService(null);
      setIsEditServiceOpen(false);
      
    } catch (err) {
      console.error('Error updating service:', err);
      toast({
        title: "Error updating service",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteService = (service: any) => {
    setServiceToDelete(service);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete || !serviceToDelete._id) {
      toast({
        title: "Error",
        description: "Cannot delete service: missing service ID",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }
      
      // Make DELETE request to API endpoint
      const response = await fetch(`https://status-app-backend-kow1.onrender.com/api/services/${serviceToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403) {
          throw new Error("You don't have permission to delete services. Admin role required.");
        } else {
          throw new Error(errorData.message || `Failed to delete service (Status: ${response.status})`);
        }
      }
      
      // Update local state by removing the deleted service
      setApiServices(prevServices => prevServices.filter(s => s._id !== serviceToDelete._id));
      
      toast({
        title: "Service deleted",
        description: `${serviceToDelete.name} has been deleted successfully.`
      });
      
      // Close the dialog
      setIsDeleteConfirmOpen(false);
      setServiceToDelete(null);
      
    } catch (err) {
      console.error('Error deleting service:', err);
      toast({
        title: "Error deleting service",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground">
            Manage your monitored services and their current status.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button onClick={() => setIsAddServiceOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
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
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Services List</CardTitle>
          <CardDescription>
            {searchQuery.trim() !== '' ? 
              `Showing ${filteredApiServices.length} of ${apiServices.length} services` : 
              `Total services: ${apiServices.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="ml-3">Loading services...</span>
            </div>
          ) : error ? (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md">
              <p className="font-semibold">Error loading services</p>
              <p className="text-sm">{error}</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Try again
              </Button>
            </div>
          ) : apiServices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No services found from API.</p>
            </div>
          ) : filteredApiServices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No services matching "<span className="font-medium">{searchQuery}</span>".
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
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApiServices.map((service) => (
                    <TableRow key={service._id || `service-${service.name}-${Math.random()}`}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.description || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(service.status as ServiceStatus)}</TableCell>
                      <TableCell className="font-medium text-l">{service.group}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleOpenEditDialog(service)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Service
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => confirmDeleteService(service)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Service
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
      
      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Add a new service to monitor on your status page.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                placeholder="e.g., API, Database, Website"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe this service..."
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="group">Group</Label>
              <Select 
                value={newService.group || "Other"} 
                onValueChange={(value) => setNewService({...newService, group: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Frontend Services">Frontend Services</SelectItem>
                    <SelectItem value="Backend Services">Backend Services</SelectItem>
                    <SelectItem value="Billing Services">Billing Services</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Current Status</Label>
              <Select 
                value={newService.status} 
                onValueChange={(value: ServiceStatus) => setNewService({...newService, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="degraded">Degraded Performance</SelectItem>
                  <SelectItem value="partial_outage">Partial Outage</SelectItem>
                  <SelectItem value="major_outage">Major Outage</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddService} 
              disabled={isSubmitting || !newService.name || !newService.description}
            >
              {isSubmitting ? "Adding..." : "Add Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the details of your service.
            </DialogDescription>
          </DialogHeader>
          
          {editingService && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Service Name</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., API, Database, Website"
                  value={editingService.name}
                  onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Briefly describe this service..."
                  value={editingService.description}
                  onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-group">Group</Label>
                <Select 
                  value={editingService.group} 
                  onValueChange={(value) => setEditingService({...editingService, group: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Frontend Services">Frontend Services</SelectItem>
                      <SelectItem value="Backend Services">Backend Services</SelectItem>
                      <SelectItem value="Billing Services">Billing Services</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Current Status</Label>
                <Select 
                  value={editingService.status} 
                  onValueChange={(value: ServiceStatus) => setEditingService({...editingService, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="degraded_performance">Degraded Performance</SelectItem>
                    <SelectItem value="partial_outage">Partial Outage</SelectItem>
                    <SelectItem value="major_outage">Major Outage</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditServiceOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditService} 
              disabled={isSubmitting || !editingService?.name || !editingService?.description}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {serviceToDelete && (
            <div className="py-4">
              <div className="bg-muted p-4 rounded-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{serviceToDelete.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Group:</span>
                  <span>{serviceToDelete.group || "Other"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status:</span>
                  <span>{getStatusBadge(serviceToDelete.status as ServiceStatus)}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmOpen(false);
                setServiceToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteService}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Deleting...
                </>
              ) : (
                "Delete Service"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;

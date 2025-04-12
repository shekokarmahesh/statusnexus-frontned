
import { useState } from "react";
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
import { Plus, MoreVertical, PenSquare, Trash2, Search, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Services = () => {
  const { services, serviceGroups, addService, updateService, deleteService, addServiceGroup } = useServices();
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Form state for adding a new service
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    status: "operational" as ServiceStatus,
    groupId: "",
  });
  
  // Form state for adding a new group
  const [newGroup, setNewGroup] = useState({
    name: "",
  });
  
  // Filter services based on search query
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Function to get status badge
  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-status-operational hover:bg-status-operational">Operational</Badge>;
      case "degraded":
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
  
  // Handle add service form submission
  const handleAddService = () => {
    addService({
      name: newService.name,
      description: newService.description,
      status: newService.status,
      groupId: newService.groupId || undefined,
      uptime: 99.9, // Default uptime
    });
    
    toast({
      title: "Service added",
      description: `${newService.name} has been added successfully.`
    });
    
    // Reset form and close dialog
    setNewService({
      name: "",
      description: "",
      status: "operational",
      groupId: "",
    });
    setIsAddServiceOpen(false);
  };
  
  // Handle add group form submission
  const handleAddGroup = () => {
    addServiceGroup({
      name: newGroup.name,
      services: [],
    });
    
    toast({
      title: "Group added",
      description: `${newGroup.name} has been added successfully.`
    });
    
    // Reset form and close dialog
    setNewGroup({
      name: "",
    });
    setIsAddGroupOpen(false);
  };
  
  // Open edit service dialog
  const openEditServiceDialog = (service: Service) => {
    setEditingService(service);
    setIsEditServiceOpen(true);
  };
  
  // Handle edit service form submission
  const handleEditService = () => {
    if (editingService) {
      updateService(editingService.id, editingService);
      
      toast({
        title: "Service updated",
        description: `${editingService.name} has been updated successfully.`
      });
      
      setIsEditServiceOpen(false);
      setEditingService(null);
    }
  };
  
  // Handle delete service
  const handleDeleteService = (serviceId: string) => {
    const serviceToDelete = services.find(s => s.id === serviceId);
    if (serviceToDelete) {
      deleteService(serviceId);
      
      toast({
        title: "Service deleted",
        description: `${serviceToDelete.name} has been deleted successfully.`
      });
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
          <Button variant="outline" onClick={() => setIsAddGroupOpen(true)}>
            Add Group
          </Button>
          <Button onClick={() => setIsAddServiceOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>
      
      {/* Search and filters */}
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
      
      {/* Service list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Service List</CardTitle>
          <CardDescription>
            Total services: {services.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No services found.</p>
              <Button
                variant="link"
                onClick={() => setIsAddServiceOpen(true)}
                className="mt-2"
              >
                Add your first service
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>
                        {service.groupId ? 
                          serviceGroups.find(group => group.id === service.groupId)?.name || "-"
                          : "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(service.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(service.lastUpdated))} ago
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEditServiceDialog(service)}>
                              <PenSquare className="mr-2 h-4 w-4" />
                              Edit Service
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteService(service.id)}
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
      
      {/* Add Service Dialog */}
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
              <Label htmlFor="group">Group (Optional)</Label>
              <Select 
                value={newService.groupId} 
                onValueChange={(value) => setNewService({...newService, groupId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">None</SelectItem>
                    {serviceGroups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Initial Status</Label>
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
              disabled={!newService.name || !newService.description}
            >
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Group Dialog */}
      <Dialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Group</DialogTitle>
            <DialogDescription>
              Create a new group to organize your services.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="e.g., Frontend, Backend, Infrastructure"
                value={newGroup.name}
                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddGroupOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddGroup} 
              disabled={!newGroup.name}
            >
              Add Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Service Dialog */}
      {editingService && (
        <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Update this service's details and status.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editName">Service Name</Label>
                <Input
                  id="editName"
                  value={editingService.name}
                  onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={editingService.description}
                  onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="editGroup">Group</Label>
                <Select 
                  value={editingService.groupId || ""} 
                  onValueChange={(value) => setEditingService({...editingService, groupId: value || undefined})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {serviceGroups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select 
                  value={editingService.status} 
                  onValueChange={(value: ServiceStatus) => setEditingService({...editingService, status: value})}
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
              <Button variant="outline" onClick={() => setIsEditServiceOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditService} 
                disabled={!editingService.name || !editingService.description}
              >
                Update Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Services;

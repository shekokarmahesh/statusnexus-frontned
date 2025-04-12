
import { useState } from "react";
import { useServices, MaintenanceEvent } from "@/contexts/ServiceContext";
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
  Calendar 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const Maintenance = () => {
  const { services, maintenanceEvents, addMaintenanceEvent, updateMaintenanceEvent, deleteMaintenanceEvent } = useServices();
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
  const [isEditMaintenanceOpen, setIsEditMaintenanceOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<MaintenanceEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const timeNow = format(today, "HH:mm");
  
  // Form state for adding new maintenance
  const [newMaintenance, setNewMaintenance] = useState({
    title: "",
    description: "",
    status: "scheduled",
    affectedServices: [] as string[],
    scheduledStart: todayStr,
    scheduledStartTime: timeNow,
    scheduledEnd: todayStr,
    scheduledEndTime: format(new Date(today.getTime() + 2 * 60 * 60 * 1000), "HH:mm"), // 2 hours later
  });
  
  // Filter maintenance events based on search query
  const filteredMaintenanceEvents = maintenanceEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle add maintenance form submission
  const handleAddMaintenance = () => {
    const scheduledStart = new Date(`${newMaintenance.scheduledStart}T${newMaintenance.scheduledStartTime}`);
    const scheduledEnd = new Date(`${newMaintenance.scheduledEnd}T${newMaintenance.scheduledEndTime}`);
    
    addMaintenanceEvent({
      title: newMaintenance.title,
      description: newMaintenance.description,
      status: "scheduled",
      affectedServices: newMaintenance.affectedServices,
      scheduledStart,
      scheduledEnd,
    });
    
    toast({
      title: "Maintenance scheduled",
      description: "The maintenance event has been scheduled."
    });
    
    // Reset form and close dialog
    resetMaintenanceForm();
    setIsAddMaintenanceOpen(false);
  };
  
  // Handle edit maintenance form submission
  const handleEditMaintenance = () => {
    if (editingMaintenance) {
      updateMaintenanceEvent(editingMaintenance.id, editingMaintenance);
      
      toast({
        title: "Maintenance updated",
        description: "The maintenance event has been updated."
      });
      
      setIsEditMaintenanceOpen(false);
      setEditingMaintenance(null);
    }
  };
  
  // Reset maintenance form
  const resetMaintenanceForm = () => {
    setNewMaintenance({
      title: "",
      description: "",
      status: "scheduled",
      affectedServices: [],
      scheduledStart: todayStr,
      scheduledStartTime: timeNow,
      scheduledEnd: todayStr,
      scheduledEndTime: format(new Date(today.getTime() + 2 * 60 * 60 * 1000), "HH:mm"),
    });
  };
  
  // Open edit maintenance dialog
  const openEditMaintenanceDialog = (maintenanceEvent: MaintenanceEvent) => {
    setEditingMaintenance({
      ...maintenanceEvent,
    });
    setIsEditMaintenanceOpen(true);
  };
  
  // Handle delete maintenance
  const handleDeleteMaintenance = (maintenanceId: string) => {
    const maintenanceToDelete = maintenanceEvents.find(m => m.id === maintenanceId);
    if (maintenanceToDelete) {
      deleteMaintenanceEvent(maintenanceId);
      
      toast({
        title: "Maintenance deleted",
        description: `"${maintenanceToDelete.title}" has been deleted.`
      });
    }
  };
  
  // Update maintenance status
  const updateMaintenanceStatus = (maintenanceId: string, newStatus: "scheduled" | "in_progress" | "completed" | "cancelled") => {
    updateMaintenanceEvent(maintenanceId, { status: newStatus });
    
    toast({
      title: "Status updated",
      description: `Maintenance status changed to ${newStatus.replace('_', ' ')}.`
    });
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
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
            Total events: {maintenanceEvents.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMaintenanceEvents.length === 0 ? (
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
                    <TableHead>Scheduled Start</TableHead>
                    <TableHead>Scheduled End</TableHead>
                    <TableHead>Affected Services</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaintenanceEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(event.scheduledStart), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(event.scheduledEnd), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {event.affectedServices.map(serviceId => {
                            const service = services.find(s => s.id === serviceId);
                            return service ? (
                              <Badge key={serviceId} variant="outline">{service.name}</Badge>
                            ) : null;
                          })}
                          {event.affectedServices.length === 0 && (
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
                            <DropdownMenuItem onClick={() => openEditMaintenanceDialog(event)}>
                              <PenSquare className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            
                            {event.status === "scheduled" && (
                              <DropdownMenuItem onClick={() => updateMaintenanceStatus(event.id, "in_progress")}>
                                Start Maintenance
                              </DropdownMenuItem>
                            )}
                            
                            {event.status === "in_progress" && (
                              <DropdownMenuItem onClick={() => updateMaintenanceStatus(event.id, "completed")}>
                                Complete Maintenance
                              </DropdownMenuItem>
                            )}
                            
                            {(event.status === "scheduled") && (
                              <DropdownMenuItem onClick={() => updateMaintenanceStatus(event.id, "cancelled")}>
                                Cancel Maintenance
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMaintenance(event.id)}
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
        <DialogContent className="sm:max-w-[500px]">
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
            
            <div className="grid gap-2">
              <Label>Scheduled Start</Label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    type="date"
                    value={newMaintenance.scheduledStart}
                    onChange={(e) => setNewMaintenance({...newMaintenance, scheduledStart: e.target.value})}
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="time"
                    value={newMaintenance.scheduledStartTime}
                    onChange={(e) => setNewMaintenance({...newMaintenance, scheduledStartTime: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Scheduled End</Label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    type="date"
                    value={newMaintenance.scheduledEnd}
                    onChange={(e) => setNewMaintenance({...newMaintenance, scheduledEnd: e.target.value})}
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="time"
                    value={newMaintenance.scheduledEndTime}
                    onChange={(e) => setNewMaintenance({...newMaintenance, scheduledEndTime: e.target.value})}
                  />
                </div>
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
                      variant={newMaintenance.affectedServices.includes(service.id) ? "default" : "outline"}
                      className="cursor-pointer m-1"
                      onClick={() => {
                        const isSelected = newMaintenance.affectedServices.includes(service.id);
                        setNewMaintenance({
                          ...newMaintenance,
                          affectedServices: isSelected
                            ? newMaintenance.affectedServices.filter(id => id !== service.id)
                            : [...newMaintenance.affectedServices, service.id]
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
            <Button variant="outline" onClick={() => setIsAddMaintenanceOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddMaintenance} 
              disabled={!newMaintenance.title || !newMaintenance.description}
            >
              Schedule Maintenance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Maintenance Dialog */}
      {editingMaintenance && (
        <Dialog open={isEditMaintenanceOpen} onOpenChange={setIsEditMaintenanceOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Maintenance</DialogTitle>
              <DialogDescription>
                Update the details of this maintenance event.
              </DialogDescription>
            </DialogHeader>
            
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
              
              <div className="grid gap-2">
                <Label>Status</Label>
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
                <Label>Scheduled Start</Label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      type="datetime-local"
                      value={format(new Date(editingMaintenance.scheduledStart), "yyyy-MM-dd'T'HH:mm")}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        if (!isNaN(date.getTime())) {
                          setEditingMaintenance({...editingMaintenance, scheduledStart: date});
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Scheduled End</Label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      type="datetime-local"
                      value={format(new Date(editingMaintenance.scheduledEnd), "yyyy-MM-dd'T'HH:mm")}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        if (!isNaN(date.getTime())) {
                          setEditingMaintenance({...editingMaintenance, scheduledEnd: date});
                        }
                      }}
                    />
                  </div>
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
                        variant={editingMaintenance.affectedServices.includes(service.id) ? "default" : "outline"}
                        className="cursor-pointer m-1"
                        onClick={() => {
                          const isSelected = editingMaintenance.affectedServices.includes(service.id);
                          setEditingMaintenance({
                            ...editingMaintenance,
                            affectedServices: isSelected
                              ? editingMaintenance.affectedServices.filter(id => id !== service.id)
                              : [...editingMaintenance.affectedServices, service.id]
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
              <Button variant="outline" onClick={() => setIsEditMaintenanceOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditMaintenance} 
                disabled={!editingMaintenance.title || !editingMaintenance.description}
              >
                Update Maintenance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Maintenance;

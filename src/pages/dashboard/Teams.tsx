
import { useState } from "react";
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
  Search, 
  XCircle,
  UserPlus,
  Mail,
  RefreshCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  status: "active" | "pending";
};

// Mock team members data with explicit types
const initialTeamMembers: TeamMember[] = [
  {
    id: "usr_1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active"
  },
  {
    id: "usr_2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "member",
    status: "active"
  },
  {
    id: "usr_3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "member",
    status: "pending"
  }
];

const Teams = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Form state for inviting new member
  const [newMember, setNewMember] = useState({
    email: "",
    role: "member" as "admin" | "member",
  });
  
  // Filter team members based on search query
  const filteredTeamMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle invite form submission
  const handleInvite = () => {
    const id = "usr_" + Math.random().toString(36).substr(2, 9);
    
    setTeamMembers([
      ...teamMembers,
      {
        id,
        name: newMember.email.split("@")[0],
        email: newMember.email,
        role: newMember.role,
        status: "pending" as "active" | "pending"
      }
    ]);
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${newMember.email}.`
    });
    
    // Reset form and close dialog
    setNewMember({
      email: "",
      role: "member",
    });
    setIsInviteOpen(false);
  };
  
  // Handle delete member
  const handleDeleteMember = (memberId: string) => {
    const memberToDelete = teamMembers.find(m => m.id === memberId);
    if (memberToDelete) {
      setTeamMembers(teamMembers.filter(member => member.id !== memberId));
      
      toast({
        title: "Member removed",
        description: `${memberToDelete.name} has been removed from the team.`
      });
    }
  };
  
  // Handle resend invitation
  const handleResendInvite = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (member && member.status === "pending") {
      toast({
        title: "Invitation resent",
        description: `The invitation to ${member.email} has been resent.`
      });
    }
  };
  
  // Handle role change
  const handleRoleChange = (memberId: string, newRole: "admin" | "member") => {
    setTeamMembers(teamMembers.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ));
    
    const member = teamMembers.find(m => m.id === memberId);
    if (member) {
      toast({
        title: "Role updated",
        description: `${member.name}'s role has been updated to ${newRole}.`
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Management</h2>
          <p className="text-muted-foreground">
            Manage your team members and their access permissions.
          </p>
        </div>
        
        <Button onClick={() => setIsInviteOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Team Member
        </Button>
      </div>
      
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
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
      
      {/* Team members list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Total members: {teamMembers.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTeamMembers.length === 0 ? (
            <div className="text-center py-10">
              {searchQuery ? (
                <p className="text-muted-foreground">No team members matching your search.</p>
              ) : (
                <>
                  <p className="text-muted-foreground">No team members found.</p>
                  <Button
                    variant="link"
                    onClick={() => setIsInviteOpen(true)}
                    className="mt-2"
                  >
                    Invite your first team member
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant={member.role === "admin" ? "default" : "outline"}>
                          {member.role === "admin" ? "Admin" : "Member"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.status === "active" ? (
                          <span className="text-status-operational flex items-center">
                            <span className="w-2 h-2 rounded-full bg-status-operational mr-2"></span>
                            Active
                          </span>
                        ) : (
                          <span className="text-amber-500 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                            Pending
                          </span>
                        )}
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
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => handleRoleChange(member.id, "admin")}
                              disabled={member.role === "admin"}
                            >
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleRoleChange(member.id, "member")}
                              disabled={member.role === "member"}
                            >
                              Make Member
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            {member.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleResendInvite(member.id)}>
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Resend Invite
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMember(member.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
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
      
      {/* Invite Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team. They will receive an email with instructions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newMember.role} 
                onValueChange={(value: "admin" | "member") => setNewMember({...newMember, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="member">Team Member</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Administrators can manage all aspects of the status page. Team members can update service status and incidents.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleInvite} 
              disabled={!newMember.email}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teams;

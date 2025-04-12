
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Organization settings
  const [orgSettings, setOrgSettings] = useState({
    name: user?.organization.name || "Demo Organization",
    url: "status.example.com",
    logo: "",
    favicon: "",
    supportEmail: "support@example.com",
    timezone: "UTC",
    automaticIncidents: true,
    allowSubscriptions: true,
  });
  
  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    emailNotifications: true,
    incidentCreated: true,
    incidentUpdated: true,
    maintenanceScheduled: true,
    maintenanceUpdated: true,
    statusChanged: true,
  });
  
  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: "#3b82f6",
    font: "Inter",
    customCSS: "",
    customHeader: "",
    customFooter: "",
  });
  
  // Handle organization settings update
  const handleUpdateOrgSettings = () => {
    // In a real app, this would make an API call to update the settings
    toast({
      title: "Settings updated",
      description: "Your organization settings have been saved."
    });
  };
  
  // Handle email settings update
  const handleUpdateEmailSettings = () => {
    toast({
      title: "Email settings updated",
      description: "Your notification preferences have been saved."
    });
  };
  
  // Handle appearance settings update
  const handleUpdateAppearanceSettings = () => {
    toast({
      title: "Appearance settings updated",
      description: "Your customization settings have been saved."
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your organization and application settings.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Configure your organization and status page settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={orgSettings.name}
                    onChange={(e) => setOrgSettings({...orgSettings, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="url">Status Page URL</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      https://
                    </span>
                    <Input
                      id="url"
                      className="rounded-l-none"
                      value={orgSettings.url}
                      onChange={(e) => setOrgSettings({...orgSettings, url: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    placeholder="https://example.com/logo.png"
                    value={orgSettings.logo}
                    onChange={(e) => setOrgSettings({...orgSettings, logo: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    placeholder="https://example.com/favicon.ico"
                    value={orgSettings.favicon}
                    onChange={(e) => setOrgSettings({...orgSettings, favicon: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={orgSettings.supportEmail}
                    onChange={(e) => setOrgSettings({...orgSettings, supportEmail: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={orgSettings.timezone} 
                    onValueChange={(value) => setOrgSettings({...orgSettings, timezone: value})}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="automaticIncidents">Automatic Incidents</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically create incidents when services experience downtime.
                    </p>
                  </div>
                  <Switch
                    id="automaticIncidents"
                    checked={orgSettings.automaticIncidents}
                    onCheckedChange={(checked) => setOrgSettings({...orgSettings, automaticIncidents: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowSubscriptions">Allow Subscriptions</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to subscribe to status updates via email.
                    </p>
                  </div>
                  <Switch
                    id="allowSubscriptions"
                    checked={orgSettings.allowSubscriptions}
                    onCheckedChange={(checked) => setOrgSettings({...orgSettings, allowSubscriptions: checked})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateOrgSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email.
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={emailSettings.emailNotifications}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, emailNotifications: checked})}
                />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Notification Events</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="incidentCreated">Incident Created</Label>
                    <Switch
                      id="incidentCreated"
                      disabled={!emailSettings.emailNotifications}
                      checked={emailSettings.incidentCreated}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, incidentCreated: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="incidentUpdated">Incident Updated</Label>
                    <Switch
                      id="incidentUpdated"
                      disabled={!emailSettings.emailNotifications}
                      checked={emailSettings.incidentUpdated}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, incidentUpdated: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenanceScheduled">Maintenance Scheduled</Label>
                    <Switch
                      id="maintenanceScheduled"
                      disabled={!emailSettings.emailNotifications}
                      checked={emailSettings.maintenanceScheduled}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, maintenanceScheduled: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenanceUpdated">Maintenance Updated</Label>
                    <Switch
                      id="maintenanceUpdated"
                      disabled={!emailSettings.emailNotifications}
                      checked={emailSettings.maintenanceUpdated}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, maintenanceUpdated: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="statusChanged">Service Status Changed</Label>
                    <Switch
                      id="statusChanged"
                      disabled={!emailSettings.emailNotifications}
                      checked={emailSettings.statusChanged}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, statusChanged: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateEmailSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your status page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      className="w-12"
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                    />
                    <Input
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font">Font</Label>
                  <Select 
                    value={appearanceSettings.font} 
                    onValueChange={(value) => setAppearanceSettings({...appearanceSettings, font: value})}
                  >
                    <SelectTrigger id="font">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customCSS">Custom CSS</Label>
                <Textarea
                  id="customCSS"
                  placeholder=".my-class { color: blue; }"
                  rows={4}
                  value={appearanceSettings.customCSS}
                  onChange={(e) => setAppearanceSettings({...appearanceSettings, customCSS: e.target.value})}
                />
                <p className="text-sm text-muted-foreground">
                  Add custom CSS to further style your status page.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customHeader">Custom Header HTML</Label>
                <Textarea
                  id="customHeader"
                  placeholder="<div class='header'>Custom header content</div>"
                  rows={3}
                  value={appearanceSettings.customHeader}
                  onChange={(e) => setAppearanceSettings({...appearanceSettings, customHeader: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customFooter">Custom Footer HTML</Label>
                <Textarea
                  id="customFooter"
                  placeholder="<footer>Custom footer content</footer>"
                  rows={3}
                  value={appearanceSettings.customFooter}
                  onChange={(e) => setAppearanceSettings({...appearanceSettings, customFooter: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateAppearanceSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

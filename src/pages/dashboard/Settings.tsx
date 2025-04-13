import { useClerk, useUser, UserButton, OrganizationSwitcher } from "@clerk/clerk-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useState } from "react";
import { Bell, Shield, Globe, Mail, UserCog, ExternalLink, Users } from "lucide-react";

const Settings = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState({
    incidents: true,
    maintenance: true,
    statusChanges: false,
    dailyDigest: true
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          {/* Enhanced UserButton Card */}
          <Card className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all border border-border/60">
            <CardHeader className="p-4 pb-2 bg-muted/30 rounded-t-lg border-b border-border/60">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserCog className="h-5 w-5 text-primary" />
                User Account
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full animate-pulse"></div>
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "h-16 w-16 shadow-md relative z-10"
                      }
                    }}
                    signInUrl="/sign-in"
                  />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-lg">{user?.fullName || 'User'}</p>
                  <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || ''}</p>
                  <Badge variant="outline" className="mt-2 bg-primary/5">
                    Personal Account
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Enhanced Organization Card */}
          <Card className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all border border-border/60">
            <CardHeader className="p-4 pb-2 bg-muted/30 rounded-t-lg border-b border-border/60">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg opacity-70"></div>
                <OrganizationSwitcher 
                  hidePersonal
                  appearance={{
                    elements: {
                      rootBox: "w-full sm:w-[280px] relative z-10",
                      organizationSwitcherTrigger: "w-full p-2.5 border shadow-sm rounded-md hover:bg-accent hover:border-primary/30 transition-all",
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Separator className="my-8 opacity-50" />
      
      {/* Placeholder for future content, but not adding it as requested */}
    </div>
  );
};

export default Settings;

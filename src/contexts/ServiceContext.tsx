
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ServiceStatus = "operational" | "degraded_performance" | "partial_outage" | "major_outage" | "maintenance";

export type Service = {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  lastUpdated: Date;
  group?: string;
  uptime?: number; // percentage
};

export type ServiceGroup = {
  id: string;
  name: string;
  services: string[]; // service IDs
};

export type Incident = {
  id: string;
  title: string;
  description: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  severity: "minor" | "major" | "critical";
  affectedServices: string[]; // service IDs
  createdAt: Date;
  updatedAt: Date;
  updates: IncidentUpdate[];
};

export type IncidentUpdate = {
  id: string;
  message: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  createdAt: Date;
  user: string;
};

export type MaintenanceEvent = {
  id: string;
  title: string;
  description: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  affectedServices: string[]; // service IDs
  scheduledStart: Date;
  scheduledEnd: Date;
  createdAt: Date;
  updatedAt: Date;
};

type ServiceContextType = {
  services: Service[];
  serviceGroups: ServiceGroup[];
  incidents: Incident[];
  maintenanceEvents: MaintenanceEvent[];
  addService: (service: Omit<Service, "id" | "lastUpdated">) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addIncident: (incident: Omit<Incident, "id" | "createdAt" | "updatedAt" | "updates">) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  addIncidentUpdate: (incidentId: string, update: Omit<IncidentUpdate, "id" | "createdAt">) => void;
  deleteIncident: (id: string) => void;
  addMaintenanceEvent: (event: Omit<MaintenanceEvent, "id" | "createdAt" | "updatedAt">) => void;
  updateMaintenanceEvent: (id: string, updates: Partial<MaintenanceEvent>) => void;
  deleteMaintenanceEvent: (id: string) => void;
  addServiceGroup: (group: Omit<ServiceGroup, "id">) => void;
  updateServiceGroup: (id: string, updates: Partial<ServiceGroup>) => void;
  deleteServiceGroup: (id: string) => void;
  getOverallStatus: () => ServiceStatus;
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
};

// Mock data generator functions
const generateMockServices = (): Service[] => {
  return [
    {
      id: "srv_1",
      name: "API",
      description: "Core API services",
      status: "operational",
      lastUpdated: new Date(),
      uptime: 99.98,
      group: "grp_1"
    },
    {
      id: "srv_2",
      name: "Website",
      description: "Customer-facing website",
      status: "operational",
      lastUpdated: new Date(),
      uptime: 99.95,
      group: "grp_1"
    },
    {
      id: "srv_3",
      name: "Database",
      description: "Primary database cluster",
      status: "operational",
      lastUpdated: new Date(),
      uptime: 99.99,
      group: "grp_2"
    },
    {
      id: "srv_4",
      name: "Authentication",
      description: "User authentication services",
      status: "operational",
      lastUpdated: new Date(),
      uptime: 99.9,
      group: "grp_2"
    },
    {
      id: "srv_5",
      name: "Payment Processing",
      description: "Payment processing services",
      status: "degraded_performance",
      lastUpdated: new Date(),
      uptime: 98.5,
      group: "grp_3"
    }
  ];
};

const generateMockServiceGroups = (): ServiceGroup[] => {
  return [
    {
      id: "grp_1",
      name: "Frontend Services",
      services: ["srv_1", "srv_2"]
    },
    {
      id: "grp_2",
      name: "Backend Services",
      services: ["srv_3", "srv_4"]
    },
    {
      id: "grp_3",
      name: "Billing Services",
      services: ["srv_5"]
    }
  ];
};

const generateMockIncidents = (): Incident[] => {
  return [
    {
      id: "inc_1",
      title: "API Latency Issues",
      description: "We are investigating reports of increased latency on API calls.",
      status: "investigating",
      severity: "minor",
      affectedServices: ["srv_1"],
      createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      updates: [
        {
          id: "upd_1",
          message: "We are investigating reports of increased latency on API calls.",
          status: "investigating",
          createdAt: new Date(Date.now() - 60 * 60 * 1000),
          user: "System Administrator"
        },
        {
          id: "upd_2",
          message: "We have identified the issue and are working on a fix.",
          status: "identified",
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
          user: "System Administrator"
        }
      ]
    }
  ];
};

const generateMockMaintenanceEvents = (): MaintenanceEvent[] => {
  return [
    {
      id: "mnt_1",
      title: "Database Upgrade",
      description: "Scheduled maintenance for database version upgrade.",
      status: "scheduled",
      affectedServices: ["srv_3"],
      scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      scheduledEnd: new Date(Date.now() + 26 * 60 * 60 * 1000), // 1 day + 2 hours from now
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ];
};

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [maintenanceEvents, setMaintenanceEvents] = useState<MaintenanceEvent[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, set up mock data
    setServices(generateMockServices());
    setServiceGroups(generateMockServiceGroups());
    setIncidents(generateMockIncidents());
    setMaintenanceEvents(generateMockMaintenanceEvents());
  }, []);

  const addService = (service: Omit<Service, "id" | "lastUpdated">) => {
    const newService: Service = {
      ...service,
      id: "srv_" + Math.random().toString(36).substr(2, 9),
      lastUpdated: new Date(),
    };
    setServices([...services, newService]);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(
      services.map(service => 
        service.id === id 
          ? { ...service, ...updates, lastUpdated: new Date() } 
          : service
      )
    );
  };

  const deleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
    
    // Also remove the service from any groups
    setServiceGroups(
      serviceGroups.map(group => ({
        ...group,
        services: group.services.filter(serviceId => serviceId !== id)
      }))
    );
  };

  const addIncident = (incident: Omit<Incident, "id" | "createdAt" | "updatedAt" | "updates">) => {
    const now = new Date();
    const newIncident: Incident = {
      ...incident,
      id: "inc_" + Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
      updates: [
        {
          id: "upd_" + Math.random().toString(36).substr(2, 9),
          message: incident.description,
          status: incident.status,
          createdAt: now,
          user: "System Administrator" // In a real app, this would be the current user
        }
      ]
    };
    setIncidents([...incidents, newIncident]);
  };

  const updateIncident = (id: string, updates: Partial<Incident>) => {
    setIncidents(
      incidents.map(incident => 
        incident.id === id 
          ? { ...incident, ...updates, updatedAt: new Date() } 
          : incident
      )
    );
  };

  const addIncidentUpdate = (incidentId: string, update: Omit<IncidentUpdate, "id" | "createdAt">) => {
    const newUpdate: IncidentUpdate = {
      ...update,
      id: "upd_" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    
    setIncidents(
      incidents.map(incident => 
        incident.id === incidentId
          ? { 
              ...incident, 
              updates: [...incident.updates, newUpdate],
              status: update.status,
              updatedAt: new Date()
            }
          : incident
      )
    );
  };

  const deleteIncident = (id: string) => {
    setIncidents(incidents.filter(incident => incident.id !== id));
  };

  const addMaintenanceEvent = (event: Omit<MaintenanceEvent, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date();
    const newEvent: MaintenanceEvent = {
      ...event,
      id: "mnt_" + Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
    };
    setMaintenanceEvents([...maintenanceEvents, newEvent]);
  };

  const updateMaintenanceEvent = (id: string, updates: Partial<MaintenanceEvent>) => {
    setMaintenanceEvents(
      maintenanceEvents.map(event => 
        event.id === id 
          ? { ...event, ...updates, updatedAt: new Date() } 
          : event
      )
    );
  };

  const deleteMaintenanceEvent = (id: string) => {
    setMaintenanceEvents(maintenanceEvents.filter(event => event.id !== id));
  };

  const addServiceGroup = (group: Omit<ServiceGroup, "id">) => {
    const newGroup: ServiceGroup = {
      ...group,
      id: "grp_" + Math.random().toString(36).substr(2, 9),
    };
    setServiceGroups([...serviceGroups, newGroup]);
  };

  const updateServiceGroup = (id: string, updates: Partial<ServiceGroup>) => {
    setServiceGroups(
      serviceGroups.map(group => 
        group.id === id 
          ? { ...group, ...updates } 
          : group
      )
    );
  };

  const deleteServiceGroup = (id: string) => {
    setServiceGroups(serviceGroups.filter(group => group.id !== id));
    
    // Update services that were in this group
    setServices(
      services.map(service => 
        service.group === id 
          ? { ...service, group: undefined } 
          : service
      )
    );
  };

  const getOverallStatus = (): ServiceStatus => {
    if (services.length === 0) return "operational";
    
    if (services.some(service => service.status === "major_outage")) {
      return "major_outage";
    } else if (services.some(service => service.status === "partial_outage")) {
      return "partial_outage";
    } else if (services.some(service => service.status === "degraded_performance")) {
      return "degraded_performance";
    } else if (services.every(service => service.status === "maintenance")) {
      return "maintenance";
    } else {
      return "operational";
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        serviceGroups,
        incidents,
        maintenanceEvents,
        addService,
        updateService,
        deleteService,
        addIncident,
        updateIncident,
        addIncidentUpdate,
        deleteIncident,
        addMaintenanceEvent,
        updateMaintenanceEvent,
        deleteMaintenanceEvent,
        addServiceGroup,
        updateServiceGroup,
        deleteServiceGroup,
        getOverallStatus,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

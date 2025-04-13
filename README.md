
# StatusNexus: Real-Time Status Page Platform

StatusNexus is a professional status page platform that enables organizations to communicate service reliability to their users through transparent, real-time status updates. This application helps build trust with users by providing clear visibility into service health, incidents, and scheduled maintenance.



## Overview

StatusNexus provides a comprehensive solution for monitoring and communicating the status of your services. With real-time updates, incident management, and customizable status pages, you can keep your users informed about the health of your services at all times.

## ✨ Features

### 📊 Service Monitoring

- Custom service components management
- Multiple status levels (operational, degraded, outage)
- Real-time status updates
- Scheduled maintenance notices
- Historical incident tracking


### 🚨 Incident Management

- Advanced incident management
- Incident creation and tracking
- Update posting during incidents
- Historical incident archives


### 👥 Team Collaboration

- Role-based permissions
- Team member management
- Notification preferences
- Collaborative status updates


### 📈 Metrics \& Analytics

- Uptime percentage display
- Historical performance graphs
- Service level agreements
- Analytics dashboard


### 🌐 Public Status Pages

- Branded status pages
- Custom domain support
- Mobile responsive design
- Embeddable status widgets


### 🔌 API \& Integrations

- RESTful API access
- Slack \& Discord integrations
- Webhook support
- Custom integrations


## 🛠️ Tech Stack

### Frontend

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: Tailwind CSS with customizable theme
- **State Management**: React Context
- **Routing**: React Router v6
- **Authentication**: Clerk
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation
- **Toast Notifications**: sonner


### UI Components

The application uses a comprehensive set of UI components from shadcn/ui including:

- Button, Card, Dialog
- Form controls (Input, Select, etc.)
- Navigation (Sidebar, Breadcrumb)
- Feedback (Toast, Badge)
- Layout components


## 📁 Project Structure

```
src/
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
├── components/        # Reusable components
│   └── ui/            # UI component library
├── contexts/          # React context providers
├── hooks/             # Custom React hooks
├── layouts/           # Page layout components
├── lib/               # Utility functions
├── pages/             # Application pages
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages
│   ├── organization/  # Organization management
│   └── public/        # Public-facing pages
└── providers/         # Provider components
```


## 🚀 Setup and Installation

### Prerequisites

- Node.js (latest LTS recommended)
- npm or Bun package manager


### Installation Steps

1. Clone the repository:
```sh
git clone &lt;repository-url&gt;
cd lovable_frontend_final
```

2. Install the dependencies:
```sh
npm install
# or with Bun
bun install
```

3. Create a .env file in the root directory with the required environment variables.
4. Start the development server:
```sh
npm run dev
# or with Bun
bun dev
```

5. The application will be available at `http://localhost:5173`

## 🏗️ Building for Production

To build the application for production:

```sh
npm run build
# or with Bun
bun run build
```

The build artifacts will be stored in the dist directory.

## 🎨 Customization

### Theme Customization

The application uses Tailwind CSS for styling with a customizable theme. Theme settings are defined in:

- tailwind.config.ts - Main theme configuration
- index.css - CSS variables for the theme

Dark mode is supported and can be toggled by users or set to follow system preferences.

### Adding New Features

To add new pages or features:

1. Create new components in the components directory
2. Add new pages in the pages directory
3. Update routing in App.tsx

## 🚢 Deployment

The application is set up for easy deployment to Vercel or other similar platforms.

To deploy:

1. Connect your repository to Vercel
2. Configure the environment variables
3. Deploy

## 📞 Contact

For any questions or inquiries about this project, please contact [shekokarmahesh@gmail.com]


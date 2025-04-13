import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Shield, 
  LineChart, 
  Bell, 
  Users, 
  CheckCircle, 
  Activity, 
  Globe,
  Zap,
  Clock,
  Smartphone
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Modern Sticky Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StatusNexus</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
            <Link to="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/sign-in">Log in</Link>
            </Button>
            <Button size="sm" asChild className="rounded-full px-4">
              <Link to="/sign-up">Start for free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Split Design */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
        <div className="container flex flex-col md:flex-row items-center">
          <div className="flex-1 space-y-8 pb-10 md:pb-0 md:pr-10">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                <span className="bg-primary h-2 w-2 rounded-full animate-pulse mr-2"></span>
                <span className="font-medium">Now live: New status widget API</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
                Keep your users <span className="text-primary">informed</span> with real-time status pages
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-[600px]">
                Build trust through transparency. Professional status pages that communicate service reliability to your users in real-time.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full" asChild>
                <Link to="/sign-up">
                  Get started for free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link to="/public">View demo</Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>5-minute setup</span>
              </div>
            </div>
          </div>
          
          {/* Dashboard Preview with Border Decoration */}
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-lg shadow-2xl border bg-card overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <img 
                src="https://placehold.co/800x500/e4e7ec/9da3ae?text=Status+Dashboard" 
                alt="StatusNexus dashboard preview" 
                className="w-full h-auto" 
              />
            </div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -top-10 -left-10 h-40 w-40 bg-primary/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <p className="text-center text-sm font-medium text-muted-foreground mb-6">
            TRUSTED BY INNOVATIVE TEAMS AROUND THE WORLD
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            <div className="h-8 w-24 bg-muted rounded"></div>
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="h-8 w-28 bg-muted rounded"></div>
            <div className="h-8 w-24 bg-muted rounded"></div>
            <div className="h-8 w-28 bg-muted rounded"></div>
          </div>
        </div>
      </section>

      {/* Features Section with Cards */}
      <section className="py-20 md:py-32" id="features">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need for status management</h2>
            <p className="text-muted-foreground">
              Our platform provides all the tools to effectively communicate service health to your users.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-muted/10">
              <CardHeader>
                <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Service Monitoring</CardTitle>
                <CardDescription>Track and display the status of all your services in real-time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Custom service components</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Multiple status levels</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Group services by categories</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature Card 2 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-muted/10">
              <CardHeader>
                <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Incident Management</CardTitle>
                <CardDescription>Efficiently track and communicate incidents to keep users informed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Real-time incident updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Scheduled maintenance notices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Historical incident tracking</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature Card 3 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-muted/10">
              <CardHeader>
                <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>Work together with your team to manage status pages efficiently</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Role-based permissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Team member management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Notification preferences</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature Card 4 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-muted/10">
              <CardHeader>
                <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Uptime Metrics</CardTitle>
                <CardDescription>Track and display historical uptime metrics to demonstrate reliability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Uptime percentage display</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Historical performance graphs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Service level agreements</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature Card 5 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-muted/10">
              <CardHeader>
                <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Public Status Page</CardTitle>
                <CardDescription>Professional, customizable public status pages for your users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Branded status pages</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Custom domain support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Mobile responsive design</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature Card 6 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-muted/10">
              <CardHeader>
                <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>API & Integrations</CardTitle>
                <CardDescription>Connect with your favorite tools and services seamlessly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">RESTful API access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Slack & Discord integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Webhook support</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How StatusNexus works</h2>
            <p className="text-muted-foreground">
              Get up and running in minutes with our simple setup process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">1</div>
                <div className="hidden md:block absolute top-8 left-16 w-full border-t border-dashed border-primary/30"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create your account</h3>
              <p className="text-muted-foreground">
                Sign up for free and set up your organization in just a few minutes
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">2</div>
                <div className="hidden md:block absolute top-8 left-16 w-full border-t border-dashed border-primary/30"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Add your services</h3>
              <p className="text-muted-foreground">
                Define the services you want to monitor and customize their display
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">3</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share your status page</h3>
              <p className="text-muted-foreground">
                Publish your status page and start building trust with your users
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" id="testimonials">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">What our customers say</h2>
            <p className="text-muted-foreground">
              Companies of all sizes trust StatusNexus to communicate with their users
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <p className="mb-6 italic text-muted-foreground">
                  "StatusNexus has significantly improved how we communicate service disruptions to our customers. The setup was incredibly simple."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">CTO, TechCorp</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial 2 */}
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <p className="mb-6 italic text-muted-foreground">
                  "The real-time updates and integrations have made our incident management process much more transparent and efficient."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div>
                    <p className="font-medium">Michael Chen</p>
                    <p className="text-sm text-muted-foreground">DevOps Lead, CloudSoft</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial 3 */}
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <p className="mb-6 italic text-muted-foreground">
                  "Our support tickets decreased by 30% after implementing StatusNexus. Our users appreciate the transparency."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div>
                    <p className="font-medium">Emily Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Support Manager, AppWorks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30" id="pricing">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">
              Start for free, upgrade as you grow. No hidden fees.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>For individuals & small projects</CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Up to 5 services</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Basic incident management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Public status page</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/sign-up">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Pro Plan - Highlighted */}
            <Card className="relative overflow-hidden border-primary shadow-lg">
              <div className="absolute top-0 right-0 left-0 h-1 bg-primary"></div>
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Popular</div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For growing teams & businesses</CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Up to 20 services</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Advanced incident management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Team collaboration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Metrics & analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Email notifications</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/sign-up">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Enterprise Plan */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Unlimited services</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Custom integrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">SLA guarantees</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/90 to-primary rounded-xl p-10 text-primary-foreground text-center flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to improve your status communication?</h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl">
              Start building trust with your users today through transparent, real-time status updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="rounded-full" asChild>
                <Link to="/sign-up">
                  Get started for free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/public">View demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12 mt-auto">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">StatusNexus</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Professional status pages that build trust through transparent communication.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="/public" className="text-muted-foreground hover:text-foreground transition-colors">Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} StatusNexus. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">LinkedIn</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

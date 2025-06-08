import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Image, Bot, Menu, LogIn } from 'lucide-react';
import { 
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { isAuthenticated } from "@/api/auth";
import { toast } from "sonner";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const isActive = (path: string) => currentPath === path;
  const handleLogin = () => navigate('/login');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('access_token_timestamp');
    setAuthenticated(false);
    toast.success("Logged out successfully");
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    console.log(authenticated);
  }, [authenticated]);

  // Navigation menu items organized by new categories
  const imageAnalysisTools = [
    { title: "Pixel Statistics", path: "/pixel-statistics", icon: Users },
    { title: "Edge Detection", path: "/edge-detection", icon: Image },
    // { title: "PCA Projection", path: "/pca-projection", icon: Bot },
  ];

  const forgeryDetectionTools = [
    { title: "Copy-Move Forgery", path: "/copy-move-forgery", icon: Users },
    { title: "Error Level Analysis", path: "/error-level-analysis", icon: Image },
  ];

  const aiRecognitionTools = [
    { title: "AI Detection", path: "/detect-ai", icon: Bot },
    { title: "Face Recognition", path: "/face-recognition", icon: Users },
  ];

  const isActiveInCategory = (items: typeof imageAnalysisTools) => {
    return items.some(item => isActive(item.path));
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* App Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/KPMGLogo.png" 
                alt="Logo" 
                className='h-20 w-20 mr-8' 
              />              
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-0 md:flex">
              <NavigationMenu className="px-0">
                <NavigationMenuList>
                  {/* Home */}
                  <NavigationMenuItem>
                    <Link to="/">
                      <NavigationMenuLink className={cn(
                        navigationMenuTriggerStyle(),
                        isActive('/') && 'bg-accent text-accent-foreground'
                      )}>
                        <Image className="h-4 w-4 mr-2" /> Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {/* Metadata (standalone) */}
                  <NavigationMenuItem>
                    <Link to="/metadata">
                      <NavigationMenuLink className={cn(
                        navigationMenuTriggerStyle(),
                        isActive('/metadata') && 'bg-accent text-accent-foreground'
                      )}>
                        <Image className="h-4 w-4 mr-2" /> Metadata
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {/* Image Analysis Dropdown */}
                  <NavigationMenuItem value="image-analysis">
                    <NavigationMenuTrigger className={cn(
                      isActiveInCategory(imageAnalysisTools) && 'bg-accent text-accent-foreground'
                    )}>
                      <Image className="h-4 w-4 mr-2" />
                      Image Analysis
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="data-[state=open]:absolute data-[state=open]:left-[-100px]">
                      <div className="grid w-[300px] gap-1 p-2">
                        {imageAnalysisTools.map((item) => (
                          <Link key={item.path} to={item.path}>
                            <NavigationMenuLink className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive(item.path) && 'bg-accent text-accent-foreground'
                            )}>
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                <div className="text-sm font-medium">{item.title}</div>
                              </div>
                            </NavigationMenuLink>
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Forgery Detection Dropdown */}
                  <NavigationMenuItem value="forgery-detection">
                    <NavigationMenuTrigger className={cn(
                      isActiveInCategory(forgeryDetectionTools) && 'bg-accent text-accent-foreground'
                    )}>
                      <Bot className="h-4 w-4 mr-2" />
                      Forgery Detection
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="data-[state=open]:absolute data-[state=open]:left-[-200px]">
                      <div className="grid w-[300px] gap-1 p-2">
                        {forgeryDetectionTools.map((item) => (
                          <Link key={item.path} to={item.path}>
                            <NavigationMenuLink className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive(item.path) && 'bg-accent text-accent-foreground'
                            )}>
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                <div className="text-sm font-medium">{item.title}</div>
                              </div>
                            </NavigationMenuLink>
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* AI & Recognition Dropdown */}
                  <NavigationMenuItem value="ai-recognition">
                    <NavigationMenuTrigger className={cn(
                      isActiveInCategory(aiRecognitionTools) && 'bg-accent text-accent-foreground'
                    )}>
                      <Users className="h-4 w-4 mr-2" />
                      AI & Recognition
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="data-[state=open]:absolute data-[state=open]:left-[-300px]">
                      <div className="grid w-[300px] gap-1 p-2">
                        {aiRecognitionTools.map((item) => (
                          <Link key={item.path} to={item.path}>
                            <NavigationMenuLink className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive(item.path) && 'bg-accent text-accent-foreground'
                            )}>
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                <div className="text-sm font-medium">{item.title}</div>
                              </div>
                            </NavigationMenuLink>
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right side - User menu */}
          <div className="hidden md:flex items-center space-x-2">
            {!authenticated && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogin}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}
            {authenticated && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <Image className="h-4 w-4" /> Home
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/metadata" className="flex items-center gap-2">
                    <Image className="h-4 w-4" /> Metadata
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Image Analysis</DropdownMenuLabel>
                {imageAnalysisTools.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" /> {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Forgery Detection</DropdownMenuLabel>
                {forgeryDetectionTools.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" /> {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>AI & Recognition</DropdownMenuLabel>
                {aiRecognitionTools.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" /> {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                {!authenticated && (
                  <DropdownMenuItem 
                    onClick={handleLogin} 
                    className="flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" /> Login
                  </DropdownMenuItem>
                )}
                {authenticated && (
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
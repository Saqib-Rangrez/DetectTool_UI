import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Image, Bot, Menu, LogIn, BarChart3 } from 'lucide-react';
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

  // State to manage open dropdowns
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Navigation menu items organized by categories
  const imageAnalysisTools = [
    { title: "Pixel Statistics", path: "/pixel-statistics", icon: Users },
    { title: "Edge Detection", path: "/edge-detection", icon: Image },
    { title: "PCA Projection", path: "/pca-projection", icon: Bot },
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

  // Replicate NavigationMenuTrigger styling
  const triggerStyle = cn(
    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50"
  );

  // Hover handlers
  const handleMouseEnter = (dropdown: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200); // 200ms delay for better UX
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
            <div className="hidden md:ml-16 md:flex items-center space-x-1">
              {/* Home */}
              <Link to="/">
                <Button
                  variant="ghost"
                  className={cn(
                    triggerStyle,
                    isActive('/') && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Image className="h-4 w-4 mr-2" /> Home
                </Button>
              </Link>

              {/* Metadata */}
              <Link to="/metadata">
                <Button
                  variant="ghost"
                  className={cn(
                    triggerStyle,
                    isActive('/metadata') && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Image className="h-4 w-4 mr-2" /> Metadata
                </Button>
              </Link>

              {/* Image Analysis Dropdown */}
              <DropdownMenu
                open={openDropdown === 'image-analysis'}
                onOpenChange={(open) => !open && setOpenDropdown(null)}
              >
                <DropdownMenuTrigger
                  asChild
                  onMouseEnter={() => handleMouseEnter('image-analysis')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      triggerStyle,
                      isActiveInCategory(imageAnalysisTools) && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Image Analysis
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[300px] p-2 flex flex-col gap-1"
                  onMouseEnter={() => handleMouseEnter('image-analysis')}
                  onMouseLeave={handleMouseLeave}
                >
                  {imageAnalysisTools.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 w-full rounded-md p-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                          isActive(item.path) && 'bg-accent text-accent-foreground'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Forgery Detection Dropdown */}
              <DropdownMenu
                open={openDropdown === 'forgery-detection'}
                onOpenChange={(open) => !open && setOpenDropdown(null)}
              >
                <DropdownMenuTrigger
                  asChild
                  onMouseEnter={() => handleMouseEnter('forgery-detection')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      triggerStyle,
                      isActiveInCategory(forgeryDetectionTools) && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Forgery Detection
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[300px] p-2 flex flex-col gap-1"
                  onMouseEnter={() => handleMouseEnter('forgery-detection')}
                  onMouseLeave={handleMouseLeave}
                >
                  {forgeryDetectionTools.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 w-full rounded-md p-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                          isActive(item.path) && 'bg-accent text-accent-foreground'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* AI & Recognition Dropdown */}
              <DropdownMenu
                open={openDropdown === 'ai-recognition'}
                onOpenChange={(open) => !open && setOpenDropdown(null)}
              >
                <DropdownMenuTrigger
                  asChild
                  onMouseEnter={() => handleMouseEnter('ai-recognition')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      triggerStyle,
                      isActiveInCategory(aiRecognitionTools) && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    AI & Recognition
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[300px] p-2 flex flex-col gap-1"
                  onMouseEnter={() => handleMouseEnter('ai-recognition')}
                  onMouseLeave={handleMouseLeave}
                >
                  {aiRecognitionTools.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 w-full rounded-md p-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                          isActive(item.path) && 'bg-accent text-accent-foreground'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
              <div className='flex items-center gap-2'> 
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-lg bg-transparent px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none",
                      isActive('/dashboard') && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <BarChart3 className="h-4 w-4 mr-2 transition-colors" /> 
                    Dashboard
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
              
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
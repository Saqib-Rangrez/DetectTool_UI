// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { Users, Image, Bot, Menu, User, LogIn } from 'lucide-react';
// import { 
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
//   navigationMenuTriggerStyle
// } from "@/components/ui/navigation-menu";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";
// import { isAuthenticated } from "@/utils/api"; // Import isAuthenticated

// const Navigation = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const currentPath = location.pathname;
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const isActive = (path: string) => currentPath === path;

//   const handleLogin = () => {
//     navigate('/login');
//   };

//   const authenticated = isAuthenticated(); // Check authentication status

//   return (
//     <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             {/* App Logo */}
//             <Link to="/" className="flex items-center">
//               <img 
//                 src="\KPMGLogo.png" 
//                 alt="Logo" 
//                 className='h-20 w-20 mr-20' 
//               />              
//             </Link>
            
//             {/* Desktop Navigation */}
//             <div className="hidden md:ml-6 md:flex">
//               <NavigationMenu className="px-4">
//                 <NavigationMenuList>
//                   <NavigationMenuItem>
//                     <Link to="/">
//                       <NavigationMenuLink className={cn(
//                         navigationMenuTriggerStyle(),
//                         isActive('/') && "bg-accent text-accent-foreground"
//                       )}>
//                         <Image className="h-4 w-4 mr-2" />
//                         Home
//                       </NavigationMenuLink>
//                     </Link>
//                   </NavigationMenuItem>
                  
//                   <NavigationMenuItem>
//                     <NavigationMenuTrigger className={isActive('/metadata') ? "bg-accent text-accent-foreground" : ""}>
//                       <Image className="h-4 w-4 mr-2" />
//                       Image Analysis
//                     </NavigationMenuTrigger>
//                     <NavigationMenuContent>
//                       <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
//                         <li className="row-span-3">
//                           <Link
//                             to="/metadata"
//                             className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
//                           >
//                             <Image className="h-6 w-6 mb-2" />
//                             <div className="mb-2 mt-4 text-lg font-medium">
//                               Metadata
//                             </div>
//                             <p className="text-sm leading-tight text-muted-foreground">
//                               Extract and analyze image metadata information
//                             </p>
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/detect-ai"
//                             className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
//                           >
//                             <div className="flex items-center gap-2">
//                               <Bot className="h-4 w-4" />
//                               <div className="text-sm font-medium leading-none">
//                                 AI Detection
//                               </div>
//                             </div>
//                             <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//                               Detect AI-generated content in images
//                             </p>
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/face-recognition"
//                             className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
//                           >
//                             <div className="flex items-center gap-2">
//                               <Users className="h-4 w-4" />
//                               <div className="text-sm font-medium leading-none">
//                                 Face Recognition
//                               </div>
//                             </div>
//                             <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//                               Compare and match faces across multiple images
//                             </p>
//                           </Link>
//                         </li>
//                       </ul>
//                     </NavigationMenuContent>
//                   </NavigationMenuItem>
//                 </NavigationMenuList>
//               </NavigationMenu>
//             </div>
//           </div>

//           {/* Right side - User menu */}
//           <div className="hidden md:flex items-center space-x-2">
//             {!authenticated && (
//               <Button 
//                 variant="outline" 
//                 size="sm" 
//                 onClick={handleLogin}
//                 className="flex items-center gap-2"
//               >
//                 <LogIn className="h-4 w-4" />
//                 <span>Login</span>
//               </Button>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="flex items-center md:hidden">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon">
//                   <Menu className="h-6 w-6" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-52">
//                 <DropdownMenuItem asChild>
//                   <Link to="/" className="flex items-center gap-2">
//                     <Image className="h-4 w-4" />
//                     Home
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link to="/metadata" className="flex items-center gap-2">
//                     <Image className="h-4 w-4" />
//                     Metadata
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link to="/detect-ai" className="flex items-center gap-2">
//                     <Bot className="h-4 w-4" />
//                     AI Detection
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link to="/face-recognition" className="flex items-center gap-2">
//                     <Users className="h-4 w-4" />
//                     Face Recognition
//                   </Link>
//                 </DropdownMenuItem>
//                 {!authenticated && (
//                   <DropdownMenuItem 
//                     onClick={handleLogin} 
//                     className="flex items-center gap-2"
//                   >
//                     <LogIn className="h-4 w-4" />
//                     Login
//                   </DropdownMenuItem>
//                 )}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navigation;













import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Image, Bot, Menu, LogIn } from 'lucide-react';
import { 
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { isAuthenticated } from "@/utils/api";
import { toast } from "sonner";
import { useEffect } from 'react';
import { log } from 'console';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => currentPath === path;
  const handleLogin = () => navigate('/login');
  const [authenticated, setAuthenticated] = useState(isAuthenticated());


  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('access_token_timestamp');
    setAuthenticated(false); // 👈 Add this
    toast.success("Logged out successfully");
    navigate('/login', { replace: true });
  };


  useEffect(() => {
    console.log(authenticated)
  }, []);
  


  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* App Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/KPMGLogo.png" 
                alt="Logo" 
                className='h-20 w-20 mr-20' 
              />              
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex">
              <NavigationMenu className="px-4">
                <NavigationMenuList>
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
                  <NavigationMenuItem>
                    <Link to="/detect-ai">
                      <NavigationMenuLink className={cn(
                        navigationMenuTriggerStyle(),
                        isActive('/detect-ai') && 'bg-accent text-accent-foreground'
                      )}>
                        <Bot className="h-4 w-4 mr-2" /> AI Detection
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/face-recognition">
                      <NavigationMenuLink className={cn(
                        navigationMenuTriggerStyle(),
                        isActive('/face-recognition') && 'bg-accent text-accent-foreground'
                      )}>
                        <Users className="h-4 w-4 mr-2" /> Face Recognition
                      </NavigationMenuLink>
                    </Link>
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
              <DropdownMenuContent align="end" className="w-52">
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
                <DropdownMenuItem asChild>
                  <Link to="/detect-ai" className="flex items-center gap-2">
                    <Bot className="h-4 w-4" /> AI Detection
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/face-recognition" className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Face Recognition
                  </Link>
                </DropdownMenuItem>
                {!authenticated && (
                  <DropdownMenuItem 
                    onClick={handleLogin} 
                    className="flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" /> Login
                  </DropdownMenuItem>
                )}
                {
                  authenticated && (
                    <DropdownMenuItem 
                      onClick={() => {
                        handleLogout(); 
                      }} 
                      className="flex items-center gap-2"
                    >
                      <LogIn className="h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  ) 
                }
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;

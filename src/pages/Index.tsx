import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto pt-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Enterprise Image Processing & Analysis
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Upload, analyze, and extract valuable metadata from your images with our advanced processing tools
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Get Metadata</CardTitle>
              <CardDescription>
                Extract comprehensive metadata from your images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Upload multiple images and extract detailed EXIF data, dimensions, color profiles, and more.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/metadata')} className="w-full">
                Extract Metadata
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>OCR Analysis</CardTitle>
              <CardDescription>
                Extract text from images with advanced OCR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Recognize and extract text from images using our high-accuracy optical character recognition.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Coming Soon</Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Image Analytics</CardTitle>
              <CardDescription>
                Get insights from your image collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Generate reports and analytics based on your image metadata and processing results.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Coming Soon</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready to get started?</h2>
              <p className="text-slate-600">Upload your first image and explore our powerful features</p>
            </div>
            <Button size="lg" onClick={() => navigate('/metadata')}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;









// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
// import { FileImage, ShieldCheck, Users, BarChart2, AlertTriangle, ChevronRight, Upload, Zap, Database, FileOutput } from 'lucide-react';
// import { motion } from 'framer-motion';

// const Index: React.FC = () => {
//   const navigate = useNavigate();
  
//   // Animation variants
//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.3,
//       }
//     }
//   };
  
//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0, transition: { type: "tween" } }
//   };

//   const heroBackground = {
//     hidden: { opacity: 0 },
//     show: { opacity: 1, transition: { duration: 1.5 } }
//   };
  
//   const moduleCards = [
//     {
//       title: "Get Metadata",
//       description: "Extract comprehensive EXIF data from your images",
//       route: "/metadata",
//       icon: <FileImage className="h-5 w-5" />,
//       color: "bg-blue-500",
//     },
//     {
//       title: "AI Detection",
//       description: "Identify AI-generated vs. human-captured images",
//       route: "/detect-ai",
//       icon: <ShieldCheck className="h-5 w-5" />,
//       color: "bg-purple-500",
//     },
//     {
//       title: "Face Recognition",
//       description: "Compare and match faces across multiple images",
//       route: "/face-recognition",
//       icon: <Users className="h-5 w-5" />,
//       color: "bg-green-500",
//     },
//     {
//       title: "Pixel Statistics",
//       description: "Generate statistical analysis of image pixels",
//       route: "/pixel-statistics",
//       icon: <BarChart2 className="h-5 w-5" />,
//       color: "bg-amber-500",
//     },
//     {
//       title: "Forgery Detection",
//       description: "Identify tampered or manipulated regions in images",
//       route: "/copy-move-forgery",
//       icon: <AlertTriangle className="h-5 w-5" />,
//       color: "bg-red-500",
//     }
//   ];
  
//   const valueProps = [
//     {
//       title: "Fast & Accurate",
//       description: "Industry-leading precision with optimized processing time",
//       icon: <Zap className="h-6 w-6" />,
//       color: "bg-blue-100 text-blue-600",
//     },
//     {
//       title: "Bulk & Single Upload",
//       description: "Process individual files or entire batches efficiently",
//       icon: <Upload className="h-6 w-6" />,
//       color: "bg-green-100 text-green-600",
//     },
//     {
//       title: "Exportable Results",
//       description: "Download human-readable reports in various formats",
//       icon: <FileOutput className="h-6 w-6" />,
//       color: "bg-amber-100 text-amber-600",
//     },
//     {
//       title: "Powered by AI",
//       description: "Advanced neural networks for superior analysis",
//       icon: <Database className="h-6 w-6" />,
//       color: "bg-purple-100 text-purple-600",
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden">
//       {/* Neural network background pattern */}
//       <motion.div 
//         className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-5"
//         initial="hidden"
//         animate="show"
//         variants={heroBackground}
//       >
//         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//           <defs>
//             <pattern id="neural" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
//               <circle cx="50" cy="50" r="2" fill="#2563eb" />
//               <path d="M50 10 L50 90 M10 50 L90 50 M20 20 L80 80 M20 80 L80 20" stroke="#2563eb" strokeWidth="0.5" />
//             </pattern>
//           </defs>
//           <rect width="100%" height="100%" fill="url(#neural)" />
//         </svg>
//       </motion.div>
      
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
//         {/* Hero Section */}
//         <section className="py-12 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
//           <motion.div 
//             className="max-w-2xl"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <div className="inline-block mb-4">
//               <span className="rounded-full text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-800">
//                 Enterprise Solution
//               </span>
//             </div>
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
//               AI-Powered Image <br className="hidden md:block" />
//               <span className="text-blue-600">Analysis Suite</span>
//             </h1>
//             <p className="text-xl text-slate-600 mb-8 max-w-lg">
//               Upload, Detect, Compare — All in One Unified Platform. Unlock hidden insights from your images with advanced processing tools.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <Button 
//                 size="lg" 
//                 onClick={() => navigate('/metadata')}
//                 className="gap-2 px-6 shadow-md"
//               >
//                 Get Started
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//               <Button 
//                 variant="outline" 
//                 size="lg" 
//                 onClick={() => {
//                   const featuresSection = document.getElementById('features');
//                   featuresSection?.scrollIntoView({ behavior: 'smooth' });
//                 }}
//                 className="gap-2 px-6"
//               >
//                 Learn More
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </motion.div>
          
//           <motion.div 
//             className="relative w-full md:w-1/2 lg:w-2/5"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//           >
//             <div className="relative">
//               {/* Main image with scanning effect */}
//               <div className="rounded-lg shadow-2xl overflow-hidden">
//                 <img 
//                   src="https://images.unsplash.com/photo-1518770660439-4636190af475" 
//                   alt="AI Image Analysis" 
//                   className="w-full h-auto object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 to-transparent mix-blend-overlay" />
                
//                 {/* Animated scanning line */}
//                 <motion.div 
//                   className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-transparent h-10"
//                   animate={{ top: ["0%", "100%", "0%"] }}
//                   transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
//                 />
                
//                 {/* Animated bounding boxes */}
//                 <motion.div 
//                   className="absolute left-[20%] top-[15%] w-[30%] h-[25%] border-2 border-blue-400 rounded-md"
//                   animate={{ opacity: [0, 1, 0] }}
//                   transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
//                 />
//                 <motion.div 
//                   className="absolute right-[25%] bottom-[20%] w-[20%] h-[30%] border-2 border-green-400 rounded-md"
//                   animate={{ opacity: [0, 1, 0] }}
//                   transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
//                 />
//               </div>
              
//               {/* Floating cards */}
//               <motion.div 
//                 className="absolute -top-4 -right-4 p-3 bg-white rounded-lg shadow-lg w-32"
//                 animate={{ y: [0, -8, 0] }}
//                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
//               >
//                 <div className="text-xs font-medium text-slate-500">Processing</div>
//                 <div className="text-sm font-bold text-slate-800">Face Detection</div>
//                 <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
//                   <motion.div 
//                     className="h-1 bg-blue-500 rounded-full" 
//                     animate={{ width: ["0%", "100%"] }}
//                     transition={{ repeat: Infinity, duration: 2 }}
//                   />
//                 </div>
//               </motion.div>
              
//               <motion.div 
//                 className="absolute -bottom-4 -left-4 p-3 bg-white rounded-lg shadow-lg"
//                 animate={{ y: [0, 8, 0] }}
//                 transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
//               >
//                 <div className="flex items-center gap-2">
//                   <div className="h-3 w-3 bg-green-500 rounded-full"></div>
//                   <div className="text-sm font-bold text-slate-800">AI verified</div>
//                 </div>
//               </motion.div>
//             </div>
//           </motion.div>
//         </section>
        
//         {/* Feature Overview - Quick Navigation Cards */}
//         <section id="features" className="py-16 mt-6">
//           <motion.div 
//             className="text-center mb-12"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//           >
//             <h2 className="text-3xl font-bold text-slate-800 mb-4">Explore Suite of Tools</h2>
//             <p className="text-slate-600 max-w-3xl mx-auto">
//               Discover our powerful platform's capabilities, designed to provide comprehensive insights into all your visual assets.
//             </p>
//           </motion.div>
          
//           <motion.div 
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
//             variants={container}
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true }}
//           >
//             {moduleCards.map((card, index) => (
//               <motion.div key={card.title} variants={item}>
//                 <Card 
//                   className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer bg-white border-slate-100"
//                   onClick={() => navigate(card.route)}
//                 >
//                   <CardContent className="p-6">
//                     <div className={`${card.color} w-10 h-10 flex items-center justify-center rounded-lg text-white mb-4`}>
//                       {card.icon}
//                     </div>
//                     <CardTitle className="text-lg mb-2">{card.title}</CardTitle>
//                     <p className="text-sm text-slate-500">{card.description}</p>
//                   </CardContent>
//                   <CardFooter className="pt-0 pb-4 px-6">
//                     <Button 
//                       variant="ghost" 
//                       size="sm" 
//                       className="text-xs w-full justify-between"
//                     >
//                       <span>Explore</span>
//                       <ChevronRight className="h-3 w-3" />
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>
//         </section>
        
//         {/* Value Proposition Section */}
//         <section className="py-16 bg-white rounded-3xl shadow-sm">
//           <div className="px-6 md:px-12">
//             <motion.div 
//               className="text-center mb-16"
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               viewport={{ once: true }}
//             >
//               <h2 className="text-3xl font-bold text-slate-800 mb-4">Why to Choose!</h2>
//               <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full"></div>
//             </motion.div>
            
//             <motion.div 
//               className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
//               variants={container}
//               initial="hidden"
//               whileInView="show"
//               viewport={{ once: true }}
//             >
//               {valueProps.map((prop) => (
//                 <motion.div 
//                   key={prop.title}
//                   className="text-center"
//                   variants={item}
//                 >
//                   <div className={`${prop.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
//                     {prop.icon}
//                   </div>
//                   <h3 className="text-xl font-bold text-slate-800 mb-3">{prop.title}</h3>
//                   <p className="text-slate-600">{prop.description}</p>
//                 </motion.div>
//               ))}
//             </motion.div>
            
//             {/* Call-to-Action */}
//             <motion.div 
//               className="mt-16 text-center"
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               viewport={{ once: true }}
//             >
//               <Button 
//                 size="lg" 
//                 onClick={() => navigate('/metadata')} 
//                 className="px-8 py-6 text-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
//               >
//                 Start Analyzing Your Images
//                 <ChevronRight className="h-5 w-5 ml-2" />
//               </Button>
//             </motion.div>
//           </div>
//         </section>
        
        
//       </main>
//     </div>
//   );
// };

// export default Index;
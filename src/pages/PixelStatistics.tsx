import React, { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Info, Upload, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import ImageViewer from '@/components/copy-move-forgery/ImageViewer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchImageStats } from '@/api/services/imageStats';

// Define the processing modes
type ProcessingMode = 'minimum' | 'average' | 'maximum';

// Define the stats interface
interface PixelStatistics {
  red: number;
  green: number;
  blue: number;
}

interface ApiResponse {
  imageUrl: string;
  filename: string;
  stats: PixelStatistics;
  mode: ProcessingMode;
  inclusive: boolean;
}

const PixelStatistics = () => {
  // State management
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<ProcessingMode>('average');
  const [inclusive, setInclusive] = useState(false);
  const [statistics, setStatistics] = useState<PixelStatistics | null>(null);
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  
  // Refs
  const originalContainerRef = useRef<HTMLDivElement>(null);
  const processedContainerRef = useRef<HTMLDivElement>(null);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setProcessedImage(null); // Reset processed image when new image is uploaded
        setStatistics(null); // Reset statistics
        setResponseData(null); // Reset response data
      };
      reader.readAsDataURL(file);
      
      toast.success(`Image "${file.name}" uploaded successfully`);
    }
  };

  // Process image
  const processImage = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await fetchImageStats(selectedImage, mode, inclusive);
      
      setProcessedImage(result.imageUrl);
      setStatistics(result.stats);
      setResponseData({
        imageUrl: result.imageUrl,
        filename: result.filename,
        stats: result.stats,
        mode: result.mode as ProcessingMode,
        inclusive: result.inclusive
      });
      setIsProcessing(false);
      toast.success('Image processed successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process image. Please try again.');
      setIsProcessing(false);
    }
  };

  // Calculate total pixels
  const totalPixels = statistics ? statistics.red + statistics.green + statistics.blue : 0;
  
  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="container max-w-full px-2 py-3 md:px-6">
      <h1 className="text-2xl font-bold text-foreground mb-4">Pixel Statistics</h1>
      
      {/* Controls Section - Modern, compact design */}
      <Card className="mb-4 shadow-sm glass-card border-opacity-50">
        <CardHeader className="py-2 px-4 border-b border-border/40">
          <CardTitle className="text-lg font-medium flex items-center">
            <span className="bg-primary/10 text-primary p-1.5 rounded-md mr-2">
              <Info className="h-4 w-4" />
            </span>
            Image Processing Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="py-3 px-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Upload Button - Modern styling */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('image-upload')?.click()}
                className="border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
              >
                <Upload className="h-4 w-4 mr-1.5" /> Upload Image
              </Button>
              <input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
              {selectedImage && (
                <span className="text-xs text-muted-foreground max-w-[150px] truncate bg-secondary/50 px-2 py-0.5 rounded">
                  {selectedImage.name}
                </span>
              )}
            </div>
            
            {/* Mode Selector - Modern, button-like styling */}
            <div className="flex items-center gap-2 border-l pl-4 border-border/30">
              <span className="text-sm font-medium text-muted-foreground">Mode:</span>
              <RadioGroup 
                value={mode} 
                onValueChange={(value) => setMode(value as ProcessingMode)}
                className="flex gap-2"
              >
                <div className="flex items-center space-x-1 bg-secondary/50 px-2 py-1 rounded-md">
                  <RadioGroupItem value="minimum" id="minimum" className="h-3.5 w-3.5" />
                  <Label htmlFor="minimum" className="text-xs cursor-pointer">Min</Label>
                </div>
                <div className="flex items-center space-x-1 bg-secondary/50 px-2 py-1 rounded-md">
                  <RadioGroupItem value="average" id="average" className="h-3.5 w-3.5" />
                  <Label htmlFor="average" className="text-xs cursor-pointer">Avg</Label>
                </div>
                <div className="flex items-center space-x-1 bg-secondary/50 px-2 py-1 rounded-md">
                  <RadioGroupItem value="maximum" id="maximum" className="h-3.5 w-3.5" />
                  <Label htmlFor="maximum" className="text-xs cursor-pointer">Max</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Inclusive Checkbox - Modern styling */}
            <div className="flex items-center gap-1.5 border-l pl-4 border-border/30">
              <div className="flex items-center gap-1 bg-secondary/50 px-2.5 py-1 rounded-md">
                <Checkbox 
                  id="inclusive" 
                  checked={inclusive} 
                  onCheckedChange={(checked) => setInclusive(checked === true)}
                  className="h-3.5 w-3.5 rounded-sm"
                />
                <Label htmlFor="inclusive" className="text-xs cursor-pointer">Inclusive</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground ml-0.5 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs max-w-[200px]">
                      <p>Includes edge pixels in the processing calculation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            {/* Process Button - Prominent styling */}
            <Button 
              onClick={processImage} 
              disabled={!selectedImage || isProcessing}
              size="sm"
              className="ml-auto bg-primary hover:bg-primary/90 shadow-sm"
            >
              {isProcessing ? 'Processing...' : 'Process Image'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Images & Stats Display Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
        {/* Original Image - Left Column */}
        <Card className="overflow-hidden flex flex-col h-full shadow-sm border-opacity-40 card-gradient-cool lg:col-span-1">
          <CardHeader className="py-2 px-3 border-b border-border/40 bg-background/50">
            <CardTitle className="text-sm font-medium flex items-center">
              <span className="h-2 w-2 rounded-full bg-primary/70 mr-2"></span>
              Original Image
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-grow overflow-hidden relative" ref={originalContainerRef}>
            {imagePreview ? (
              <ImageViewer 
                imageUrl={imagePreview} 
                altText="Original" 
                type="original"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 bg-secondary/10">
                <div className="bg-primary/5 rounded-full p-4 mb-3">
                  <Upload className="h-6 w-6 text-primary/60" />
                </div>
                <p className="text-sm">Upload an image to get started</p>
                <p className="text-xs text-muted-foreground mt-1">Supported formats: JPG, PNG, WebP</p>
              </div>
            )}
          </CardContent>
          {selectedImage && (
            <CardFooter className="py-1.5 px-3 bg-muted/30 border-t border-border/20">
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs font-normal">
                  {selectedImage.name}
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">
                  {Math.round(selectedImage.size / 1024)} KB
                </span>
              </div>
            </CardFooter>
          )}
        </Card>
        
        {/* Processed Image - Center Column */}
        <Card className="overflow-hidden flex flex-col h-full shadow-sm border-opacity-40 card-gradient-warm lg:col-span-1">
          <CardHeader className="py-2 px-3 border-b border-border/40 bg-background/50">
            <CardTitle className="text-sm font-medium flex items-center">
              <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              Processed Output
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-grow overflow-hidden relative" ref={processedContainerRef}>
            {isProcessing ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary/30 animate-spin" style={{ animationDuration: '1.5s' }}></div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">Processing image...</p>
              </div>
            ) : processedImage ? (
              <ImageViewer 
                imageUrl={processedImage} 
                altText="Processed" 
                type="processed"
                stats={statistics || undefined}
                showStats={true}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 bg-secondary/10">
                <div className="bg-blue-500/5 rounded-full p-4 mb-3">
                  <Info className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-sm">Process an image to see results here</p>
                <p className="text-xs text-muted-foreground mt-1">Select settings and click "Process Image"</p>
              </div>
            )}
          </CardContent>
          {responseData && (
            <CardFooter className="py-1.5 px-3 bg-muted/30 border-t border-border/20">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-xs">
                  {responseData.mode.charAt(0).toUpperCase() + responseData.mode.slice(1)}
                </Badge>
                {responseData.inclusive && 
                  <Badge variant="outline" className="text-xs border-green-500/30 text-green-600">
                    Inclusive
                  </Badge>
                }
              </div>
            </CardFooter>
          )}
        </Card>
        
        {/* Statistics Section - Right Column */}
        <Card className="overflow-hidden flex flex-col h-full shadow-sm border-opacity-40 bg-gradient-to-br from-slate-50 to-slate-100 lg:col-span-1">
          <CardHeader className="py-2 px-3 border-b border-border/40 bg-background/50">
            <CardTitle className="text-sm font-medium flex items-center">
              <span className="h-2 w-2 rounded-full bg-violet-500 mr-2"></span>
              Pixel Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-grow overflow-auto">
            {statistics ? (
              <div className="space-y-6">
                {/* Summary Card */}
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium mb-2 text-muted-foreground">Summary</div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Mode</div>
                        <div className="text-lg font-medium capitalize">{responseData?.mode || "N/A"}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Inclusive</div>
                        <div className="text-lg font-medium">{responseData?.inclusive ? "Yes" : "No"}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Filename</div>
                        <div className="text-sm font-medium truncate" title={responseData?.filename}>
                          {responseData?.filename || "N/A"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detail Stats */}
                <div className="space-y-4">
                  <div className="text-sm font-medium mb-2 text-muted-foreground">Color Distribution</div>
                  
                  {/* RGB Values Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Color</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                            <span>Red</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(statistics.red)}</TableCell>
                        <TableCell className="text-right">
                          {totalPixels ? ((statistics.red / totalPixels) * 100).toFixed(1) : "0"}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                            <span>Green</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(statistics.green)}</TableCell>
                        <TableCell className="text-right">
                          {totalPixels ? ((statistics.green / totalPixels) * 100).toFixed(1) : "0"}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                            <span>Blue</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(statistics.blue)}</TableCell>
                        <TableCell className="text-right">
                          {totalPixels ? ((statistics.blue / totalPixels) * 100).toFixed(1) : "0"}%
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/30">
                        <TableCell className="font-medium">Total</TableCell>
                        <TableCell className="text-right font-mono font-medium">{formatNumber(totalPixels)}</TableCell>
                        <TableCell className="text-right font-medium">100%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                  {/* Color Distribution Visualization */}
                  <div className="mt-6">
                    <div className="text-sm font-medium mb-2">Visual Distribution</div>
                    <div className="h-6 flex rounded-lg overflow-hidden">
                      <div 
                        className="bg-red-500" 
                        style={{ width: `${totalPixels ? (statistics.red / totalPixels) * 100 : 0}%` }}
                      ></div>
                      <div 
                        className="bg-green-500" 
                        style={{ width: `${totalPixels ? (statistics.green / totalPixels) * 100 : 0}%` }}
                      ></div>
                      <div 
                        className="bg-blue-500" 
                        style={{ width: `${totalPixels ? (statistics.blue / totalPixels) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                        <span>Red</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                        <span>Green</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                        <span>Blue</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-600">
                  <div className="flex items-center mb-1">
                    <Info className="h-3.5 w-3.5 mr-1" />
                    <span className="font-medium">Analysis Details</span>
                  </div>
                  <p>
                    This analysis shows the distribution of red, green, and blue pixel values in the 
                    image using the {responseData?.mode} processing mode.
                    {responseData?.inclusive 
                      ? " Edge pixels were included in the calculation." 
                      : " Edge pixels were excluded from the calculation."
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div className="max-w-xs">
                  <div className="mx-auto bg-slate-100 rounded-full h-12 w-12 flex items-center justify-center mb-3">
                    <BarChart2 className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium">No Statistics Available</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload and process an image to view detailed pixel statistics.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PixelStatistics;
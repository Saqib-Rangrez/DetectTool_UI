import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Upload, Download, Loader, RotateCcw, Settings, Zap, Info, FileImage } from "lucide-react";
import ImageViewer from "@/components/copy-move-forgery/ImageViewer";
import { fetchEdgeDetection } from "@/api/services/edgeDetection";

interface EdgeDetectionParams {
  radius: number;
  contrast: number;
  grayscale: boolean;
}

const EdgeDetection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [params, setParams] = useState<EdgeDetectionParams>({
    radius: 3,
    contrast: 50,
    grayscale: false,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImageUrl(url);
      setProcessedImageUrl("");
      toast.success("Image uploaded successfully");
    }
  };

  const handleApplyFilter = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    if (params.radius < 1 || params.radius > 15) {
      toast.error("Radius must be between 1 and 15 pixels");
      return;
    }

    if (params.contrast < 0 || params.contrast > 100) {
      toast.error("Contrast must be between 0 and 100");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetchEdgeDetection(selectedFile, params.radius, params.contrast, params.grayscale);
      setProcessedImageUrl(response.imageUrl);
      toast.success("Edge detection filter applied successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to apply edge detection filter");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setParams({
      radius: 3,
      contrast: 50,
      grayscale: false,
    });
    setProcessedImageUrl("");
    toast.success("Parameters reset to default");
  };

  const handleExportProcessed = () => {
    if (!processedImageUrl) {
      toast.error("No processed image to export");
      return;
    }
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = `edge_detected_${selectedFile?.name || 'image.jpg'}`;
    link.click();
    toast.success("Processed image exported");
  };

  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 15) {
      setParams(prev => ({ ...prev, radius: value }));
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-full mx-auto space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edge Detection Filter</h1>
          </div>
          <Badge variant="outline" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Filter Engine
          </Badge>
        </div>
        
        {/* Controls Panel */}
        <Card className="shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end px-3 py-5">
            {/* File Upload with Preview */}
            <div className="lg:col-span-1">
              <div className="relative">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-muted-foreground/25 rounded-md bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors overflow-hidden"
                >
                  {originalImageUrl ? (
                    <img
                      src={originalImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <>
                      <Upload className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Upload Image</span>
                    </>
                  )}
                </Label>
              </div>
            </div>

            {/* Radius Parameter */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Label className="text-sm font-medium">Radius</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Detection sensitivity (1-15px)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="15"
                  value={params.radius}
                  onChange={handleRadiusChange}
                  className="h-9 text-center"
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
            </div>

            {/* Contrast Control */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Label className="text-sm font-medium">Contrast</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edge visibility enhancement</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-2">
                <Slider
                  value={[params.contrast]}
                  onValueChange={(value) => setParams(prev => ({ ...prev, contrast: value[0] }))}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span className="text-primary font-medium">{params.contrast}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Options and Controls */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="grayscale"
                  checked={params.grayscale}
                  onCheckedChange={(checked) => setParams(prev => ({ ...prev, grayscale: Boolean(checked) }))}
                />
                <Label htmlFor="grayscale" className="text-sm">Grayscale Output</Label>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleApplyFilter}
                  disabled={!selectedFile || isProcessing}
                  size="sm"
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="mr-1 h-3 w-3 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <Zap className="mr-1 h-3 w-3" />
                      Apply Filter
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <span>Reset to Default</span>
                  <RotateCcw className="h-3 w-3" />
                </Button>
                {processedImageUrl && (
                  <Button variant="outline" size="sm" onClick={handleExportProcessed}>
                    <span>Download Image</span>
                    <Download className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Results Panel */}
        {!originalImageUrl ? (
          <Card className="h-96 flex items-center justify-center ">
            <div className="text-center">
              <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No Image Selected</h3>
              <p className="text-sm text-muted-foreground">
                Upload an image to apply edge detection filter
              </p>
            </div>
          </Card>
        ) : (
          <Card className="pb-5" style={{marginBottom: "2rem"}}>
            <CardHeader className="pb-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filter Results</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Original: {selectedFile?.name}
                  </Badge>
                  {processedImageUrl && (
                    <Badge className="text-xs bg-green-600">
                      Filter Applied
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 h-96">
                {/* Original Image */}
                <div className="border-r border-border">
                  <div className="px-4 py-2 border-b bg-muted/30">
                    <h4 className="text-sm font-medium">Original</h4>
                  </div>
                  <div className="h-full">
                    <ImageViewer 
                      imageUrl={originalImageUrl}
                      altText="Original image"
                      type="original"
                    />
                  </div>
                </div>

                {/* Processed Image */}
                <div>
                  <div className="px-4 py-2 border-b bg-muted/30">
                    <h4 className="text-sm font-medium">Edge Detected</h4>
                  </div>
                  <div className="h-full">
                    {isProcessing ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <Loader className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">Processing...</p>
                        </div>
                      </div>
                    ) : processedImageUrl ? (
                      <ImageViewer 
                        imageUrl={processedImageUrl}
                        altText="Edge detected image"
                        type="processed"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <Zap className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Apply filter to see results</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EdgeDetection;
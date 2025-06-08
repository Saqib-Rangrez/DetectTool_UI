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
import { fetchErrorLevelAnalysis } from "@/api/services/errorLevelAnalysis";

interface ErrorLevelParams {
  quality: number;
  scale: number;
  contrast: number;
  linear: boolean;
  greyscale: boolean;
}

const ErrorLevelAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [params, setParams] = useState<ErrorLevelParams>({
    quality: 75,
    scale: 5,
    contrast: 20,
    linear: false,
    greyscale: false,
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

  const handleApplyAnalysis = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    if (params.quality < 1 || params.quality > 100) {
      toast.error("Quality must be between 1 and 100");
      return;
    }

    if (params.scale < 1 || params.scale > 100) {
      toast.error("Scale must be between 1 and 100");
      return;
    }

    if (params.contrast < 0 || params.contrast > 100) {
      toast.error("Contrast must be between 0 and 100");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetchErrorLevelAnalysis(
        selectedFile,
        params.quality,
        params.scale,
        params.contrast,
        params.linear,
        params.greyscale
      );
      setProcessedImageUrl(response.imageUrl);
      toast.success("Error level analysis completed successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to complete error level analysis");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setParams({
      quality: 75,
      scale: 5,
      contrast: 20,
      linear: false,
      greyscale: false,
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
    link.download = `error_level_analysis_${selectedFile?.name || 'image.png'}`;
    link.click();
    toast.success("Processed image exported");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-full mx-auto space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Error Level Analysis</h1>
            <p className="text-sm text-muted-foreground">
              Detect image tampering through compression artifact analysis
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            ELA Engine
          </Badge>
        </div>
        
        {/* Controls Panel */}
        <Card className="shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end p-3">
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
                    className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-md bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors overflow-hidden"
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

              <div className="w-full flex flex-col items-start gap-2">
                {/* Quality Control */}
                <div className="w-full">
                  <div className="flex items-center gap-1 mb-2">
                    <Label className="text-sm font-medium">Quality</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>JPEG compression quality for analysis</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[params.quality]}
                      onValueChange={(value) => setParams(prev => ({ ...prev, quality: value[0] }))}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1%</span>
                      <span className="text-primary font-medium">{params.quality}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Scale Control */}
                <div className="w-full">
                  <div className="flex items-center gap-1 mb-2">
                    <Label className="text-sm font-medium">Scale</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Output scaling factor</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[params.scale]}
                      onValueChange={(value) => setParams(prev => ({ ...prev, scale: value[0] }))}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1%</span>
                      <span className="text-primary font-medium">{params.scale}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>                
              </div>

              <div className="w-full flex flex-col items-start gap-2">
                <div className="flex gap-3 w-full ">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="linear"
                      checked={params.linear}
                      onCheckedChange={(checked) => setParams(prev => ({ ...prev, linear: Boolean(checked) }))}
                    />
                    <Label htmlFor="linear" className="text-sm">Linear</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="greyscale"
                      checked={params.greyscale}
                      onCheckedChange={(checked) => setParams(prev => ({ ...prev, greyscale: Boolean(checked) }))}
                    />
                    <Label htmlFor="greyscale" className="text-sm">Greyscale</Label>
                  </div>
                </div>

                {/* Contrast Control */}
                <div className="w-full">
                  <div className="flex items-center gap-1 mb-2">
                    <Label className="text-sm font-medium">Contrast</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Error visibility enhancement</p>
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
              </div>

              {/* Buttons */}
              <div className="w-full flex flex-col items-start gap-2">
                <div className="w-full flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
                    <span>Reset to Default</span>
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                  {processedImageUrl && (
                    <Button variant="outline" size="sm" onClick={handleExportProcessed} className="w-full">
                      <span>Download Image</span>
                      <Download className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="w-full">
                  <Button
                    onClick={handleApplyAnalysis}
                    disabled={!selectedFile || isProcessing}
                    size="sm"
                    className="flex-1 w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="mr-1 h-3 w-3 animate-spin" />
                        Analyzing
                      </>
                    ) : (
                      <>
                        <Zap className="mr-1 h-3 w-3" />
                        Analyze Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
                            
            </div>
        </Card>
        
        {/* Results Panel */}
        {!originalImageUrl ? (
          <Card className="h-96 flex items-center justify-center">
            <div className="text-center">
              <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No Image Selected</h3>
              <p className="text-sm text-muted-foreground">
                Upload an image to perform error level analysis
              </p>
            </div>
          </Card>
        ) : (
          <Card style={{marginBottom : "4rem"}}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Analysis Results</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Original: {selectedFile?.name}
                  </Badge>
                  {processedImageUrl && (
                    <Badge className="text-xs bg-green-600">
                      Analysis Complete
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

                {/* Analysis Result */}
                <div>
                  <div className="px-4 py-2 border-b bg-muted/30">
                    <h4 className="text-sm font-medium">Error Level Analysis</h4>
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
                        altText="Error level analysis result"
                        type="processed"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <Zap className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Click analyze to see results</p>
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

export default ErrorLevelAnalysis;
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Folder, 
  Upload, 
  Download,
  Info,
  AlertCircle,
  Loader,
  CheckCircle, 
  ArrowRight, 
  ImageIcon,
  Users
} from 'lucide-react';
import FaceRecognitionInput from '@/components/FaceRecognition/FaceRecognitionInput';
import FaceRecognitionResults from '@/components/FaceRecognition/FaceRecognitionResults';
import ExportDialog from '@/components/FaceRecognition/ExportDialog';
import EmptyState from '@/components/FaceRecognition/EmptyState';
import { compareImages } from '@/utils/api';

// Types for the face recognition feature
export interface ImageFile {
  id: string;
  name: string;
  url: string;
  matches?: Match[];
  isSelected?: boolean;
}

export interface Match {
  id: string;
  name: string;
  url: string;
  score: number;
}

export interface ProcessingStatus {
  isProcessing: boolean;
  current: number;
  total: number;
  progressPercent: number;
}

const FaceRecognition: React.FC = () => {
  const [inputFolder, setInputFolder] = useState<ImageFile[] | null>(null);
  const [comparisonFolder, setComparisonFolder] = useState<ImageFile[] | null>(null);
  const [threshold, setThreshold] = useState<number>(0.75);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    current: 0,
    total: 0,
    progressPercent: 0
  });
  const [results, setResults] = useState<ImageFile[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportProcessing, setExportProcessing] = useState(false);
  const { toast } = useToast();

  const handleInputFolderSelect = useCallback((files: FileList) => {
    const imageFiles: ImageFile[] = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: `input-${Math.random().toString(36).substring(2, 11)}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }));
    
    if (imageFiles.length === 0) {
      toast({
        title: "No valid images",
        description: "Please select images (JPEG, PNG, etc.) for the input folder.",
        variant: "destructive"
      });
      return;
    }

    setInputFolder(imageFiles);
    toast({
      title: "Input folder selected",
      description: `${imageFiles.length} images uploaded successfully.`
    });
  }, [toast]);

  const handleComparisonFolderSelect = useCallback((files: FileList) => {
    const imageFiles: ImageFile[] = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: `comparison-${Math.random().toString(36).substring(2, 11)}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }));
    
    if (imageFiles.length === 0) {
      toast({
        title: "No valid images",
        description: "Please select images (JPEG, PNG, etc.) for the comparison folder.",
        variant: "destructive"
      });
      return;
    }

    setComparisonFolder(imageFiles);
    toast({
      title: "Comparison folder selected",
      description: `${imageFiles.length} images uploaded successfully.`
    });
  }, [toast]);

  const handleSubmit = useCallback(async () => {
    if (!inputFolder || !comparisonFolder) {
      toast({
        title: "Missing folders",
        description: "Please select both input and comparison folders.",
        variant: "destructive"
      });
      return;
    }

    // Start processing
    setProcessingStatus({
      isProcessing: true,
      current: 0,
      total: inputFolder.length,
      progressPercent: 0
    });
    setResults(null);

    try {
      // Simulate progress animation
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress = Math.min(progress + 10, 80);
        setProcessingStatus(prev => ({
          ...prev,
          progressPercent: progress
        }));
      }, 200);

      const inputFiles = inputFolder.map(img => new File([img.url], img.name, { type: 'image/*' }));
      const compareFiles = comparisonFolder.map(img => new File([img.url], img.name, { type: 'image/*' }));
      const response = await compareImages(inputFiles, compareFiles, threshold);

      clearInterval(progressInterval);
      setProcessingStatus(prev => ({
        ...prev,
        progressPercent: 100,
        current: inputFolder.length
      }));

      // Process API response
      const resultsWithMatches = inputFolder.map(inputImg => {
        const matches = response.matches
          .filter(match => match.input_file === inputImg.name && match.matched)
          .map(match => {
            const compareImg = comparisonFolder.find(img => img.name === match.compare_file);
            return {
              id: compareImg?.id || `match-${Math.random().toString(36).substring(2, 11)}`,
              name: match.compare_file,
              url: compareImg?.url || '',
              score: match.result / 100 // Convert result (0-100) to score (0-1)
            };
          });

        return {
          ...inputImg,
          matches
        };
      });

      // Filter to only images with matches
      const filteredResults = resultsWithMatches.filter(img => img.matches && img.matches.length > 0);

      setResults(filteredResults);
      if (filteredResults.length > 0) {
        setSelectedImage(filteredResults[0]);
      }

      toast({
        title: "Processing complete",
        description: `Found ${response.total_matches} matches for ${filteredResults.length} out of ${inputFolder.length} images.`
      });

      if (response.errors.length > 0) {
        toast({
          title: "Processing errors",
          description: `${response.errors.length} image(s) could not be processed.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error comparing images:', error);
      toast({
        title: "Error",
        description: `Failed to compare images: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setProcessingStatus(prev => ({
        ...prev,
        isProcessing: false
      }));
    }
  }, [inputFolder, comparisonFolder, threshold, toast]);

  const handleExport = useCallback(() => {
    setShowExportDialog(true);
  }, []);

  const handleExportConfirm = useCallback((format: 'csv' | 'json') => {
    if (!results || results.length === 0) {
      toast({
        title: "No results to export",
        description: "Process images first to get exportable results.",
        variant: "destructive"
      });
      return;
    }

    setExportProcessing(true);

    setTimeout(() => {
      let exportData;
      let fileName;
      let dataUrl;

      if (format === 'json') {
        exportData = JSON.stringify(results, null, 2);
        fileName = 'face-recognition-results.json';
        const blob = new Blob([exportData], { type: 'application/json' });
        dataUrl = URL.createObjectURL(blob);
      } else {
        const csvRows = [
          ['Input Image', 'Matched Image', 'Similarity Score'].join(','),
          ...results.flatMap(input =>
            input.matches ? input.matches.map(match =>
              [`"${input.name.replace(/"/g, '""')}"`, `"${match.name.replace(/"/g, '""')}"`, match.score.toFixed(4)].join(',')
            ) : []
          )
        ];
        exportData = csvRows.join('\n');
        fileName = 'face-recognition-results.csv';
        const blob = new Blob([exportData], { type: 'text/csv' });
        dataUrl = URL.createObjectURL(blob);
      }

      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = fileName;
      downloadLink.click();

      setExportProcessing(false);
      setShowExportDialog(false);

      toast({
        title: "Export successful",
        description: `Results exported as ${format.toUpperCase()}.`
      });
    }, 1500);
  }, [results, toast]);

  const handleImageSelect = useCallback((image: ImageFile) => {
    setSelectedImage(image);
  }, []);

  const showEmptyState = !inputFolder && !comparisonFolder;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="border-b bg-white p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Face Recognition</h1>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* Input Section */}
        <FaceRecognitionInput 
          threshold={threshold}
          setThreshold={setThreshold}
          onInputFolderSelect={handleInputFolderSelect}
          onComparisonFolderSelect={handleComparisonFolderSelect}
          onSubmit={handleSubmit}
          onExport={handleExport}
          inputCount={inputFolder?.length}
          comparisonCount={comparisonFolder?.length}
          isProcessing={processingStatus.isProcessing}
          hasResults={!!results && results.length > 0}
        />
        
        {/* Processing Indicator */}
        {processingStatus.isProcessing && (
          <Card className="my-4 animate-fade-in">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin text-primary" />
                    <span className="font-medium">Processing...</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {processingStatus.current} of {processingStatus.total} images
                  </span>
                </div>
                <Progress value={processingStatus.progressPercent} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Processing image {processingStatus.current} of {processingStatus.total} from Input Folder...
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Results Section */}
        {!showEmptyState ? (
          <>
            {!processingStatus.isProcessing && (
              <div className="mt-6">
                {results && results.length > 0 ? (
                  <FaceRecognitionResults 
                    results={results}
                    selectedImage={selectedImage}
                    onImageSelect={handleImageSelect}
                    threshold={threshold}
                  />
                ) : !processingStatus.isProcessing && inputFolder && comparisonFolder && (
                  <Card className="bg-white p-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ArrowRight className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">Ready to Process</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Both input and comparison folders are ready. Click the "Submit" button above to start the face recognition process.
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
      
      {/* Export Dialog */}
      <ExportDialog
        showDialog={showExportDialog}
        setShowDialog={setShowExportDialog}
        onExportConfirm={handleExportConfirm}
        isProcessing={exportProcessing}
      />
    </div>
  );
};

export default FaceRecognition;
import React, { useState, useCallback, useEffect } from 'react';
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
import { compareImages, isAuthenticated } from '@/utils/api';
import { useNavigate } from 'react-router-dom';

// Types for the face recognition feature
export interface ImageFile {
  id: string;
  name: string;
  url: string;
  file: File; // Store original File object
  matches?: Match[];
  isSelected?: boolean;
}

export interface Match {
  id: string;
  name: string;
  url: string;
  score: number;
  distance: number; // Add distance for display
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
  const [threshold, setThreshold] = useState<number>(30); 
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
    const navigate = useNavigate();
  

  useEffect(() => {
        if (!isAuthenticated()) {
          toast({
            title: "Authentication required",
            description: "Please log in to access this page",
            variant: "destructive",
          });
          navigate("/login");
        }
      }, [navigate, toast]);

  const handleInputFolderSelect = useCallback((files: FileList) => {
    const validFiles: ImageFile[] = Array.from(files)
      .filter(file => file.type.startsWith('image/') || file.type === 'application/pdf')
      .map(file => ({
        id: `input-${Math.random().toString(36).substring(2, 11)}`,
        name: file.name,
        url: URL.createObjectURL(file),
        file
      }));
    
    if (validFiles.length === 0) {
      toast({
        title: "No valid files",
        description: "Please select images (JPEG, PNG, etc.) or PDFs for the input folder.",
        variant: "destructive"
      });
      return;
    }

    setInputFolder(validFiles);
    toast({
      title: "Input folder selected",
      description: `${validFiles.length} file${validFiles.length === 1 ? '' : 's'} uploaded successfully.`
    });
  }, [toast]);

  const handleComparisonFolderSelect = useCallback((files: FileList) => {
    const validFiles: ImageFile[] = Array.from(files)
      .filter(file => file.type.startsWith('image/') || file.type === 'application/pdf')
      .map(file => ({
        id: `comparison-${Math.random().toString(36).substring(2, 11)}`,
        name: file.name,
        url: URL.createObjectURL(file),
        file
      }));
    
    if (validFiles.length === 0) {
      toast({
        title: "No valid files",
        description: "Please select images (JPEG, PNG, etc.) or PDFs for the comparison folder.",
        variant: "destructive"
      });
      return;
    }

    setComparisonFolder(validFiles);
    toast({
      title: "Comparison folder selected",
      description: `${validFiles.length} file${validFiles.length === 1 ? '' : 's'} uploaded successfully.`
    });
  }, [toast]);

  const handleThresholdChange = useCallback((value: number) => {
    if (value < 30 || value > 100 || isNaN(value)) {
      setThreshold(30);
    } else {
      setThreshold(value);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    let intervalId: NodeJS.Timeout | null = null;
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
    setSelectedImage(null); // Clear selectedImage to avoid stale state

    try {
      // Simulate per-file progress
      let currentFile = 0;
      const totalFiles = inputFolder.length;
      const intervalDuration = Math.max(500, 10000 / totalFiles); // 500ms per file, capped at 10s total
      let intervalId: NodeJS.Timeout | null = null;

      const updateProgress = () => {
        currentFile = Math.min(currentFile + 1, totalFiles);
        const progress = (currentFile / totalFiles) * 100;
        setProcessingStatus({
          isProcessing: true,
          current: currentFile,
          total: totalFiles,
          progressPercent: progress
        });
        if (currentFile >= totalFiles && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      };

      intervalId = setInterval(updateProgress, intervalDuration);

      // Run API call in parallel
      const inputFiles = inputFolder.map(img => img.file);
      const compareFiles = comparisonFolder.map(img => img.file);
      const response = await compareImages(inputFiles, compareFiles, threshold);

      // Ensure progress reaches 100% on API completion
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      setProcessingStatus({
        isProcessing: false,
        current: totalFiles,
        total: totalFiles,
        progressPercent: 100
      });

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
              score: match.result,
              distance: match.distance
            };
          });

        return {
          ...inputImg,
          matches
        };
      });

      // Filter to only files with matches
      const filteredResults = resultsWithMatches.filter(img => img.matches && img.matches.length > 0);

      setResults(filteredResults);
      if (filteredResults.length > 0) {
        setSelectedImage(filteredResults[0]);
        setInputFolder(null);
        setComparisonFolder(null);
        setThreshold(30);
      }

      toast({
        title: "Processing complete",
        description: `Found ${response.total_matches} matches for ${filteredResults.length} out of ${inputFolder.length} file${inputFolder.length === 1 ? '' : 's'}.`
      });

      if (response.errors.length > 0) {
        toast({
          title: "Processing errors",
          description: `${response.errors.length} file${response.errors.length === 1 ? '' : 's'} could not be processed: ${response.errors.join(', ')}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error comparing files:', error);
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      toast({
        title: "Error",
        description: `Failed to compare files: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      setProcessingStatus({
        isProcessing: false,
        current: 0,
        total: inputFolder.length,
        progressPercent: 0
      });
      setResults(null);
      setSelectedImage(null); // Clear on error
    }
  }, [inputFolder, comparisonFolder, threshold, toast]);

  const handleExport = useCallback(() => {
    setShowExportDialog(true);
  }, []);

  const handleExportConfirm = useCallback((format: 'csv' | 'json') => {
    if (!results || results.length === 0) {
      toast({
        title: "No results to export",
        description: "Process files first to get exportable results.",
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
          ['Input File', 'Compare File', 'Matched', 'Distance', 'Threshold', 'Result'].join(','),
          ...results.flatMap(input =>
            input.matches ? input.matches.map(match => [
              `"${input.name.replace(/"/g, '""')}"`,
              `"${match.name.replace(/"/g, '""')}"`,
              'true', // Only matched results are included
              match.distance.toFixed(2),
              threshold.toFixed(2),
              match.score.toFixed(2)
            ].join(',')) : []
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
  }, [results, threshold, toast]);

  const handleImageSelect = useCallback((image: ImageFile) => {
    setSelectedImage(image);
  }, []);

  const showEmptyState = !inputFolder && !comparisonFolder && (!results || results.length === 0);

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
          setThreshold={handleThresholdChange}
          onInputFolderSelect={handleInputFolderSelect}
          onComparisonFolderSelect={handleComparisonFolderSelect}
          onSubmit={handleSubmit}
          onExport={handleExport}
          inputCount={inputFolder?.length}
          comparisonCount={comparisonFolder?.length}
          isProcessing={processingStatus.isProcessing}
          hasResults={!!results && results.length > 0}
          thresholdMin={30}
          thresholdMax={100}
          thresholdTooltip="Threshold value between 30 and 100 for face matching confidence."
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
                    {processingStatus.current} of {processingStatus.total} file{processingStatus.total === 1 ? '' : 's'}
                  </span>
                </div>
                <Progress value={processingStatus.progressPercent} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Processing file {processingStatus.current} of {processingStatus.total} from Input Folder...
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
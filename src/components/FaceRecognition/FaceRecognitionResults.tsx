
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageFile } from '@/pages/FaceRecognition';

interface FaceRecognitionResultsProps {
  results: ImageFile[];
  selectedImage: ImageFile | null;
  onImageSelect: (image: ImageFile) => void;
  threshold: number;
}

const FaceRecognitionResults: React.FC<FaceRecognitionResultsProps> = ({
  results,
  selectedImage,
  onImageSelect,
  threshold
}) => {
  const [activeView, setActiveView] = useState<'grid' | 'split'>('split');

  // Helper for score indication color
  const getMatchScoreColor = (score: number) => {
    if (score >= threshold + 0.15) return 'bg-green-600 hover:bg-green-700';
    if (score >= threshold) return 'bg-amber-500 hover:bg-amber-600';
    return 'bg-gray-500 hover:bg-gray-600';
  };

  // Find matched images for the selected image
  const matchedImages = selectedImage?.matches || [];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* View Control Tabs */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'grid' | 'split')} className="w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mb-2">Recognition Results</h2>
          <TabsList className="overflow-hidden rounded-lg">
            <TabsTrigger value="split">Split View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="split" className="mt-4">
          <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
            {/* Input Images Panel */}
            <ResizablePanel defaultSize={40} minSize={30}>
              <div className="flex flex-col h-full bg-white">
                <div className="p-4 border-b bg-slate-50">
                  <h3 className="font-medium">Input Images ({results.length})</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {results.map((image) => (
                      <div 
                        key={image.id}
                        className={`relative rounded-md overflow-hidden border-2 transition-all cursor-pointer hover:shadow-md ${
                          selectedImage?.id === image.id ? 'border-primary shadow-md' : 'border-transparent'
                        }`}
                        onClick={() => onImageSelect(image)}
                      >
                        <img 
                          src={image.url} 
                          alt={image.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                          <div className="p-2 w-full">
                            <p className="text-white text-xs truncate">
                              {image.name}
                            </p>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="outline" className="bg-black/30 text-white border-white/20 text-[10px]">
                                {image.matches?.length || 0} matches
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {image.matches && image.matches.length > 0 && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              <span className="text-[10px]">Matches</span>
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ResizablePanel>

            {/* Resizer Handle */}
            <ResizableHandle withHandle />

            {/* Matches Panel */}
            <ResizablePanel defaultSize={60}>
              <div className="flex flex-col h-full bg-white">
                <div className="p-4 border-b bg-slate-50">
                  <h3 className="font-medium">
                    {selectedImage 
                      ? `Matched Results for "${selectedImage.name}" (${matchedImages.length})` 
                      : 'Select an input image to see matches'}
                  </h3>
                </div>
                {selectedImage ? (
                  <div className="flex-1 overflow-y-auto p-4">
                    {matchedImages.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matchedImages.map((match) => (
                          <Card key={match.id} className="overflow-hidden hover:shadow-md transition-all">
                            <div className="relative h-56">
                              <img 
                                src={match.url} 
                                alt={match.name} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 right-3">
                                <Badge className={`${getMatchScoreColor(match.score)}`}>
                                  Match: {match.score.toFixed(2)}
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <p className="font-medium text-sm truncate" title={match.name}>
                                  {match.name}
                                </p>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="mt-2">
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${getMatchScoreColor(match.score).split(' ')[0]}`}
                                    style={{ width: `${match.score * 100}%` }}
                                  />
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                  <span>Threshold: {threshold}</span>
                                  <span>Score: {match.score.toFixed(2)}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center max-w-md">
                          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                          <h4 className="text-lg font-medium">No Matches Found</h4>
                          <p className="text-sm text-muted-foreground mt-2">
                            No matches were found for "{selectedImage.name}" with the current threshold of {threshold}.
                            Try lowering the threshold or select another image.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-muted-foreground">Select an image from the left panel to view matches</p>
                    </div>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>

        <TabsContent value="grid" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((image) => (
                  <Card key={image.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 border-b bg-slate-50">
                      <h4 className="font-medium truncate" title={image.name}>
                        {image.name}
                      </h4>
                    </div>
                    <div className="p-4">
                      <div className="relative h-40 mb-4 border rounded overflow-hidden">
                        <img 
                          src={image.url} 
                          alt={image.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-600">
                            <span className="text-xs">{image.matches?.length || 0} matches</span>
                          </Badge>
                        </div>
                      </div>
                      
                      {image.matches && image.matches.length > 0 ? (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Matches:</h5>
                          {image.matches.slice(0, 2).map((match) => (
                            <div key={match.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                              <div className="w-12 h-12 shrink-0 rounded overflow-hidden">
                                <img 
                                  src={match.url} 
                                  alt={match.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs truncate" title={match.name}>{match.name}</p>
                                <Badge className={`mt-1 text-[10px] ${getMatchScoreColor(match.score)}`}>
                                  {match.score.toFixed(2)}
                                </Badge>
                              </div>
                            </div>
                          ))}
                          {image.matches.length > 2 && (
                            <p className="text-xs text-center text-muted-foreground">
                              +{image.matches.length - 2} more matches
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="h-24 flex items-center justify-center">
                          <p className="text-sm text-muted-foreground">No matches found</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FaceRecognitionResults;

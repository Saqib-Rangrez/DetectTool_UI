import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';
import { 
  Image, 
  Bot, 
  Users, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Activity,
  Zap,
  Search,
  AlertTriangle,
  Layers,
  Target
} from 'lucide-react';

const Dashboard = () => {
  // Mock data for analytics
  const overallStats = {
    totalFiles: 421,
    successful: 403,
    failed: 18,
    successRate: 95.7
  };

  const moduleData = [
    { module: 'Get Metadata', processed: 120, success: 118, failure: 2, successRate: 98.3 },
    { module: 'Detect AI or Not', processed: 95, success: 92, failure: 3, successRate: 96.8 },
    { module: 'Face Recognition', processed: 80, success: 79, failure: 1, successRate: 98.8 },
    { module: 'Pixel Statistics', processed: 56, success: 56, failure: 0, successRate: 100.0 },
    { module: 'Copy-Move Forgery', processed: 70, success: 68, failure: 2, successRate: 97.1 },
    { module: 'Edge Detection Filter', processed: 75, success: 70, failure: 5, successRate: 93.3 },
    { module: 'Error Level Analysis', processed: 65, success: 63, failure: 2, successRate: 96.9 },
    { module: 'PCA Projection', processed: 45, success: 44, failure: 1, successRate: 97.8 }
  ];

  const aiDetectionData = [
    { name: 'AI Generated', value: 36, color: '#ef4444' },
    { name: 'Human Generated', value: 59, color: '#10b981' }
  ];

  const copyMoveData = [
    { detector: 'BRISK', usage: 35, avgKeypoints: 2203 },
    { detector: 'ORB', usage: 20, avgKeypoints: 1890 },
    { detector: 'AKAZE', usage: 15, avgKeypoints: 2456 }
  ];

  const pixelStatsData = [
    { mode: 'Minimum', count: 21 },
    { mode: 'Average', count: 24 },
    { mode: 'Maximum', count: 11 }
  ];

  const edgeDetectionTrend = [
    { day: 'Mon', radius: 3.2, contrast: 62 },
    { day: 'Tue', radius: 3.8, contrast: 68 },
    { day: 'Wed', radius: 3.5, contrast: 65 },
    { day: 'Thu', radius: 3.7, contrast: 70 },
    { day: 'Fri', radius: 3.9, contrast: 63 },
    { day: 'Sat', radius: 3.1, contrast: 58 },
    { day: 'Sun', radius: 3.6, contrast: 66 }
  ];

  // New data for Error Level Analysis
  const errorLevelData = [
    { compressionLevel: '50%', avgError: 12.5, filesProcessed: 15 },
    { compressionLevel: '70%', avgError: 8.3, filesProcessed: 22 },
    { compressionLevel: '85%', avgError: 5.1, filesProcessed: 18 },
    { compressionLevel: '95%', avgError: 2.8, filesProcessed: 10 }
  ];

  const errorLevelMetrics = {
    totalAnalyzed: 65,
    averageErrorLevel: 7.2,
    suspiciousRegions: 23,
    compressionArtifacts: 156,
    qualityThreshold: 80
  };

  // New data for PCA Projection
  const pcaComponentData = [
    { component: 'PC1', variance: 64.2, eigenvalue: 1250.4 },
    { component: 'PC2', variance: 23.8, eigenvalue: 890.2 },
    { component: 'PC3', variance: 12.0, eigenvalue: 345.8 }
  ];

  const pcaProjectionModes = [
    { mode: 'Distance', usage: 18, avgAccuracy: 87.5 },
    { mode: 'Projection', usage: 15, avgAccuracy: 92.3 },
    { mode: 'Cross Product', usage: 12, avgAccuracy: 89.1 }
  ];

  const pcaMetrics = {
    totalProcessed: 45,
    averageVariance: 66.7,
    dimensionalityReduction: 78.4,
    processingOptions: {
      inverted: 23,
      equalized: 18
    }
  };

  const chartConfig = {
    ai: { label: "AI Generated", color: "#ef4444" },
    human: { label: "Human Generated", color: "#10b981" },
    radius: { label: "Radius", color: "#3b82f6" },
    contrast: { label: "Contrast", color: "#8b5cf6" },
    error: { label: "Error Level", color: "#f59e0b" },
    variance: { label: "Variance", color: "#06b6d4" },
    eigenvalue: { label: "Eigenvalue", color: "#8b5cf6" }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          </div>
          <p className="text-gray-600">Comprehensive overview of your image processing platform performance</p>
        </div>

        {/* Overall Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Files</CardTitle>
              <Image className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{overallStats.totalFiles}</div>
              <p className="text-xs text-blue-600 mt-1">Processed this month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{overallStats.successful}</div>
              <p className="text-xs text-green-600 mt-1">{overallStats.successRate}% success rate</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{overallStats.failed}</div>
              <p className="text-xs text-red-600 mt-1">{(100 - overallStats.successRate).toFixed(1)}% failure rate</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{overallStats.successRate}%</div>
              <p className="text-xs text-purple-600 mt-1">Overall efficiency</p>
            </CardContent>
          </Card>
        </div>

        {/* Module Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Module Performance Overview
            </CardTitle>
            <CardDescription>Detailed breakdown by processing module</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Files Processed</TableHead>
                  <TableHead>Success</TableHead>
                  <TableHead>Failure</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moduleData.map((module, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{module.module}</TableCell>
                    <TableCell>{module.processed}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">{module.success}</span>
                        <Progress value={(module.success / module.processed) * 100} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-red-600 font-medium">{module.failure}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={module.successRate >= 98 ? "default" : module.successRate >= 95 ? "secondary" : "destructive"}>
                        {module.successRate}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {module.successRate >= 98 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : module.successRate >= 95 ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* AI Detection & Face Recognition Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-600" />
                AI Detection Intelligence
              </CardTitle>
              <CardDescription>Analysis of AI vs Human generated content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">36</div>
                  <div className="text-sm text-gray-600">AI Generated</div>
                  <div className="text-xs text-gray-500">Avg Confidence: 78.3%</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">59</div>
                  <div className="text-sm text-gray-600">Human Generated</div>
                  <div className="text-xs text-gray-500">Avg Confidence: 85.1%</div>
                </div>
              </div>
              <ChartContainer config={chartConfig} className="h-48">
                <PieChart>
                  <Pie
                    data={aiDetectionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {aiDetectionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Face Recognition Analytics
              </CardTitle>
              <CardDescription>Many-to-many face matching performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-lg font-semibold text-blue-900">45</div>
                    <div className="text-sm text-blue-600">Input Images</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-lg font-semibold text-green-900">35</div>
                    <div className="text-sm text-green-600">Comparison Images</div>
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">120</div>
                  <div className="text-sm text-purple-600">Matched Pairs Found</div>
                  <div className="text-xs text-purple-500 mt-1">Avg Threshold: 0.72</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Copy-Move Forgery & Pixel Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-orange-600" />
                Copy-Move Forgery Detection
              </CardTitle>
              <CardDescription>Detector usage and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-lg font-semibold">70</div>
                    <div className="text-sm text-gray-600">Images Analyzed</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-lg font-semibold">2,203</div>
                    <div className="text-sm text-gray-600">Avg Keypoints</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {copyMoveData.map((detector, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{detector.detector}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{detector.usage} uses</div>
                        <div className="text-xs text-gray-500">{detector.avgKeypoints} keypoints</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Pixel Statistics
              </CardTitle>
              <CardDescription>Processing mode usage and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-900">56</div>
                  <div className="text-sm text-yellow-600">Images Processed</div>
                  <div className="text-xs text-yellow-500">Inclusive mode: 32 times</div>
                </div>
                <ChartContainer config={chartConfig} className="h-32">
                  <BarChart data={pixelStatsData}>
                    <XAxis dataKey="mode" />
                    <YAxis />
                    <Bar dataKey="count" fill="#eab308" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Level Analysis & PCA Projection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Error Level Analysis
              </CardTitle>
              <CardDescription>Compression artifacts and manipulation detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="text-lg font-semibold text-orange-900">{errorLevelMetrics.totalAnalyzed}</div>
                    <div className="text-sm text-orange-600">Images Analyzed</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="text-lg font-semibold text-red-900">{errorLevelMetrics.suspiciousRegions}</div>
                    <div className="text-sm text-red-600">Suspicious Regions</div>
                  </div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="text-xl font-bold text-amber-900">{errorLevelMetrics.averageErrorLevel}%</div>
                  <div className="text-sm text-amber-600">Average Error Level</div>
                  <div className="text-xs text-amber-500 mt-1">{errorLevelMetrics.compressionArtifacts} artifacts detected</div>
                </div>
                <ChartContainer config={chartConfig} className="h-40">
                  <BarChart data={errorLevelData}>
                    <XAxis dataKey="compressionLevel" />
                    <YAxis />
                    <Bar dataKey="avgError" fill="#f59e0b" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-cyan-600" />
                PCA Projection Analysis
              </CardTitle>
              <CardDescription>Principal component analysis and dimensionality reduction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-cyan-50 p-3 rounded-lg">
                    <div className="text-lg font-semibold text-cyan-900">{pcaMetrics.totalProcessed}</div>
                    <div className="text-sm text-cyan-600">Images Processed</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-lg font-semibold text-blue-900">{pcaMetrics.averageVariance}%</div>
                    <div className="text-sm text-blue-600">Avg Variance</div>
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-xl font-bold text-purple-900">{pcaMetrics.dimensionalityReduction}%</div>
                  <div className="text-sm text-purple-600">Dimensionality Reduction</div>
                  <div className="text-xs text-purple-500 mt-1">
                    Inverted: {pcaMetrics.processingOptions.inverted} | Equalized: {pcaMetrics.processingOptions.equalized}
                  </div>
                </div>
                <ChartContainer config={chartConfig} className="h-40">
                  <BarChart data={pcaComponentData}>
                    <XAxis dataKey="component" />
                    <YAxis />
                    <Bar dataKey="variance" fill="#06b6d4" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edge Detection Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              Edge Detection Filter Trends
            </CardTitle>
            <CardDescription>Weekly parameter usage patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChartContainer config={chartConfig} className="h-64">
                  <LineChart data={edgeDetectionTrend}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Line type="monotone" dataKey="radius" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="contrast" stroke="#8b5cf6" strokeWidth={2} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ChartContainer>
              </div>
              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="text-xl font-bold text-indigo-900">75</div>
                  <div className="text-sm text-indigo-600">Total Processed</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-xl font-bold text-blue-900">3.5px</div>
                  <div className="text-sm text-blue-600">Avg Radius</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-xl font-bold text-purple-900">64%</div>
                  <div className="text-sm text-purple-600">Avg Contrast</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">48</div>
                  <div className="text-sm text-gray-600">Grayscale Uses</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
};

export default Dashboard;

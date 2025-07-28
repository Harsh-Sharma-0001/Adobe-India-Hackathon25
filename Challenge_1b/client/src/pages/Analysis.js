import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, User, Target, Loader2, Download, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Analysis = () => {
  const [files, setFiles] = useState([]);
  const [persona, setPersona] = useState('');
  const [jobToBeDone, setJobToBeDone] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      toast.success(`${acceptedFiles.length} PDF(s) uploaded successfully!`);
    }
  });

  const personas = [
    { value: 'Travel Planner', label: 'Travel Planner', icon: '✈️', description: 'Plan trips and travel experiences' },
    { value: 'HR Professional', label: 'HR Professional', icon: '👔', description: 'Manage forms and compliance' },
    { value: 'Food Contractor', label: 'Food Contractor', icon: '🍽️', description: 'Plan menus and catering' },
    { value: 'Student', label: 'Student', icon: '📚', description: 'Research and academic work' },
    { value: 'Researcher', label: 'Researcher', icon: '🔬', description: 'Analyze research documents' },
    { value: 'Business Analyst', label: 'Business Analyst', icon: '📊', description: 'Analyze business documents' }
  ];

  const handleAnalysis = async () => {
    if (!files.length || !persona || !jobToBeDone) {
      toast.error('Please fill in all fields and upload PDFs');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep('Starting analysis...');
    setResults(null); // Clear previous results

    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('pdfs', file);
    });
    formData.append('persona', persona);
    formData.append('jobToBeDone', jobToBeDone);

    // Start progress simulation
    const steps = [
      'Uploading files...',
      'Processing PDFs...',
      'Extracting content...',
      'Analyzing sections...',
      'Generating insights...'
    ];
    
    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setCurrentStep(steps[currentStepIndex]);
        setAnalysisProgress((prev) => Math.min(prev + 20, 90)); // Only go up to 90%
        currentStepIndex++;
      }
    }, 1000);

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000  // 2 minute timeout
      });
      
      // Clear the progress interval
      clearInterval(interval);
      
      // Set final progress and results
      setAnalysisProgress(100);
      setCurrentStep('Analysis complete!');
      setResults(response.data);
      
      console.log('Analysis results received:', response.data);
      toast.success('Analysis completed successfully!');
      
    } catch (error) {
      // Clear the progress interval
      clearInterval(interval);
      
      console.error('Analysis error:', error);
      if (error.code === 'ECONNABORTED') {
        toast.error('Analysis timed out. Please try with a smaller PDF or try again.');
      } else if (error.response?.data?.error) {
        toast.error(`Analysis failed: ${error.response.data.error}`);
      } else {
        toast.error('Analysis failed. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPersonaIcon = (personaValue) => {
    const persona = personas.find(p => p.value === personaValue);
    return persona?.icon || '👤';
  };

  // const getImportanceColor = (rank) => {
  //   if (rank <= 3) return 'text-red-600 bg-red-100';
  //   if (rank <= 6) return 'text-orange-600 bg-orange-100';
  //   return 'text-green-600 bg-green-100';
  // };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold text-secondary-800">PDF Analysis</h1>
        <p className="text-lg text-secondary-600">
          Upload your PDFs and specify your persona to get intelligent analysis
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload PDFs
            </h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-secondary-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-secondary-400" />
              {isDragActive ? (
                <p className="text-primary-600">Drop the PDFs here...</p>
              ) : (
                <div>
                  <p className="text-secondary-600 mb-2">
                    Drag & drop PDFs here, or click to select
                  </p>
                  <p className="text-sm text-secondary-500">
                    Supports multiple PDF files
                  </p>
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="font-medium text-secondary-800">Uploaded Files:</h3>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-secondary-600">
                    <FileText className="w-4 h-4" />
                    <span>{file.name}</span>
                    <span className="text-xs text-green-600">✓ Ready</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Configuration Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Analysis Configuration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Persona
                </label>
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select a persona</option>
                  {personas.map(p => (
                    <option key={p.value} value={p.value}>
                      {p.icon} {p.label} - {p.description}
                    </option>
                  ))}
                </select>
                {persona && (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-secondary-600">
                    <span className="text-lg">{getPersonaIcon(persona)}</span>
                    <span>Selected: {persona}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Job to be Done
                </label>
                <textarea
                  value={jobToBeDone}
                  onChange={(e) => setJobToBeDone(e.target.value)}
                  placeholder="Describe what you want to accomplish with these PDFs..."
                  rows={4}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalysis}
            disabled={isAnalyzing || !files.length || !persona || !jobToBeDone}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="w-5 h-5 mr-2" />
                Start Analysis
              </>
            )}
          </button>

          {/* Progress Bar */}
          {(isAnalyzing || results) && (
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analysis Progress
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Analysis Complete
                  </>
                )}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className={isAnalyzing ? "text-secondary-600" : "text-green-600 font-medium"}>
                    {isAnalyzing ? currentStep : "Ready to view results"}
                  </span>
                  <span className={isAnalyzing ? "text-secondary-600" : "text-green-600 font-medium"}>
                    {analysisProgress}%
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isAnalyzing ? "bg-primary-600" : "bg-green-600"
                    }`}
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Results */}
      {results && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-800 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Analysis Results
              </h2>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(results, null, 2);
                  const dataBlob = new Blob([dataStr], {type: 'application/json'});
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `analysis_results_${new Date().toISOString().slice(0, 10)}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                  toast.success('Results exported successfully!');
                }}
                className="btn-secondary text-sm px-4 py-2 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </button>
            </div>

            {/* Metadata Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-800 font-medium">Documents</div>
                <div className="text-2xl font-bold text-blue-900 mt-1">
                  {results.metadata?.total_documents || results.results?.length || 0}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-800 font-medium">Persona</div>
                <div className="text-lg font-bold text-purple-900 mt-1">
                  {results.metadata?.persona || 'N/A'}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-800 font-medium">Job</div>
                <div className="text-lg font-bold text-green-900 mt-1 truncate">
                  {results.metadata?.job_to_be_done || 'N/A'}
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-orange-800 font-medium">Timestamp</div>
                <div className="text-sm font-bold text-orange-900 mt-1">
                  {new Date(results.metadata?.timestamp).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Document Results */}
            <div className="space-y-8">
              {results.results?.map((result, docIndex) => (
                <div key={docIndex} className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-secondary-600" />
                    {result.filename}
                  </h3>

                  {/* Sections */}
                  <div className="space-y-6">
                    {result.sections?.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="bg-gradient-to-r from-gray-50 to-white border rounded-lg p-4">
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              Rank #{section.rank}
                            </span>
                            <span className="text-sm text-gray-600">
                              Page {section.page}
                            </span>
                          </div>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            Score: {section.score}
                          </span>
                        </div>

                        {/* Section Title & Content */}
                        <h4 className="text-lg font-semibold text-secondary-800 mb-2">
                          {section.title}
                        </h4>
                        <p className="text-secondary-600 mb-4">
                          {section.content}
                        </p>

                        {/* Subsection Analysis */}
                        {section.subsection_analysis?.map((subsection, subIndex) => (
                          <div key={subIndex} className="bg-white border rounded p-3 mb-2">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-secondary-700">
                                Paragraph {subsection.paragraph}
                              </span>
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                Relevance: {subsection.relevance_score}
                              </span>
                            </div>
                            <p className="text-sm text-secondary-600 mb-2">
                              {subsection.content}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {subsection.key_points?.map((point, pointIndex) => (
                                <span key={pointIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {point}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analysis; 
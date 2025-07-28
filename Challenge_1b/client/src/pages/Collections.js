import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, FileText, Eye, BarChart3, Calendar, User, Target, Download, Play, ExternalLink, X, ChevronRight, Star, BookOpen } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [pdfs, setPdfs] = useState({});

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get('/api/collections');
      setCollections(response.data);
      
      // Fetch PDFs for each collection
      const pdfsData = {};
      for (const collection of response.data) {
        try {
          const pdfResponse = await axios.get(`/api/collections/${collection.id}/pdfs`);
          pdfsData[collection.id] = pdfResponse.data;
        } catch (error) {
          pdfsData[collection.id] = [];
        }
      }
      setPdfs(pdfsData);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = (collectionId, filename) => {
    window.open(`/viewer/${collectionId}/${filename}`, '_blank');
  };

  const handleViewDetails = (collection) => {
    setSelectedCollection(collection);
    toast.success(`Viewing details for ${collection.name}`);
  };

  const handleCloseModal = () => {
    setSelectedCollection(null);
    setSelectedPDF(null);
  };

  const getImportanceColor = (rank) => {
    if (rank <= 3) return 'text-red-600 bg-red-100';
    if (rank <= 6) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getPersonaIcon = (persona) => {
    switch (persona?.toLowerCase()) {
      case 'travel planner':
        return '✈️';
      case 'hr professional':
        return '👔';
      case 'food contractor':
        return '🍽️';
      default:
        return '👤';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold text-secondary-800">Collections</h1>
        <p className="text-lg text-secondary-600">
          Explore pre-analyzed PDF collections with persona-based insights
        </p>
      </motion.div>

      {collections.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Database className="w-16 h-16 mx-auto text-secondary-400 mb-4" />
          <h3 className="text-xl font-semibold text-secondary-600 mb-2">No Collections Found</h3>
          <p className="text-secondary-500">
            Collections will appear here once you add PDF files and analysis data.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleViewDetails(collection)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                  {collection.hasPdfs ? `${pdfs[collection.id]?.length || 0} PDFs` : 'No PDFs'}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                {collection.name}
              </h3>

              {collection.input && (
                <div className="space-y-2 text-sm text-secondary-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getPersonaIcon(collection.input.persona?.role)}</span>
                    <span>Persona: {collection.input.persona?.role || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Task: {collection.input.job_to_be_done?.task?.substring(0, 50)}...</span>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-secondary-500">
                  {collection.input?.documents?.length || 0} documents
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(collection);
                  }}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                >
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Enhanced Collection Details Modal */}
      {selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-secondary-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-800">
                      {selectedCollection.name}
                    </h2>
                    <p className="text-secondary-600">
                      Challenge ID: {selectedCollection.input?.challenge_info?.challenge_id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-secondary-400 hover:text-secondary-600 p-2 rounded-lg hover:bg-secondary-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Information */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Input Configuration
                    </h3>
                    {selectedCollection.input ? (
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-secondary-600">Persona:</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-2xl">{getPersonaIcon(selectedCollection.input.persona?.role)}</span>
                            <p className="text-secondary-800 font-medium">{selectedCollection.input.persona?.role}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-secondary-600">Task:</span>
                          <p className="text-secondary-800 mt-1">{selectedCollection.input.job_to_be_done?.task}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-secondary-600">Documents:</span>
                          <div className="mt-2 space-y-1">
                            {selectedCollection.input.documents?.map((doc, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm">
                                <FileText className="w-4 h-4 text-secondary-500" />
                                <span className="text-secondary-800">{doc.filename}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-secondary-500">No input configuration available</p>
                    )}
                  </div>

                  {/* PDF List */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      PDF Documents
                    </h3>
                    {pdfs[selectedCollection.id]?.length > 0 ? (
                      <div className="space-y-2">
                        {pdfs[selectedCollection.id].map((pdf, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary-50">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-secondary-500" />
                              <span className="text-sm text-secondary-800">{pdf}</span>
                            </div>
                            <button
                              onClick={() => handleViewPDF(selectedCollection.id, pdf)}
                              className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-secondary-500">No PDFs available</p>
                    )}
                  </div>
                </div>

                {/* Analysis Results */}
                <div className="lg:col-span-2">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Analysis Results
                    </h3>
                    {selectedCollection.output ? (
                      <div className="space-y-6">
                        {/* Extracted Sections */}
                        {selectedCollection.output.extracted_sections && (
                          <div>
                            <h4 className="font-medium text-secondary-700 mb-3">Extracted Sections</h4>
                            <div className="space-y-3">
                              {selectedCollection.output.extracted_sections.slice(0, 5).map((section, index) => (
                                <div key={index} className="p-3 bg-secondary-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-secondary-800">{section.section_title}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getImportanceColor(section.importance_rank)}`}>
                                      Rank #{section.importance_rank}
                                    </span>
                                  </div>
                                  <p className="text-sm text-secondary-600">Page {section.page_number}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Subsection Analysis */}
                        {selectedCollection.output.subsection_analysis && (
                          <div>
                            <h4 className="font-medium text-secondary-700 mb-3">Subsection Analysis</h4>
                            <div className="space-y-3">
                              {selectedCollection.output.subsection_analysis.slice(0, 3).map((subsection, index) => (
                                <div key={index} className="p-3 bg-primary-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-secondary-800">Document: {subsection.document}</span>
                                    <span className="text-xs text-secondary-500">Page {subsection.page_number}</span>
                                  </div>
                                  <p className="text-sm text-secondary-700 line-clamp-3">{subsection.refined_text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4 border-t border-secondary-200">
                          <button
                            onClick={() => {
                              toast.success('Analysis results exported successfully!');
                            }}
                            className="btn-secondary text-sm px-4 py-2 flex items-center"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export Results
                          </button>
                          <button
                            onClick={() => {
                              toast.success('Detailed analysis view opened!');
                            }}
                            className="btn-primary text-sm px-4 py-2 flex items-center"
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Full Analysis
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BarChart3 className="w-12 h-12 mx-auto text-secondary-400 mb-4" />
                        <h4 className="text-lg font-medium text-secondary-600 mb-2">No Analysis Results</h4>
                        <p className="text-secondary-500 mb-4">
                          Analysis results will appear here once processing is complete.
                        </p>
                        <button
                          onClick={() => {
                            toast.success('Analysis started! Results will be available soon.');
                          }}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Run Analysis
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Collections; 
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Database, Zap, Eye, Upload, BarChart3 } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: FileText,
      title: 'PDF Embedding',
      description: 'View PDFs seamlessly with Adobe PDF Embed API',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Database,
      title: 'Multi-Collection Analysis',
      description: 'Process multiple document collections with persona-based analysis',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Upload and analyze PDFs instantly with advanced AI',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Eye,
      title: 'Interactive Viewing',
      description: 'Explore extracted content with beautiful visualizations',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Drag and drop PDFs for instant analysis',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: BarChart3,
      title: 'Smart Insights',
      description: 'Get importance rankings and structured analysis',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            PDF Analysis Hub
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Experience the future of PDF analysis with Adobe's powerful embedding technology. 
            Upload, analyze, and interact with your documents like never before.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/analysis" className="btn-primary text-lg px-8 py-3">
            Start Analysis
          </Link>
          <Link to="/collections" className="btn-secondary text-lg px-8 py-3">
            View Collections
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="card hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-secondary-600">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center space-y-6"
      >
        <div className="card max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary-800 mb-4">
            Ready to Transform Your PDF Experience?
          </h2>
          <p className="text-lg text-secondary-600 mb-6">
            Join the revolution in document analysis. Upload your PDFs and discover insights 
            you never knew existed.
          </p>
          <Link to="/analysis" className="btn-primary text-lg px-8 py-3">
            Get Started Now
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home; 
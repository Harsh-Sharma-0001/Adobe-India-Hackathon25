import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const Viewer = () => {
  const { collectionId, filename } = useParams();
  const viewerRef = useRef(null);
  const adobeDCView = useRef(null);

  useEffect(() => {
    const loadPDF = async () => {
      if (window.AdobeDC) {
        adobeDCView.current = new window.AdobeDC.View({
          clientId: "1c2a84f90f1746778df9d4c1376896bd",
          divId: "adobe-dc-view"
        });

        adobeDCView.current.previewFile({
          content: { location: { url: `/api/pdf/${collectionId}/${filename}` } },
          metaData: { fileName: filename }
        }, {
          embedMode: "SIZED_CONTAINER",
          showDownloadPDF: true,
          showPrintPDF: true,
          showLeftHandPanel: true,
          showAnnotationTools: true
        });
      }
    };

    loadPDF();
  }, [collectionId, filename]);

  return (
    <div className="min-h-screen bg-secondary-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">
            {filename}
          </h1>
          <p className="text-secondary-600">
            Collection: {collectionId}
          </p>
        </div>
        
        <div className="card p-0 overflow-hidden">
          <div id="adobe-dc-view" ref={viewerRef} className="w-full h-[80vh]"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Viewer; 
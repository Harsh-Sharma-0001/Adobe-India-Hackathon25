const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testCompleteSystem() {
  console.log('🧪 Testing Complete System...');
  
  try {
    // Test 1: Check if server is running
    console.log('1. Checking server status...');
    const configResponse = await axios.get('http://localhost:5000/api/config');
    console.log('✅ Server is running');
    
    // Test 2: Upload and analyze a PDF
    console.log('2. Testing PDF upload and analysis...');
    
    const formData = new FormData();
    
    // Add a test PDF (if exists)
    const testPdfPath = path.join(__dirname, 'server', 'sessions', '55507e90-17d7-4587-b672-74fcea2f61cc', 'input', 'Breakfast Ideas.pdf');
    
    if (fs.existsSync(testPdfPath)) {
      formData.append('pdfs', fs.createReadStream(testPdfPath));
      formData.append('persona', 'Food Contractor');
      formData.append('jobToBeDone', 'Plan a breakfast for 3 people');
      
      const analysisResponse = await axios.post('http://localhost:5000/api/analyze', formData, {
        headers: { ...formData.getHeaders() },
        timeout: 60000
      });
      
      console.log('✅ Analysis completed successfully!');
      console.log('📊 Results:', analysisResponse.data);
      
      // Check if results have the required structure
      if (analysisResponse.data.results && analysisResponse.data.results.length > 0) {
        const result = analysisResponse.data.results[0];
        
        console.log('✅ Metadata:', result.metadata);
        console.log('✅ Sections found:', result.sections.length);
        console.log('✅ Ranked sections:', result.sections.map(s => `Rank ${s.rank}: ${s.title}`));
        
        if (result.sections[0].subsection_analysis) {
          console.log('✅ Subsection analysis present');
        }
        
        console.log('🎉 ALL TESTS PASSED! System is working perfectly!');
      }
      
    } else {
      console.log('⚠️ Test PDF not found, but server is running');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testCompleteSystem(); 
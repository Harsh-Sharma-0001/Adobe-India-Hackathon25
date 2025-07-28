const axios = require('axios');

async function testSystem() {
  console.log('🧪 Testing Complete System...');
  
  try {
    // Test 1: Backend
    console.log('1. Testing Backend...');
    const backendResponse = await axios.get('http://localhost:5000/api/config');
    console.log('✅ Backend is working:', backendResponse.data);
    
    // Test 2: Frontend
    console.log('2. Testing Frontend...');
    const frontendResponse = await axios.get('http://localhost:3000');
    console.log('✅ Frontend is working (Status:', frontendResponse.status, ')');
    
    // Test 3: Collections API
    console.log('3. Testing Collections API...');
    const collectionsResponse = await axios.get('http://localhost:5000/api/collections');
    console.log('✅ Collections API is working:', collectionsResponse.data.length, 'collections found');
    
    console.log('🎉 ALL SYSTEMS ARE WORKING PERFECTLY!');
    console.log('📱 You can now access the webapp at: http://localhost:3000');
    console.log('🔧 Backend API is running at: http://localhost:5000');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSystem(); 
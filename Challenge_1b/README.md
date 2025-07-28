# PDF Analysis Hub - Adobe India Hackathon

A futuristic, beautiful webapp for PDF analysis using Adobe PDF Embed API and advanced AI processing.

## 🚀 Features

- **Adobe PDF Embed API Integration**: Seamless PDF viewing with full annotation capabilities
- **Multi-Collection Analysis**: Process multiple document collections with persona-based analysis
- **Real-time Processing**: Upload and analyze PDFs instantly with Python backend
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Persona-based Analysis**: Intelligent content extraction based on user personas
- **Interactive Viewing**: Explore extracted content with visualizations

## 🛠️ Tech Stack

- **Frontend**: React.js with Tailwind CSS, Framer Motion
- **Backend**: Node.js with Express.js
- **PDF Processing**: Python with PyPDF2, pdfplumber, PyMuPDF
- **PDF Embedding**: Adobe PDF Embed API
- **File Upload**: Multer with drag-and-drop interface

## 📦 Installation

1. **Install Dependencies**:
   ```bash
   npm run install-all
   ```

2. **Install Python Dependencies** (for PDF processing):
   ```bash
   pip install PyPDF2 pdfplumber PyMuPDF
   ```

## 🚀 Running the Application

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```

   This will start both:
   - Backend server on `http://localhost:5000`
   - Frontend React app on `http://localhost:3000`

2. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
Challenge_1b/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── index.js           # Express server
│   └── uploads/           # Temporary file uploads
├── collections/           # PDF collections (create this)
│   ├── Collection_1/
│   ├── Collection_2/
│   └── Collection_3/
└── package.json           # Root package.json
```

## 🎯 Usage

### 1. Home Page
- Beautiful landing page with feature overview
- Quick access to analysis and collections

### 2. Analysis Page
- Upload PDFs via drag-and-drop
- Select persona (Travel Planner, HR Professional, etc.)
- Describe your task/job to be done
- Get intelligent analysis results

### 3. Collections Page
- View pre-analyzed PDF collections
- Explore persona-based insights
- Access structured analysis results

### 4. PDF Viewer
- Full-featured PDF viewing with Adobe Embed API
- Annotations, printing, and download capabilities
- Responsive design for all devices

## 🔧 Configuration

### Adobe PDF Embed API
The API key is already configured in the server (`1c2a84f90f1746778df9d4c1376896bd`).

### Collections Setup
Create collections in the `collections/` directory:

```
collections/
├── Collection_1/
│   ├── PDFs/                    # PDF files
│   ├── challenge1b_input.json   # Input configuration
│   └── challenge1b_output.json  # Analysis results
└── Collection_2/
    └── ...
```

## 🎨 Design Features

- **Modern UI**: Clean, professional design with gradient backgrounds
- **Smooth Animations**: Framer Motion for delightful interactions
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Loading States**: Beautiful loading animations and progress indicators

## 🔍 API Endpoints

- `GET /api/config` - Get Adobe API configuration
- `GET /api/collections` - List all collections
- `GET /api/collections/:id/pdfs` - Get PDFs for a collection
- `GET /api/pdf/:collectionId/:filename` - Serve PDF files
- `POST /api/analyze` - Upload and analyze PDFs
- `GET /api/analysis/:sessionId` - Get analysis results

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
cd client && npm run build
```

## 📝 License

MIT License - Adobe India Hackathon 2025

## 🤝 Contributing

This is a hackathon project showcasing advanced PDF analysis capabilities with Adobe's technologies.

---

**Built with ❤️ for Adobe India Hackathon 2025** 
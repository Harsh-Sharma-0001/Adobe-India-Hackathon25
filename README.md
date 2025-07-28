# Adobe India Hackathon 2025 - PDF Analysis Webapp

A comprehensive PDF analysis webapp built with React, Node.js, and Adobe PDF Embed API for the Adobe India Hackathon 2025.

## 🚀 Features

### Challenge 1a: PDF Processing & Analysis
- **Advanced PDF Processing**: Extract text, tables, and images from PDFs
- **Multi-format Support**: Handles various PDF structures and layouts
- **Structured Output**: Generates JSON files with extracted content and metadata
- **Batch Processing**: Process multiple PDFs simultaneously
- **Docker Support**: Containerized deployment with Docker

### Challenge 1b: Web Application
- **Beautiful UI**: Modern, intuitive interface built with React and Tailwind CSS
- **Adobe PDF Embed API**: Seamless PDF viewing and interaction
- **Real-time Analysis**: Instant PDF analysis with persona-based content extraction
- **Multi-Collection Support**: Organize and analyze document collections
- **Smart Insights**: AI-powered content ranking and subsection analysis
- **Interactive Viewing**: Embedded PDF viewer with zoom, search, and navigation
- **Easy Upload**: Drag-and-drop file upload with progress tracking

## 🛠️ Tech Stack

### Frontend
- **React.js**: Modern UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Dropzone**: File upload handling
- **React Hot Toast**: User notifications
- **Axios**: HTTP client for API calls

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **Multer**: File upload middleware
- **fs-extra**: Enhanced file system operations
- **UUID**: Unique identifier generation

### PDF Processing
- **PyPDF2**: PDF text extraction
- **pdfplumber**: Advanced PDF parsing
- **PyMuPDF**: High-performance PDF processing
- **Adobe PDF Embed API**: PDF viewing and interaction

## 📁 Project Structure

```
Adobe-India-Hackathon25/
├── Challenge_1a/                 # PDF Processing Solution
│   ├── Dockerfile               # Docker configuration
│   ├── process_pdfs.py          # Main PDF processing script
│   ├── README.md               # Challenge 1a documentation
│   └── sample_dataset/         # Sample PDFs and outputs
│       ├── pdfs/               # Input PDF files
│       ├── outputs/            # Generated JSON outputs
│       └── schema/             # Output schema definition
│
├── Challenge_1b/                # Web Application
│   ├── client/                 # React frontend
│   │   ├── public/            # Static assets
│   │   ├── src/               # React components
│   │   │   ├── components/    # Reusable components
│   │   │   └── pages/         # Page components
│   │   └── package.json       # Frontend dependencies
│   ├── server/                # Node.js backend
│   │   ├── index.js           # Express server
│   │   └── package.json       # Backend dependencies
│   ├── collections/           # Pre-analyzed document collections
│   └── package.json           # Root package.json
│
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Python 3.8+ (for Challenge 1a)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harsh-Sharma-0001/Adobe-India-Hackathon25.git
   cd Adobe-India-Hackathon25
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (Challenge 1b)
   cd Challenge_1b
   npm run install-all
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📖 Usage

### Challenge 1a: PDF Processing
1. Place PDF files in the `sample_dataset/pdfs/` directory
2. Run the processing script:
   ```bash
   cd Challenge_1a
   python process_pdfs.py
   ```
3. Check generated outputs in `sample_dataset/outputs/`

### Challenge 1b: Web Application

#### Upload and Analyze PDFs
1. Navigate to the Analysis page
2. Upload 3-10 PDF files using drag-and-drop
3. Select a persona (Food Contractor, Student, etc.)
4. Enter the job to be done
5. Click "Start Analysis"
6. View results with ranked sections and insights

#### View Collections
1. Go to the Collections page
2. Browse pre-analyzed document collections
3. Click "View Details" for detailed analysis
4. Use "View" to open PDFs in the embedded viewer

#### Features
- **PDF Embedding**: View PDFs directly in the browser
- **Multi-Collection Analysis**: Process multiple document sets
- **Real-time Processing**: Instant analysis results
- **Interactive Viewing**: Zoom, search, and navigate PDFs
- **Easy Upload**: Simple drag-and-drop interface
- **Smart Insights**: AI-powered content ranking

## 🔧 Configuration

### Adobe PDF Embed API
The application uses Adobe's PDF Embed API for PDF viewing. The client ID is configured in:
- Frontend: `client/public/index.html`
- Backend: `server/index.js`

### Environment Variables
Create a `.env` file in the root directory:
```env
ADOBE_CLIENT_ID=your_adobe_client_id
PORT=5000
NODE_ENV=development
```

## 🐳 Docker Deployment

### Challenge 1a
```bash
cd Challenge_1a
docker build -t pdf-processor .
docker run -v $(pwd)/sample_dataset:/app/sample_dataset pdf-processor
```

## 📊 API Endpoints

### Backend API (Challenge 1b)
- `GET /api/config` - Get Adobe Client ID
- `POST /api/analyze` - Upload and analyze PDFs
- `GET /api/collections` - List document collections
- `GET /api/collections/:id/pdfs` - Get PDFs in collection
- `GET /api/pdf/:collectionId/:filename` - Serve PDF files

## 🎯 Key Features

### Analysis Results
- **Metadata Display**: Persona, job, documents, timestamp
- **Ranked Sections**: Document name, page number, section title, rank badge
- **Subsection Insights**: Detailed analysis with key points and relevance scores
- **JSON Download**: Export analysis results

### Performance
- **Fast Processing**: ≤ 60 seconds analysis time
- **CPU Optimized**: Uses only CPU resources
- **Memory Efficient**: ≤ 1GB model usage
- **Real-time Updates**: Live progress tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the Adobe India Hackathon 2025. All rights reserved.

## 👨‍💻 Author

**Harsh Sharma**
- GitHub: [@Harsh-Sharma-0001](https://github.com/Harsh-Sharma-0001)
- Repository: [Adobe-India-Hackathon25](https://github.com/Harsh-Sharma-0001/Adobe-India-Hackathon25)

## 🙏 Acknowledgments

- Adobe for providing the PDF Embed API
- React and Node.js communities for excellent documentation
- Tailwind CSS for the beautiful UI framework
- All contributors and mentors at Adobe India Hackathon 2025

---

**Built with ❤️ for Adobe India Hackathon 2025** 

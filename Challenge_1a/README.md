# PDF Processing Solution

## Overview
This project is a solution for Challenge 1a of the Adobe India Hackathon 2025. It processes PDF files, extracts structured data, and outputs JSON files conforming to a specified schema. The solution is containerized using Docker and meets strict performance and resource constraints.

## Features
- Processes all PDFs in `/app/input` (read-only)
- Outputs JSON files to `/app/output` (one per PDF)
- Output conforms to schema in `sample_dataset/schema/output_schema.json`
- Efficient, CPU-only, no internet access at runtime
- Works on AMD64 architecture

## Directory Structure
```
Challenge_1a/
├── sample_dataset/
│   ├── outputs/         # Example JSON outputs
│   ├── pdfs/            # Input PDF files
│   └── schema/
│       └── output_schema.json
├── Dockerfile           # Docker container configuration
├── process_pdfs.py      # PDF processing script
└── README.md            # This file
```

## Build & Run

### Build Docker Image
```
docker build --platform linux/amd64 -t pdf-processor .
```

### Run Container
```
docker run --rm -v $(pwd)/sample_dataset/pdfs:/app/input:ro -v $(pwd)/sample_dataset/outputs:/app/output --network none pdf-processor
```

## Requirements
- Python 3.10
- Open source libraries only
- No internet access during runtime
- ≤ 10 seconds for 50-page PDF
- ≤ 200MB model size (if any)
- ≤ 16GB RAM, 8 CPUs

## Output Format
Each PDF generates a JSON file named `filename.json` matching the schema in `sample_dataset/schema/output_schema.json`.

## Notes
- The provided script is a template. Implement actual PDF parsing and JSON generation as needed.
- Test with both simple and complex PDFs. 
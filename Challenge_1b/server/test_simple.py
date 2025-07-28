#!/usr/bin/env python3
import sys
import json
from pathlib import Path

def test_simple_pdf_processing():
    """Simple test to see if PDF processing works"""
    print("Starting simple PDF test...")
    
    # Check if we have the required imports
    try:
        from PyPDF2 import PdfReader
        print("✅ PyPDF2 imported successfully")
    except ImportError as e:
        print(f"❌ PyPDF2 import failed: {e}")
        return False
    
    # Check if we can find any PDFs in the current directory
    current_dir = Path(".")
    pdf_files = list(current_dir.glob("*.pdf"))
    
    if not pdf_files:
        print("❌ No PDF files found in current directory")
        return False
    
    print(f"✅ Found {len(pdf_files)} PDF files")
    
    # Try to process the first PDF
    pdf_file = pdf_files[0]
    print(f"Testing with: {pdf_file.name}")
    
    try:
        reader = PdfReader(str(pdf_file))
        print(f"✅ PDF opened successfully. Pages: {len(reader.pages)}")
        
        # Try to extract text from first page
        if len(reader.pages) > 0:
            text = reader.pages[0].extract_text() or ""
            print(f"✅ Text extracted: {len(text)} characters")
            print(f"Sample text: {text[:100]}...")
        else:
            print("❌ No pages found in PDF")
            return False
            
    except Exception as e:
        print(f"❌ Error processing PDF: {e}")
        return False
    
    print("✅ Simple PDF test completed successfully!")
    return True

if __name__ == "__main__":
    success = test_simple_pdf_processing()
    sys.exit(0 if success else 1) 
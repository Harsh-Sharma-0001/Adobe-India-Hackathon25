#!/usr/bin/env python3
"""
Test script to verify PDF analysis functionality
"""

import sys
import os
from pathlib import Path

# Add the server directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

try:
    from process_pdfs_webapp import process_pdfs_webapp
except ImportError as e:
    print(f"Error importing process_pdfs_webapp: {e}")
    sys.exit(1)

def test_analysis():
    """Test the PDF analysis functionality"""
    print("=== Testing PDF Analysis ===\n")
    
    # Create a test session directory
    test_dir = Path("test_session")
    test_dir.mkdir(exist_ok=True)
    
    # Create test input directory
    input_dir = test_dir / "input"
    input_dir.mkdir(exist_ok=True)
    
    # Create test output directory
    output_dir = test_dir / "output"
    output_dir.mkdir(exist_ok=True)
    
    print(f"Test session directory: {test_dir}")
    print(f"Input directory: {input_dir}")
    print(f"Output directory: {output_dir}")
    
    # Check if there are any PDFs in the collections to test with
    collections_dir = Path("collections")
    test_pdfs = []
    
    if collections_dir.exists():
        for collection in collections_dir.iterdir():
            if collection.is_dir():
                pdfs_dir = collection / "PDFs"
                if pdfs_dir.exists():
                    for pdf_file in pdfs_dir.glob("*.pdf"):
                        test_pdfs.append(pdf_file)
                        break  # Just use the first PDF from each collection
    
    if not test_pdfs:
        print("❌ No PDF files found in collections to test with!")
        print("Please add some PDF files to your collections first.")
        return False
    
    # Copy the first PDF to test input directory
    test_pdf = test_pdfs[0]
    test_input_pdf = input_dir / test_pdf.name
    
    print(f"Testing with PDF: {test_pdf.name}")
    
    try:
        import shutil
        shutil.copy2(test_pdf, test_input_pdf)
        print(f"✓ Copied {test_pdf.name} to test directory")
    except Exception as e:
        print(f"✗ Error copying PDF: {e}")
        return False
    
    # Run the analysis
    try:
        print("\nRunning PDF analysis...")
        result = process_pdfs_webapp(str(test_dir))
        
        if result:
            print(f"✓ Analysis completed successfully!")
            print(f"✓ Processed {len(result)} files")
            
            # Check if output files were created
            output_files = list(output_dir.glob("*.json"))
            if output_files:
                print(f"✓ Created {len(output_files)} output files:")
                for output_file in output_files:
                    print(f"  - {output_file.name}")
                
                # Try to read one of the output files
                try:
                    import json
                    with open(output_files[0], 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    print(f"✓ Output file contains: {len(data.get('sections', []))} sections")
                    print(f"✓ Output file contains: {len(data.get('tables', []))} tables")
                    print(f"✓ Output file contains: {len(data.get('images', []))} images")
                except Exception as e:
                    print(f"✗ Error reading output file: {e}")
                    return False
            else:
                print("✗ No output files were created")
                return False
        else:
            print("✗ Analysis failed - no files processed")
            return False
            
    except Exception as e:
        print(f"✗ Error during analysis: {e}")
        return False
    
    # Clean up
    try:
        import shutil
        shutil.rmtree(test_dir)
        print(f"✓ Cleaned up test directory")
    except Exception as e:
        print(f"Warning: Could not clean up test directory: {e}")
    
    print("\n✅ PDF analysis test completed successfully!")
    return True

if __name__ == "__main__":
    success = test_analysis()
    sys.exit(0 if success else 1) 
#!/usr/bin/env python3
"""
Test script to verify Python PDF processing dependencies and functionality
"""

import sys
import os

def test_imports():
    """Test if all required packages can be imported"""
    print("Testing Python imports...")
    
    try:
        import json
        print("✓ json")
    except ImportError as e:
        print(f"✗ json: {e}")
        return False
    
    try:
        from pathlib import Path
        print("✓ pathlib")
    except ImportError as e:
        print(f"✗ pathlib: {e}")
        return False
    
    try:
        from PyPDF2 import PdfReader
        print("✓ PyPDF2")
    except ImportError as e:
        print(f"✗ PyPDF2: {e}")
        return False
    
    try:
        import pdfplumber
        print("✓ pdfplumber")
    except ImportError as e:
        print(f"✗ pdfplumber: {e}")
        return False
    
    try:
        import fitz
        print("✓ PyMuPDF (fitz)")
    except ImportError as e:
        print(f"✗ PyMuPDF: {e}")
        return False
    
    try:
        import re
        print("✓ re")
    except ImportError as e:
        print(f"✗ re: {e}")
        return False
    
    print("All imports successful!")
    return True

def test_python_version():
    """Test Python version"""
    print(f"Python version: {sys.version}")
    if sys.version_info >= (3, 7):
        print("✓ Python version is compatible")
        return True
    else:
        print("✗ Python version too old (need 3.7+)")
        return False

def main():
    print("=== Python PDF Processing Test ===\n")
    
    # Test Python version
    if not test_python_version():
        return False
    
    print()
    
    # Test imports
    if not test_imports():
        print("\n❌ Some required packages are missing!")
        print("Please install missing packages with:")
        print("pip install PyPDF2 pdfplumber PyMuPDF")
        return False
    
    print("\n✅ All tests passed! Python environment is ready for PDF processing.")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 
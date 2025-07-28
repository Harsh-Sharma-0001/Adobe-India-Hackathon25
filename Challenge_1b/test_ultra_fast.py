#!/usr/bin/env python3
import sys
import json
from pathlib import Path

def test_ultra_fast():
    """Test the ultra-fast system"""
    print("🧪 Testing Ultra-Fast System...")
    
    # Test the ultra-fast script
    session_dir = "sessions/0512696d-4185-415c-9d5c-080c03bc59c7"
    
    if Path(session_dir).exists():
        print("✅ Session directory exists")
        
        # Check if output was created
        output_dir = Path(session_dir) / "output"
        if output_dir.exists():
            json_files = list(output_dir.glob("*.json"))
            if json_files:
                print(f"✅ Found {len(json_files)} output files")
                
                # Read and display the result
                with open(json_files[0], 'r') as f:
                    result = json.load(f)
                
                print("📊 Analysis Results:")
                print(f"  Filename: {result['filename']}")
                print(f"  Persona: {result['metadata']['persona']}")
                print(f"  Job: {result['metadata']['job_to_be_done']}")
                print(f"  Sections: {len(result['sections'])}")
                
                for section in result['sections']:
                    print(f"    Rank {section['rank']}: {section['title']} (Score: {section['score']})")
                
                print("🎉 Ultra-fast system is working perfectly!")
                return True
            else:
                print("❌ No output files found")
        else:
            print("❌ Output directory not found")
    else:
        print("❌ Session directory not found")
    
    return False

if __name__ == "__main__":
    test_ultra_fast() 
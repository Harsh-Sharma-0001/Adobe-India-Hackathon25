#!/usr/bin/env python3
import sys
import json
import re
from pathlib import Path
from PyPDF2 import PdfReader

def extract_sections_fast(text):
    """Fast section extraction - simple but effective"""
    sections = []
    lines = text.split('\n')
    current_section = {"title": "Introduction", "content": "", "page": 1}
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Simple heading detection
        if (len(line) < 100 and 
            (line.isupper() or 
             line.startswith(('1.', '2.', '3.', '4.', '5.')) or
             line.endswith(':') or
             line.startswith(('Chapter', 'Section', 'Part')))):
            
            if current_section["content"].strip():
                sections.append(current_section)
            current_section = {"title": line, "content": "", "page": 1}
        else:
            current_section["content"] += line + "\n"
    
    if current_section["content"].strip():
        sections.append(current_section)
    
    return sections

def rank_sections_fast(sections, persona, job_to_be_done):
    """Fast ranking algorithm"""
    if not sections:
        return []
    
    # Simple keyword matching
    keywords = {
        'Travel Planner': ['travel', 'trip', 'destination', 'hotel', 'flight', 'vacation'],
        'Food Contractor': ['menu', 'food', 'catering', 'recipe', 'ingredients', 'breakfast', 'lunch', 'dinner'],
        'Business Analyst': ['business', 'strategy', 'market', 'analysis', 'financial', 'revenue'],
        'Student': ['study', 'education', 'learning', 'course', 'assignment', 'research'],
        'Researcher': ['research', 'study', 'analysis', 'data', 'findings', 'methodology']
    }
    
    persona_keywords = keywords.get(persona, [])
    
    # Score and rank sections
    scored_sections = []
    for section in sections:
        score = 0
        content_lower = section['content'].lower()
        title_lower = section['title'].lower()
        
        # Score based on keywords
        for keyword in persona_keywords:
            if keyword in content_lower:
                score += 2
            if keyword in title_lower:
                score += 3
        
        # Score based on job keywords
        job_words = job_to_be_done.lower().split()
        for word in job_words:
            if len(word) > 3 and word in content_lower:
                score += 1
        
        scored_sections.append({
            **section,
            'score': score,
            'rank': 0
        })
    
    # Sort by score
    scored_sections.sort(key=lambda x: x['score'], reverse=True)
    
    # Assign ranks
    for i, section in enumerate(scored_sections):
        section['rank'] = i + 1
    
    return scored_sections

def analyze_subsections_fast(section_content, persona, job_to_be_done):
    """Fast subsection analysis"""
    paragraphs = [p.strip() for p in section_content.split('\n\n') if p.strip() and len(p.strip()) > 50]
    
    insights = []
    for i, paragraph in enumerate(paragraphs[:3]):  # Only first 3 paragraphs
        sentences = paragraph.split('. ')
        key_points = [s.strip() for s in sentences[:2] if len(s.strip()) > 20]
        
        insight = {
            'paragraph': i + 1,
            'content': paragraph[:150] + '...' if len(paragraph) > 150 else paragraph,
            'key_points': key_points,
            'relevance_score': 0
        }
        
        # Simple relevance scoring
        content_lower = paragraph.lower()
        score = 0
        keywords = ['food', 'travel', 'business', 'study', 'research']
        for keyword in keywords:
            if keyword in content_lower:
                score += 1
        
        insight['relevance_score'] = score
        insights.append(insight)
    
    return insights

def process_pdfs_fast(session_dir):
    """Fast PDF processing - optimized for speed"""
    print("Starting fast PDF processing...")
    
    session_path = Path(session_dir)
    
    # Find input directory
    input_dir = None
    for dir_path in [session_path / "input", session_path / "pdfs", session_path]:
        if dir_path.exists() and any(dir_path.glob("*.pdf")):
            input_dir = dir_path
            break
    
    if not input_dir:
        print("No PDF files found")
        return []
    
    # Create output directory
    output_dir = session_path / "output"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Processing from: {input_dir}")
    
    # Get persona and job from input.json
    persona = "Food Contractor"
    job_to_be_done = "Analyze document"
    
    input_file = session_path / "input.json"
    if input_file.exists():
        try:
            with open(input_file, 'r') as f:
                data = json.load(f)
                # Handle persona as string or dict
                persona_data = data.get('persona', persona)
                if isinstance(persona_data, dict):
                    persona = persona_data.get('role', 'Food Contractor')
                else:
                    persona = persona_data
                job_to_be_done = data.get('jobToBeDone', job_to_be_done)
        except Exception as e:
            print(f"Error reading input.json: {e}")
            persona = "Food Contractor"
            job_to_be_done = "Analyze document"
    
    print(f"Persona: {persona}")
    print(f"Job: {job_to_be_done}")
    
    results = []
    
    # Process each PDF
    for pdf_file in input_dir.glob("*.pdf"):
        print(f"Processing: {pdf_file.name}")
        
        try:
            # Extract text (only first 5 pages for speed)
            reader = PdfReader(str(pdf_file))
            pages_to_process = min(len(reader.pages), 5)
            
            text_parts = []
            for j in range(pages_to_process):
                try:
                    page_text = reader.pages[j].extract_text() or ""
                    text_parts.append(page_text)
                except:
                    continue
            
            text = "\n".join(text_parts)
            
            # Extract sections
            sections = extract_sections_fast(text)
            print(f"Found {len(sections)} sections")
            
            # Rank sections
            ranked_sections = rank_sections_fast(sections, persona, job_to_be_done)
            print(f"Ranked {len(ranked_sections)} sections")
            
            # Add subsection analysis
            for section in ranked_sections:
                section['subsection_analysis'] = analyze_subsections_fast(section['content'], persona, job_to_be_done)
            
            # Build result
            result = {
                "filename": pdf_file.name,
                "content": text[:5000],  # Limit content
                "sections": ranked_sections,
                "tables": [],  # Skip tables for speed
                "images": [],  # Skip images for speed
                "metadata": {
                    "persona": persona,
                    "job_to_be_done": job_to_be_done,
                    "total_sections": len(ranked_sections),
                    "processing_time": "fast_completed"
                }
            }
            
            # Save to output
            output_file = output_dir / f"{pdf_file.stem}.json"
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            
            results.append(result)
            print(f"Completed: {pdf_file.name}")
            
        except Exception as e:
            print(f"Error processing {pdf_file.name}: {e}")
            continue
    
    print(f"Processing complete. {len(results)} files processed.")
    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python process_pdfs_webapp_fast.py <session_directory>")
        sys.exit(1)
    
    session_dir = sys.argv[1]
    process_pdfs_fast(session_dir) 
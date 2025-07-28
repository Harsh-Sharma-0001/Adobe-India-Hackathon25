import json
import sys
from pathlib import Path
from PyPDF2 import PdfReader
import pdfplumber
import fitz  # PyMuPDF
import re
import os

def extract_sections(text):
    """Extract sections from text with better heuristics"""
    lines = text.split('\n')
    sections = []
    current_section = []
    current_title = "Introduction"
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check if line looks like a heading
        is_heading = (
            line.isupper() or 
            line.startswith(('1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.')) or
            line.startswith(('I.', 'II.', 'III.', 'IV.', 'V.', 'VI.', 'VII.', 'VIII.', 'IX.', 'X.')) or
            (len(line) < 100 and line.endswith(':')) or
            (len(line) < 80 and line.isupper()) or
            line.startswith(('Chapter', 'Section', 'Part', 'Introduction', 'Conclusion', 'Summary'))
        )
        
        if is_heading:
            if current_section:
                sections.append({
                    'title': current_title,
                    'content': '\n'.join(current_section),
                    'page': 1  # We'll update this later
                })
            current_title = line
            current_section = [line]
        else:
            current_section.append(line)
    
    if current_section:
        sections.append({
            'title': current_title,
            'content': '\n'.join(current_section),
            'page': 1
        })
    
    return sections

def rank_sections(sections, persona, job_to_be_done):
    """Rank sections based on relevance to persona and job"""
    if not sections:
        return []
    
    # Keywords for different personas
    persona_keywords = {
        'Travel Planner': ['travel', 'trip', 'destination', 'hotel', 'flight', 'booking', 'itinerary', 'tourist', 'vacation', 'holiday'],
        'Food Contractor': ['menu', 'food', 'catering', 'recipe', 'ingredients', 'cooking', 'meal', 'breakfast', 'lunch', 'dinner', 'restaurant'],
        'Business Analyst': ['business', 'strategy', 'market', 'analysis', 'financial', 'revenue', 'profit', 'growth', 'competition', 'industry'],
        'Student': ['study', 'education', 'learning', 'course', 'assignment', 'research', 'academic', 'university', 'college', 'school'],
        'Researcher': ['research', 'study', 'analysis', 'data', 'findings', 'methodology', 'results', 'conclusion', 'experiment', 'survey']
    }
    
    # Get keywords for the persona
    keywords = persona_keywords.get(persona, [])
    
    # Score each section
    scored_sections = []
    for i, section in enumerate(sections):
        score = 0
        content_lower = section['content'].lower()
        title_lower = section['title'].lower()
        
        # Score based on keywords in content
        for keyword in keywords:
            if keyword in content_lower:
                score += 2
            if keyword in title_lower:
                score += 3
        
        # Score based on job keywords
        job_words = job_to_be_done.lower().split()
        for word in job_words:
            if len(word) > 3 and word in content_lower:
                score += 1
        
        # Bonus for longer, more detailed sections
        if len(section['content']) > 200:
            score += 1
        
        scored_sections.append({
            **section,
            'score': score,
            'rank': 0  # Will be set after sorting
        })
    
    # Sort by score (highest first)
    scored_sections.sort(key=lambda x: x['score'], reverse=True)
    
    # Assign ranks
    for i, section in enumerate(scored_sections):
        section['rank'] = i + 1
    
    return scored_sections

def analyze_subsections(section_content, persona, job_to_be_done):
    """Analyze subsections within a section"""
    # Split content into paragraphs
    paragraphs = [p.strip() for p in section_content.split('\n\n') if p.strip()]
    
    insights = []
    for i, paragraph in enumerate(paragraphs[:5]):  # Limit to first 5 paragraphs
        if len(paragraph) < 50:  # Skip very short paragraphs
            continue
            
        # Simple insight generation based on content
        insight = {
            'paragraph': i + 1,
            'content': paragraph[:200] + '...' if len(paragraph) > 200 else paragraph,
            'key_points': [],
            'relevance_score': 0
        }
        
        # Extract key points (simple approach)
        sentences = paragraph.split('. ')
        key_points = []
        for sentence in sentences[:3]:  # Take first 3 sentences as key points
            if len(sentence) > 20:
                key_points.append(sentence.strip())
        
        insight['key_points'] = key_points
        
        # Calculate relevance score
        content_lower = paragraph.lower()
        score = 0
        
        # Score based on persona keywords
        persona_keywords = {
            'Travel Planner': ['travel', 'trip', 'destination', 'hotel', 'flight'],
            'Food Contractor': ['menu', 'food', 'catering', 'recipe', 'ingredients'],
            'Business Analyst': ['business', 'strategy', 'market', 'analysis', 'financial'],
            'Student': ['study', 'education', 'learning', 'course', 'assignment'],
            'Researcher': ['research', 'study', 'analysis', 'data', 'findings']
        }
        
        keywords = persona_keywords.get(persona, [])
        for keyword in keywords:
            if keyword in content_lower:
                score += 1
        
        insight['relevance_score'] = score
        insights.append(insight)
    
    return insights

def extract_tables(pdf_path):
    tables = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                page_tables = page.extract_tables()
                for table in page_tables:
                    tables.append({"page": i+1, "data": table})
    except Exception as e:
        print(f"Error extracting tables from {pdf_path}: {e}")
    return tables

def extract_images(pdf_path, output_dir):
    images = []
    try:
        doc = fitz.open(pdf_path)
        images_dir = output_dir / "images"
        images_dir.mkdir(parents=True, exist_ok=True)
        for page_num in range(len(doc)):
            page = doc[page_num]
            for img_index, img in enumerate(page.get_images(full=True)):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                ext = base_image["ext"]
                image_filename = f"page{page_num+1}_img{img_index+1}.{ext}"
                image_path = images_dir / image_filename
                with open(image_path, "wb") as img_file:
                    img_file.write(image_bytes)
                images.append({"page": page_num+1, "image_file": f"images/{image_filename}"})
    except Exception as e:
        print(f"Error extracting images from {pdf_path}: {e}")
    return images

def process_pdfs_webapp(session_dir):
    """Process PDFs for webapp with flexible directory structure"""
    session_path = Path(session_dir)
    
    # Look for input directory in various possible locations
    input_dir = None
    possible_input_dirs = [
        session_path / "input",
        session_path / "pdfs",
        session_path
    ]
    
    for dir_path in possible_input_dirs:
        if dir_path.exists() and any(dir_path.glob("*.pdf")):
            input_dir = dir_path
            break
    
    if not input_dir:
        print(f"No PDF files found in session directory: {session_dir}")
        return
    
    # Create output directory
    output_dir = session_path / "output"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Processing PDFs from: {input_dir}")
    print(f"Output directory: {output_dir}")
    
    processed_files = []
    
    pdf_files = list(input_dir.glob("*.pdf"))
    total_files = len(pdf_files)
    
    for i, pdf_file in enumerate(pdf_files):
        print(f"Processing: {pdf_file.name} ({i+1}/{total_files})")
        
        try:
            # Extract text (limit to first 10 pages for performance)
            print(f"  Reading PDF: {pdf_file.name}")
            reader = PdfReader(str(pdf_file))
            pages_to_process = min(len(reader.pages), 10)  # Limit to first 10 pages
            print(f"  Total pages: {len(reader.pages)}, Processing: {pages_to_process}")
            
            text_parts = []
            for j in range(pages_to_process):
                try:
                    print(f"    Reading page {j+1}/{pages_to_process}")
                    page_text = reader.pages[j].extract_text() or ""
                    text_parts.append(page_text)
                except Exception as e:
                    print(f"    Error reading page {j+1}: {e}")
            text = "\n".join(text_parts)
            print(f"  Text extracted: {len(text)} characters")
        except Exception as e:
            print(f"Error reading PDF {pdf_file.name}: {e}")
            text = f"Error reading PDF: {e}"
        
        # Extract sections
        print(f"  Extracting sections...")
        sections = extract_sections(text)
        print(f"  Sections found: {len(sections)}")
        
        # Get persona and job from session metadata (if available)
        persona = "Food Contractor"  # Default
        job_to_be_done = "Analyze document content"  # Default
        
        # Try to read input.json for persona and job info
        input_file = session_path / "input.json"
        if input_file.exists():
            try:
                with open(input_file, 'r') as f:
                    input_data = json.load(f)
                    persona = input_data.get('persona', persona)
                    job_to_be_done = input_data.get('jobToBeDone', job_to_be_done)
                print(f"  Using persona: {persona}")
                print(f"  Using job: {job_to_be_done}")
            except Exception as e:
                print(f"  Error reading input.json: {e}")
        
        # Rank sections based on persona and job
        print(f"  Ranking sections...")
        ranked_sections = rank_sections(sections, persona, job_to_be_done)
        print(f"  Ranked {len(ranked_sections)} sections")
        
        # Analyze subsections for each ranked section
        print(f"  Analyzing subsections...")
        for section in ranked_sections:
            section['subsection_analysis'] = analyze_subsections(section['content'], persona, job_to_be_done)
        
        # Extract tables
        print(f"  Extracting tables...")
        tables = extract_tables(str(pdf_file))
        print(f"  Tables found: {len(tables)}")
        
        # Extract images
        print(f"  Extracting images...")
        images = extract_images(str(pdf_file), output_dir)
        print(f"  Images found: {len(images)}")
        
        # Build output
        data = {
            "filename": pdf_file.name,
            "content": text[:10000],  # Limit content size
            "sections": ranked_sections,
            "tables": tables,
            "images": images,
            "metadata": {
                "persona": persona,
                "job_to_be_done": job_to_be_done,
                "total_sections": len(ranked_sections),
                "processing_time": "completed"
            }
        }
        
        # Save to output directory
        output_file = output_dir / f"{pdf_file.stem}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        processed_files.append(pdf_file.name)
        print(f"Completed: {pdf_file.name} -> {output_file}")
    
    print(f"Processing complete. {len(processed_files)} files processed.")
    return processed_files

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python process_pdfs_webapp.py <session_directory>")
        sys.exit(1)
    
    session_dir = sys.argv[1]
    process_pdfs_webapp(session_dir) 
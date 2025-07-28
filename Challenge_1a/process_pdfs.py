import json
from pathlib import Path
from PyPDF2 import PdfReader
import pdfplumber
import fitz  # PyMuPDF
import re
import os

def extract_sections(text):
    # Simple heuristic: split by headings (e.g., lines in ALL CAPS or starting with numbers)
    sections = []
    current = {"title": "Introduction", "text": ""}
    for line in text.splitlines():
        if re.match(r"^(\d+\.|[A-Z][A-Z\s]+)$", line.strip()):
            if current["text"].strip():
                sections.append(current)
            current = {"title": line.strip(), "text": ""}
        else:
            current["text"] += line + "\n"
    if current["text"].strip():
        sections.append(current)
    return sections

def extract_tables(pdf_path):
    tables = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            page_tables = page.extract_tables()
            for table in page_tables:
                tables.append({"page": i+1, "data": table})
    return tables

def extract_images(pdf_path, output_dir):
    images = []
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
    return images

def process_pdfs():
    input_dir = Path("/app/input")
    output_dir = Path("/app/output")
    output_dir.mkdir(parents=True, exist_ok=True)

    for pdf_file in input_dir.glob("*.pdf"):
        # Extract text
        try:
            reader = PdfReader(str(pdf_file))
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception as e:
            text = f"Error reading PDF: {e}"
        # Extract sections
        sections = extract_sections(text)
        # Extract tables
        try:
            tables = extract_tables(str(pdf_file))
        except Exception as e:
            tables = []
        # Extract images
        try:
            images = extract_images(str(pdf_file), output_dir)
        except Exception as e:
            images = []
        # Build output
        data = {
            "filename": pdf_file.name,
            "content": text[:10000],
            "sections": sections,
            "tables": tables,
            "images": images
        }
        output_file = output_dir / f"{pdf_file.stem}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    process_pdfs() 
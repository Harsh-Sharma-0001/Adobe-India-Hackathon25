FROM python:3.10
WORKDIR /app
COPY process_pdfs.py .
RUN pip install --no-cache-dir PyPDF2 pdfplumber pymupdf
CMD ["python", "process_pdfs.py"] 
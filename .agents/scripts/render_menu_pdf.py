import fitz
import os

pdf_path = "attached_assets/menu_plazhi_1784230918459.pdf"
output_dir = ".agents/outputs/menu_plazhi"
os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Pages: {doc.page_count}")
print(f"Metadata: {doc.metadata}")

for i in range(doc.page_count):
    page = doc[i]
    print(f"Page {i+1} size: {page.rect}")
    pix = page.get_pixmap(matrix=fitz.Matrix(3, 3))  # 216 DPI for good quality
    out_path = f"{output_dir}/page_{i+1:02d}.png"
    pix.save(out_path)
    print(f"Saved: {out_path} ({pix.width}x{pix.height})")

doc.close()
print("Done")

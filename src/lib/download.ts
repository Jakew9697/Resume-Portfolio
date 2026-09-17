'use client';
export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export async function exportPdf(title: string, subtitle: string, body: string, filename: string) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const clean = (s: string) => s.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\u2022/g, '-').replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '');
  let page = pdf.addPage([612, 792]); let y = 730;
  const nextPage = () => { page = pdf.addPage([612, 792]); y = 730; };
  const draw = (text: string, size = 11, heavy = false) => {
    const face = heavy ? bold : font;
    const print = (line: string) => {
      if (y < 65) nextPage();
      page.drawText(line, { x: 56, y, size, font: face, color: rgb(.12,.16,.23) });
      y -= size * 1.5;
    };
    let line = '';
    for (const word of clean(text).split(/\s+/)) {
      if (line && face.widthOfTextAtSize(line + ' ' + word, size) <= 490) { line += ' ' + word; continue; }
      if (line) { print(line); line = ''; }
      for (const char of word) {
        if (face.widthOfTextAtSize(line + char, size) > 490) { print(line); line = ''; }
        line += char;
      }
    }
    if (line) print(line);
  };
  draw(title, 25, true); y -= 8; draw(subtitle, 11);
  y -= 16;
  page.drawLine({ start: { x: 56, y }, end: { x: 546, y }, thickness: 1, color: rgb(.85,.88,.92) });
  y -= 26;
  const paragraphs = body.split('\n');
  for (let i = 0; i < paragraphs.length; i++) {
    const raw = paragraphs[i].trim();
    if (!raw) { y -= 7; continue; }
    const text = raw.replace(/^#{1,6}\s+/, '');
    if (i === 0 && text.toLowerCase().includes(title.toLowerCase())) continue;
    const heading = /^#{1,6}\s/.test(raw) || (text.length < 65 && !/[.!?:]$/.test(text) && paragraphs[i + 1] === '');
    if (heading && y < 120) nextPage();
    draw(text, heading ? 13 : 11, heading);
    y -= heading ? 5 : 3;
  }
  for (const [i, p] of pdf.getPages().entries()) {
    p.drawText('Jake Worsham | Portfolio demonstration', { x: 56, y: 30, size: 8, font, color: rgb(.45,.48,.53) });
    p.drawText(String(i + 1) + ' / ' + pdf.getPageCount(), { x: 520, y: 30, size: 8, font, color: rgb(.45,.48,.53) });
  }
  pdf.setTitle(title); pdf.setAuthor('Jake Worsham');
  download(new Blob([new Uint8Array(await pdf.save())], { type: 'application/pdf' }), filename);
}
export async function readDocument(file: File) {
  if (file.size > 5000000) throw new Error('Choose a document smaller than 5 MB.');
  let text: string;
  if (file.name.toLowerCase().endsWith('.pdf')) {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
    const pdf = await task.promise;
    if (pdf.numPages > 20) { await task.destroy(); throw new Error('Choose a PDF with 20 pages or fewer.'); }
    const pages: string[] = [];
    try { for (let i = 1; i <= pdf.numPages; i++) { const page = await pdf.getPage(i); const content = await page.getTextContent(); pages.push(content.items.map(item => 'str' in item ? item.str : '').join(' ')); } }
    finally { await task.destroy(); }
    text = pages.join('\n');
  } else if (/\.(txt|md)$/i.test(file.name)) text = await file.text();
  else throw new Error('Choose a PDF, TXT, or Markdown file.');
  if (!text.trim()) throw new Error('No readable text found. Use a text-based PDF or a TXT file.');
  if (text.length > 24000) throw new Error('This document is too long for the demo. Use an excerpt under 24,000 characters.');
  return { name: file.name, text };
}

import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ContractManagementPlan } from '../types';

export async function generateWordDocument(cmp: ContractManagementPlan): Promise<void> {
  const children: Paragraph[] = [];
  
  // Title page
  children.push(
    new Paragraph({ text: '', spacing: { before: 2000 } }),
    new Paragraph({
      text: 'CONTRACT MANAGEMENT PLAN',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({
      text: cmp.contractName,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      text: `Version ${cmp.version} | Generated ${new Date(cmp.createdAt).toLocaleDateString('en-GB')}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      text: 'Compliant with Procurement Act 2023 (PA23) & Government Commercial Function (GCF) Guidelines',
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 }
    }),
    new Paragraph({
      text: 'CLASSIFICATION: OFFICIAL',
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({ text: '', spacing: { before: 1000 } }),
    new Paragraph({
      text: 'This document is generated in accordance with the Procurement Act 2023 and aligns with the Government Commercial Function standards for contract management.',
      spacing: { after: 200 }
    }),
  );

  // Table of Contents
  children.push(
    new Paragraph({ text: '', spacing: { before: 400 } }),
    new Paragraph({
      text: 'TABLE OF CONTENTS',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 }
    })
  );

  cmp.sections.forEach((section, index) => {
    children.push(
      new Paragraph({
        text: `${index + 1}. ${section.title}`,
        spacing: { after: 100 }
      })
    );
  });

  // Sections
  cmp.sections.forEach((section) => {
    children.push(
      new Paragraph({ text: '', spacing: { before: 400 } }),
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    );

    if (section.pa23Reference) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'PA23 Reference: ', bold: true, italics: true }),
            new TextRun({ text: section.pa23Reference, italics: true, color: '666666' })
          ],
          spacing: { after: 100 }
        })
      );
    }

    if (section.gcfAlignment) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'GCF Alignment: ', bold: true, italics: true }),
            new TextRun({ text: section.gcfAlignment, italics: true, color: '666666' })
          ],
          spacing: { after: 200 }
        })
      );
    }

    // Parse content into paragraphs
    const contentParagraphs = section.content.split('\n').filter(p => p.trim());
    contentParagraphs.forEach(para => {
      if (para.startsWith('• ') || para.startsWith('- ')) {
        children.push(
          new Paragraph({
            text: para.substring(2),
            bullet: { level: 0 },
            spacing: { after: 50 }
          })
        );
      } else if (para.startsWith('## ')) {
        children.push(
          new Paragraph({
            text: para.substring(3),
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 }
          })
        );
      } else if (para.startsWith('### ')) {
        children.push(
          new Paragraph({
            text: para.substring(4),
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 }
          })
        );
      } else {
        children.push(
          new Paragraph({
            text: para,
            spacing: { after: 100 }
          })
        );
      }
    });
  });

  // Document control section
  children.push(
    new Paragraph({ text: '', spacing: { before: 600 } }),
    new Paragraph({
      text: 'DOCUMENT CONTROL',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 }
    }),
    new Paragraph({
      text: `Version: ${cmp.version}`,
      spacing: { after: 50 }
    }),
    new Paragraph({
      text: `Created: ${new Date(cmp.createdAt).toLocaleDateString('en-GB')}`,
      spacing: { after: 50 }
    }),
    new Paragraph({
      text: `Last Updated: ${new Date(cmp.updatedAt).toLocaleDateString('en-GB')}`,
      spacing: { after: 50 }
    }),
    new Paragraph({
      text: `Status: ${cmp.status.toUpperCase()}`,
      spacing: { after: 200 }
    }),
    new Paragraph({
      text: 'CLASSIFICATION: OFFICIAL',
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 }
    })
  );

  const doc = new Document({
    creator: 'CMP Generator',
    title: `Contract Management Plan - ${cmp.contractName}`,
    description: 'PA23 & GCF Compliant Contract Management Plan',
    sections: [{
      properties: {},
      children
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `CMP_${cmp.contractName.replace(/\s+/g, '_')}_v${cmp.version}.docx`);
}

export function generateHTML(cmp: ContractManagementPlan): string {
  const sectionsHTML = cmp.sections.map((section, index) => `
    <section id="section-${index + 1}" class="cmp-section">
      <h2>${section.title}</h2>
      ${section.pa23Reference ? `<p class="reference"><strong>PA23 Reference:</strong> <em>${section.pa23Reference}</em></p>` : ''}
      ${section.gcfAlignment ? `<p class="reference"><strong>GCF Alignment:</strong> <em>${section.gcfAlignment}</em></p>` : ''}
      <div class="content">${formatContentToHTML(section.content)}</div>
    </section>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contract Management Plan - ${cmp.contractName}</title>
  <meta name="classification" content="OFFICIAL">
  <style>
    :root {
      --govuk-blue: #1d70b8;
      --govuk-dark: #0b0c0c;
      --govuk-grey: #505a5f;
      --govuk-light-grey: #f3f2f1;
      --govuk-border: #b1b4b6;
      --govuk-green: #00703c;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "GDS Transport", Arial, sans-serif;
      color: var(--govuk-dark);
      line-height: 1.6;
      max-width: 960px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
    }
    .header {
      border-bottom: 4px solid var(--govuk-blue);
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
    .header h1 { font-size: 2rem; color: var(--govuk-dark); }
    .header .subtitle { color: var(--govuk-grey); font-size: 1.1rem; }
    .classification {
      background: var(--govuk-light-grey);
      padding: 0.5rem 1rem;
      text-align: center;
      font-weight: bold;
      border: 1px solid var(--govuk-border);
      margin-bottom: 2rem;
    }
    .toc {
      background: var(--govuk-light-grey);
      padding: 1.5rem;
      margin-bottom: 2rem;
      border-left: 4px solid var(--govuk-blue);
    }
    .toc h2 { margin-bottom: 1rem; }
    .toc ol { padding-left: 1.5rem; }
    .toc li { margin-bottom: 0.5rem; }
    .cmp-section {
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--govuk-border);
    }
    .cmp-section h2 {
      color: var(--govuk-blue);
      font-size: 1.5rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--govuk-blue);
    }
    .reference {
      font-size: 0.9rem;
      color: var(--govuk-grey);
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      background: #f0f7ff;
      border-left: 3px solid var(--govuk-blue);
    }
    .content p { margin-bottom: 0.75rem; }
    .content ul, .content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
    .content li { margin-bottom: 0.5rem; }
    .content h3 { margin: 1.5rem 0 0.75rem; color: var(--govuk-dark); }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    th, td {
      border: 1px solid var(--govuk-border);
      padding: 0.75rem;
      text-align: left;
    }
    th { background: var(--govuk-light-grey); font-weight: bold; }
    .footer {
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 2px solid var(--govuk-blue);
      text-align: center;
      color: var(--govuk-grey);
      font-size: 0.9rem;
    }
    @media print {
      body { padding: 0; }
      .cmp-section { page-break-inside: avoid; }
    }
    /* SharePoint compatible metadata */
    meta[name="sharepoint-approval"] { content: "pending"; }
  </style>
</head>
<body>
  <div class="classification">CLASSIFICATION: OFFICIAL</div>
  
  <div class="header">
    <h1>Contract Management Plan</h1>
    <p class="subtitle">${cmp.contractName}</p>
    <p class="subtitle">Version ${cmp.version} | Generated ${new Date(cmp.createdAt).toLocaleDateString('en-GB')}</p>
    <p class="subtitle">Procurement Act 2023 & GCF Compliant</p>
  </div>

  <div class="toc">
    <h2>Table of Contents</h2>
    <ol>
      ${cmp.sections.map((s, i) => `<li><a href="#section-${i + 1}">${s.title}</a></li>`).join('\n      ')}
    </ol>
  </div>

  ${sectionsHTML}

  <div class="footer">
    <p><strong>Document Control</strong></p>
    <p>Version: ${cmp.version} | Created: ${new Date(cmp.createdAt).toLocaleDateString('en-GB')} | Last Updated: ${new Date(cmp.updatedAt).toLocaleDateString('en-GB')}</p>
    <p>Status: ${cmp.status.toUpperCase()}</p>
    <p class="classification" style="margin-top: 1rem;">CLASSIFICATION: OFFICIAL</p>
    <p style="margin-top: 1rem;">Generated by CMP Generator | PA23 & GCF Compliant</p>
    <!-- SharePoint compatible: This HTML can be imported directly into SharePoint pages -->
    <!-- Metadata: contract-name="${cmp.contractName}" version="${cmp.version}" status="${cmp.status}" -->
  </div>
</body>
</html>`;
}

function formatContentToHTML(content: string): string {
  const lines = content.split('\n').filter(l => l.trim());
  let html = '';
  let inList = false;

  lines.forEach(line => {
    if (line.startsWith('• ') || line.startsWith('- ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${line.substring(2)}</li>`;
    } else if (line.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3>${line.substring(4)}</h3>`;
    } else if (line.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3>${line.substring(3)}</h3>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p>${line}</p>`;
    }
  });

  if (inList) html += '</ul>';
  return html;
}

export function downloadHTML(cmp: ContractManagementPlan): void {
  const html = generateHTML(cmp);
  const blob = new Blob([html], { type: 'text/html' });
  saveAs(blob, `CMP_${cmp.contractName.replace(/\s+/g, '_')}_v${cmp.version}.html`);
}

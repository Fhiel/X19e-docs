const fs = require('fs');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Starte PDF-Generierung...');
        
        // 1. Alle HTML-Dateien in der exakten Reihenfolge einlesen
        const files = [
            'site/index.html',
            'site/kurzbeschreibung/index.html',
            'site/funktionssicherheit/index.html',
            'site/elektrische_sicherheit/index.html',
            'site/sicherheit_des_energiespeichers/index.html',
            'site/umweltschutz_und_vertraeglichkeit/index.html',
            'site/umfassender_personenschutz/index.html'
        ];

        let combinedHtml = '';

        files.forEach((f, idx) => {
            if (!fs.existsSync(f)) {
                console.warn(`Warnung: Datei ${f} wurde nicht gefunden.`);
                return;
            }
            const fileContent = fs.readFileSync(f, 'utf8');
            const $ = cheerio.load(fileContent);
            const content = $('article').html();
            
            if (idx === 0) {
                // Deckblatt kriegt eine eigene Klasse
                combinedHtml += `<div class="cover">${content}</div><div class="page-break"></div>`;
            } else {
                combinedHtml += `<section class="chapter">${content}</section><div class="page-break"></div>`;
            }
        });

        // 2. Temporäres Druckdokument erzeugen und CSS verlinken
        const finalDocument = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <link rel="stylesheet" href="file://${process.cwd()}/site/stylesheets/custom.css">
        </head>
        <body>
            ${combinedHtml}
        </body>
        </html>`;
        
        fs.writeFileSync('site/print_preview.html', finalDocument);

        // 3. Headless Chrome starten
        const browser = await puppeteer.launch({ 
            headless: true, 
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();
        
        // Seite laden
        await page.goto('file://' + process.cwd() + '/site/print_preview.html', { waitUntil: 'networkidle0' });
        
        // 4. Inhaltsverzeichnis dynamisch aufbauen (Sammelt h1-Überschriften und misst deren Seiten-Position)
        const tocEntries = await page.evaluate(() => {
            const headings = Array.from(document.querySelectorAll('section.chapter h1'));
            return headings.map(h => {
                // Berechne die ungefähre Seite basierend auf der vertikalen Position (A4 Höhe ca. 1122px)
                const pageNum = Math.ceil((h.getBoundingClientRect().top + window.scrollY) / 1122) + 1;
                return {
                    title: h.innerText.replace(/[\n\r]/g, '').trim(),
                    page: pageNum
                };
            });
        });

        // Inhaltsverzeichnis-HTML bauen
        let tocContent = `
        <div id="pdf-toc" style="page-break-before: always; page-break-after: always; width: 100%;">
            <h1 style="page-break-before: avoid !important;">Inhaltsverzeichnis</h1>
            <br><br>
            <div style="display: flex; flex-direction: column; gap: 12px; font-family: 'Montserrat', sans-serif; font-size: 12pt;">
        `;
        
        tocEntries.forEach(entry => {
            tocContent += `
                <div class="print-toc-item" style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <span class="print-toc-title" style="font-weight: bold; background: white; padding-right: 5px; z-index: 2;">${entry.title}</span>
                    <span style="flex-grow: 1; border-bottom: 2px dotted #888888; margin: 0 10px; position: relative; top: -4px; z-index: 1;"></span>
                    <span class="print-toc-page" style="font-weight: bold; background: white; padding-left: 5px; z-index: 2;">${entry.page}</span>
                </div>`;
        });
        tocContent += `</div></div>`;

        // Inhaltsverzeichnis direkt nach dem Deckblatt in das Dokument einschleusen
        let completeHtmlWithToc = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <link rel="stylesheet" href="file://${process.cwd()}/site/stylesheets/custom.css">
        </head>
        <body>
            <div class="cover">${cheerio.load(fs.readFileSync(files[0], 'utf8'))('article').html()}</div>
            <div class="page-break"></div>
            ${tocContent}
            ${combinedHtml.replace(/<div class="cover">[\s\S]*?<\/div><div class="page-break"><\/div>/, '')}
        </body>
        </html>`;

        fs.writeFileSync('site/print_preview_final.html', completeHtmlWithToc);
        await page.goto('file://' + process.cwd() + '/site/print_preview_final.html', { waitUntil: 'networkidle0' });

        // 5. Native Print-Execution via Chrome Treiberschicht
        fs.mkdirSync('site/downloads', { recursive: true });
        await page.pdf({
            path: 'site/downloads/X19e_Technische_Dokumentation.pdf',
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: '<div></div>',
            footerTemplate: `
                <div style="font-size: 9pt; font-family: 'Montserrat', sans-serif; width: 100%; text-align: right; padding-right: 20mm; color: #888888;">
                    <span class="pageNumber"></span>
                </div>`,
            margin: { top: '25mm', bottom: '25mm', left: '20mm', right: '20mm' }
        });

        await browser.close();
        console.log('PDF erfolgreich mit echtem Inhaltsverzeichnis und Seitenzahlen generiert!');
    } catch (error) {
        console.error('Fehler bei der PDF-Erstellung:', error);
        process.exit(1);
    }
})();
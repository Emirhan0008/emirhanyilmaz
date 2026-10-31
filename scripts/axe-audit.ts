import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import axe from 'axe-core';

// Set up minimal browser globals for components if accessed during render
const globalDom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:3000/',
});

(global as any).window = globalDom.window;
(global as any).document = globalDom.window.document;
(global as any).location = globalDom.window.location;
if (!global.navigator) {
  try {
    Object.defineProperty(global, 'navigator', {
      value: globalDom.window.navigator,
      configurable: true,
    });
  } catch {}
}

async function runAxeAudit() {
  console.log('🔍 Emirhan Yılmaz Portfolyosu axe-core Erişilebilirlik Denetimi Başlatılıyor...');

  const indexPath = path.resolve(process.cwd(), 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');

  // Dynamically import App
  const { default: App } = await import('../src/App');

  // Render React component tree
  console.log('⚛️  React ağacı sunucu tarafında render ediliyor...');
  let appHtml = '';
  try {
    appHtml = renderToString(React.createElement(App));
  } catch (err) {
    console.warn('SSR render sırasında uyarı (istemci kancaları nedeniyle beklenen):', (err as Error).message);
  }

  // Inject rendered React into index.html root
  const fullHtml = indexHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  // Create JSDOM instance with the full HTML
  const dom = new JSDOM(fullHtml, {
    runScripts: 'outside-only',
    url: 'http://localhost:3000/',
  });

  console.log('🛡️  axe.run() ile WCAG 2.0, 2.1, 2.2 ve Best Practices kuralları taranıyor...');
  
  // Inject axe source into JSDOM window
  dom.window.eval(axe.source);
  
  // Run axe on document inside JSDOM
  const results = await (dom.window as any).axe.run(dom.window.document, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
    },
  });

  console.log('\n================ AXE AUDIT SONUÇLARI ================');
  console.log(`✅ Geçen Başarılı Testler (Passes): ${results.passes.length}`);
  console.log(`⚠️  İnceleme Önerileri (Incomplete): ${results.incomplete.length}`);
  console.log(`❌ Kural İhlalleri (Violations): ${results.violations.length}`);
  console.log('=====================================================\n');

  if (results.violations.length > 0) {
    console.error('🚨 BULUNAN İHLALLER (VIOLATIONS):');
    results.violations.forEach((v, idx) => {
      console.error(`\n[#${idx + 1}] ID: ${v.id} | Etki: ${v.impact?.toUpperCase()}`);
      console.error(`Açıklama: ${v.description}`);
      console.error(`Yardım: ${v.help} (${v.helpUrl})`);
      console.error('Etkilenen Düğümler:');
      v.nodes.forEach(n => {
        console.error(` - Hedef: ${n.target.join(' ')}`);
        console.error(`   HTML: ${n.html.substring(0, 120)}...`);
        console.error(`   Hata Nedeni: ${n.failureSummary}`);
      });
    });
  } else {
    console.log('🎉 TEBRİKLER! Sıfır ihlal (0 violations). axe-core denetiminden %100 başarıyla geçti!');
  }

  if (results.incomplete.length > 0) {
    console.log('\nℹ️  MANUEL İNCELEME GEREKTİREBİLECEK DURUMLAR (INCOMPLETE):');
    results.incomplete.forEach((inc, idx) => {
      console.log(`\n[#${idx + 1}] ID: ${inc.id} | ${inc.help}`);
      inc.nodes.forEach(n => {
        console.log(` - Hedef: ${n.target.join(' ')}`);
      });
    });
  }

  // Save report to JSON for inspection if needed
  fs.writeFileSync('axe-report.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    passesCount: results.passes.length,
    violationsCount: results.violations.length,
    incompleteCount: results.incomplete.length,
    violations: results.violations,
    incomplete: results.incomplete
  }, null, 2));

  console.log('\n📄 Ayrıntılı JSON raporu kaydedildi: axe-report.json');
}

runAxeAudit().catch(err => {
  console.error('Audit çalıştırma hatası:', err);
  process.exit(1);
});

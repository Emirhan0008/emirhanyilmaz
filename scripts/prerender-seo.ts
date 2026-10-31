import fs from 'fs';
import path from 'path';
import { projects, articles, profileData } from '../src/data';
import { projectsEn, articlesEn, profileDataEn } from '../src/data.en';
import { Project, Article } from '../src/types';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const BASE_URL = 'https://emirhanyilmaz.vercel.app';

interface PageMeta {
  route: string; // e.g. '/projects/3dcografya'
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  schema?: object;
  preRenderedHtml?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildProjectSchema(p: Project, lang: 'tr' | 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.title,
    headline: p.title,
    description: p.description,
    applicationCategory: p.category,
    operatingSystem: 'Web, Windows, macOS, Linux',
    image: p.image?.startsWith('http') ? p.image : `${BASE_URL}${p.image}`,
    url: `${BASE_URL}/projects/${p.id}`,
    author: {
      '@type': 'Person',
      name: profileData.name,
      url: BASE_URL,
      jobTitle: profileData.title,
    },
    keywords: p.tech.join(', '),
  };
}

function buildArticleSchema(a: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: a.title,
    description: a.summary,
    datePublished: '2024-01-15',
    dateModified: '2026-10-31',
    author: {
      '@type': 'Person',
      name: profileData.name,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: profileData.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/articles/${a.id}`,
    },
    keywords: a.tags.join(', '),
  };
}

function generateStaticHtml(baseTemplate: string, meta: PageMeta): string {
  let html = baseTemplate;

  // 1. Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);

  // 2. Replace Meta Description
  const metaDescRegex = /<meta name="description" content=".*?" \/>/i;
  const newMetaDesc = `<meta name="description" content="${escapeHtml(meta.description)}" />`;
  if (metaDescRegex.test(html)) {
    html = html.replace(metaDescRegex, newMetaDesc);
  } else {
    html = html.replace('</head>', `  ${newMetaDesc}\n  </head>`);
  }

  // 3. Replace Canonical Link
  const canonicalRegex = /<link rel="canonical" href=".*?" \/>/i;
  const newCanonical = `<link rel="canonical" href="${meta.canonicalUrl}" />`;
  if (canonicalRegex.test(html)) {
    html = html.replace(canonicalRegex, newCanonical);
  } else {
    html = html.replace('</head>', `  ${newCanonical}\n  </head>`);
  }

  // 4. Update OpenGraph Tags
  const ogTitleRegex = /<meta property="og:title" content=".*?" \/>/i;
  if (ogTitleRegex.test(html)) {
    html = html.replace(ogTitleRegex, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`);
  }
  const ogDescRegex = /<meta property="og:description" content=".*?" \/>/i;
  if (ogDescRegex.test(html)) {
    html = html.replace(ogDescRegex, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
  }
  const ogUrlRegex = /<meta property="og:url" content=".*?" \/>/i;
  if (ogUrlRegex.test(html)) {
    html = html.replace(ogUrlRegex, `<meta property="og:url" content="${meta.canonicalUrl}" />`);
  }

  // 5. Inject Dedicated Schema.org JSON-LD
  if (meta.schema) {
    const schemaScript = `\n  <script type="application/ld+json">\n${JSON.stringify(meta.schema, null, 2)}\n  </script>`;
    html = html.replace('</head>', `${schemaScript}\n</head>`);
  }

  // 6. Inject Pre-rendered Content into Noscript for search engine crawlers
  if (meta.preRenderedHtml) {
    const noscriptContent = `\n  <noscript>\n    <div class="pre-rendered-seo-content" style="padding: 2rem; max-width: 900px; margin: 0 auto; color: #e4e4e7; font-family: system-ui, sans-serif;">\n${meta.preRenderedHtml}\n    </div>\n  </noscript>\n`;
    html = html.replace('</body>', `${noscriptContent}</body>`);
  }

  return html;
}

export function prerenderAllPages() {
  console.log('🚀 Pre-rendering 31+ static SEO routes for Google Search Console...');

  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ dist/index.html not found. Run 'vite build' first.`);
    return;
  }

  const baseTemplate = fs.readFileSync(indexPath, 'utf-8');
  const pages: PageMeta[] = [];

  // 1. Root and Category Hubs
  pages.push({
    route: '/projects',
    title: 'Projeler Vitrini (30+ Canlı Proje) — Emirhan Yılmaz',
    description: 'Emirhan Yılmaz tarafından geliştirilen Three.js 3D web, Google Gemini AI Vision, Python otomasyon ve özel eğitim odaklı 30+ canlı proje.',
    canonicalUrl: `${BASE_URL}/projects`,
    preRenderedHtml: `
      <h1>Projeler Vitrini — Emirhan Yılmaz (30+ Canlı Proje)</h1>
      <p>Bilişsel bilim, psikolojik danışmanlık ve yapay zeka mimarisini birleştiren 30'dan fazla production-ready yazılım projesi.</p>
      <ul>
        ${projects.map(p => `<li><a href="/projects/${p.id}"><strong>${escapeHtml(p.title)}</strong></a>: ${escapeHtml(p.description)}</li>`).join('\n')}
      </ul>
    `
  });

  pages.push({
    route: '/articles',
    title: 'Makaleler & Teknik Yazılar — Emirhan Yılmaz',
    description: 'Yapay zeka etiği, özel eğitimde büyük dil modelleri (LLM), Python otomasyonları ve bilişsel bilim üzerine teknik makaleler.',
    canonicalUrl: `${BASE_URL}/articles`,
    preRenderedHtml: `
      <h1>Makaleler ve Araştırma Yazıları — Emirhan Yılmaz</h1>
      <ul>
        ${articles.map(a => `<li><a href="/articles/${a.id}"><strong>${escapeHtml(a.title)}</strong></a> (${a.date}): ${escapeHtml(a.summary)}</li>`).join('\n')}
      </ul>
    `
  });

  pages.push({
    route: '/contact',
    title: 'İletişim & Proje Teklifi — Emirhan Yılmaz',
    description: 'Emirhan Yılmaz ile yapay zeka sistemleri, 3D web geliştirme ve kurumsal otomasyon projeleri için doğrudan iletişime geçin.',
    canonicalUrl: `${BASE_URL}/contact`,
    preRenderedHtml: `
      <h1>İletişim — Emirhan Yılmaz</h1>
      <p>E-posta: emirhan0008@gmail.com | GitHub: github.com/Emirhan0008 | Telegram: t.me/emirhanyilmazrpd</p>
    `
  });

  // 2. Individual Projects (25 projects)
  for (const project of projects) {
    const techBadges = project.tech.map(t => `<span style="display:inline-block; margin:2px 4px; padding:2px 6px; background:#27272a; border-radius:4px; font-size:12px;">${escapeHtml(t)}</span>`).join(' ');
    const highlightsHtml = project.highlights?.length
      ? `<h3>Öne Çıkan Özellikler</h3><ul>${project.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul>`
      : '';
    const caseStudyHtml = project.caseStudy
      ? `<h3>Vaka Analizi & Mimari (Problem / Çözüm / Etki)</h3>
         <p><strong>Problem:</strong> ${escapeHtml(project.caseStudy.challenge)}</p>
         <p><strong>Rol:</strong> ${escapeHtml(project.caseStudy.role)}</p>
         ${project.caseStudy.solution ? `<p><strong>Çözüm:</strong> ${escapeHtml(project.caseStudy.solution)}</p>` : ''}
         <p><strong>Etki:</strong> ${escapeHtml(project.caseStudy.impact)}</p>`
      : '';

    const preRendered = `
      <article>
        <h1>${escapeHtml(project.title)} — Proje Detayı</h1>
        <p><strong>Kategori:</strong> ${escapeHtml(project.category)}</p>
        <p><strong>Özet:</strong> ${escapeHtml(project.description)}</p>
        <div><strong>Kullanılan Teknolojiler:</strong> ${techBadges}</div>
        <div style="margin-top:1rem;">
          <p>${escapeHtml(project.longDescription || project.description)}</p>
        </div>
        ${highlightsHtml}
        ${caseStudyHtml}
        <div style="margin-top:1.5rem;">
          ${project.demoUrl ? `<a href="${project.demoUrl}" style="color:#34d399; margin-right:1rem;" target="_blank">Canlı Demo</a>` : ''}
          ${project.githubUrl ? `<a href="${project.githubUrl}" style="color:#60a5fa;" target="_blank">GitHub Kaynak Kodu</a>` : ''}
        </div>
      </article>
    `;

    pages.push({
      route: `/projects/${project.id}`,
      title: `${project.title} — Emirhan Yılmaz | Projeler`,
      description: `${project.description} — Emirhan Yılmaz portfolyosu canlı proje detayı ve teknik vaka analizi.`,
      canonicalUrl: `${BASE_URL}/projects/${project.id}`,
      schema: buildProjectSchema(project, 'tr'),
      preRenderedHtml: preRendered,
    });
  }

  // 3. Individual Articles (3 articles)
  for (const article of articles) {
    const preRendered = `
      <article>
        <h1>${escapeHtml(article.title)}</h1>
        <p><strong>Kategori:</strong> ${escapeHtml(article.category)} | <strong>Tarih:</strong> ${article.date} | <strong>Okuma Süresi:</strong> ${article.readTime}</p>
        <p><strong>Özet:</strong> ${escapeHtml(article.summary)}</p>
        <div style="margin-top:1rem; line-height: 1.6;">
          ${article.content.map(p => `<p>${escapeHtml(p)}</p>`).join('\n')}
        </div>
        <p><strong>Etiketler:</strong> ${article.tags.join(', ')}</p>
      </article>
    `;

    pages.push({
      route: `/articles/${article.id}`,
      title: `${article.title} — Emirhan Yılmaz | Makaleler`,
      description: `${article.summary} — Emirhan Yılmaz tarafından kaleme alınan teknik analiz.`,
      canonicalUrl: `${BASE_URL}/articles/${article.id}`,
      schema: buildArticleSchema(article),
      preRenderedHtml: preRendered,
    });
  }

  // Write all pages to dist
  let count = 0;
  for (const page of pages) {
    const cleanRoute = page.route.replace(/^\//, '');
    const targetDir = path.join(DIST_DIR, cleanRoute);
    fs.mkdirSync(targetDir, { recursive: true });

    const finalHtml = generateStaticHtml(baseTemplate, page);
    const targetFilePath = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFilePath, finalHtml, 'utf-8');
    count++;
  }

  console.log(`✅ ${count} adet bağımsız static SEO sayfası dist/ dizinine başarıyla pre-render edildi!`);
}

// If executed directly via CLI
if (process.argv[1] && process.argv[1].endsWith('prerender-seo.ts')) {
  prerenderAllPages();
}

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const viewports = [
  { width: 320, height: 900, label: 'android-narrow' },
  { width: 360, height: 900, label: 'android' },
  { width: 390, height: 844, label: 'iphone' },
  { width: 430, height: 932, label: 'iphone-wide' },
  { width: 768, height: 1024, label: 'tablet-portrait' },
  { width: 1024, height: 768, label: 'tablet-landscape' },
  { width: 1366, height: 768, label: 'laptop' },
  { width: 1440, height: 900, label: 'desktop' },
  { width: 1920, height: 1080, label: 'wide-desktop' },
];

const baseUrl = process.env.QA_URL ?? 'http://127.0.0.1:4173/alina-business-tracker/';
await mkdir('qa-artifacts', { recursive: true });

const browser = await chromium.launch({ headless: true });
const reports = [];

for (const viewport of viewports) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    hasTouch: viewport.width <= 1024,
    isMobile: viewport.width <= 430,
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });

  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((image) => {
      image.loading = 'eager';
    });
    const pageHeight = document.documentElement.scrollHeight;
    for (let y = 0; y < pageHeight; y += innerHeight) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    scrollTo(0, 0);
    await document.fonts.ready;
    await Promise.race([
      Promise.all(
        Array.from(document.images, (image) => (
          image.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                image.addEventListener('load', resolve, { once: true });
                image.addEventListener('error', resolve, { once: true });
              })
        )),
      ),
      new Promise((resolve) => setTimeout(resolve, 10_000)),
    ]);
  });

  const geometry = await page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return { left: box.left, top: box.top, right: box.right, bottom: box.bottom, width: box.width, height: box.height };
    };
    const intersects = (a, b) => Boolean(
      a && b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
    );
    const visible = (element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && box.width > 0 && box.height > 0;
    };

    const boundsSelectors = '.site-main h1,.site-main h2,.site-main h3,.site-main p,.site-main a,.site-main dt,.site-main dd,.site-main figure,.site-main img';
    const outOfBounds = Array.from(document.querySelectorAll(boundsSelectors))
      .filter((element) => !element.closest('.client-line') && visible(element))
      .map((element) => {
        const box = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: element.className,
          text: element.textContent?.trim().slice(0, 80) ?? '',
          left: Math.round(box.left * 10) / 10,
          right: Math.round(box.right * 10) / 10,
        };
      })
      .filter((element) => element.left < -1 || element.right > innerWidth + 1);

    const portrait = rect('.hero__portrait');
    const heroCopy = rect('.hero__copy');
    const heroTelegram = rect('.hero__telegram');
    const growth = rect('.hero__headline--growth');
    const needs = rect('.hero__headline--needs');
    const heroOverlaps = [
      ['portrait-copy', portrait, heroCopy],
      ['portrait-telegram', portrait, heroTelegram],
      ['portrait-growth', portrait, growth],
      ['portrait-needs', portrait, needs],
      ['copy-telegram', heroCopy, heroTelegram],
    ].filter(([, a, b]) => intersects(a, b)).map(([name]) => name);

    const caseScenes = Array.from(document.querySelectorAll('.case-v9__scene')).map((element) => {
      const box = element.getBoundingClientRect();
      const image = element.querySelector('img');
      const imageBox = image?.getBoundingClientRect();
      return {
        ratio: box.width / box.height,
        width: box.width,
        height: box.height,
        imageWidth: imageBox?.width ?? 0,
        imageHeight: imageBox?.height ?? 0,
      };
    });

    const profileNumbers = Array.from(document.querySelectorAll('.profile-v9__facts dt')).map((element) => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        text: element.textContent?.trim(),
        top: Math.round(box.top * 10) / 10,
        bottom: Math.round(box.bottom * 10) / 10,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
      };
    });
    const metricRows = profileNumbers.reduce((rows, metric) => {
      const row = rows.find((candidate) => Math.abs(candidate.top - metric.top) <= 2);
      if (row) row.items.push(metric);
      else rows.push({ top: metric.top, items: [metric] });
      return rows;
    }, []);
    const metricMisalignment = metricRows.flatMap((row) => {
      const bottoms = row.items.map((item) => item.bottom);
      return Math.max(...bottoms) - Math.min(...bottoms) > 2 ? row.items.map((item) => item.text) : [];
    });

    const rail = document.querySelector('.experience-v9__rail');
    const railOverflow = rail ? rail.scrollWidth - rail.clientWidth : null;
    const brokenImages = Array.from(document.querySelectorAll('.hero img,.case-v9 img'))
      .filter((image) => image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src);

    return {
      viewport: { width: innerWidth, height: innerHeight },
      documentOverflow: document.documentElement.scrollWidth - innerWidth,
      outOfBounds,
      heroOverlaps,
      heroRects: { portrait, heroCopy, heroTelegram, growth, needs },
      caseScenes,
      caseRatioSpread: Math.max(...caseScenes.map((scene) => scene.ratio)) - Math.min(...caseScenes.map((scene) => scene.ratio)),
      profileNumbers,
      metricMisalignment,
      railOverflow,
      brokenImages,
      bodyBackground: getComputedStyle(document.body).backgroundColor,
    };
  });

  const failures = [];
  if (geometry.documentOverflow > 1) failures.push(`document overflow ${geometry.documentOverflow}px`);
  if (geometry.outOfBounds.length) failures.push(`${geometry.outOfBounds.length} visible elements out of bounds`);
  if (geometry.heroOverlaps.length) failures.push(`hero overlaps: ${geometry.heroOverlaps.join(', ')}`);
  if (geometry.caseScenes.length !== 4) failures.push(`expected 4 case scenes, found ${geometry.caseScenes.length}`);
  if (geometry.caseRatioSpread > 0.02) failures.push(`case ratio spread ${geometry.caseRatioSpread.toFixed(4)}`);
  if (geometry.metricMisalignment.length) failures.push(`metric misalignment: ${geometry.metricMisalignment.join(', ')}`);
  if (geometry.railOverflow > 1) failures.push(`experience rail overflow ${geometry.railOverflow}px`);
  if (geometry.brokenImages.length) failures.push(`${geometry.brokenImages.length} broken images`);
  if (consoleErrors.length) failures.push(`${consoleErrors.length} console errors`);

  const report = { ...viewport, geometry, consoleErrors, failures };
  reports.push(report);
  await page.screenshot({
    path: `qa-artifacts/${String(viewport.width).padStart(4, '0')}-${viewport.label}.png`,
    fullPage: true,
    animations: 'disabled',
  });
  await page.close();
}

await browser.close();
await writeFile('qa-artifacts/report.json', `${JSON.stringify(reports, null, 2)}\n`);

const failed = reports.filter((report) => report.failures.length);
if (failed.length) {
  for (const report of failed) {
    console.error(`${report.width}px (${report.label}): ${report.failures.join('; ')}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Layout QA passed at ${reports.length} viewports (${viewports.map(({ width }) => width).join(', ')}px).`);
}

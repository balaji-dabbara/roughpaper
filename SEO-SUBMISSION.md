# SEO Submission Checklist

## 1. Generate the OG social image

1. Open `generate-og.html` in Chrome (double-click the file or serve via Live Server)
2. Click **Download og-image.png**
3. Move the downloaded file to `assets/og-image.png` in the repo
4. Commit and push — the OG image is now live at `https://www.roughpaper.online/assets/og-image.png`

---

## 2. Google Search Console

1. Go to <https://search.google.com/search-console>
2. Click **Add property** → choose **URL prefix** → enter `https://www.roughpaper.online/`
3. Verify ownership — easiest method: **HTML file** (download the file, put it in the repo root, push, then click Verify)
4. Once verified, go to **Sitemaps** in the left menu
5. Enter `sitemap.xml` and click **Submit**
6. Check the **Coverage** report after ~24 hours — the home page should appear as Indexed

---

## 3. Bing Webmaster Tools

1. Go to <https://www.bing.com/webmasters>
2. Sign in with a Microsoft account
3. Click **Add a site** → enter `https://www.roughpaper.online/`
4. Choose **XML Sitemap** verification: add the provided `<meta>` tag to `index.html` (or use the XML file method if preferred), then click Verify
5. After verification, go to **Sitemaps** → **Submit sitemap** → enter `https://www.roughpaper.online/sitemap.xml`

---

## 4. After the first month — update sitemap lastmod

When you make a significant change to the app, update the `<lastmod>` date in `sitemap.xml`
to the release date. This signals to crawlers that the page has fresh content worth re-indexing.

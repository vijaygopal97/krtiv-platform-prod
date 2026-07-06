import express from 'express';
import Content, { buildCmsKey } from '../models/Content.js';

const router = express.Router();

/** Public read — merged map keyed by cmsKey. Optional ?page=home filter. */
router.get('/', async (req, res) => {
  try {
    const { page } = req.query;
    const filter = page && typeof page === 'string' ? { page } : {};
    const rows = await Content.find(filter).select('cmsKey value valueType page section key updatedAt').lean();
    const map = {};
    for (const row of rows) {
      map[row.cmsKey] = {
        value: row.value,
        valueType: row.valueType,
        page: row.page,
        section: row.section,
        key: row.key,
        updatedAt: row.updatedAt,
      };
    }
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ success: true, content: map });
  } catch (err) {
    console.error('GET /content', err);
    res.status(500).json({ success: false, message: 'Could not load content' });
  }
});

/** SEO bundle for a page slug (home, contact, about, …). */
router.get('/seo/:pageSlug', async (req, res) => {
  try {
    const pageSlug = req.params.pageSlug;
    const prefix = `${pageSlug}.seo.`;
    const rows = await Content.find({
      cmsKey: { $regex: `^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}` },
      valueType: 'seo',
    })
      .select('cmsKey value key')
      .lean();
    const seo = {};
    for (const row of rows) {
      seo[row.key] = row.value;
    }
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ success: true, page: pageSlug, seo });
  } catch (err) {
    console.error('GET /content/seo', err);
    res.status(500).json({ success: false, message: 'Could not load SEO' });
  }
});

export { buildCmsKey };
export default router;

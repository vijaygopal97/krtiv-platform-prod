import express from 'express';
import ExperienceBlog from '../models/ExperienceBlog.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const blogs = await ExperienceBlog.find({ published: true })
      .sort({ sortOrder: 1, title: 1 })
      .select('slug title subtitle heroImage overview sortOrder')
      .lean();
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    res.json({ success: true, blogs });
  } catch (err) {
    console.error('GET /experience-blogs', err);
    res.status(500).json({ success: false, message: 'Could not load blogs' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const blog = await ExperienceBlog.findOne({
      slug: req.params.slug,
      published: true,
    }).lean();
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    let related = [];
    if (blog.relatedSlugs?.length) {
      related = await ExperienceBlog.find({
        slug: { $in: blog.relatedSlugs },
        published: true,
      })
        .select('slug title heroImage subtitle')
        .lean();
    } else {
      related = await ExperienceBlog.find({
        slug: { $ne: blog.slug },
        published: true,
        categoryTags: { $in: blog.categoryTags || [] },
      })
        .limit(4)
        .select('slug title heroImage subtitle')
        .lean();
    }

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    res.json({ success: true, blog, related });
  } catch (err) {
    console.error('GET /experience-blogs/:slug', err);
    res.status(500).json({ success: false, message: 'Could not load blog' });
  }
});

export default router;

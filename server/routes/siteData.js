import express from 'express';

export function siteDataRoutes(pool) {
  const router = express.Router();

  // Get site data
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT data, updated_at FROM site_data WHERE key = $1 ORDER BY updated_at DESC LIMIT 1',
        ['main']
      );

      if (result.rows.length === 0) {
        return res.json(null);
      }

      res.json(result.rows[0].data);
    } catch (error) {
      console.error('Get site data error:', error);
      res.status(500).json({ error: 'Failed to load site data' });
    }
  });

  // Save site data
  router.post('/', async (req, res) => {
    try {
      const data = req.body;

      if (!data) {
        return res.status(400).json({ error: 'Data required' });
      }

      // Upsert: Update if exists, insert if not
      const result = await pool.query(
        `INSERT INTO site_data (key, data, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (key) 
         DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP
         RETURNING updated_at`,
        ['main', JSON.stringify(data)]
      );

      res.json({ 
        success: true, 
        message: 'Site data saved successfully',
        updated_at: result.rows[0].updated_at
      });
    } catch (error) {
      console.error('Save site data error:', error);
      res.status(500).json({ error: 'Failed to save site data' });
    }
  });

  // Get data version/timestamp
  router.get('/version', async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT updated_at FROM site_data WHERE key = $1 ORDER BY updated_at DESC LIMIT 1',
        ['main']
      );

      if (result.rows.length === 0) {
        return res.json({ updated_at: null });
      }

      res.json({ updated_at: result.rows[0].updated_at });
    } catch (error) {
      console.error('Get version error:', error);
      res.status(500).json({ error: 'Failed to get version' });
    }
  });

  return router;
}

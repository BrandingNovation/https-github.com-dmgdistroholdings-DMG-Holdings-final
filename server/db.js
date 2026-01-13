export async function initDatabase(pool) {
  try {
    // Create site_data table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_data (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL DEFAULT 'main',
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin_users table for authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on site_data key for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_site_data_key ON site_data(key)
    `);

    // Insert default admin user if none exists (password: 'admin')
    const adminCheck = await pool.query('SELECT COUNT(*) FROM admin_users');
    if (parseInt(adminCheck.rows[0].count) === 0) {
      const bcrypt = await import('bcrypt');
      const defaultHash = await bcrypt.hash('admin', 10);
      await pool.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
        ['admin', defaultHash]
      );
      console.log('✓ Default admin user created (username: admin, password: admin)');
    }

    console.log('✓ Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

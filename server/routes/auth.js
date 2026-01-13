import express from 'express';
import bcrypt from 'bcrypt';

export function authRoutes(pool) {
  const router = express.Router();

  // Login endpoint
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }

      const result = await pool.query(
        'SELECT id, username, password_hash FROM admin_users WHERE username = $1',
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const isValid = await bcrypt.compare(password, user.password_hash);

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // In a production app, you'd generate a JWT token here
      // For simplicity, we'll just return success
      res.json({ 
        success: true, 
        message: 'Login successful',
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update password endpoint
  router.post('/update-password', async (req, res) => {
    try {
      const { username, currentPassword, newPassword } = req.body;
      
      if (!username || !currentPassword || !newPassword) {
        return res.status(400).json({ error: 'All fields required' });
      }

      if (newPassword.length < 4) {
        return res.status(400).json({ error: 'Password must be at least 4 characters' });
      }

      // Verify current password
      const result = await pool.query(
        'SELECT password_hash FROM admin_users WHERE username = $1',
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Current password incorrect' });
      }

      // Update password
      const newHash = await bcrypt.hash(newPassword, 10);
      await pool.query(
        'UPDATE admin_users SET password_hash = $1 WHERE username = $2',
        [newHash, username]
      );

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error('Password update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}

#!/usr/bin/env node
/**
 * Verification script to test database connection and API setup
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'dmg_holdings',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function verifyDatabase() {
  console.log('🔍 Verifying database connection...');
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    console.log(`   Server time: ${result.rows[0].now}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function verifyTables() {
  console.log('🔍 Verifying database tables...');
  try {
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tableNames = tables.rows.map(r => r.table_name);
    const required = ['site_data', 'admin_users'];
    const missing = required.filter(t => !tableNames.includes(t));
    
    if (missing.length === 0) {
      console.log('✅ All required tables exist');
      tableNames.forEach(t => console.log(`   - ${t}`));
      return true;
    } else {
      console.log('⚠️  Missing tables:', missing.join(', '));
      console.log('   Run the API server once to auto-create tables');
      return false;
    }
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
    return false;
  }
}

async function verifyAdminUser() {
  console.log('🔍 Verifying admin user...');
  try {
    const result = await pool.query('SELECT COUNT(*) FROM admin_users');
    const count = parseInt(result.rows[0].count);
    if (count > 0) {
      console.log('✅ Admin user exists');
      return true;
    } else {
      console.log('⚠️  No admin user found (will be created on first API start)');
      return true;
    }
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.log('⚠️  admin_users table does not exist (will be created on first API start)');
      return true;
    }
    console.error('❌ Error checking admin user:', error.message);
    return false;
  }
}

async function verifyAPI() {
  console.log('🔍 Verifying API server...');
  return new Promise((resolve) => {
    const port = process.env.PORT || 3001;
    const req = http.get(`http://localhost:${port}/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ API server is running');
          console.log(`   Response: ${data}`);
          resolve(true);
        } else {
          console.log(`⚠️  API returned status ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('⚠️  API server not running (start with: npm run dev)');
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      console.log('⚠️  API server not responding');
      resolve(false);
    });
  });
}

async function main() {
  console.log('🚀 DMG Holdings API - Setup Verification\n');
  
  const results = {
    database: await verifyDatabase(),
    tables: await verifyTables(),
    admin: await verifyAdminUser(),
    api: await verifyAPI()
  };
  
  console.log('\n📊 Summary:');
  console.log(`   Database: ${results.database ? '✅' : '❌'}`);
  console.log(`   Tables: ${results.tables ? '✅' : '⚠️'}`);
  console.log(`   Admin User: ${results.admin ? '✅' : '❌'}`);
  console.log(`   API Server: ${results.api ? '✅' : '⚠️'}`);
  
  if (results.database && results.tables && results.admin) {
    console.log('\n✅ Setup looks good!');
    if (!results.api) {
      console.log('   Start the API server with: npm run dev');
    }
  } else {
    console.log('\n⚠️  Some checks failed. Review the errors above.');
  }
  
  await pool.end();
  process.exit(results.database ? 0 : 1);
}

main().catch(console.error);

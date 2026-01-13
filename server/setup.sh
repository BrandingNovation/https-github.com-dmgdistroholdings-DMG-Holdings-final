#!/bin/sh
set -e

echo "🚀 Setting up DMG Holdings API Server..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dmg_holdings
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:5173
EOF
    echo "✓ .env file created. Please update with your database credentials."
else
    echo "✓ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your database credentials"
echo "2. Make sure PostgreSQL is running"
echo "3. Run: npm run dev"
echo ""

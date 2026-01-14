#!/bin/bash
# Pre-commit security check to prevent secrets from being committed

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔒 Running security check..."

# Check for files that might contain secrets
SECRET_FILES=$(git diff --cached --name-only | grep -E "\.env$|\.env\.|secret|password|token|key|\.pem|\.key" | grep -v ".gitignore" | grep -v "example" | grep -v "template")

if [ -n "$SECRET_FILES" ]; then
    echo -e "${RED}❌ SECURITY WARNING: Files that may contain secrets detected:${NC}"
    echo "$SECRET_FILES"
    echo ""
    echo -e "${YELLOW}Please review these files before committing.${NC}"
    exit 1
fi

# Check for common secret patterns in staged files
SECRET_PATTERNS=$(git diff --cached | grep -E "ghp_[A-Za-z0-9]{36}|sk-[A-Za-z0-9]{32}|password\s*[:=]\s*['\"][^'\"]{8,}|api[_-]?key\s*[:=]\s*['\"][^'\"]{16,}" | grep -v "example" | grep -v "template" | grep -v "default" | grep -v "postgres")

if [ -n "$SECRET_PATTERNS" ]; then
    echo -e "${RED}❌ SECURITY WARNING: Potential secrets detected in code:${NC}"
    echo "$SECRET_PATTERNS" | head -5
    echo ""
    echo -e "${YELLOW}Please use environment variables instead of hardcoded secrets.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Security check passed${NC}"
exit 0

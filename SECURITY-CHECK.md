# Security Check Protocol

## Standard Practice

**Before every commit/push, I will:**

1. ✅ Check for `.env` files or files with "secret", "password", "token", "key" in the name
2. ✅ Scan for hardcoded secrets (GitHub tokens `ghp_*`, API keys, passwords)
3. ✅ Verify all credentials use environment variables, not hardcoded values
4. ✅ Ensure `.gitignore` properly excludes sensitive files
5. ✅ Review any files that might contain credentials before committing

## What Gets Checked

- ❌ `.env` files
- ❌ Files with "secret", "password", "token" in name
- ❌ Hardcoded GitHub tokens (`ghp_*`)
- ❌ Hardcoded API keys
- ❌ Hardcoded database passwords
- ❌ Private keys (`.pem`, `.key` files)

## What's Safe

- ✅ Environment variable references (`process.env.KEY`)
- ✅ Default/example values (`'postgres'`, `'localhost'`)
- ✅ Documentation files with placeholders (`<your-password>`)
- ✅ `.env.example` or `.env.template` files

## If Secrets Are Found

I will:
1. **NOT commit** the changes
2. **Report** what was found
3. **Suggest** using environment variables instead
4. **Update** `.gitignore` if needed

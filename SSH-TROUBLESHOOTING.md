# SSH Connection Troubleshooting for Cursor Agent

## Current SSH Status

**Server:** `65.21.109.247` (ubuntu-8gb-hel1-1)  
**SSH Service:** ✅ Active and running  
**Port:** 22 (listening on all interfaces)  
**Root Login:** ✅ Allowed  
**Firewall:** ✅ Inactive (not blocking)  
**Authorized Keys:** 1 key configured

## Common Issues & Solutions

### Issue 1: SSH Key Not Found
**Problem:** Cursor agent doesn't have access to your SSH private key

**Solution:**
```bash
# In Cursor, specify the SSH key path:
ssh -i /path/to/your/private/key root@65.21.109.247
```

**To find your SSH key:**
- Check `~/.ssh/id_rsa` or `~/.ssh/id_ed25519` on your local machine
- Or generate a new key pair if needed

### Issue 2: Password Authentication Disabled
**Problem:** Server may only accept SSH key authentication

**Check:**
```bash
# On server, check SSH config:
grep PasswordAuthentication /etc/ssh/sshd_config
```

**Solution:** Either:
1. Use SSH key authentication (recommended)
2. Enable password auth temporarily:
   ```bash
   # On server:
   sed -i 's/#PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
   systemctl restart ssh
   ```

### Issue 3: Agent Can't Enter Password Interactively
**Problem:** Cursor agent can't type password interactively

**Solution:** Use SSH key instead:
```bash
# Generate key pair (on your local machine):
ssh-keygen -t ed25519 -C "cursor-agent"

# Copy public key to server:
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@65.21.109.247

# Or manually add to server:
cat ~/.ssh/id_ed25519.pub | ssh root@65.21.109.247 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Issue 4: Wrong SSH Key Format
**Problem:** Key format not recognized

**Solution:** Use standard key format:
```bash
# Generate Ed25519 key (modern, recommended):
ssh-keygen -t ed25519

# Or RSA key (older, widely supported):
ssh-keygen -t rsa -b 4096
```

## Quick Fix: Add Your SSH Key to Server

**Step 1:** Generate key (if you don't have one):
```bash
ssh-keygen -t ed25519 -f ~/.ssh/cursor_agent_key
```

**Step 2:** Copy public key to server:
```bash
ssh-copy-id -i ~/.ssh/cursor_agent_key.pub root@65.21.109.247
```

**Step 3:** Test connection:
```bash
ssh -i ~/.ssh/cursor_agent_key root@65.21.109.247
```

**Step 4:** In Cursor agent, use:
```bash
ssh -i ~/.ssh/cursor_agent_key root@65.21.109.247
```

## Alternative: Enable Password Authentication (Temporary)

If you need password auth for testing:

```bash
# On server (via current access):
sed -i 's/#PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
systemctl restart sshd
```

**⚠️ Security Warning:** Only enable password auth temporarily. Use SSH keys for production.

## Current Server SSH Configuration

- **PermitRootLogin:** yes
- **Port:** 22
- **Service:** Active
- **Firewall:** Inactive (not blocking)
- **Authorized Keys:** 1 key present

## Test Connection

**From your local terminal:**
```bash
# Test with key:
ssh -i ~/.ssh/your_key root@65.21.109.247

# Test with password (if enabled):
ssh root@65.21.109.247
```

**From Cursor agent:**
- Must specify key path: `ssh -i /path/to/key root@65.21.109.247`
- Cannot enter password interactively

## Recommended Solution

**Best approach:** Set up SSH key authentication

1. Generate SSH key on your local machine
2. Add public key to server's `~/.ssh/authorized_keys`
3. Use key path in Cursor agent: `ssh -i /path/to/key root@65.21.109.247`

This is more secure and works with non-interactive agents.

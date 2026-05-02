# 🌐 Ngrok Setup Guide for Tablet Image Analyzer

## 📋 Overview
Share your local Vite development server (port 5175) with remote collaborators using Ngrok.

---

## 🚀 Installation & Setup

### **Step 1: Install Ngrok**

**Option A: Using npm (Recommended)**
```bash
npm install -g ngrok
```

**Option B: Using Chocolatey (Windows)**
```bash
choco install ngrok
```

**Option C: Manual Download**
1. Visit: https://ngrok.com/download
2. Download Windows version
3. Extract `ngrok.exe` to `C:\Windows\System32` or add to PATH

---

### **Step 2: Get Auth Token**

1. **Sign up:** https://dashboard.ngrok.com/signup
2. **Copy token:** https://dashboard.ngrok.com/get-started/your-authtoken
3. **Configure:**
   ```bash
   ngrok config add-authtoken YOUR_TOKEN_HERE
   ```

---

## 🎯 Usage

### **Start Vite Server**
```bash
npm run dev
```
Server runs on: `http://localhost:5175`

### **Start Ngrok Tunnel**

**Basic (Free)**
```bash
ngrok http 5175
```

**With Password Protection**
```bash
ngrok http 5175 --basic-auth="user:pass123"
```

**With Custom Domain (Paid)**
```bash
ngrok http 5175 --domain=tablet-analyzer.ngrok.io
```

---

## 📊 Ngrok Output

```
Session Status: online
Account: your@email.com
Forwarding: https://abc123.ngrok.io -> http://localhost:5175

Web Interface: http://127.0.0.1:4040
```

**Share this URL:** `https://abc123.ngrok.io`

---

## 🔒 Security Best Practices

1. **Use Basic Auth:**
   ```bash
   ngrok http 5175 --basic-auth="pharma:secure2024"
   ```

2. **Limit Session Time:** Close tunnel when done

3. **Monitor Traffic:** Visit `http://127.0.0.1:4040` to see requests

4. **Use IP Restrictions (Paid):**
   ```bash
   ngrok http 5175 --cidr-allow=1.2.3.4/32
   ```

---

## 🛠️ Troubleshooting

**Issue: "command not found: ngrok"**
- Solution: Add ngrok to PATH or use full path

**Issue: "ERR_NGROK_108"**
- Solution: Run `ngrok config add-authtoken YOUR_TOKEN`

**Issue: Vite HMR not working**
- Solution: Add to `vite.config.js`:
  ```javascript
  export default {
    server: {
      hmr: {
        clientPort: 443
      }
    }
  }
  ```

---

## 📱 Alternative: LocalTunnel

**Install:**
```bash
npm install -g localtunnel
```

**Usage:**
```bash
lt --port 5175 --subdomain tablet-analyzer
```

**Output:**
```
your url is: https://tablet-analyzer.loca.lt
```

---

## ⚡ Quick Commands

```bash
# Start dev server
npm run dev

# In new terminal: Start ngrok
ngrok http 5175

# With auth
ngrok http 5175 --basic-auth="demo:pass123"

# Stop: Press Ctrl+C
```

---

## 📞 Share with Collaborator

**Send them:**
1. Ngrok URL: `https://abc123.ngrok.io`
2. Credentials (if using auth): `user:pass123`
3. Instructions: "Open URL in browser, enter credentials"

**They will see:**
- Your live Vite app
- Real-time updates via HMR
- Full functionality (uploads, theme toggle, etc.)

---

## 🎓 Pro Tips

- **Keep terminal open:** Ngrok runs as long as terminal is active
- **Free tier limits:** 1 tunnel, random URL each time
- **Paid benefits:** Custom domains, multiple tunnels, IP whitelisting
- **Monitor traffic:** Use web interface at `http://127.0.0.1:4040`

---

## ✅ Verification

1. Start Vite: `npm run dev`
2. Start Ngrok: `ngrok http 5175`
3. Copy URL from Ngrok output
4. Open URL in browser
5. Verify app loads correctly
6. Test theme toggle
7. Share URL with collaborator

**Done! Your local dev environment is now accessible remotely! 🚀**
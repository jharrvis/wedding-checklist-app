# 🚀 Deployment Guide

Panduan lengkap untuk deploy Wedding Checklist App ke berbagai platform hosting.

## 📋 Daftar Isi

- [Persiapan Deploy](#persiapan-deploy)
- [GitHub Pages](#github-pages)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [Firebase Hosting](#firebase-hosting)
- [Surge.sh](#surgesh)
- [Custom Server](#custom-server)
- [Domain Custom](#domain-custom)
- [HTTPS & SSL](#https--ssl)
- [Performance Optimization](#performance-optimization)

## 🛠️ Persiapan Deploy

### Pre-deployment Checklist

- [ ] Code telah di-test di berbagai browser
- [ ] Responsive design berfungsi dengan baik
- [ ] localStorage berfungsi normal
- [ ] Semua assets tersedia dan ter-optimized
- [ ] Tidak ada console errors
- [ ] Performance audit passed

### File Structure Verification

```
wedding-checklist/
├── index.html              ✅ Entry point
├── assets/
│   ├── css/
│   │   └── style.css       ✅ Styles
│   ├── js/
│   │   ├── app.js          ✅ Main logic
│   │   └── data.js         ✅ Data
│   └── images/
│       └── favicon.ico     ✅ Icon
├── README.md               ✅ Documentation
└── CNAME                   ⚠️ (Optional - for custom domain)
```

## 🐙 GitHub Pages

### Method 1: GitHub Actions (Recommended)

1. **Create workflow file**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run tests and validation
        run: |
          npm run lint
          npm run validate

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to Pages section
   - Source: GitHub Actions
   - Save

### Method 2: Direct Branch Deploy

1. **Push code to `gh-pages` branch**:

```bash
git checkout -b gh-pages
git push origin gh-pages
```

2. **Configure in repository settings**:
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: gh-pages
   - Folder: / (root)

**Live URL**: `https://yourusername.github.io/wedding-checklist-app`

## 🌐 Netlify

### Method 1: Git Integration (Recommended)

1. **Connect repository**:

   - Sign up at [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select repository

2. **Build settings**:

   - Build command: `npm run build` (or leave empty)
   - Publish directory: `./` (root)
   - Node version: 18

3. **Environment variables** (if needed):
   ```
   NODE_VERSION=18
   ```

### Method 2: Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  publish = "."
  command = "echo 'No build needed'"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Live URL**: `https://your-app-name.netlify.app`

## ⚡ Vercel

### Method 1: Git Integration

1. **Connect repository**:

   - Sign up at [vercel.com](https://vercel.com)
   - Import project from GitHub
   - Select repository

2. **Project settings**:
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: `./`

### Method 2: CLI Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

### Vercel Configuration

Create `vercel.json`:

```json
{
  "version": 2,
  "name": "wedding-checklist-app",
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

**Live URL**: `https://your-app-name.vercel.app`

## 🔥 Firebase Hosting

### Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init hosting

# Select options:
# - What do you want to use as your public directory? (public) → .
# - Configure as a single-page app? (y/N) → y
# - Set up automatic builds and deploys with GitHub? (y/N) → y (optional)
```

### Firebase Configuration

`firebase.json`:

```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Deploy

```bash
# Deploy
firebase deploy

# Deploy with custom message
firebase deploy -m "Version 2.0.0 release"
```

**Live URL**: `https://your-project-id.web.app`

## 🌊 Surge.sh

Simple static hosting for quick deployments:

```bash
# Install Surge
npm install -g surge

# Deploy
surge

# Follow prompts:
# - project path: . (current directory)
# - domain: your-app-name.surge.sh
```

**Live URL**: `https://your-app-name.surge.sh`

## 🖥️ Custom Server

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/wedding-checklist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(css|js|ico|png|jpg|jpeg|gif|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main app
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

### Apache Configuration

Create `.htaccess`:

```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static files
<filesMatch "\.(css|js|ico|png|jpg|jpeg|gif|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</filesMatch>

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

## 🌐 Domain Custom

### DNS Configuration

1. **CNAME Record** (for subdomain):

```
Type: CNAME
Name: wedding (atau subdomain pilihan)
Value: your-app-name.netlify.app
TTL: 3600
```

2. **A Record** (for root domain):

```
Type: A
Name: @
Value: [IP address dari hosting provider]
TTL: 3600
```

### Platform-specific Domain Setup

**Netlify**:

- Dashboard → Domain settings → Add custom domain
- Follow DNS verification process

**Vercel**:

- Project settings → Domains → Add domain
- Configure DNS records as instructed

**GitHub Pages**:

- Repository settings → Pages → Custom domain
- Create `CNAME` file in root with domain name

## 🔒 HTTPS & SSL

### Automatic SSL (Recommended)

Most modern hosting platforms provide automatic SSL:

- **Netlify**: Automatic Let's Encrypt SSL
- **Vercel**: Automatic SSL certificates
- **Firebase**: Built-in SSL
- **GitHub Pages**: Automatic HTTPS for `.github.io` domains

### Force HTTPS

Add to your hosting configuration:

**Netlify** (`_redirects` file):

```
http://yourdomain.com/* https://yourdomain.com/:splat 301!
```

**Vercel** (`vercel.json`):

```json
{
  "redirects": [
    {
      "source": "http://yourdomain.com/(.*)",
      "destination": "https://yourdomain.com/$1",
      "permanent": true
    }
  ]
}
```

## ⚡ Performance Optimization

### Pre-deployment Optimization

1. **Minify CSS & JS**:

```bash
# Install terser for JS minification
npm install -g terser

# Minify JavaScript
terser assets/js/app.js -o assets/js/app.min.js -c -m

# Use minified version in HTML
# <script src="assets/js/app.min.js"></script>
```

2. **Optimize Images**:

```bash
# Install imagemin-cli
npm install -g imagemin-cli

# Optimize images
imagemin assets/images/* --out-dir=assets/images/optimized
```

3. **Enable Compression**:
   - Gzip/Brotli compression on server
   - Most hosting platforms enable this automatically

### Performance Monitoring

**Lighthouse Audit**:

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://yourdomain.com --output html --output-path ./lighthouse-report.html
```

**Target Metrics**:

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### CDN Configuration

For global performance, consider using CDN:

**Cloudflare**:

1. Sign up for free account
2. Add your domain
3. Update nameservers
4. Enable CDN and optimizations

## 🔍 Monitoring & Analytics

### Error Monitoring

Add to `index.html`:

```html
<script>
  window.addEventListener("error", function (e) {
    // Log errors to monitoring service
    console.error("App Error:", e.error);

    // Optional: Send to monitoring service
    // fetch('/api/errors', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         message: e.error.message,
    //         stack: e.error.stack,
    //         url: window.location.href,
    //         timestamp: new Date().toISOString()
    //     })
    // });
  });
</script>
```

### Usage Analytics

Google Analytics 4:

```html
<!-- Google tag (gtag.js) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

## 📝 Deployment Checklist

Before going live:

- [ ] Performance audit completed
- [ ] Cross-browser testing done
- [ ] Mobile responsiveness verified
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)
- [ ] Analytics/monitoring setup
- [ ] Error tracking implemented
- [ ] Backup/restore plan in place
- [ ] Documentation updated
- [ ] Team notified of new deployment

---

## 🆘 Troubleshooting

### Common Issues

**404 Errors**:

- Ensure SPA routing is configured
- Check `.htaccess` or hosting config

**CORS Issues**:

- Static sites shouldn't have CORS issues
- Check if external APIs are being called

**Performance Issues**:

- Enable compression
- Optimize images
- Use CDN

**localStorage Not Working**:

- Check if site is served over HTTPS
- Verify browser compatibility

### Support

- 📧 deployment@weddingchecklist.com
- 💬 [Discord Community](https://discord.gg/wedding-checklist)
- 📝 [GitHub Issues](https://github.com/username/wedding-checklist-app/issues)

---

**Happy deploying! 🚀**

_Your wedding checklist app is ready to help couples worldwide! 💍_

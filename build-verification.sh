#!/bin/bash

echo "🔍 Verifying build prerequisites..."
echo ""

# Check Node.js version
echo "Node.js version:"
node --version

# Check npm version
echo "npm version:"
npm --version

# Check Angular CLI
echo "Angular CLI:"
npx ng version

# Check if package.json exists
if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json missing"
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Generate package-lock.json if missing
if [ ! -f "package-lock.json" ]; then
    echo "📝 Generating package-lock.json..."
    npm install
fi

# Verify package-lock.json
if [ -f "package-lock.json" ]; then
    echo "✅ package-lock.json generated"
else
    echo "❌ Failed to generate package-lock.json"
    exit 1
fi

# Test build
echo ""
echo "🏗️ Testing build..."
npm run build:ssr

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🎉 All checks passed! Ready for CI/CD deployment."

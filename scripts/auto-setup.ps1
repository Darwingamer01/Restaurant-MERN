# Restaurant MERN Auto-Setup Script
# Windows PowerShell script to automate local development setup

param(
    [switch]$SkipDeps,
    [switch]$SkipEnv,
    [switch]$SkipSeed
)

Write-Host "🍽️ Restaurant MERN Auto-Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js not found. Please install Node.js 20.x" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green

# Check npm
$npmVersion = npm --version 2>$null
if (-not $npmVersion) {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
}
Write-Host "✅ npm $npmVersion found" -ForegroundColor Green

# Install dependencies
if (-not $SkipDeps) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    
    npm install --workspaces
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install workspace dependencies" -ForegroundColor Red
        exit 1
    }
    
    # Build shared package
    npm run build --workspace=packages/shared
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to build shared package" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
}

# Environment setup
if (-not $SkipEnv) {
    Write-Host "⚙️ Setting up environment..." -ForegroundColor Yellow
    
    if (-not (Test-Path ".env")) {
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Host "✅ Created .env from .env.example" -ForegroundColor Green
            Write-Host "🔧 Please fill in your .env file with actual values before proceeding" -ForegroundColor Yellow
        } else {
            Write-Host "❌ .env.example not found" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ .env file already exists" -ForegroundColor Green
    }
}

# Database seeding
if (-not $SkipSeed) {
    Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
    
    # Check if .env is properly filled
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "MONGO_URI=$" -or $envContent -match "JWT_SECRET=$") {
        Write-Host "❌ Please fill in your .env file first" -ForegroundColor Red
        Write-Host "Required: MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET" -ForegroundColor Red
        exit 1
    }
    
    npm run seed --workspace=apps/backend
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to seed database" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Database seeded successfully" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. npm run dev (start development servers)" -ForegroundColor White
Write-Host "2. Visit http://localhost:5173 (frontend)" -ForegroundColor White
Write-Host "3. Visit http://localhost:5000/api/v1/health (backend)" -ForegroundColor White

# مجتمع آموزشی قرآنی هدی - اسکریپت راه‌اندازی با Podman در پاورشل

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  مجتمع آموزشی قرآنی هدی - راه‌اندازی کانتینرها با پادمن" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# 1. Start or Init Machine
Write-Host "[1/3] بررسی و روشن‌کردن ماشین پادمن..." -ForegroundColor Yellow
$machineStatus = podman machine list 2>$null
if ($machineStatus -notmatch "Currently running") {
    podman machine start 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ایجاد ماشین پادمن..." -ForegroundColor Gray
        podman machine init
        podman machine start
    }
}

# 2. Up containers
Write-Host "`n[2/3] بیلد و اجرای سرویس‌ها با Podman Compose..." -ForegroundColor Yellow
podman compose -f podman-compose.yml up -d --build

# 3. Show running containers
Write-Host "`n[3/3] کانتینرهای در حال اجرا:" -ForegroundColor Green
podman ps

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  سرویس‌ها با موفقیت فعال شدند!" -ForegroundColor Green
Write-Host "  فرانت‌اند و سایت: http://localhost" -ForegroundColor White
Write-Host "  بک‌اند API:       http://localhost:4000/api/health" -ForegroundColor White
Write-Host "  پایگاه داده:      localhost:5432 (PostgreSQL)" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan

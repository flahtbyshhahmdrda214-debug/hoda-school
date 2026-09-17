@echo off
chcp 65001 > nul
echo ========================================================
echo   مجتمع آموزشی قرآنی هدی - راه‌اندازی با پادمن (Podman)
echo ========================================================
echo.

echo [1/3] بررسی وضعیت Podman Machine...
podman machine start 2>nul
if %errorlevel% neq 0 (
    echo در حال آماده‌سازی اولیه ماشین پادمن...
    podman machine init
    podman machine start
)

echo.
echo [2/3] اجرای سرویس‌ها با Podman Compose...
podman compose -f podman-compose.yml up -d --build

echo.
echo [3/3] وضعیت کانتینرهای فعال:
podman ps

echo.
echo ========================================================
echo   سیستم با موفقیت در کانتینرهای پادمن بالا آمد!
echo   فرانت‌اند و سایت: http://localhost
echo   بک‌اند و API:     http://localhost:4000/api/health
echo   پایگاه داده:      localhost:5432 (PostgreSQL)
echo ========================================================
pause

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$env:NEXT_PUBLIC_SITE_URL = "https://hazedev.xyz"
$env:NEXT_PUBLIC_BASE_PATH = ""

npm run export:pages

$tmp = Join-Path $root ".gh-pages-tmp"
if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
New-Item -ItemType Directory -Path $tmp | Out-Null
Copy-Item -Recurse -Force (Join-Path $root "out\*") $tmp
Set-Content -Path (Join-Path $tmp "CNAME") -Value "hazedev.xyz" -NoNewline

git -C $tmp init | Out-Null
git -C $tmp checkout -b gh-pages | Out-Null
git -C $tmp add -A
git -C $tmp -c user.email="haze@users.noreply.github.com" -c user.name="Haze" commit -m "Deploy portfolio to hazedev.xyz" | Out-Null
git -C $tmp remote add origin https://github.com/HazeDev07/portfolio.git
git -C $tmp push -f origin gh-pages
Remove-Item -Recurse -Force $tmp
Write-Host "Published: https://hazedev.xyz/"

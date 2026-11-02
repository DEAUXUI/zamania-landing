# Скачивает картинки из Figma в папку images\ (Windows).
# Запуск: правой кнопкой -> "Выполнить с помощью PowerShell"
Set-Location $PSScriptRoot
New-Item -ItemType Directory -Force -Path images | Out-Null
Get-Content assets.txt | ForEach-Object {
  $parts = $_ -split ' '
  if ($parts.Length -eq 2) {
    Write-Host "-> $($parts[1])"
    try { Invoke-WebRequest -Uri $parts[0] -OutFile ("images\" + $parts[1]) -UseBasicParsing }
    catch { Write-Host "   ОШИБКА: $($parts[1])" }
  }
}
Write-Host "Готово."

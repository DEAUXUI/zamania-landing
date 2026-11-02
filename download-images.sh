#!/usr/bin/env bash
# Скачивает картинки из Figma в папку images/. Запуск: bash download-images.sh
cd "$(dirname "$0")"
mkdir -p images
while read -r url name; do
  [ -z "$url" ] && continue
  echo "-> $name"
  curl -fsSL -o "images/$name" "$url" || echo "   ОШИБКА: $name"
done < assets.txt
echo "Готово."

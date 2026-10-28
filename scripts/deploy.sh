#!/bin/sh
# Siteyi Dokploy'a yükler: proje klasörünü zip'leyip application.dropDeployment ile gönderir.
# Gerekli .env değişkenleri: DOKPLOY_URL, DOKPLOY_API_KEY, DOKPLOY_APP_ID
set -e
cd "$(dirname "$0")/.."
set -a; . ./.env; set +a
: "${DOKPLOY_URL:?.env içinde DOKPLOY_URL yok}" "${DOKPLOY_API_KEY:?.env içinde DOKPLOY_API_KEY yok}" "${DOKPLOY_APP_ID:?.env içinde DOKPLOY_APP_ID yok}"

rm -f deploy.zip
zip -qr deploy.zip . -x 'node_modules/*' 'data/*' '.env' '.env.production' '.claude/*' '*.DS_Store' 'deploy.zip' 'public/img/logo-original.png'
echo "Yükleniyor: $(du -h deploy.zip | cut -f1)"
curl -sS -f -m 300 -X POST "$DOKPLOY_URL/api/application.dropDeployment" \
  -H "x-api-key: $DOKPLOY_API_KEY" \
  -F "applicationId=$DOKPLOY_APP_ID" \
  -F "zip=@deploy.zip;type=application/zip"
echo
rm -f deploy.zip
echo "Gönderildi. Derleme durumu Dokploy panelinde: $DOKPLOY_URL"

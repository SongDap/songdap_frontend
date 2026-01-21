#!/bin/bash

# ============================================
# SongDap Frontend 배포 스크립트
# CodeDeploy용 (빌드는 GitHub Actions에서 완료됨)
# ============================================

set -e

WEB_ROOT=/var/www/frontend

echo "============================================"
echo "> [프론트엔드 배포] $(date '+%Y-%m-%d %H:%M:%S')"
echo "> WEB_ROOT: $WEB_ROOT"
echo "============================================"

# 1. 배포된 파일 확인
echo "> 배포된 파일 확인..."
ls -la $WEB_ROOT/

# 2. 권한 설정
echo "> 권한 설정 중..."
chown -R www-data:www-data $WEB_ROOT
chmod -R 755 $WEB_ROOT

# 3. Nginx 설정 테스트
echo "> Nginx 설정 테스트..."
nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Nginx 설정 오류!"
    exit 1
fi

# 4. Nginx 리로드
echo "> Nginx 리로드..."
systemctl reload nginx

# 5. 헬스 체크
echo "> 헬스 체크..."
sleep 2

if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|301\|302"; then
    echo "✅ 헬스 체크 통과!"
else
    echo "⚠️ 헬스 체크 실패 (수동 확인 필요)"
fi

echo "============================================"
echo "> [배포 완료] $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

#!/bin/bash

# ============================================
# EC2 프론트엔드 초기 설정 자동화 스크립트
# Ubuntu 24.04 LTS 환경에서 실행
# ============================================

set -e

echo "🚀 SongDap 프론트엔드 EC2 초기 설정을 시작합니다..."
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 변수 설정
NODE_VERSION="20"
FRONTEND_DIR="/home/ubuntu/frontend"
WEB_ROOT="/var/www/frontend"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"

# ============================================
# 1. 시스템 업데이트
# ============================================
echo -e "${YELLOW}[1/6] 시스템 업데이트${NC}"
sudo apt update && sudo apt upgrade -y
echo -e "${GREEN}✅ 시스템 업데이트 완료${NC}"
echo ""

# ============================================
# 2. Nginx 설치
# ============================================
echo -e "${YELLOW}[2/6] Nginx 설치${NC}"

if command -v nginx &> /dev/null; then
    echo -e "${BLUE}ℹ️  Nginx가 이미 설치되어 있습니다.${NC}"
    nginx -v
else
    sudo apt install -y nginx
    echo -e "${GREEN}✅ Nginx 설치 완료${NC}"
fi

# Nginx 서비스 시작 및 활성화
sudo systemctl start nginx
sudo systemctl enable nginx
echo -e "${GREEN}✅ Nginx 서비스 활성화 완료${NC}"
echo ""

# ============================================
# 3. Node.js 설치 (NVM 사용)
# ============================================
echo -e "${YELLOW}[3/6] Node.js $NODE_VERSION 설치${NC}"

if command -v node &> /dev/null; then
    echo -e "${BLUE}ℹ️  Node.js가 이미 설치되어 있습니다.${NC}"
    node --version
else
    # NodeSource 저장소 추가 및 Node.js 설치
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt install -y nodejs
    echo -e "${GREEN}✅ Node.js 설치 완료${NC}"
fi

echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo ""

# ============================================
# 4. 디렉토리 구조 생성
# ============================================
echo -e "${YELLOW}[4/6] 디렉토리 구조 생성${NC}"

# 프론트엔드 작업 디렉토리
mkdir -p $FRONTEND_DIR
mkdir -p /home/ubuntu/frontend-backup

# 웹 루트 디렉토리
sudo mkdir -p $WEB_ROOT/out
sudo chown -R ubuntu:ubuntu $WEB_ROOT
sudo chmod -R 755 $WEB_ROOT

# 로그 디렉토리 권한 확인
sudo mkdir -p /var/log/nginx
sudo chown -R www-data:adm /var/log/nginx

echo -e "${GREEN}✅ 디렉토리 구조 생성 완료${NC}"
echo ""

# ============================================
# 5. Nginx 설정
# ============================================
echo -e "${YELLOW}[5/6] Nginx 설정${NC}"

# 기본 사이트 비활성화
if [ -f "$NGINX_SITES_ENABLED/default" ]; then
    sudo rm $NGINX_SITES_ENABLED/default
    echo "> 기본 사이트 비활성화 완료"
fi

# SongDap Nginx 설정 복사 (프론트엔드 코드에 포함된 경우)
if [ -f "$FRONTEND_DIR/nginx/songdap.conf" ]; then
    sudo cp $FRONTEND_DIR/nginx/songdap.conf $NGINX_SITES_AVAILABLE/songdap
    echo "> Nginx 설정 파일 복사 완료"
else
    # 기본 Nginx 설정 생성
    echo "> 기본 Nginx 설정 파일 생성 중..."
    sudo tee $NGINX_SITES_AVAILABLE/songdap > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;
    
    root /var/www/frontend/out;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/javascript application/javascript application/json;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }

    access_log /var/log/nginx/songdap_access.log;
    error_log /var/log/nginx/songdap_error.log;
}
EOF
fi

# 심볼릭 링크 생성
if [ ! -f "$NGINX_SITES_ENABLED/songdap" ]; then
    sudo ln -s $NGINX_SITES_AVAILABLE/songdap $NGINX_SITES_ENABLED/songdap
fi

# Nginx 설정 테스트
echo "> Nginx 설정 테스트..."
sudo nginx -t

if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx 설정 완료${NC}"
else
    echo -e "${RED}❌ Nginx 설정 오류! 수동으로 확인하세요.${NC}"
    exit 1
fi
echo ""

# ============================================
# 6. 방화벽 설정 (UFW)
# ============================================
echo -e "${YELLOW}[6/6] 방화벽 설정 확인${NC}"

if sudo ufw status | grep -q "Status: active"; then
    echo -e "${BLUE}ℹ️  UFW가 이미 활성화되어 있습니다.${NC}"
    sudo ufw status
else
    read -p "UFW 방화벽을 활성화하시겠습니까? (y/n): " enable_ufw
    if [ "$enable_ufw" = "y" ]; then
        sudo ufw allow 22/tcp   # SSH
        sudo ufw allow 80/tcp   # HTTP
        sudo ufw allow 443/tcp  # HTTPS
        sudo ufw --force enable
        echo -e "${GREEN}✅ UFW 활성화 완료${NC}"
    fi
fi
echo ""

# ============================================
# 완료 메시지
# ============================================
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ 프론트엔드 EC2 초기 설정이 완료되었습니다!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📋 설치된 소프트웨어:"
echo "   - Nginx: $(nginx -v 2>&1 | cut -d'/' -f2)"
echo "   - Node.js: $(node --version)"
echo "   - npm: $(npm --version)"
echo ""
echo "📁 디렉토리 구조:"
echo "   - 프론트엔드 작업: $FRONTEND_DIR"
echo "   - 웹 루트: $WEB_ROOT/out"
echo "   - 백업: /home/ubuntu/frontend-backup"
echo ""
echo "📝 다음 단계:"
echo "1. 로컬에서 프론트엔드 코드 업로드:"
echo "   scp -i key.pem -r ./songdap/* ubuntu@[EC2_IP]:$FRONTEND_DIR/"
echo ""
echo "2. EC2에서 배포 스크립트 실행:"
echo "   cd $FRONTEND_DIR && chmod +x scripts/deploy-frontend.sh"
echo "   ./scripts/deploy-frontend.sh"
echo ""
echo "3. 웹사이트 확인:"
echo "   http://$(curl -s ifconfig.me 2>/dev/null || echo '[EC2_IP]')"
echo ""


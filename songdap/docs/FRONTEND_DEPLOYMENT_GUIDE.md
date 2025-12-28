# SongDap 프론트엔드 배포 가이드

> **최종 업데이트**: 2025-12-28  
> **상태**: 배포 설정 완료 ✅

## 📋 배포 환경 개요

- **프레임워크**: Next.js 15 (App Router)
- **배포 방식**: 정적 배포 (`output: 'export'`)
- **웹 서버**: Nginx
- **EC2**: AWS EC2 (Ubuntu 24.04 LTS)
- **퍼블릭 IP**: `13.209.40.98` (백엔드와 동일 서버)

### 🏗️ 아키텍처

```
                    ┌─────────────────────────────────────┐
                    │           AWS EC2 서버              │
                    │       (13.209.40.98)               │
   인터넷           │                                     │
   사용자  ───────▶ │  ┌─────────────────────────────┐   │
     │              │  │         Nginx (:80)          │   │
     │              │  │  ┌─────────┐  ┌──────────┐  │   │
     └──────────────┼──┼─▶│ 정적파일 │  │  /api/*  │──┼───┤
                    │  │  │ (out/)  │  │  프록시   │  │   │
                    │  │  └─────────┘  └────┬─────┘  │   │
                    │  └────────────────────┼────────┘   │
                    │                       │            │
                    │                       ▼            │
                    │          ┌─────────────────┐       │
                    │          │ Spring Boot     │       │
                    │          │ (:8080)         │       │
                    │          └─────────────────┘       │
                    └─────────────────────────────────────┘
```

---

## 🚀 배포 프로세스 개요

1. **EC2 초기 설정** (최초 1회)
2. **프론트엔드 코드 업로드**
3. **빌드 및 배포**
4. **SSL 인증서 설정** (선택사항)

---

## 📝 Part 1: EC2 초기 설정 (최초 1회)

### 자동 설정 스크립트 사용 (권장)

```bash
# EC2 접속
ssh -i "NoDap-Server-pem.pem" ubuntu@13.209.40.98

# 초기 설정 스크립트 실행
chmod +x scripts/ec2-frontend-setup.sh
./scripts/ec2-frontend-setup.sh
```

### 수동 설정

#### Step 1: 시스템 업데이트 및 Nginx 설치

```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Nginx 설치
sudo apt install -y nginx

# Nginx 서비스 시작 및 활성화
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Step 2: Node.js 설치

```bash
# NodeSource 저장소 추가
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js 설치
sudo apt install -y nodejs

# 버전 확인
node --version  # v20.x.x
npm --version   # 10.x.x
```

#### Step 3: 디렉토리 구조 생성

```bash
# 프론트엔드 작업 디렉토리
mkdir -p ~/frontend
mkdir -p ~/frontend-backup

# 웹 루트 디렉토리
sudo mkdir -p /var/www/frontend/out
sudo chown -R ubuntu:ubuntu /var/www/frontend
```

#### Step 4: Nginx 설정

```bash
# 기본 사이트 비활성화
sudo rm /etc/nginx/sites-enabled/default

# SongDap 설정 복사
sudo cp ~/frontend/nginx/songdap.conf /etc/nginx/sites-available/songdap

# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/songdap /etc/nginx/sites-enabled/songdap

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl reload nginx
```

---

## 📝 Part 2: 프론트엔드 코드 업로드

### 방법 A: SCP로 직접 업로드 (개발/테스트용)

**로컬 터미널에서 실행:**

```bash
# 프론트엔드 코드 업로드
scp -i "NoDap-Server-pem.pem" -r ./songdap/* ubuntu@13.209.40.98:~/frontend/
```

### 방법 B: Git Clone (프로덕션 권장)

**EC2에서 실행:**

```bash
cd ~/frontend
git clone https://github.com/your-org/songdap_frontend.git .
```

### 방법 C: AWS CodeDeploy (CI/CD)

`appspec.yml`이 이미 설정되어 있으므로, GitHub Actions와 연동하여 자동 배포 가능.

---

## 📝 Part 3: 빌드 및 배포

### 배포 스크립트 사용 (권장)

```bash
# EC2에서 실행
cd ~/frontend
chmod +x scripts/deploy-frontend.sh
./scripts/deploy-frontend.sh
```

### 수동 배포

```bash
# 1. 의존성 설치
cd ~/frontend
npm ci

# 2. 빌드 (정적 파일 생성)
npm run build

# 3. 빌드 결과 확인
ls -la out/

# 4. 배포
sudo cp -r out/* /var/www/frontend/out/
sudo chown -R www-data:www-data /var/www/frontend/out

# 5. Nginx 재시작
sudo systemctl reload nginx
```

---

## 📝 Part 4: SSL 인증서 설정 (HTTPS)

### Let's Encrypt 무료 인증서 설치

```bash
# Certbot 설치
sudo apt install -y certbot python3-certbot-nginx

# 인증서 발급 (도메인이 있어야 함)
sudo certbot --nginx -d songdap.com -d www.songdap.com

# 자동 갱신 확인
sudo certbot renew --dry-run
```

### Nginx HTTPS 설정

인증서 발급 후 `nginx/songdap.conf`의 주석 처리된 HTTPS 설정을 활성화:

```nginx
server {
    listen 443 ssl http2;
    server_name songdap.com www.songdap.com;

    ssl_certificate /etc/letsencrypt/live/songdap.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/songdap.com/privkey.pem;
    
    # ... 나머지 설정
}

# HTTP -> HTTPS 리다이렉트
server {
    listen 80;
    server_name songdap.com www.songdap.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 🔧 환경 변수 설정

### Next.js 환경 변수 (빌드 시점)

`.env.production` 파일 생성:

```bash
# ~/frontend/.env.production
NEXT_PUBLIC_API_URL=http://13.209.40.98:8080
NEXT_PUBLIC_SITE_URL=http://13.209.40.98
```

> ⚠️ **주의**: `NEXT_PUBLIC_` 접두사가 있는 변수만 클라이언트에 노출됩니다.

---

## 📊 유용한 명령어

### Nginx 관리

```bash
# 서비스 상태 확인
sudo systemctl status nginx

# 서비스 재시작
sudo systemctl restart nginx

# 설정만 리로드 (무중단)
sudo systemctl reload nginx

# 설정 테스트
sudo nginx -t

# 실시간 액세스 로그
sudo tail -f /var/log/nginx/songdap_access.log

# 에러 로그
sudo tail -f /var/log/nginx/songdap_error.log
```

### 배포 관련

```bash
# 현재 배포 버전 확인
ls -la /var/www/frontend/out/

# 디스크 사용량 확인
du -sh /var/www/frontend/out/

# 백업 목록 확인
ls -la ~/frontend-backup/

# 이전 버전으로 롤백
sudo rm -rf /var/www/frontend/out
sudo cp -r ~/frontend-backup/backup_YYYYMMDD_HHMMSS /var/www/frontend/out
sudo systemctl reload nginx
```

---

## 🚨 문제 해결

### 404 에러 발생

```bash
# 파일 존재 확인
ls -la /var/www/frontend/out/

# Nginx 설정 확인
cat /etc/nginx/sites-enabled/songdap

# try_files 설정이 올바른지 확인
# try_files $uri $uri.html $uri/ /index.html;
```

### 빌드 실패

```bash
# Node.js 버전 확인
node --version  # v20 이상 필요

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 메모리 부족 시
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### API 프록시 오류

```bash
# 백엔드 서버 실행 확인
sudo systemctl status nodap

# 포트 확인
sudo netstat -tlnp | grep 8080

# Nginx 에러 로그 확인
sudo tail -f /var/log/nginx/songdap_error.log
```

### 권한 오류

```bash
# 웹 루트 권한 재설정
sudo chown -R www-data:www-data /var/www/frontend
sudo chmod -R 755 /var/www/frontend
```

---

## ✅ 배포 체크리스트

### EC2 초기 설정
- [ ] Nginx 설치 및 실행
- [ ] Node.js 20.x 설치
- [ ] 디렉토리 구조 생성 (`/var/www/frontend/out`)
- [ ] Nginx 설정 파일 적용
- [ ] 방화벽 설정 (80, 443 포트)

### 배포
- [ ] 프론트엔드 코드 업로드
- [ ] 의존성 설치 (`npm ci`)
- [ ] 빌드 성공 (`npm run build`)
- [ ] 정적 파일 배포 (`out/` → `/var/www/frontend/out/`)
- [ ] Nginx 리로드
- [ ] 웹사이트 접속 테스트

### 프로덕션 (선택)
- [ ] 도메인 연결
- [ ] SSL 인증서 설치
- [ ] HTTPS 리다이렉트 설정
- [ ] 환경 변수 설정

---

## 📁 프로젝트 구조

```
songdap/
├── appspec.yml              # AWS CodeDeploy 설정
├── nginx/
│   └── songdap.conf         # Nginx 설정 파일
├── scripts/
│   ├── deploy-frontend.sh   # 배포 스크립트
│   └── ec2-frontend-setup.sh # EC2 초기 설정 스크립트
├── docs/
│   └── FRONTEND_DEPLOYMENT_GUIDE.md  # 이 문서
├── src/                     # 소스 코드
├── public/                  # 정적 파일
├── out/                     # 빌드 결과 (생성됨)
├── next.config.ts           # Next.js 설정
└── package.json
```

---

## 📞 참고 자료

- [Next.js 정적 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [Let's Encrypt 인증서](https://letsencrypt.org/docs/)
- [AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/)


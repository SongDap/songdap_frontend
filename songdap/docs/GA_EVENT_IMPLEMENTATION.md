# Google Analytics 이벤트 추적 구현 문서

## 개요
이 문서는 노래로 답해줘 서비스에 실제로 구현된 Google Analytics 이벤트 추적 내용을 정리한 문서입니다.

## GA 이벤트 구조

### 이벤트 추적 함수
```typescript
trackEvent(
  payload: GAEvent,      // GA4 표준 이벤트 파라미터
  extras?: GAEventExtras // 커스텀 파라미터 (category, action, label)
)
```

### 이벤트 구분 원칙
- **버튼 클릭 시**: `select_content` 이벤트 사용 (사용자 액션 추적)
- **완료 시**: 각각의 완료 이벤트 사용 (비즈니스 로직 완료 추적)

## 구현된 GA 이벤트 목록

### 1. 인증 (Authentication)

#### 1.1 로그인 버튼 클릭
**위치**: `LandingMain.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "cta", item_id: "landing_kakao_login" },
  { category: "navigation", action: "click_button", label: "landing_kakao_login" }
);
```
- **트리거**: 카카오 로그인 버튼 클릭 시
- **목적**: 로그인 시도 추적

#### 1.2 회원가입 버튼 클릭
**위치**: `SignupForm.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "signup_button", item_id: "signup_submit" },
  { category: "authentication", action: "sign_up_click", label: "signup_form" }
);
```
- **트리거**: 회원가입하기 버튼 클릭 시
- **목적**: 회원가입 시도 추적

#### 1.3 회원가입 완료
**위치**: `SignupForm.tsx`
```typescript
trackEvent(
  { event: "sign_up", method: "kakao" },
  { category: "authentication", action: "sign_up", label: "onboarding" }
);
```
- **트리거**: 회원가입 API 성공 후
- **목적**: 회원가입 완료 추적

#### 1.4 프로필 이미지 업로드 (회원가입)
**위치**: `SignupForm.tsx`
```typescript
trackEvent(
  { event: "upload_image", file_size_kb: Math.round(file.size / 1024) },
  { category: "profile", action: "upload_image", label: "signup_profile_image" }
);
```
- **트리거**: 프로필 이미지 파일 선택 시
- **목적**: 회원가입 시 프로필 이미지 업로드 추적

### 2. 앨범 (Album)

#### 2.1 앨범 생성 버튼 클릭 (앨범 목록 페이지)
**위치**: `AlbumListPageClient.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "cta", item_id: "album_create" },
  { category: "album", action: "create_click", label: "album_list_pc" } // 또는 "album_list_mobile"
);
```
- **트리거**: "새 앨범 만들기" 버튼 클릭 시
- **목적**: 앨범 생성 시작 추적

#### 2.2 앨범 생성 버튼 클릭 (앨범 생성 폼)
**위치**: `CreateAlbumForm.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "album_create_button", item_id: "album_create_submit" },
  { category: "album", action: "create_click", label: "album_create_form" }
);
```
- **트리거**: 앨범 생성 폼의 "완료" 버튼 클릭 시
- **목적**: 앨범 생성 제출 추적

#### 2.3 앨범 생성 완료
**위치**: `CreateAlbumForm.tsx`
```typescript
trackEvent(
  { event: "create_album", item_id: albumUuid },
  { category: "album", action: "create", label: albumUuid }
);
```
- **트리거**: 앨범 생성 API 성공 후
- **목적**: 앨범 생성 완료 추적

#### 2.4 앨범 목록 조회
**위치**: `AlbumListPageClient.tsx`
```typescript
trackEvent(
  {
    event: "view_item_list",
    item_list_name: "album_list",
    items: baseItems
      .filter((item) => Boolean(item.uuid))
      .map((item) => ({ item_id: item.uuid })),
  },
  { category: "album", action: "view_list", label: String(page) }
);
```
- **트리거**: 앨범 목록 데이터 로드 완료 시
- **목적**: 앨범 목록 조회 추적 (items 배열로 상세 정보 전달)

#### 2.5 앨범 수정 버튼 클릭 (공유 페이지)
**위치**: `AlbumShareContent.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "album_edit_button", item_id: albumData?.uuid || "" },
  { category: "album", action: "edit_click", label: albumData?.uuid || "" }
);
```
- **트리거**: 앨범 공유 페이지의 "수정" 버튼 클릭 시
- **목적**: 앨범 수정 시작 추적

#### 2.6 앨범 수정 취소 버튼 클릭
**위치**: `EditAlbumForm.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "album_edit_cancel", item_id: "album_edit_cancel" },
  { category: "album", action: "edit_cancel_click", label: "album_edit_form" }
);
```
- **트리거**: 앨범 수정 폼의 "취소" 버튼 클릭 시
- **목적**: 앨범 수정 취소 추적

#### 2.7 앨범 수정 완료 버튼 클릭
**위치**: `EditAlbumForm.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "album_edit_button", item_id: "album_edit_submit" },
  { category: "album", action: "edit_click", label: "album_edit_form" }
);
```
- **트리거**: 앨범 수정 폼의 "완료" 버튼 클릭 시
- **목적**: 앨범 수정 제출 추적

#### 2.8 앨범 공유 (링크 복사) 버튼 클릭
**위치**: `AlbumShareContent.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "album_share_link", item_id: albumData?.uuid || "" },
  { category: "album", action: "share_link_click", label: albumData?.uuid || "" }
);
```
- **트리거**: "링크 복사하기" 버튼 클릭 시
- **목적**: 링크 복사 시도 추적

#### 2.9 앨범 공유 (링크 복사) 완료
**위치**: `AlbumShareContent.tsx`
```typescript
trackEvent(
  { event: "share_album", item_id: albumData.uuid },
  { category: "album", action: "share", label: albumData.uuid }
);
```
- **트리거**: 링크 복사 성공 후
- **목적**: 링크 복사 완료 추적

#### 2.10 앨범 공유 (카카오톡) 버튼 클릭
**위치**: `AlbumShareContent.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "album_share_kakao", item_id: albumData?.uuid || "" },
  { category: "album", action: "share_kakao_click", label: albumData?.uuid || "" }
);
```
- **트리거**: "카카오톡으로 공유하기" 버튼 클릭 시
- **목적**: 카카오톡 공유 시도 추적

#### 2.11 앨범 공유 (카카오톡) 완료
**위치**: `AlbumShareContent.tsx`
```typescript
trackEvent(
  { event: "share_album", item_id: albumData.uuid },
  { category: "album", action: "share_kakao", label: albumData.uuid }
);
```
- **트리거**: 카카오톡 공유 성공 후
- **목적**: 카카오톡 공유 완료 추적

#### 2.12 앨범 공유 완료 버튼 클릭
**위치**: `AlbumShareContent.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "album_share_complete", item_id: albumData?.uuid || "" },
  { category: "album", action: "share_complete_click", label: albumData?.uuid || "" }
);
```
- **트리거**: 앨범 공유 페이지의 "완료" 버튼 클릭 시
- **목적**: 공유 완료 버튼 클릭 추적

### 3. 노래 (Song)

#### 3.1 노래 추가 버튼 클릭 (앨범 상세 페이지)
**위치**: `AlbumDetailContent.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "song_add_from_detail", item_id: albumUuid },
  { category: "song", action: "add_click", label: albumUuid }
);
```
- **트리거**: 앨범 상세 페이지의 "+ 노래 추가" 버튼 클릭 시
- **목적**: 노래 추가 시작 추적

#### 3.2 스포티파이 검색 버튼 클릭
**위치**: `SongAddPage.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "spotify_search", item_id: albumId || "" },
  { category: "song", action: "search_click", label: albumId || "" }
);
```
- **트리거**: 스포티파이 검색 버튼 클릭 시
- **목적**: 스포티파이 검색 시도 추적

#### 3.3 노래 이미지 업로드
**위치**: `SongAddPage.tsx`
```typescript
trackEvent(
  { event: "upload_song_image", file_size_kb: Math.round(file.size / 1024) },
  { category: "song", action: "upload_image", label: albumId || "" }
);
```
- **트리거**: 노래 이미지 파일 선택 시
- **목적**: 노래 이미지 업로드 추적

#### 3.4 노래 추가 다음 단계 버튼 클릭
**위치**: `SongAddPage.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "song_add_next", item_id: albumId || "" },
  { category: "song", action: "next_step", label: albumId || "" }
);
```
- **트리거**: 노래 추가 폼의 "다음" 버튼 클릭 시
- **목적**: 다음 단계 이동 추적

#### 3.5 노래 추가 완료 버튼 클릭
**위치**: `SongAddPage.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "song_add_submit", item_id: albumId || "" },
  { category: "song", action: "add_click", label: albumId || "" }
);
```
- **트리거**: 노래 추가 폼의 "완료" 버튼 클릭 시
- **목적**: 노래 추가 제출 추적

#### 3.6 노래 추가 완료
**위치**: `SongAddPage.tsx`
```typescript
trackEvent(
  { event: "add_to_cart", items: [{ item_id: songKey }] },
  { category: "song", action: "add", label: targetAlbumId }
);
```
- **트리거**: 노래 추가 API 성공 후
- **목적**: 노래 추가 완료 추적
- **참고**: `songKey` 형식: `song:{albumId}:{title}-{artist}`

#### 3.7 노래 추가 완료 페이지 - 노래 추가하기 버튼 클릭
**위치**: `SongAddCompletedPage.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "song_add_more", item_id: albumId || "" },
  { category: "song", action: "add_more_click", label: albumId || "" }
);
```
- **트리거**: 노래 추가 완료 페이지의 "노래 추가하기" 버튼 클릭 시
- **목적**: 추가 노래 추가 시작 추적

#### 3.8 노래 추가 완료 페이지 - 앨범 생성하기 버튼 클릭
**위치**: `SongAddCompletedPage.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "album_create_from_completed", item_id: "album_create_from_song_completed" },
  { category: "album", action: "create_click", label: "song_add_completed_page" }
);
```
- **트리거**: 노래 추가 완료 페이지의 "앨범 생성하기" 버튼 클릭 시
- **목적**: 앨범 생성 시작 추적

### 4. 프로필 (Profile)

#### 4.1 프로필 수정 버튼 클릭
**위치**: `ProfileEditForm.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "profile_edit_button", item_id: "profile_edit_submit" },
  { category: "profile", action: "edit_click", label: "profile_edit_form" }
);
```
- **트리거**: 프로필 수정 폼의 "수정하기" 버튼 클릭 시
- **목적**: 프로필 수정 제출 추적

#### 4.2 프로필 수정 완료
**위치**: `ProfileEditPage.tsx`
```typescript
trackEvent(
  { event: "update_profile", field: "nickname" },
  { category: "profile", action: "edit_complete", label: updated.nickname }
);
```
- **트리거**: 프로필 수정 API 성공 후
- **목적**: 프로필 수정 완료 추적

#### 4.3 회원탈퇴 버튼 클릭
**위치**: `WithdrawalForm.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "withdraw_button", item_id: "withdraw_submit" },
  { category: "profile", action: "withdraw_click", label: "withdraw_form" }
);
```
- **트리거**: 회원탈퇴 폼의 "회원 탈퇴" 버튼 클릭 시
- **목적**: 회원탈퇴 제출 추적

#### 4.4 회원탈퇴 완료
**위치**: `ProfileWithdrawPage.tsx`
```typescript
trackEvent(
  { event: "withdraw", reason: primaryReason },
  { category: "profile", action: "withdraw", label: primaryReason }
);
```
- **트리거**: 회원탈퇴 API 성공 후
- **목적**: 회원탈퇴 완료 추적
- **참고**: `primaryReason` 값: `HARD_TO_USE`, `NOT_THE_SERVICE`, `FOUND_BETTER`, `OTHER`

### 5. 네비게이션 (Navigation)

#### 5.1 내 앨범 보기 버튼 클릭 (랜딩 페이지)
**위치**: `LandingMain.tsx`
```typescript
trackEvent(
  { event: "select_content", content_type: "cta", item_id: "landing_album_list" },
  { category: "navigation", action: "click_button", label: "landing_album_list" }
);
```
- **트리거**: 랜딩 페이지의 "내 앨범 보기" 버튼 클릭 시
- **목적**: 앨범 목록으로 이동 추적

## 이벤트 추적 패턴

### 패턴 1: 버튼 클릭 추적
모든 주요 버튼의 `onClick`에 직접 `trackEvent`를 추가하여 사용자 클릭을 추적합니다.

```typescript
<button
  onClick={() => {
    trackEvent(
      { event: "select_content", content_type: "버튼_타입", item_id: "버튼_식별자" },
      { category: "카테고리", action: "액션_click", label: "라벨" }
    );
    // 실제 핸들러 실행
    handleAction();
  }}
>
  버튼 텍스트
</button>
```

### 패턴 2: 완료 이벤트 추적
비즈니스 로직이 성공적으로 완료된 후에 완료 이벤트를 추적합니다.

```typescript
try {
  const result = await apiCall();
  
  // 완료 이벤트 추적
  trackEvent(
    { event: "완료_이벤트", ...완료_파라미터 },
    { category: "카테고리", action: "액션", label: "라벨" }
  );
  
  // 다음 단계로 이동
} catch (error) {
  // 에러 처리
}
```

## GA4 표준 이벤트 사용

다음 GA4 표준 이벤트를 사용합니다:
- `select_content`: 콘텐츠 선택 (버튼 클릭 등)
- `view_item_list`: 아이템 목록 조회
- `add_to_cart`: 장바구니 추가 (노래 추가)
- `share_album`: 앨범 공유
- `sign_up`: 회원가입
- `update_profile`: 프로필 업데이트
- `withdraw`: 회원탈퇴

## 커스텀 이벤트

다음 커스텀 이벤트를 사용합니다:
- `create_album`: 앨범 생성
- `upload_image`: 이미지 업로드
- `upload_song_image`: 노래 이미지 업로드

## 주의사항

1. **개인정보 보호**: Label에 개인정보(이름, 이메일 등)를 포함하지 않습니다.
2. **일관성**: `content_type`과 `item_id`는 일관된 형식을 사용합니다.
3. **버튼 클릭 vs 완료**: 버튼 클릭은 사용자 액션, 완료는 비즈니스 로직 완료를 구분합니다.
4. **타입 안정성**: `GAEvent` 타입을 사용하여 허용된 이벤트만 사용 가능합니다.

## 파일별 구현 현황

### 완료된 파일
- ✅ `LandingMain.tsx` - 로그인 버튼, 내 앨범 보기 버튼
- ✅ `SignupForm.tsx` - 회원가입 버튼, 프로필 이미지 업로드, 회원가입 완료
- ✅ `CreateAlbumForm.tsx` - 앨범 생성 버튼, 앨범 생성 완료
- ✅ `EditAlbumForm.tsx` - 앨범 수정 취소/완료 버튼
- ✅ `AlbumListPageClient.tsx` - 앨범 목록 조회, 앨범 생성 버튼
- ✅ `AlbumShareContent.tsx` - 공유 버튼들, 수정 버튼, 완료 버튼
- ✅ `AlbumDetailContent.tsx` - 노래 추가 버튼
- ✅ `SongAddPage.tsx` - 스포티파이 검색, 이미지 업로드, 다음/완료 버튼, 노래 추가 완료
- ✅ `SongAddCompletedPage.tsx` - 노래 추가하기, 앨범 생성하기 버튼
- ✅ `ProfileEditForm.tsx` - 프로필 수정 버튼
- ✅ `ProfileEditPage.tsx` - 프로필 수정 완료
- ✅ `WithdrawalForm.tsx` - 회원탈퇴 버튼
- ✅ `ProfileWithdrawPage.tsx` - 회원탈퇴 완료

## 이벤트 추적 통계

### 카테고리별 이벤트 수
- **authentication**: 4개 (로그인, 회원가입, 프로필 이미지 업로드)
- **album**: 12개 (생성, 수정, 조회, 공유)
- **song**: 8개 (추가, 검색, 이미지 업로드)
- **profile**: 4개 (수정, 탈퇴)
- **navigation**: 1개 (내 앨범 보기)

### 총 이벤트 수
- **버튼 클릭 이벤트**: 18개
- **완료 이벤트**: 11개
- **총 29개 이벤트** 구현 완료

## 업데이트 이력

- 2024년: GA4 표준 이벤트 중심 설계로 전환
- 버튼 클릭과 완료 이벤트 구분 적용
- 모든 주요 버튼에 클릭 추적 추가
- 총 29개 이벤트 구현 완료


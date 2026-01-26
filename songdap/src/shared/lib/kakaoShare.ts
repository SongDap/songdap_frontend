/**
 * KakaoTalk Share (JavaScript SDK)
 *
 * - SDK를 필요 시점에만 동적으로 로드합니다.
 * - sendDefault로 텍플릿을 전송합니다. (공식 문서 방식)
 * - env: NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY 필요
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

// 공식 문서 예시 그대로 사용
const KAKAO_SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.7/kakao.min.js";
const KAKAO_SDK_INTEGRITY =
  "sha384-tJkjbtDbvoxO+diRuDtwRO9JXR7pjWnfjfRn5ePUpl7e7RJCxKCwwnfqUAdXh53p";

let kakaoLoadPromise: Promise<void> | null = null;

function loadScriptOnce(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") return reject(new Error("document is undefined"));

    const existing = document.querySelector(
      `script[data-kakao-sdk="true"][src="${KAKAO_SDK_SRC}"]`
    );
    if (existing) return resolve();

    const script = document.createElement("script");
    script.src = KAKAO_SDK_SRC;
    script.async = true;
    script.defer = true;
    // 문서 예시처럼 SRI 적용
    script.integrity = KAKAO_SDK_INTEGRITY;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-kakao-sdk", "true");
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error(`Failed to load Kakao SDK: ${KAKAO_SDK_SRC}`));
    document.head.appendChild(script);
  });
}

async function ensureKakaoSdkLoaded(): Promise<any> {
  if (typeof window === "undefined") throw new Error("window is undefined");

  if (window.Kakao) return window.Kakao;

  if (!kakaoLoadPromise) {
    kakaoLoadPromise = (async () => {
      await loadScriptOnce();
    })();
  }

  await kakaoLoadPromise;
  if (!window.Kakao) throw new Error("Kakao SDK loaded but window.Kakao is missing");
  return window.Kakao;
}

async function ensureKakaoInitialized(): Promise<any> {
  const Kakao = await ensureKakaoSdkLoaded();
  const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY is missing");

  try {
    if (typeof Kakao.isInitialized === "function" && Kakao.isInitialized()) return Kakao;
  } catch {
    // ignore
  }

  if (typeof Kakao.init === "function") {
    Kakao.init(key);
  }

  return Kakao;
}

export async function shareKakaoText(params: {
  text: string;
  url: string;
  buttonTitle?: string;
}): Promise<void> {
  const Kakao = await ensureKakaoInitialized();

  // Kakao.Share.sendDefault (text template)
  if (!Kakao?.Share?.sendDefault) {
    throw new Error("Kakao.Share.sendDefault is not available");
  }

  Kakao.Share.sendDefault({
    objectType: "text",
    text: params.text.slice(0, 200),
    link: {
      webUrl: params.url,
      mobileWebUrl: params.url,
    },
    buttonTitle: params.buttonTitle ?? "링크 열기",
  });
}

export async function shareKakaoFeed(params: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  buttonTitle?: string;
}): Promise<void> {
  const Kakao = await ensureKakaoInitialized();

  if (!Kakao?.Share?.sendDefault) {
    throw new Error("Kakao.Share.sendDefault is not available");
  }

  const resolvedImageUrl =
    params.imageUrl && params.imageUrl.trim().length > 0
      ? params.imageUrl.trim()
      : `${window.location.origin}/images/logo.png`;

  Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: params.title,
      description: params.description,
      imageUrl: resolvedImageUrl,
      link: {
        mobileWebUrl: params.url,
        webUrl: params.url,
      },
    },
    buttons: [
      {
        title: params.buttonTitle ?? "노래 추가하기",
        link: {
          mobileWebUrl: params.url,
          webUrl: params.url,
        },
      },
    ],
  });
}


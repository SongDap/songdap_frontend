/**
 * KakaoTalk Share (JavaScript SDK)
 *
 * - SDK를 필요 시점에만 동적으로 로드합니다.
 * - 텍스트 템플릿(objectType: "text")을 사용해서 이미지/OG 의존성을 낮춥니다.
 * - env: NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY 필요
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

const KAKAO_SDK_SRC_CANDIDATES = [
  // 최신 버전이 바뀔 수 있어 후보를 여러 개 둠 (첫 성공 로드 사용)
  "https://t1.kakaocdn.net/kakao_js_sdk/2.7.6/kakao.min.js",
  "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js",
  "https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js",
] as const;

let kakaoLoadPromise: Promise<void> | null = null;

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") return reject(new Error("document is undefined"));

    const existing = document.querySelector(`script[data-kakao-sdk="true"][src="${src}"]`);
    if (existing) return resolve();

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-kakao-sdk", "true");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load Kakao SDK: ${src}`));
    document.head.appendChild(script);
  });
}

async function ensureKakaoSdkLoaded(): Promise<any> {
  if (typeof window === "undefined") throw new Error("window is undefined");

  if (window.Kakao) return window.Kakao;

  if (!kakaoLoadPromise) {
    kakaoLoadPromise = (async () => {
      let lastErr: unknown = null;
      for (const src of KAKAO_SDK_SRC_CANDIDATES) {
        try {
          await loadScriptOnce(src);
          return;
        } catch (e) {
          lastErr = e;
        }
      }
      throw lastErr ?? new Error("Failed to load Kakao SDK");
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


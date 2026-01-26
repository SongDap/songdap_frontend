/**
 * 공통 API 응답 처리 유틸리티
 */

/**
 * 백엔드 응답에서 data 필드 추출
 * 
 * 지원하는 응답 구조:
 * - { code, message, data: {...} }
 * - { success, message, data: {...} }
 * - { data: {...} } (바로 data 필드)
 * - {...} (바로 데이터 구조)
 * 
 * @template T 추출할 데이터의 타입
 * @param responseData 백엔드 응답 데이터
 * @returns 추출된 데이터 또는 null
 */
export function extractDataFromResponse<T>(responseData: any): T | null {
  if (!responseData || typeof responseData !== 'object') {
    return null;
  }

  // { code, message, data } 또는 { success, message, data } 구조
  if ('data' in responseData && responseData.data) {
    return responseData.data as T;
  }

  // 바로 데이터 구조 ({ code, message } 형식의 경우 data 필드가 필수)
  return responseData as T;
}

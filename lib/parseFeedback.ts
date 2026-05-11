/**
 * 백엔드가 Python dict repr 형식으로 내려주는 strengths/improvements 문자열을
 * 표시용 항목 배열로 변환한다.
 *
 * 지원 형식:
 *   - Python dict: {'key': 'value', 'key2': ['item1', 'item2']}
 *   - 줄바꿈 구분 일반 텍스트
 */

export interface FeedbackItem {
  label: string
  text: string
}

const KEY_LABELS: Record<string, string> = {
  posture: '자세',
  specific_relevance: '주제 연관성',
  answer_clarity: '답변 명확성',
  eye_contact: '눈 맞춤',
  structure_and_delivery: '구조 및 전달력',
  improvement_examples: '개선 예시',
}

function getLabel(key: string): string {
  return KEY_LABELS[key] ?? key
}

// (변수명: 수치) 형태의 괄호 내용 제거 — LLM이 score 정보를 포함할 때 가드
function cleanText(text: string): string {
  return text.replace(/\s*\([^)]+\)/g, '').trim()
}

export function parseFeedbackItems(
  raw: string | null | undefined,
  maxItems?: number
): FeedbackItem[] {
  if (!raw) return []
  const text = raw.trim()

  if (!text.startsWith('{')) {
    const items = text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({ label: '', text: cleanText(s) }))
    return maxItems != null ? items.slice(0, maxItems) : items
  }

  // Python dict repr 형식: key-value 쌍을 순서대로 추출
  const inner = text.slice(1, -1)
  const results: FeedbackItem[] = []
  const pairPattern = /'([a-z_]+)':\s*(?:'([^']*)'|\[([^\]]*)\])/g
  let match: RegExpExecArray | null

  while ((match = pairPattern.exec(inner)) !== null) {
    if (maxItems != null && results.length >= maxItems) break

    const label = getLabel(match[1])

    if (match[2] !== undefined) {
      const val = cleanText(match[2])
      if (val) results.push({ label, text: val })
    } else if (match[3] !== undefined) {
      const itemPattern = /'([^']*)'/g
      let itemMatch: RegExpExecArray | null
      while ((itemMatch = itemPattern.exec(match[3])) !== null) {
        if (maxItems != null && results.length >= maxItems) break
        const val = cleanText(itemMatch[1])
        if (val) results.push({ label, text: val })
      }
    }
  }

  return results
}

// SessionSummary 등 텍스트만 필요한 곳에서 사용
export function parseFeedbackText(raw: string | null | undefined): string[] {
  return parseFeedbackItems(raw).map((item) => item.text)
}

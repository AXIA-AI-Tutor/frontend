/**
 * 백엔드가 내려주는 strengths/improvements 문자열을 표시용 항목 배열로 변환한다.
 *
 * 지원 형식:
 *   - Python dict: {'key': 'value', 'key2': ['item1', 'item2']}
 *   - 번호+볼드 plain text: "1. **레이블**: 내용\n2. **레이블**: 내용"
 *   - 번호 plain text: "1. 내용\n2. 내용"
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

// ** 마크다운 볼드, (변수명: 수치) 괄호, 선행 '- ' 제거
function cleanText(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/\s*\([^)]+\)/g, '')
    .replace(/^-\s+/, '')
    .trim()
}

// "1. **레이블**: 내용", "- **레이블**: 내용", "1. 내용" 형태의 줄을 FeedbackItem으로 파싱
function parseTextLine(line: string): FeedbackItem {
  const numberedBoldLabel = line.match(/^\d+\.\s+\*\*([^*]+)\*\*:\s*(.+)/)
  if (numberedBoldLabel) {
    return {
      label: numberedBoldLabel[1].trim(),
      text: cleanText(numberedBoldLabel[2]),
    }
  }
  const dashBoldLabel = line.match(/^-\s+\*\*([^*]+)\*\*:\s*(.+)/)
  if (dashBoldLabel) {
    return { label: dashBoldLabel[1].trim(), text: cleanText(dashBoldLabel[2]) }
  }
  const numbered = line.match(/^\d+\.\s+(.+)/)
  if (numbered) {
    return { label: '', text: cleanText(numbered[1]) }
  }
  return { label: '', text: cleanText(line) }
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
      .map(parseTextLine)
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

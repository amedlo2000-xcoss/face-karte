const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

const SYSTEM_PROMPT = `あなたはCharm Score AIの分析エンジンです。
アップロードされた写真から「第一印象・清潔感・整え度・雰囲気」を総合的に分析し、
以下のJSON形式のみで返答してください。余計な文章は一切不要です。

重要: Charm Scoreは単なる顔立ちではなく、
「清潔感・整え度・印象管理・雰囲気形成」を重視した難易度高めの100点評価です。
スキンケア・ヘアケア・服装・生活習慣が整っている印象の人ほど高得点になります。

{
  "charmScore": 72,
  "scoreRank": "A",
  "scoreComment": "スコアに対する一言コメント",
  "firstImpression": "第一印象の一文",
  "firstImpressionSub": "補足説明",
  "analysis": {
    "cleanliness": { "score": 80, "comment": "清潔感分析コメント" },
    "charm": { "score": 75, "comment": "魅力分析コメント" },
    "photogenic": { "score": 70, "comment": "写真映え分析コメント" },
    "atmosphere": { "score": 78, "comment": "雰囲気分析コメント" },
    "friendly": { "score": 85, "comment": "親しみやすさコメント" },
    "luxury": { "score": 65, "comment": "高級感コメント" },
    "ageImpression": { "score": 72, "comment": "年齢印象コメント（実年齢より若く/老けて見えるなど）" }
  },
  "improvements": [
    { "priority": 1, "title": "改善項目タイトル", "detail": "具体的な改善提案" },
    { "priority": 2, "title": "改善項目タイトル", "detail": "具体的な改善提案" },
    { "priority": 3, "title": "改善項目タイトル", "detail": "具体的な改善提案" }
  ],
  "advice": {
    "impression": "印象改善アドバイス",
    "cleanliness": "清潔感向上アドバイス",
    "photo": "写真写り改善アドバイス",
    "skin": "肌印象改善アドバイス",
    "atmosphere": "雰囲気演出アドバイス",
    "charm": "魅力度向上アドバイス"
  },
  "scoreUpTips": [
    "スコアを上げるための具体的なTips1",
    "Tips2",
    "Tips3"
  ]
}`

export async function analyzeImage(base64Image, mimeType) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey || apiKey === 'your_openai_key_here') {
    throw new Error('.env の VITE_OPENAI_API_KEY に有効な OpenAI API キーを設定してください')
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 2048,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: 'high',
              },
            },
            {
              type: 'text',
              text: 'この写真を詳細に分析してください。JSONのみ返してください。',
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API エラー: ${response.status}`)
  }

  const result = await response.json()
  const text = result.choices?.[0]?.message?.content ?? ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('JSONの解析に失敗しました')
  return JSON.parse(jsonMatch[0])
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

const SYSTEM_PROMPT = `必ずJSON形式のみで返答してください。説明文や前置きは一切不要です。

あなたはCharm Score AIの分析エンジンです。
写真から「第一印象・清潔感・魅力形成・雰囲気・生活管理状態」を総合分析し、
以下のJSON形式のみで返してください。文章は一切不要です。

【重要な評価基準】
- 50〜60点: 平均域
- 61〜70点: 清潔感あり
- 71〜80点: 魅力管理ができている
- 81〜90点: 印象設計レベルが高い
- 91〜100点: 極めて完成度が高い状態
- 100点は簡単に出ない設計。顔面偏差値ではなく「整え度・印象管理・清潔感」を重視。

【分析対象】
顔立ち・パーツ配置・肌印象・髪印象・輪郭・表情・清潔感・雰囲気・写真写り・美容意識・生活習慣・自己管理状態

{
  "charmScore": 72,
  "scoreRank": "B",
  "scoreRankLabel": "魅力管理ができている",
  "scoreComment": "総合評価の一言コメント",
  "firstImpression": {
    "main": "第一印象キーワード（例：上品で落ち着いた印象）",
    "sub": "補足説明",
    "keywords": ["優しそう", "知的", "近寄りやすい"]
  },
  "parts": {
    "eye": { "label": "目元", "comment": "分析コメント", "score": 75 },
    "brow": { "label": "眉", "comment": "分析コメント", "score": 70 },
    "nose": { "label": "鼻", "comment": "分析コメント", "score": 72 },
    "mouth": { "label": "口元", "comment": "分析コメント", "score": 68 },
    "skin": { "label": "肌", "comment": "分析コメント", "score": 65 },
    "outline": { "label": "輪郭", "comment": "分析コメント", "score": 78 },
    "hair": { "label": "髪", "comment": "分析コメント", "score": 70 },
    "faceline": { "label": "フェイスライン", "comment": "分析コメント", "score": 74 }
  },
  "analysis": {
    "cleanliness": { "score": 70, "comment": "清潔感：肌印象・髪ツヤ・毛穴・疲労感の分析" },
    "charm": { "score": 75, "comment": "魅力：オーラ・存在感・色気の分析" },
    "photogenic": { "score": 68, "comment": "写真映え：角度・光・表情の分析" },
    "atmosphere": { "score": 72, "comment": "雰囲気：高級感・親しみやすさ・知性の分析" },
    "friendly": { "score": 80, "comment": "親しみやすさの分析" },
    "luxury": { "score": 65, "comment": "高級感の分析" },
    "ageImpression": { "score": 74, "comment": "年齢印象：実年齢との差・若見え要素の分析" },
    "selfManagement": { "score": 68, "comment": "自己管理：生活習慣・美容意識が見える要素の分析" }
  },
  "improvements": [
    { "priority": 1, "title": "最優先改善項目", "detail": "具体的な改善提案", "effect": "高" },
    { "priority": 2, "title": "改善項目2", "detail": "具体的な改善提案", "effect": "中" },
    { "priority": 3, "title": "改善項目3", "detail": "具体的な改善提案", "effect": "中" }
  ],
  "advice": {
    "impression": "印象改善アドバイス",
    "cleanliness": "清潔感向上アドバイス",
    "photo": "写真写り・SNS映え改善アドバイス",
    "skin": "肌印象改善アドバイス",
    "atmosphere": "雰囲気演出アドバイス",
    "charm": "魅力度向上アドバイス"
  },
  "scoreUpTips": [
    "スコアアップTips1（具体的な行動）",
    "Tips2",
    "Tips3"
  ],
  "futurePrediction": {
    "threeYears": "現在の習慣が続いた場合の3年後の印象予測",
    "fiveYears": "5年後の印象予測",
    "tenYears": "10年後の印象予測"
  }
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
      max_tokens: 3000,
      response_format: { type: 'json_object' },
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
  console.log('OpenAI response text:', text)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error(`JSONの解析に失敗しました。APIレスポンス: ${text.slice(0, 200)}`)
  }
  try {
    return JSON.parse(jsonMatch[0])
  } catch (e) {
    throw new Error(`JSONのパースに失敗しました: ${e.message}。レスポンス先頭: ${text.slice(0, 200)}`)
  }
}

const GOLD = '#c9a96e'
const GOLD_LIGHT = '#f0ddb0'
const GOLD_DARK = '#a07840'
const GOLD_BG = '#fdf8f2'

const analysisLabels = {
  cleanliness:   '清潔感',
  charm:         '魅力',
  photogenic:    '写真映え',
  atmosphere:    '雰囲気',
  friendly:      '親しみやすさ',
  luxury:        '高級感',
  ageImpression: '年齢印象',
}

const adviceLabels = {
  impression:  '印象改善',
  cleanliness: '清潔感向上',
  photo:       '写真写り',
  skin:        '肌印象',
  atmosphere:  '雰囲気演出',
  charm:       '魅力向上',
}

const rankColors = {
  S: { bg: '#7b5ea7', text: '#fff' },
  A: { bg: '#c9a96e', text: '#fff' },
  B: { bg: '#5b8fa8', text: '#fff' },
  C: { bg: '#7aab7a', text: '#fff' },
  D: { bg: '#aaa',    text: '#fff' },
}

function formatDate() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function ScoreBar({ score }) {
  const pct = Math.min(100, Math.max(0, score || 0))
  return (
    <div style={{ width: '100%', background: '#eee', borderRadius: 4, height: 6, overflow: 'hidden' }}>
      <div style={{
        width: `${pct}%`,
        height: '100%',
        background: `linear-gradient(to right, ${GOLD_DARK}, ${GOLD})`,
        borderRadius: 4,
        transition: 'width 0.3s',
      }} />
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ textAlign: 'center', margin: '18px 0 12px', position: 'relative' }}>
      <div style={{
        display: 'inline-block',
        padding: '4px 20px',
        border: `1px solid ${GOLD}`,
        color: GOLD_DARK,
        fontSize: 11,
        letterSpacing: '0.18em',
        fontWeight: 700,
        background: '#fff',
        position: 'relative',
        zIndex: 1,
      }}>
        {children}
      </div>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 1,
        background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
        zIndex: 0,
      }} />
    </div>
  )
}

export default function KarteCard({ data, karteRef, imageDataUrl }) {
  if (!data) return null

  const rank = data.scoreRank ?? 'B'
  const rankColor = rankColors[rank] ?? rankColors['B']
  const score = data.charmScore ?? 0

  return (
    <div
      ref={karteRef}
      style={{
        background: '#fff',
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", serif',
        color: '#333',
        paddingBottom: 24,
        boxShadow: '0 2px 24px rgba(0,0,0,0.12)',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {/* ① ヘッダー */}
      <div style={{
        background: `linear-gradient(135deg, ${GOLD_DARK} 0%, ${GOLD} 60%, ${GOLD_LIGHT} 100%)`,
        padding: '18px 24px 14px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <div style={{ fontSize: 9, letterSpacing: '0.35em', opacity: 0.85, marginBottom: 6 }}>
          CHARM SCORE AI
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>
          Charm Score
        </div>
        <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: '0.15em' }}>
          — AI第一印象解析カルテ —
        </div>
      </div>

      {/* ② 写真 + Charm Score（横並び2カラム） */}
      <div style={{
        display: 'flex',
        gap: 0,
        padding: '16px',
        borderBottom: `1px solid ${GOLD_LIGHT}`,
        background: GOLD_BG,
        alignItems: 'center',
      }}>
        {/* 左: 診断写真 */}
        <div style={{ flexShrink: 0, textAlign: 'center', marginRight: 16 }}>
          {imageDataUrl ? (
            <>
              <div style={{ fontSize: 9, color: '#9a7a3a', letterSpacing: '0.2em', marginBottom: 6 }}>PHOTO</div>
              <img
                src={imageDataUrl}
                alt="診断写真"
                style={{
                  width: 160,
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: 12,
                  border: '1px solid #e8d5a3',
                  display: 'block',
                }}
              />
              <div style={{ fontSize: 9, color: '#9a7a3a', letterSpacing: '0.1em', marginTop: 6 }}>
                {formatDate()} Analyzed by AI
              </div>
            </>
          ) : (
            <div style={{
              width: 160, height: 200, borderRadius: 12,
              background: '#eee', border: '1px solid #ddd',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: '#999',
            }}>
              No Image
            </div>
          )}
        </div>

        {/* 右: スコア */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: GOLD_DARK, letterSpacing: '0.2em', marginBottom: 4 }}>
            CHARM SCORE
          </div>

          {/* スコア数値 */}
          <div style={{
            fontSize: 64,
            fontWeight: 700,
            color: GOLD,
            lineHeight: 1,
            marginBottom: 8,
            fontFamily: 'Georgia, serif',
          }}>
            {score}
          </div>

          {/* ランクバッジ */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: rankColor.bg,
            color: rankColor.text,
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            {rank}
          </div>

          {/* スコアコメント */}
          <div style={{ fontSize: 11, color: '#666', lineHeight: 1.6, marginBottom: 12, padding: '0 4px' }}>
            {data.scoreComment}
          </div>

          {/* ゲージバー */}
          <div style={{ padding: '0 4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#999', marginBottom: 4 }}>
              <span>0</span><span>50</span><span>100</span>
            </div>
            <div style={{ background: '#e8e0d0', borderRadius: 6, height: 10, overflow: 'hidden' }}>
              <div style={{
                width: `${score}%`,
                height: '100%',
                background: `linear-gradient(to right, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT})`,
                borderRadius: 6,
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* ③ FIRST IMPRESSION */}
      <div style={{
        background: '#fff',
        borderBottom: `1px solid ${GOLD_LIGHT}`,
        padding: '14px 20px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 9, color: GOLD_DARK, letterSpacing: '0.2em', marginBottom: 6 }}>
          FIRST IMPRESSION
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#2a2a2a', marginBottom: 6 }}>
          {data.firstImpression}
        </div>
        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.7 }}>
          {data.firstImpressionSub}
        </div>
      </div>

      {/* ④ ANALYSIS（7項目） */}
      <SectionTitle>ANALYSIS</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(data.analysis ?? {}).map(([key, val]) => (
          <div key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#444', fontWeight: 600 }}>
                {analysisLabels[key] ?? key}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: GOLD_DARK }}>{val?.score}</span>
            </div>
            <ScoreBar score={val?.score} />
            <div style={{ fontSize: 10, color: '#777', marginTop: 4, lineHeight: 1.5 }}>{val?.comment}</div>
          </div>
        ))}
      </div>

      {/* ⑤ PRIORITY IMPROVEMENTS */}
      <SectionTitle>PRIORITY IMPROVEMENTS</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(data.improvements ?? []).map((item) => (
          <div key={item.priority} style={{
            display: 'flex',
            gap: 12,
            background: GOLD_BG,
            border: `1px solid ${GOLD_LIGHT}`,
            borderRadius: 8,
            padding: '10px 12px',
          }}>
            <div style={{
              flexShrink: 0,
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: GOLD,
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {item.priority}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#333', marginBottom: 3 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: '#666', lineHeight: 1.6 }}>{item.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ⑥ ADVICE（6項目グリッド） */}
      <SectionTitle>ADVICE</SectionTitle>
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {Object.entries(data.advice ?? {}).map(([key, val]) => (
          <div key={key} style={{
            background: GOLD_BG,
            border: `1px solid ${GOLD_LIGHT}`,
            borderRadius: 6,
            padding: '8px 10px',
          }}>
            <div style={{ fontSize: 9, color: GOLD_DARK, letterSpacing: '0.1em', marginBottom: 4 }}>
              {adviceLabels[key] ?? key}
            </div>
            <div style={{ fontSize: 11, color: '#444', lineHeight: 1.55 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* ⑦ SCORE UP TIPS */}
      <SectionTitle>SCORE UP TIPS</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(data.scoreUpTips ?? []).map((tip, i) => (
          <div key={i} style={{
            background: '#fdf6e8',
            borderLeft: `3px solid ${GOLD}`,
            borderRadius: '0 6px 6px 0',
            padding: '8px 12px',
            fontSize: 11,
            color: '#444',
            lineHeight: 1.6,
          }}>
            <span style={{ color: GOLD_DARK, fontWeight: 700, marginRight: 6 }}>TIP {i + 1}</span>
            {tip}
          </div>
        ))}
      </div>

      {/* ⑧ フッター */}
      <div style={{
        marginTop: 20,
        padding: '12px 16px 0',
        borderTop: `1px solid ${GOLD_LIGHT}`,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 9, color: '#aaa', lineHeight: 1.8, letterSpacing: '0.05em' }}>
          Charm Score AIは清潔感・整え度・印象管理を重視した難易度高めの評価設計です
        </div>
        <div style={{ fontSize: 9, color: '#bbb', marginTop: 4, letterSpacing: '0.15em' }}>
          Powered by Charm Score AI
        </div>
      </div>
    </div>
  )
}

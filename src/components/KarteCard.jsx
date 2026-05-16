import { useEffect, useState } from 'react'
import { cropPart } from '../utils/cropFace'

const GOLD = '#c9a96e'
const GOLD_LIGHT = '#f0ddb0'
const GOLD_DARK = '#a07840'
const GOLD_BG = '#fdf8f2'

const analysisLabels = {
  cleanliness:    '清潔感',
  charm:          '魅力',
  photogenic:     '写真映え',
  atmosphere:     '雰囲気',
  friendly:       '親しみやすさ',
  luxury:         '高級感',
  ageImpression:  '年齢印象',
  selfManagement: '自己管理',
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

const priorityColors = ['#e53935', '#f57c00', '#f9a825']

const scoreLevels = [
  { range: '50-60', label: '平均域' },
  { range: '61-70', label: '清潔感あり' },
  { range: '71-80', label: '魅力管理' },
  { range: '81-90', label: '印象設計' },
  { range: '91-100', label: '極めて高い' },
]

function formatDate() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function ScoreBar({ score, height = 6 }) {
  const pct = Math.min(100, Math.max(0, score || 0))
  return (
    <div style={{ width: '100%', background: '#e8e0d0', borderRadius: 4, height, overflow: 'hidden' }}>
      <div style={{
        width: `${pct}%`,
        height: '100%',
        background: `linear-gradient(to right, ${GOLD_DARK}, ${GOLD})`,
        borderRadius: 4,
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
  const [partImages, setPartImages] = useState({})

  useEffect(() => {
    if (!imageDataUrl || !data) return
    const keys = ['eye', 'brow', 'nose', 'mouth', 'skin', 'outline', 'hair', 'faceline']
    Promise.all(
      keys.map(async (key) => {
        const cropped = await cropPart(imageDataUrl, key)
        return [key, cropped]
      })
    ).then((results) => {
      setPartImages(Object.fromEntries(results))
    })
  }, [imageDataUrl, data])

  if (!data) return null

  const rank = data.scoreRank ?? 'B'
  const rankColor = rankColors[rank] ?? rankColors['B']
  const score = data.charmScore ?? 0
  const fi = data.firstImpression ?? {}

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
      <div style={{ height: 3, background: `linear-gradient(to right, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT})` }} />
      <div style={{
        background: `linear-gradient(135deg, ${GOLD_DARK} 0%, ${GOLD} 60%, ${GOLD_LIGHT} 100%)`,
        padding: '16px 24px 14px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <div style={{ fontSize: 9, letterSpacing: '0.4em', opacity: 0.85, marginBottom: 6 }}>
          CHARM SCORE AI
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4, fontFamily: 'Georgia, serif' }}>
          Charm Score
        </div>
        <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: '0.15em' }}>
          — AI 第一印象解析カルテ —
        </div>
      </div>

      {/* ② 写真 + Charm Score（2カラム） */}
      <div style={{
        display: 'flex',
        padding: '16px',
        borderBottom: `1px solid ${GOLD_LIGHT}`,
        background: GOLD_BG,
        alignItems: 'stretch',
        gap: 14,
      }}>
        {/* 左: 診断写真 */}
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: '#9a7a3a', letterSpacing: '0.2em', marginBottom: 6 }}>PHOTO</div>
          {imageDataUrl ? (
            <img
              src={imageDataUrl}
              alt="診断写真"
              style={{
                width: 160,
                height: 210,
                objectFit: 'cover',
                borderRadius: 12,
                border: `1px solid ${GOLD}`,
                display: 'block',
              }}
            />
          ) : (
            <div style={{
              width: 160, height: 210, borderRadius: 12,
              background: '#eee', border: `1px solid ${GOLD_LIGHT}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: '#999',
            }}>No Image</div>
          )}
          <div style={{ fontSize: 9, color: '#9a7a3a', letterSpacing: '0.1em', marginTop: 6 }}>
            {formatDate()} Analyzed by AI
          </div>
        </div>

        {/* 右: スコア */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 9, color: GOLD_DARK, letterSpacing: '0.2em', marginBottom: 4 }}>CHARM SCORE</div>

          {/* スコア + /100 */}
          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 8, lineHeight: 1 }}>
            <span style={{ fontSize: 72, fontWeight: 700, color: GOLD, fontFamily: 'Georgia, serif', lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: 16, color: '#bbb', marginBottom: 8, marginLeft: 2 }}>/100</span>
          </div>

          {/* ランクバッジ + ラベル */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: rankColor.bg, color: rankColor.text,
              fontSize: 17, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            }}>
              {rank}
            </div>
            <div style={{ fontSize: 11, color: GOLD_DARK, fontWeight: 600 }}>
              {data.scoreRankLabel}
            </div>
          </div>

          {/* スコアコメント */}
          <div style={{ fontSize: 10, color: '#666', lineHeight: 1.6, marginBottom: 10, textAlign: 'center' }}>
            {data.scoreComment}
          </div>

          {/* ゲージバー */}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#bbb', marginBottom: 3 }}>
              <span>0</span><span>50</span><span>100</span>
            </div>
            <ScoreBar score={score} height={10} />
          </div>

          {/* スコア意味説明 */}
          <div style={{ marginTop: 10, width: '100%' }}>
            {scoreLevels.map(({ range, label }) => {
              const [lo, hi] = range.split('-').map(Number)
              const active = score >= lo && score <= hi
              return (
                <div key={range} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 9, padding: '2px 6px', borderRadius: 3,
                  background: active ? `${GOLD}22` : 'transparent',
                  color: active ? GOLD_DARK : '#bbb',
                  fontWeight: active ? 700 : 400,
                }}>
                  <span>{range}</span>
                  <span>{label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ③ FIRST IMPRESSION */}
      <div style={{ borderBottom: `1px solid ${GOLD_LIGHT}`, padding: '14px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 9, color: GOLD_DARK, letterSpacing: '0.2em', marginBottom: 8 }}>
          FIRST IMPRESSION
        </div>
        {/* キーワードタグ */}
        {(fi.keywords ?? []).length > 0 && (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
            {fi.keywords.map((kw, i) => (
              <span key={i} style={{
                padding: '3px 10px',
                background: GOLD,
                color: '#fff',
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}>
                {kw}
              </span>
            ))}
          </div>
        )}
        <div style={{ fontSize: 16, fontWeight: 700, color: '#2a2a2a', marginBottom: 6 }}>
          {fi.main}
        </div>
        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.7 }}>
          {fi.sub}
        </div>
      </div>

      {/* ④ PARTS ANALYSIS（8項目・2列グリッド） */}
      <SectionTitle>PARTS ANALYSIS</SectionTitle>
      <div style={{ padding: '0 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {Object.entries(data.parts ?? {}).map(([key, val]) => (
          <div key={key} style={{
            background: '#fff',
            border: '0.5px solid #e8d5a3',
            borderRadius: 10,
            overflow: 'hidden',
          }}>
            {partImages[key] && (
              <img
                src={partImages[key]}
                alt={val?.label ?? key}
                style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }}
              />
            )}
            <div style={{ padding: '8px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#222' }}>{val?.label ?? key}</span>
                <span style={{ fontSize: 13, color: GOLD, fontWeight: 500 }}>{val?.score}</span>
              </div>
              <div style={{ height: 3, background: '#f0e6cc', borderRadius: 2, marginBottom: 6 }}>
                <div style={{ height: 3, width: `${val?.score ?? 0}%`, background: GOLD, borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 11, color: '#888', lineHeight: 1.5 }}>{val?.comment}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ⑤ ANALYSIS SCORES（8項目） */}
      <SectionTitle>ANALYSIS SCORES</SectionTitle>
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

      {/* ⑥ PRIORITY IMPROVEMENTS */}
      <SectionTitle>PRIORITY IMPROVEMENTS</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(data.improvements ?? []).map((item, idx) => (
          <div key={item.priority} style={{
            display: 'flex', gap: 12,
            background: GOLD_BG,
            border: `1px solid ${GOLD_LIGHT}`,
            borderRadius: 8,
            padding: '10px 12px',
          }}>
            <div style={{
              flexShrink: 0,
              width: 28, height: 28, borderRadius: '50%',
              background: priorityColors[idx] ?? GOLD,
              color: '#fff', fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {item.priority}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>{item.title}</span>
                {item.effect && (
                  <span style={{
                    fontSize: 9, padding: '1px 7px', borderRadius: 10,
                    background: item.effect === '高' ? '#fde8e8' : '#fef3e2',
                    color: item.effect === '高' ? '#c62828' : '#e65100',
                    fontWeight: 700,
                  }}>
                    効果: {item.effect}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: '#666', lineHeight: 1.6 }}>{item.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ⑦ ADVICE（6項目グリッド） */}
      <SectionTitle>ADVICE</SectionTitle>
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {Object.entries(data.advice ?? {}).map(([key, val]) => (
          <div key={key} style={{
            background: GOLD_BG, border: `1px solid ${GOLD_LIGHT}`,
            borderRadius: 6, padding: '8px 10px',
          }}>
            <div style={{ fontSize: 9, color: GOLD_DARK, letterSpacing: '0.1em', marginBottom: 4 }}>
              {adviceLabels[key] ?? key}
            </div>
            <div style={{ fontSize: 11, color: '#444', lineHeight: 1.55 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* ⑧ SCORE UP TIPS */}
      <SectionTitle>SCORE UP TIPS</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(data.scoreUpTips ?? []).map((tip, i) => (
          <div key={i} style={{
            background: '#fdf6e8',
            borderLeft: `3px solid ${GOLD}`,
            borderRadius: '0 6px 6px 0',
            padding: '8px 12px',
            fontSize: 11, color: '#444', lineHeight: 1.6,
          }}>
            <span style={{ color: GOLD_DARK, fontWeight: 700, marginRight: 6 }}>TIP {i + 1}</span>
            {tip}
          </div>
        ))}
      </div>

      {/* ⑨ FUTURE PREDICTION（3カラム） */}
      {data.futurePrediction && (
        <>
          <SectionTitle>FUTURE PREDICTION</SectionTitle>
          <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { key: 'threeYears', label: '3年後' },
              { key: 'fiveYears',  label: '5年後' },
              { key: 'tenYears',   label: '10年後' },
            ].map(({ key, label }) => (
              <div key={key} style={{
                background: GOLD_BG, border: `1px solid ${GOLD_LIGHT}`,
                borderRadius: 6, padding: '10px 8px', textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: GOLD_DARK,
                  marginBottom: 6, letterSpacing: '0.1em',
                }}>
                  {label}
                </div>
                <div style={{ fontSize: 10, color: '#555', lineHeight: 1.6 }}>
                  {data.futurePrediction[key]}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ⑩ フッター */}
      <div style={{
        marginTop: 20,
        padding: '12px 16px 0',
        borderTop: `1px solid ${GOLD_LIGHT}`,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 9, color: '#aaa', lineHeight: 1.9, letterSpacing: '0.04em' }}>
          Charm Score AIは清潔感・整え度・印象管理を重視した難易度高めの評価設計です<br />
          ※100点は簡単に出ない設計です
        </div>
        <div style={{ fontSize: 9, color: '#bbb', marginTop: 6, letterSpacing: '0.15em' }}>
          Powered by Charm Score AI
        </div>
      </div>
    </div>
  )
}

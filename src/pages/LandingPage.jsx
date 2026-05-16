import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function LandingPage() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  // パーティクル背景
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }))

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100,180,255,${p.alpha})`
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  const s = styles
  return (
    <div style={s.root}>
      {/* パーティクル */}
      <canvas ref={canvasRef} style={s.canvas} />

      {/* 背景グロー */}
      <div style={s.glow1} />
      <div style={s.glow2} />
      <div style={s.glow3} />

      {/* ── Hero ── */}
      <section style={s.hero}>
        {/* 左：テキスト */}
        <div style={s.heroLeft}>
          <div style={s.badge}>✦ AI IMPRESSION ANALYSIS</div>
          <h1 style={s.title}>
            Charm<br />Score<span style={s.titleAI}> AI</span>
          </h1>
          <p style={s.sub}>
            あなたの第一印象、<br />AIが数値化。
          </p>
          <p style={s.desc}>
            清潔感・雰囲気・親しみやすさ・モテ感をAIが解析。<br />
            写真1枚で、あなたの"見られ方"をチェック。
          </p>
          <button
            style={s.cta}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(100,180,255,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(100,180,255,0.3)'
            }}
            onClick={() => navigate('/karte')}
          >
            診断してみる →
          </button>
          <p style={s.note}>📸 写真1枚・無料・登録不要</p>
        </div>

        {/* 右：モデルカード */}
        <div style={s.heroRight}>
          <div style={s.modelCard}>
            {/* モデル画像（なければグラデで代替） */}
            <div style={s.modelImgWrap}>
              <img
                src="/images/charm-female-model.png"
                alt="AI診断モデル"
                style={s.modelImg}
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
              <div style={s.modelFallback}>
                <div style={s.scanLine} />
                <div style={s.scanLine2} />
                <div style={{ fontSize: 48, marginBottom: 8 }}>👤</div>
                <div style={{ color: 'rgba(100,180,255,0.7)', fontSize: 12, letterSpacing: 2 }}>
                  FACE SCANNING...
                </div>
              </div>
              {/* スキャンライン */}
              <div style={s.scanAnim} />
            </div>

            {/* スコアパネル */}
            <div style={s.scorePanel}>
              <div style={s.scorePanelLabel}>CHARM SCORE</div>
              <div style={s.scorePanelNum}>82</div>
              <div style={s.scoreBar}>
                <div style={{ ...s.scoreBarFill, width: '82%' }} />
              </div>
            </div>

            {/* レーダー風ラベル */}
            <div style={s.radarPanel}>
              <div style={s.radarTitle}>RADAR ANALYSIS</div>
              {[
                { label: 'Cleanliness', val: 85 },
                { label: 'Mood',        val: 78 },
                { label: 'Friendly',    val: 80 },
                { label: 'Attractive',  val: 74 },
              ].map(item => (
                <div key={item.label} style={s.radarRow}>
                  <span style={s.radarLabel}>{item.label}</span>
                  <div style={s.radarBar}>
                    <div style={{ ...s.radarBarFill, width: `${item.val}%` }} />
                  </div>
                  <span style={s.radarVal}>{item.val}</span>
                </div>
              ))}
            </div>

            {/* 浮遊タグ */}
            <div style={{ ...s.floatTag, top: 12, right: -16 }}>✦ AI Analyzed</div>
            <div style={{ ...s.floatTag, bottom: 80, left: -20 }}>📊 Score Ready</div>
          </div>
        </div>
      </section>

      {/* ── 3ステップ ── */}
      <section style={s.steps}>
        <div style={s.stepsInner}>
          {[
            { num: '01', icon: '📸', title: '写真をアップロード', desc: '顔写真を1枚選ぶだけ' },
            { num: '02', icon: '🤖', title: 'AIが印象を解析',    desc: 'gpt-4o-miniが6軸で診断' },
            { num: '03', icon: '✨', title: 'Charm Scoreを確認', desc: '結果をSNSにシェア' },
          ].map((step, i) => (
            <div key={i} style={s.stepCard}>
              <div style={s.stepNum}>STEP {step.num}</div>
              <div style={s.stepIcon}>{step.icon}</div>
              <div style={s.stepTitle}>{step.title}</div>
              <div style={s.stepDesc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA再掲 ── */}
      <section style={s.ctaSection}>
        <p style={s.ctaHeading}>あなたは何点？</p>
        <button
          style={s.cta}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(100,180,255,0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(100,180,255,0.3)'
          }}
          onClick={() => navigate('/karte')}
        >
          今すぐ無料で診断する →
        </button>
        <p style={s.note}>※診断結果はエンタメ・印象改善の参考としてご利用ください。</p>
      </section>

      {/* フッター */}
      <footer style={s.footer}>
        <div style={{ color: 'rgba(100,180,255,0.6)', fontSize: 11, letterSpacing: 2 }}>
          Powered by Charm Score AI
        </div>
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, marginTop: 4 }}>
          ©2026 Charm Score AI
        </div>
      </footer>
    </div>
  )
}

// ── スタイル定義 ──
const styles = {
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #020818 0%, #050d2a 50%, #0a0520 100%)',
    color: '#fff',
    fontFamily: "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif",
    overflowX: 'hidden',
    position: 'relative',
  },
  canvas: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 0,
  },
  glow1: {
    position: 'fixed', top: '-20%', left: '-10%',
    width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(60,120,255,0.15) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  glow2: {
    position: 'fixed', bottom: '-10%', right: '-10%',
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(200,100,255,0.12) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  glow3: {
    position: 'fixed', top: '40%', left: '50%',
    width: 300, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,150,200,0.08) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  hero: {
    position: 'relative', zIndex: 1,
    display: 'flex', flexWrap: 'wrap',
    alignItems: 'center', justifyContent: 'center',
    gap: 48, padding: '80px 24px 60px',
    maxWidth: 1100, margin: '0 auto',
  },
  heroLeft: { flex: '1 1 320px', maxWidth: 480 },
  heroRight: { flex: '1 1 300px', maxWidth: 420, display: 'flex', justifyContent: 'center' },
  badge: {
    display: 'inline-block',
    fontSize: 10, letterSpacing: 3, fontWeight: 700,
    color: 'rgba(100,180,255,0.9)',
    border: '1px solid rgba(100,180,255,0.3)',
    borderRadius: 50, padding: '6px 16px',
    marginBottom: 20, backdropFilter: 'blur(4px)',
    background: 'rgba(100,180,255,0.05)',
  },
  title: {
    fontSize: 'clamp(48px, 10vw, 80px)',
    fontWeight: 900, lineHeight: 1.05,
    margin: '0 0 16px',
    background: 'linear-gradient(135deg, #ffffff 30%, #a0c8ff 70%, #e0a0ff 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    letterSpacing: -2,
  },
  titleAI: {
    background: 'linear-gradient(135deg, #60b4ff, #c080ff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  sub: {
    fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 700,
    lineHeight: 1.5, margin: '0 0 16px',
    color: 'rgba(255,255,255,0.9)',
  },
  desc: {
    fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.55)',
    margin: '0 0 32px',
  },
  cta: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #3a7fff, #8040ff)',
    color: '#fff', border: 'none', borderRadius: 50,
    padding: '16px 40px', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', letterSpacing: 1,
    boxShadow: '0 6px 24px rgba(100,180,255,0.3)',
    transition: 'all 0.25s ease',
  },
  note: { fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 12 },
  modelCard: {
    position: 'relative', width: 300,
  },
  modelImgWrap: {
    width: 300, height: 380, borderRadius: 24, overflow: 'hidden',
    background: 'linear-gradient(160deg, #0d1f4a, #1a0d3a)',
    border: '1px solid rgba(100,180,255,0.2)',
    boxShadow: '0 0 60px rgba(60,120,255,0.2)',
    position: 'relative', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  modelImg: {
    position: 'absolute', top: 0, left: 0,
    width: '100%', height: '100%', objectFit: 'cover',
  },
  modelFallback: {
    position: 'relative', zIndex: 1, textAlign: 'center',
  },
  scanLine: {
    position: 'absolute', top: '30%', left: 0, right: 0,
    height: 1, background: 'linear-gradient(90deg, transparent, rgba(100,180,255,0.6), transparent)',
  },
  scanLine2: {
    position: 'absolute', top: '60%', left: 0, right: 0,
    height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,100,255,0.4), transparent)',
  },
  scanAnim: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 3,
    background: 'linear-gradient(90deg, transparent, rgba(100,200,255,0.8), transparent)',
    animation: 'scan 2.5s linear infinite',
    zIndex: 2,
  },
  scorePanel: {
    position: 'absolute', bottom: -16, left: -20,
    background: 'rgba(10,20,50,0.85)', backdropFilter: 'blur(12px)',
    border: '1px solid rgba(100,180,255,0.25)',
    borderRadius: 16, padding: '12px 16px', minWidth: 140,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  scorePanelLabel: { fontSize: 9, letterSpacing: 2, color: 'rgba(100,180,255,0.7)', marginBottom: 4 },
  scorePanelNum: {
    fontSize: 40, fontWeight: 900, lineHeight: 1,
    background: 'linear-gradient(135deg, #60b4ff, #c080ff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  scoreBar: {
    height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 6,
  },
  scoreBarFill: {
    height: '100%', borderRadius: 2,
    background: 'linear-gradient(90deg, #3a7fff, #c080ff)',
  },
  radarPanel: {
    position: 'absolute', top: 20, right: -24,
    background: 'rgba(10,20,50,0.85)', backdropFilter: 'blur(12px)',
    border: '1px solid rgba(200,100,255,0.2)',
    borderRadius: 16, padding: '12px 14px', minWidth: 160,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  radarTitle: { fontSize: 9, letterSpacing: 2, color: 'rgba(200,100,255,0.7)', marginBottom: 8 },
  radarRow: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 },
  radarLabel: { fontSize: 9, color: 'rgba(255,255,255,0.5)', width: 68, flexShrink: 0 },
  radarBar: { flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 },
  radarBarFill: {
    height: '100%', borderRadius: 2,
    background: 'linear-gradient(90deg, #60b4ff, #c080ff)',
  },
  radarVal: { fontSize: 9, color: 'rgba(255,255,255,0.4)', width: 20, textAlign: 'right' },
  floatTag: {
    position: 'absolute',
    background: 'rgba(10,20,50,0.8)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(100,180,255,0.2)',
    borderRadius: 50, padding: '4px 12px',
    fontSize: 10, color: 'rgba(100,180,255,0.8)', whiteSpace: 'nowrap',
  },
  steps: {
    position: 'relative', zIndex: 1,
    padding: '60px 24px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  stepsInner: {
    display: 'flex', flexWrap: 'wrap',
    gap: 20, justifyContent: 'center', maxWidth: 900, margin: '0 auto',
  },
  stepCard: {
    flex: '1 1 220px', maxWidth: 280, textAlign: 'center',
    background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 20, padding: '28px 20px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
  },
  stepNum: { fontSize: 10, letterSpacing: 3, color: 'rgba(100,180,255,0.5)', marginBottom: 12 },
  stepIcon: { fontSize: 32, marginBottom: 12 },
  stepTitle: { fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'rgba(255,255,255,0.9)' },
  stepDesc: { fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 },
  ctaSection: {
    position: 'relative', zIndex: 1,
    textAlign: 'center', padding: '60px 24px 80px',
  },
  ctaHeading: {
    fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 900,
    marginBottom: 24,
    background: 'linear-gradient(135deg, #ffffff, #a0c8ff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  footer: {
    position: 'relative', zIndex: 1,
    textAlign: 'center', padding: '24px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
  },
}

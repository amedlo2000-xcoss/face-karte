import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import RadarChartBox from "./RadarChartBox";
import AdviceCard from "./AdviceCard";
import { getTitle, getRankColor } from "../utils/scoreLogic";

export default function CharmResultCard({ data, imageDataUrl }) {
  const cardRef = useRef(null);
  const [mode, setMode] = useState("normal"); // "normal" | "harsh"

  const charmScore = data?.charmScore ?? 78;
  const resultTitle = getTitle(charmScore);
  const rankColor = getRankColor(charmScore);

  const radarData = data?.analysis
    ? [
        { label: "清潔感",      value: data.analysis.cleanliness?.score    ?? 75 },
        { label: "親しみやすさ", value: data.analysis.friendly?.score       ?? 76 },
        { label: "知性",        value: data.analysis.charm?.score           ?? 71 },
        { label: "色気",        value: data.analysis.luxury?.score          ?? 65 },
        { label: "信頼感",      value: data.analysis.selfManagement?.score  ?? 70 },
        { label: "オーラ",      value: data.analysis.atmosphere?.score      ?? 72 },
      ]
    : [
        { label: "清潔感",      value: 82 },
        { label: "親しみやすさ", value: 76 },
        { label: "知性",        value: 71 },
        { label: "色気",        value: 68 },
        { label: "信頼感",      value: 80 },
        { label: "オーラ",      value: 74 },
      ];

  const normalComment =
    data?.scoreComment ??
    "全体的に清潔感と親しみやすさが強く、初対面で安心感を与えやすい印象です。表情や髪型を整えることで、さらに魅力が伝わりやすくなります。";
  const harshComment =
    '印象は悪くありませんが、現状では「無難」に見えやすいです。表情・髪型・姿勢のどれかを改善しないと、強い印象には残りにくいです。';

  const adviceItems = data?.improvements
    ? data.improvements.slice(0, 3).map((imp) => ({
        title: imp.title,
        detail: imp.detail,
      }))
    : [
        { title: "表情",         detail: "口角を少し上げるだけで、親しみやすさが大きく上がります。" },
        { title: "髪型",         detail: "顔まわりをすっきり見せると、清潔感と知性が高まりやすくなります。" },
        { title: "姿勢・雰囲気", detail: "首元と肩のラインを整えることで、写真全体の印象が引き締まります。" },
      ];

  const handleSave = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: "#fff8f2",
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = `charm-score-${charmScore}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const card = {
    background: "linear-gradient(160deg, #fff8f2 0%, #fff3ea 100%)",
    borderRadius: 20,
    border: "1.5px solid #e8d5a3",
    boxShadow: "0 8px 32px rgba(180,130,80,0.10)",
    padding: "28px 20px 24px",
    maxWidth: 420,
    margin: "0 auto",
    fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
  };

  return (
    <div style={{ padding: "16px 0" }}>
      {/* 保存ボタン（カード外） */}
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <button
          onClick={handleSave}
          style={{
            background: "linear-gradient(135deg, #c9a96e, #b5862a)",
            color: "#fff",
            border: "none",
            borderRadius: 50,
            padding: "12px 32px",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 1,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(180,130,80,0.3)",
          }}
        >
          📥 診断結果を画像保存
        </button>
      </div>

      {/* 画像化対象カード */}
      <div ref={cardRef} style={card}>
        {/* ヘッダー */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{
            fontSize: 10,
            letterSpacing: 3,
            color: "#c9a96e",
            fontWeight: 700,
            marginBottom: 4,
          }}>
            ✦ CHARM SCORE AI ✦
          </div>
          <div style={{
            fontSize: 11,
            color: "#b09060",
            letterSpacing: 2,
          }}>
            AI 第一印象解析レポート
          </div>
        </div>

        {/* 写真 */}
        {imageDataUrl && (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <img
              src={imageDataUrl}
              alt="診断写真"
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #c9a96e",
                boxShadow: "0 4px 16px rgba(180,130,80,0.20)",
              }}
            />
          </div>
        )}

        {/* スコア */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{
            fontSize: 72,
            fontWeight: 900,
            color: rankColor,
            lineHeight: 1,
            letterSpacing: -2,
          }}>
            {charmScore}
          </div>
          <div style={{ fontSize: 13, color: "#b09060", marginTop: 2, letterSpacing: 1 }}>
            / 100 pt
          </div>
        </div>

        {/* 称号 */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #c9a96e22, #b5862a11)",
            border: "1.5px solid #c9a96e",
            borderRadius: 50,
            padding: "6px 20px",
            fontSize: 13,
            fontWeight: 700,
            color: "#8a6020",
            letterSpacing: 1,
          }}>
            {resultTitle}
          </span>
        </div>

        {/* レーダーチャート */}
        <div style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e8d5a3",
          padding: "12px 4px 4px",
          marginBottom: 18,
        }}>
          <div style={{
            textAlign: "center",
            fontSize: 10,
            letterSpacing: 2,
            color: "#c9a96e",
            fontWeight: 700,
            marginBottom: 2,
          }}>
            IMPRESSION RADAR
          </div>
          <RadarChartBox data={radarData} />
        </div>

        {/* モード切替ボタン */}
        <div style={{
          display: "flex",
          gap: 8,
          marginBottom: 12,
          justifyContent: "center",
        }}>
          {["normal", "harsh"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                maxWidth: 160,
                padding: "8px 0",
                borderRadius: 50,
                border: mode === m ? "none" : "1.5px solid #e8d5a3",
                background: mode === m
                  ? "linear-gradient(135deg, #c9a96e, #b5862a)"
                  : "#fff",
                color: mode === m ? "#fff" : "#b09060",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: 0.5,
                transition: "all 0.2s",
              }}
            >
              {m === "normal" ? "🌸 通常モード" : "🔥 忖度なしモード"}
            </button>
          ))}
        </div>

        {/* AIコメント */}
        <div style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e8d5a3",
          padding: "14px 16px",
          marginBottom: 18,
        }}>
          <div style={{
            fontSize: 10,
            letterSpacing: 2,
            color: "#c9a96e",
            fontWeight: 700,
            marginBottom: 8,
          }}>
            AI COMMENT
          </div>
          <div style={{
            fontSize: 13,
            color: "#5a4a3a",
            lineHeight: 1.75,
          }}>
            {mode === "normal" ? normalComment : harshComment}
          </div>
        </div>

        {/* 改善アドバイス */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 10,
            letterSpacing: 2,
            color: "#c9a96e",
            fontWeight: 700,
            marginBottom: 10,
          }}>
            IMPROVEMENT ADVICE
          </div>
          <AdviceCard items={adviceItems} />
        </div>

        {/* フッター */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#c9a96e", letterSpacing: 2, marginBottom: 2 }}>
            #CharmScoreAI
          </div>
          <div style={{ fontSize: 9, color: "#c8b090", letterSpacing: 1 }}>
            Powered by Charm Score AI
          </div>
        </div>
      </div>
    </div>
  );
}

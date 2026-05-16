export function getTitle(score) {
  if (score >= 90) return "圧倒的オーラ型";
  if (score >= 80) return "初対面モテ強者";
  if (score >= 70) return "清潔感エリート型";
  if (score >= 60) return "親しみやすい好印象型";
  if (score >= 50) return "改善余地ありの伸びしろ型";
  return "印象改革スタート型";
}

export function getRankColor(score) {
  if (score >= 90) return "#b5862a";
  if (score >= 80) return "#c9a96e";
  if (score >= 70) return "#d4b896";
  if (score >= 60) return "#e8c4a0";
  return "#ccc";
}

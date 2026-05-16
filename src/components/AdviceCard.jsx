export default function AdviceCard({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: "#fff",
            border: "1px solid #e8d5a3",
            borderLeft: "4px solid #c9a96e",
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <div style={{
            fontSize: 11,
            color: "#c9a96e",
            fontWeight: 700,
            letterSpacing: 1,
            marginBottom: 4,
            textTransform: "uppercase",
          }}>
            {String(i + 1).padStart(2, "0")} {item.title}
          </div>
          <div style={{ fontSize: 13, color: "#5a4a3a", lineHeight: 1.6 }}>
            {item.detail}
          </div>
        </div>
      ))}
    </div>
  );
}

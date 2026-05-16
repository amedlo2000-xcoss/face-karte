export function cropPart(imageDataUrl, partKey) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const w = img.naturalWidth
      const h = img.naturalHeight

      // 各パーツの相対座標（顔正面写真を想定）
      // [x%, y%, width%, height%]
      const regions = {
        eye:      [0.20, 0.28, 0.60, 0.18],
        brow:     [0.20, 0.20, 0.60, 0.16],
        nose:     [0.30, 0.38, 0.40, 0.22],
        mouth:    [0.25, 0.58, 0.50, 0.18],
        skin:     [0.15, 0.10, 0.70, 0.80],
        outline:  [0.05, 0.05, 0.90, 0.90],
        hair:     [0.10, 0.00, 0.80, 0.25],
        faceline: [0.05, 0.30, 0.90, 0.65],
      }

      const region = regions[partKey] || [0, 0, 1, 1]
      const sx = w * region[0]
      const sy = h * region[1]
      const sw = w * region[2]
      const sh = h * region[3]

      // 出力サイズ（横長サムネイル）
      const outW = 160
      const outH = Math.round(outW * (sh / sw))
      canvas.width = outW
      canvas.height = outH

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src = imageDataUrl
  })
}

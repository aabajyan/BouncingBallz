export function generateRandomColor(min = 0): string {
  const r = Math.floor(Math.random() * 255) + min
  const g = Math.floor(Math.random() * 255) + min
  const b = Math.floor(Math.random() * 255) + min

  return `rgb(${r}, ${g}, ${b})`
}

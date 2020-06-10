export const sWidth = 3
export const radius = 40 - 2 * sWidth
export const wInterval = radius * 4
export const getHeight = (high: boolean) => (high ? 2 * radius : 4 * radius)
export const getCircleX = (index: number) => radius + index * wInterval + sWidth
export const animationDuration = 0.2

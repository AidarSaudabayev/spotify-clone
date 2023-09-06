export function formatMilliseconds(milliseconds) {
const totalSeconds = Math.floor(milliseconds/1000)

const minutes = Math.floor(totalSeconds/60)

const seconds = totalSeconds %60

return `${minutes}:${seconds.toString().padStart(2,"0")}`;
}

export const API_URL = 'http://localhost:3001/api/song'
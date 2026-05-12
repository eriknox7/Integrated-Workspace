export const getGreeting = h => h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Good night'
export const fmtTime = d => d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true})
export const fmtDate = d => d.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})
export const fmtTimer = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
export const pick = arr => arr[Math.floor(Math.random()*arr.length)]

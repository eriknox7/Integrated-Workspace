export const DEFAULT_APPS = [
  // DSA
  { id:1,  name:'LeetCode',      url:'https://leetcode.com',              icon:'https://leetcode.com/favicon.ico',            cat:'Study',            fav:false,  home:true, homeOrder:1  },
  { id:2,  name:'Codeforces',    url:'https://codeforces.com',            icon:'https://codeforces.org/s/0/favicon-32x32.png', cat:'Study',            fav:false, home:true, homeorder:0 },
  { id:3,  name:'NeetCode',      url:'https://neetcode.io',               icon:'https://neetcode.io/assets/neetcode-io-logo.png',                                           cat:'Study',            fav:false },
  // AI
  { id:4,  name:'ChatGPT',       url:'https://chat.openai.com',           icon:'https://chat.openai.com/favicon.ico',          cat:'AI Tools',       fav:false,  home:true, homeOrder:2  },
  { id:5,  name:'Claude',        url:'https://claude.ai',                 icon:'https://img.icons8.com/?size=160&id=kDfpmWz6OSCQ&format=png',               cat:'AI Tools',       fav:false,  home:true, homeOrder:3  },
  { id:6,  name:'Gemini',        url:'https://gemini.google.com',         icon:'https://img.icons8.com/?size=96&id=rnK88i9FvAFO&format=png', cat:'AI Tools', fav:false },
  { id:7,  name:'Perplexity',    url:'https://perplexity.ai',             icon:'https://img.icons8.com/?size=96&id=kzJWN5jCDzpq&format=png',           cat:'AI Tools',       fav:false },
  // Dev
  { id:8,  name:'GitHub',        url:'https://github.com',                icon:'https://img.icons8.com/?size=120&id=0tREDFkScvsm&format=png',              cat:'Developer',      fav:false},
  { id:9,  name:'VS Code',       url:'https://vscode.dev',                icon:'https://img.icons8.com/?size=96&id=9OGIyU8hrxW5&format=png',              cat:'Developer',      fav:false },
  { id:10, name:'Stack Overflow',url:'https://stackoverflow.com',         icon:'https://stackoverflow.com/favicon.ico',       cat:'Developer',      fav:false },
  { id:11, name:'MDN',           url:'https://developer.mozilla.org',     icon:'https://developer.mozilla.org/favicon.ico',   cat:'Developer',      fav:false },
  { id:12, name:'Regex101',      url:'https://regex101.com',              icon:'https://img.icons8.com/?size=160&id=4swbi_BZ7hlw&format=png', cat:'Developer',   fav:false },
  // Study
  { id:13, name:'Notion',        url:'https://notion.so',                 icon:'https://www.notion.so/images/favicon.ico',    cat:'Productivity',          fav:false },
  { id:14, name:'Coursera',      url:'https://coursera.org',              icon:'https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-v2-32x32.png', cat:'Study', fav:false },
  // Social
  { id:15, name:'Twitter / X',   url:'https://x.com',                    icon:'https://abs.twimg.com/favicons/twitter.3.ico', cat:'Social',         fav:false },
  { id:16, name:'LinkedIn',      url:'https://linkedin.com',              icon:'https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca', cat:'Social', fav:false, home:true, homeOrder:4 },
  // Streaming
  { id:17, name:'YouTube',       url:'https://youtube.com',               icon:'https://img.icons8.com/?size=96&id=19318&format=png',             cat:'Streaming',      fav:false, home:true, homeOrder: 6},
  { id:18, name:'Spotify',       url:'https://open.spotify.com',          icon:'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png', cat:'Streaming', fav:false, home:true, homeOrder:7 },
  // Utilities
  { id:19, name:'Excalidraw',    url:'https://excalidraw.com',            icon:'https://excalidraw.com/favicon.ico',          cat:'Utilities',      fav:false },
  { id:20, name:'Figma',         url:'https://figma.com',                 icon:'https://static.figma.com/app/icon/1/favicon.ico', cat:'Utilities',  fav:false },
  { id:21, name:'Instagram',      url:'https://instagram.com',         icon:'https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png',         cat:'Social',     fav:false, home:true, homeOrder:5},
  { id:22, name:'Pinterest',      url:'https://in.pinterest.com/',         icon:'https://img.icons8.com/?size=96&id=XErM9A1xNUK5&format=png',         cat:'Social',     fav:false },
  { id:23, name:'Amazon',      url:'https://www.amazon.in/',         icon:'https://img.icons8.com/?size=160&id=67j6ReSm130J&format=png',         cat:'E-commerce',     fav:false, home:true, homeOrder:8 },
  { id:24, name:'Udemy',      url:'https://www.udemy.com/',         icon:'https://img.icons8.com/?size=160&id=ZGFCSq0zrC5g&format=png',         cat:'Study',     fav:false},
  { id:25, name:'Telegram',      url:'https://web.telegram.org/',         icon:'https://img.icons8.com/?size=160&id=yEmPT1iidhE0&format=png',         cat:'Social',     fav:false},
  { id:26, name:'Flipkart',      url:'https://www.flipkart.com/',         icon:'https://img.icons8.com/?size=160&id=UU2im0hihoyi&format=png',         cat:'E-commerce',     fav:false}
]

export const CATEGORIES = ['All','AI Tools','Developer','Study','Social','Streaming','Utilities', 'E-commerce', 'Productivity']
export const FOCUS_HIDDEN = ['Social','Streaming']

export const SHORTCUTS = {
  yt:  { label:'YouTube',     url:'https://www.youtube.com/results?search_query=' },
  lc:  { label:'LeetCode',    url:'https://leetcode.com/search?q=' },
  gh:  { label:'GitHub',      url:'https://github.com/search?q=' },
  gpt: { label:'ChatGPT',     url:'https://chat.openai.com/?q=' },
  cl:  { label:'Claude',      url:'https://claude.ai/new?q=' },
  gm:  { label:'Gemini',      url:'https://gemini.google.com/app?q=' },
  gg:  { label:'Google',      url:'https://google.com/search?q=' },
  px:  { label:'Perplexity',  url:'https://perplexity.ai/?q=' },

  mdn: { label:'MDN',         url:'https://developer.mozilla.org/search?q=' },
  npm: { label:'npm',         url:'https://www.npmjs.com/search?q=' },
  so:  { label:'StackOverflow', url:'https://stackoverflow.com/search?q=' },
  dev: { label:'Dev.to',      url:'https://dev.to/search?q=' },

  ig: { label:'Instagram', url:'https://www.instagram.com/explore/search/keyword/?q=' },
  li:  { label:'LinkedIn',    url:'https://www.linkedin.com/search/results/all/?keywords=' },
  tw:  { label:'Twitter/X',   url:'https://x.com/search?q=' },
  rd:  { label:'Reddit',      url:'https://www.reddit.com/search/?q=' },

  sp:  { label:'Spotify',     url:'https://open.spotify.com/search/' },
  amz: { label:'Amazon',      url:'https://www.amazon.in/s?k=' },

  dr:  { label:'Dribbble',    url:'https://dribbble.com/search/' },
  bh:  { label:'Behance',     url:'https://www.behance.net/search/projects?search=' },
  pin:  { label:'Pinterest',   url:'https://www.pinterest.com/search/pins/?q=' },

  wiki:  { label:'Wikipedia',   url:'https://en.wikipedia.org/wiki/Special:Search?search=' },
  imdb:{ label:'IMDb',        url:'https://www.imdb.com/find?q=' },

  ai:  { label:'arXiv',       url:'https://arxiv.org/search/?query=' },
  hf:  { label:'HuggingFace', url:'https://huggingface.co/models?search=' },
}

export const ACCENTS = [
  { name:'Indigo',  val:'#5b6af8', dim:'rgba(91,106,248,0.10)',  border:'rgba(91,106,248,0.22)' },
  { name:'Blue',    val:'#4a9eff', dim:'rgba(74,158,255,0.10)',  border:'rgba(74,158,255,0.22)' },
  { name:'Violet',  val:'#8b67f0', dim:'rgba(139,103,240,0.10)', border:'rgba(139,103,240,0.22)' },
  { name:'Teal',    val:'#2ec4a9', dim:'rgba(46,196,169,0.10)',  border:'rgba(46,196,169,0.22)' },
  { name:'Slate',   val:'#7b8fa6', dim:'rgba(123,143,166,0.10)', border:'rgba(123,143,166,0.22)' },
]

export const TIMER_MODES = {
  focus: { label:'Focus',       mins:45 },
  short: { label:'Short Break', mins:5  },
  long:  { label:'Long Break',  mins:15 }
}

export const DEFAULT_TODOS = [
  
]

export const DEFAULT_STREAKS = {
  dsa:   {doneToday:false, label:'DSA',   color:'#5b6af8' },
  study: {doneToday:false, label:'Study', color:'#34c48b' },
  focus: {doneToday:false, label:'Focus', color:'#e8a045' },
}

export const MOTIVATIONS = [
  'Consistency compounds. Show up today.',
  'The best code is written one line at a time.',
  'Clarity over cleverness. Always.',
  'Build in silence. Launch with impact.',
  'Progress, not perfection.',
  'Every expert was once a beginner.',
  'Small steps create massive outcomes.',
  'Deep work changes everything.',
  'Discipline survives when motivation fades.',
  'Focus creates momentum.',
  'You do not rise to goals. You fall to systems.',
  'One focused hour beats ten distracted ones.',
  'Great things take repetition.',
  'Learn slowly. Build deeply.',
  'The hard part is showing up again tomorrow.',
  'Ideas are cheap. Execution is rare.',
  'Keep building even when nobody notices.',
  'The future is built quietly.',
  'Master the basics relentlessly.',
  'Your habits are your real identity.',
  'Momentum loves consistency.',
  'Stay patient. Stay dangerous.',
  'Long-term thinking wins.',
  'Sharpen your mind daily.',
  'A calm mind writes better code.',
  'Systems create freedom.',
  'Good design feels invisible.',
  'Simple scales. Complexity breaks.',
  'The details define the product.',
  'Build what you wish existed.',
  'Slow improvement is still improvement.',
  'The grind becomes beautiful after results.',
  'Energy flows where focus goes.',
  'Keep shipping.',
  'A clean workspace creates a clean mind.',
  'You are closer than you think.',
  'Precision beats speed.',
  'Learn by building.',
  'The best developers never stop learning.',
  'Hard things become easy through repetition.',
  'Protect your attention.',
  'Stay curious longer.',
  'Your future is hidden in your daily routine.',
  'Every line of code teaches something.',
  'Quality is a habit.',
  'Consistency is a superpower.',
  'The compound effect is real.',
  'Mastery requires boredom tolerance.',
  'One project can change everything.',
  'Keep refining.',
  'Good things take focused time.',
  'Do fewer things better.',
  'Distraction is expensive.',
  'Build first. Doubt later.',
  'The process shapes the person.',
  'Think clearly. Build calmly.',
  'Stay locked in.',
  'Every difficult bug improves your thinking.',
  'Comfort kills momentum.',
  'The work speaks eventually.',
  'Make the interface feel effortless.',
  'Strong foundations create strong systems.',
  'A focused developer is unstoppable.',
  'Tiny improvements stack fast.',
  'You become what you repeatedly do.',
  'The next version of you is built daily.',
  'Great software is carefully refined.',
  'The real flex is consistency.',
  'Do the work even when it feels ordinary.',
  'Deep focus is becoming rare.',
  'Skill grows in silence.',
  'Keep moving forward.',
  'Patience creates excellence.',
  'A smooth workflow changes everything.',
  'The edge is built quietly.',
  'Stay obsessed with improvement.',
  'Effort ages well.',
  'Keep your standards high.',
  'Your environment shapes your output.',
  'The first draft is never the final form.',
  'Build for the long run.',
  'Mastery is hidden in repetition.',
  'Good systems remove friction.',
  'Consistency beats intensity.',
  'A clear mind builds clear products.',
  'Discipline creates confidence.',
  'Think bigger. Execute smaller.',
  'Stay present with the work.',
  'Refinement creates elegance.',
  'The best products feel inevitable.',
  'Build what matters.',
  'Do not rush craftsmanship.',
  'Every session counts.',
  'Your focus is your advantage.',
  'Less noise. More depth.',
  'Refine relentlessly.',
  'Meaningful work takes time.',
  'Stay hungry for improvement.',
  'You are building your future line by line.',
]

export const NAV_ITEMS = [
  { id:'dashboard', label:'Dashboard', icon:'LayoutDashboard' },
  { id:'launcher',  label:'Launcher',  icon:'Grid2x2' },
  { id:'tasks',     label:'Tasks',     icon:'CheckSquare' },
  { id:'focus',     label:'Focus',     icon:'Timer' },
  { id:'notes',     label:'Notes',     icon:'StickyNote' },
]

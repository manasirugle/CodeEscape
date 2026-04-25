import { useState, useEffect, useRef } from 'react'

/* ============================
   NAVBAR
   ============================ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { label: 'Destinations', href: '#destinations' },
    { label: 'Vlogs', href: '#vlogs' },
    { label: 'Food', href: '#food' },
    { label: 'Travel Tips', href: '#tips' },
  ]

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">RajVlog</a>
          <ul className="nav-links">
            {links.map(l => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
            <li><a href="#newsletter" className="nav-cta">Subscribe</a></li>
          </ul>
          <div
            className="nav-hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            role="button"
            tabIndex={0}
          >
            <span /><span /><span />
          </div>
        </div>
      </nav>

      <div className={`mobile-nav-overlay ${menuOpen ? 'open' : ''}`}>
        <button
          onClick={() => setMenuOpen(false)}
          style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}
          aria-label="Close menu"
        >✕</button>
        {links.map(l => (
          <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
        <a href="#newsletter" onClick={() => setMenuOpen(false)} style={{ color: 'var(--gold)' }}>Subscribe ✦</a>
      </div>
    </>
  )
}

/* ============================
   HERO
   ============================ */
function Hero() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = '/rajasthan_hero.png'
    img.onload = () => setLoaded(true)
    // Fallback in case on-load doesn't trigger fast
    setTimeout(() => setLoaded(true), 600)
  }, [])

  const stats = [
    { number: '33+', label: 'Destinations' },
    { number: '200+', label: 'Vlog Episodes' },
    { number: '2M+', label: 'Views' },
    { number: '5★', label: "Travellers' Rating" },
  ]

  return (
    <section className="hero" id="home">
      <div className={`hero-bg ${loaded ? 'loaded' : ''}`} />
      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="dot" />
          ✦ Land of Kings & Colors ✦
        </div>
        <h1 className="hero-title">
          Discover <span>Rajasthan</span><br />Like Never Before
        </h1>
        <p className="hero-subtitle">
          From the golden deserts of Jaisalmer to the blue city of Jodhpur — join us on an epic vlog journey through India's most majestic land.
        </p>
        <div className="hero-actions">
          <a href="#vlogs" className="btn-primary">
            ▶ Watch Latest Vlogs
          </a>
          <a href="#destinations" className="btn-secondary">
            🗺 Explore Destinations
          </a>
        </div>
      </div>

      <div className="hero-stats">
        {stats.map(s => (
          <div className="hero-stat" key={s.label}>
            <div className="hero-stat-number">{s.number}</div>
            <div className="hero-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span>SCROLL</span>
        <span>↓</span>
      </div>
    </section>
  )
}

/* ============================
   FADE-IN HOOK
   ============================ */
function useFadeIn() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ============================
   DESTINATIONS
   ============================ */
const DESTINATIONS = [
  { id: 'jaipur', name: 'Jaipur', sub: 'The Pink City', tag: 'Must Visit', emoji: '🏯', bg: 'dest-bg-jaipur', time: '3-4 days', rating: '9.5' },
  { id: 'jodhpur', name: 'Jodhpur', sub: 'The Blue City', tag: 'Hidden Gem', emoji: '🔵', bg: 'dest-bg-jodhpur', time: '2-3 days', rating: '9.2' },
  { id: 'jaisalmer', name: 'Jaisalmer', sub: 'The Golden City', tag: 'Desert Magic', emoji: '🏜️', bg: 'dest-bg-jaisalmer', time: '2-3 days', rating: '9.4' },
  { id: 'udaipur', name: 'Udaipur', sub: 'City of Lakes', tag: 'Romantic', emoji: '🌊', bg: 'dest-bg-udaipur', time: '3-4 days', rating: '9.7' },
  { id: 'pushkar', name: 'Pushkar', sub: 'Holy Lake Town', tag: 'Spiritual', emoji: '🕌', bg: 'dest-bg-pushkar', time: '1-2 days', rating: '8.9' },
  { id: 'bikaner', name: 'Bikaner', sub: 'Camel Country', tag: 'Off-Beat', emoji: '🐪', bg: 'dest-bg-bikaner', time: '1-2 days', rating: '8.6' },
]

function Destinations() {
  const ref = useFadeIn()

  return (
    <section className="destinations-section" id="destinations">
      <div className="container">
        <div className="section-header fade-in" ref={ref}>
          <p className="section-eyebrow">✦ Top Picks</p>
          <h2 className="section-title">Iconic <span>Destinations</span></h2>
          <p className="section-desc">
            Every corner of Rajasthan tells a story. Explore our hand-picked destinations for the ultimate royal experience.
          </p>
        </div>
        <div className="destinations-grid">
          {DESTINATIONS.map((d, i) => (
            <DestCard key={d.id} dest={d} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}

function DestCard({ dest, delay }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => { el.classList.add('visible'); obs.disconnect() }, delay)
        }
      }, { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div className="dest-card fade-in" ref={ref} id={`dest-${dest.id}`}>
      <div className={`dest-city-art ${dest.bg}`}>
        <span role="img" aria-label={dest.name}>{dest.emoji}</span>
      </div>
      <div className="dest-card-overlay">
        <span className="dest-card-tag">{dest.tag}</span>
        <h3 className="dest-card-title">{dest.name}</h3>
        <p className="dest-card-sub">{dest.sub}</p>
        <div className="dest-card-meta">
          <span><span className="icon">🕐</span>{dest.time}</span>
          <span><span className="icon">⭐</span>{dest.rating}/10</span>
        </div>
      </div>
    </div>
  )
}

/* ============================
   VLOGS
   ============================ */
const VLOGS = [
  {
    id: 'v1', featured: true,
    bg: 'v1',
    emoji: '🏯',
    category: 'City Vlog',
    title: 'Lost in Jaipur: A Day Inside Amber Fort & the Pink City Bazaars',
    excerpt: 'We woke up at dawn and climbed the winding paths of Amber Fort before the crowds arrived. The sunrise over the Maota Lake was breathtaking — one of those moments you can\'t plan, only experience.',
    duration: '18:42',
    avatar: '🎥',
    author: 'Arjun Verma',
    date: 'Mar 28, 2025',
    views: '142K',
  },
  {
    id: 'v2', bg: 'v2', emoji: '🔵',
    category: 'Desert Life',
    title: 'Jodhpur Blue Lanes & Mehrangarh at Golden Hour',
    excerpt: 'The blue paint of Jodhpur\'s old city is not just aesthetic — it has a fascinating history tied to the Brahmin caste.',
    duration: '12:15',
    avatar: '📸',
    author: 'Priya Singh',
    date: 'Apr 5, 2025',
    views: '87K',
  },
  {
    id: 'v3', bg: 'v3', emoji: '🏕️',
    category: 'Camp & Stars',
    title: 'Sleeping Under a Billion Stars in Jaisalmer Dunes',
    excerpt: 'Our overnight desert camp in the Sam dunes was magical. No wi-fi, no light pollution — just the Milky Way stretching above us.',
    duration: '14:33',
    avatar: '⛺',
    author: 'Rohit Das',
    date: 'Apr 10, 2025',
    views: '203K',
  },
]

function Vlogs() {
  const ref = useFadeIn()
  const [featured, ...rest] = VLOGS

  return (
    <section className="vlogs-section" id="vlogs">
      <div className="container">
        <div className="section-header fade-in" ref={ref}>
          <p className="section-eyebrow">✦ Latest Videos</p>
          <h2 className="section-title" style={{ color: 'white' }}>Fresh <span>Vlog</span> Episodes</h2>
          <p className="section-desc">New adventures every week — subscribe so you never miss an episode.</p>
        </div>
        <div className="vlogs-grid">
          <VlogCard vlog={featured} featured />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {rest.map(v => <VlogCard key={v.id} vlog={v} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function VlogCard({ vlog, featured }) {
  const ref = useFadeIn()
  return (
    <article className={`vlog-card ${featured ? 'vlog-featured' : ''} fade-in`} ref={ref} id={`vlog-${vlog.id}`}>
      <div className="vlog-thumb">
        <div className={`vlog-thumb-bg ${vlog.bg}`} style={{ aspectRatio: featured ? '16/10' : '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: featured ? '6rem' : '4rem' }}>
          <span role="img" aria-label={vlog.title}>{vlog.emoji}</span>
        </div>
        <div className="vlog-play" aria-label="Play video">▶</div>
        <div className="vlog-duration">{vlog.duration}</div>
      </div>
      <div className="vlog-body">
        <p className="vlog-category">{vlog.category}</p>
        <h3 className="vlog-title">{vlog.title}</h3>
        {featured && <p className="vlog-excerpt">{vlog.excerpt}</p>}
        <div className="vlog-footer">
          <div className="vlog-author">
            <div className="vlog-avatar">{vlog.avatar}</div>
            <div className="vlog-author-info">
              <p className="name">{vlog.author}</p>
              <p className="date">{vlog.date}</p>
            </div>
          </div>
          <span className="vlog-views">👁 {vlog.views}</span>
        </div>
      </div>
    </article>
  )
}

/* ============================
   EXPERIENCE STRIP
   ============================ */
const EXPERIENCES = [
  { icon: '🐘', title: 'Elephant Safaris', desc: 'Ride majestic elephants through jungle trails at Amber Fort.' },
  { icon: '🎪', title: 'Folk Performances', desc: 'Watch Kalbeliya dance and fire shows under the stars.' },
  { icon: '🛕', title: 'Temple Walks', desc: 'Explore ancient temples adorned with intricate carvings.' },
  { icon: '🍳', title: 'Cooking Classes', desc: 'Learn to cook authentic dal baati churma with local families.' },
]

function ExperienceStrip() {
  const ref = useFadeIn()
  return (
    <section className="experience-strip">
      <div className="container">
        <div className="exp-grid fade-in" ref={ref}>
          {EXPERIENCES.map(e => (
            <div className="exp-item" key={e.title}>
              <span className="exp-icon" role="img" aria-label={e.title}>{e.icon}</span>
              <h3 className="exp-title">{e.title}</h3>
              <p className="exp-desc">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================
   FOOD
   ============================ */
const FOODS = [
  { name: 'Dal Baati Churma', desc: 'The quintessential Rajasthani meal — hard wheat rolls served with lentil curry and sweet churma.', tags: ['Vegetarian', 'Traditional', 'Must-try'], emoji: '🥘', bg: 'f1' },
  { name: 'Laal Maas', desc: 'A fiery mutton curry cooked with aromatic spices, the pride of Rajasthani non-veg cuisine.', tags: ['Non-Veg', 'Spicy', 'Mewar'], emoji: '🍖', bg: 'f2' },
  { name: 'Ghevar', desc: 'A honeycomb-shaped sweet soaked in sugar syrup, especially popular during Teej festival.', tags: ['Sweet', 'Festival', 'Jaipur'], emoji: '🍯', bg: 'f3' },
  { name: 'Mirchi Bada', desc: 'Spicy chili fritters stuffed with potatoes — the ultimate street snack of Jodhpur.', tags: ['Street Food', 'Snack', 'Jodhpur'], emoji: '🌶️', bg: 'f4' },
]

function Food() {
  const ref = useFadeIn()
  return (
    <section className="food-section" id="food">
      <div className="container">
        <div className="section-header fade-in" ref={ref}>
          <p className="section-eyebrow" style={{ color: 'var(--maroon)' }}>✦ Taste Rajasthan</p>
          <h2 className="section-title">Flavours of the <span>Desert</span></h2>
          <p className="section-desc" style={{ color: 'var(--text-secondary)' }}>
            Rajasthani cuisine is bold, aromatic, and unforgettable. Here are the dishes you absolutely must try.
          </p>
        </div>
        <div className="food-grid">
          {FOODS.map((f, i) => <FoodCard food={f} key={f.name} delay={i * 100} />)}
        </div>
      </div>
    </section>
  )
}

function FoodCard({ food, delay }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => { el.classList.add('visible'); obs.disconnect() }, delay)
        }
      }, { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div className="food-card fade-in" ref={ref} id={`food-${food.name.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className={`food-img ${food.bg}`}>
        <span role="img" aria-label={food.name}>{food.emoji}</span>
      </div>
      <div className="food-body">
        <h3 className="food-name">{food.name}</h3>
        <p className="food-desc">{food.desc}</p>
        <div className="food-tags">
          {food.tags.map(t => <span className="food-tag" key={t}>{t}</span>)}
        </div>
      </div>
    </div>
  )
}

/* ============================
   TIPS
   ============================ */
const TIPS = [
  { title: 'Best time to visit', desc: 'October to March is ideal — cool weather, festivals like Pushkar Mela and Desert Festival.' },
  { title: 'Book Heritage Hotels', desc: 'Stay in a haveliexperience — old mansions turned boutique hotels for an authentic feel.' },
  { title: 'Haggle at Bazaars', desc: 'Bargaining is expected and part of the fun at local markets in Jodhpur and Jaipur.' },
  { title: 'Carry Cash', desc: 'Many small towns and remote areas have limited ATM access — carry enough rupees.' },
  { title: 'Dress Modestly', desc: 'Respect local traditions especially when entering temples. Cover shoulders and knees.' },
]

function Tips() {
  const ref = useFadeIn()
  const visRef = useFadeIn()
  return (
    <section className="tips-section" id="tips">
      <div className="container">
        <div className="tips-grid">
          <div className="tips-visual fade-in" ref={visRef}>
            <span role="img" aria-label="Rajasthan culture">🌅</span>
          </div>
          <div className="tips-content fade-in" ref={ref}>
            <p className="section-eyebrow">✦ Travel Smart</p>
            <h2 className="section-title">Insider <span>Tips</span> for Rajasthan</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Collected from 200+ days on the road across Rajasthan. These tips will save you time, money, and hassle.
            </p>
            <div className="tips-list">
              {TIPS.map((t, i) => (
                <div className="tip-item" key={t.title}>
                  <div className="tip-number">{i + 1}</div>
                  <div className="tip-text">
                    <p className="tip-title">{t.title}</p>
                    <p className="tip-desc">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================
   NEWSLETTER
   ============================ */
function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const ref = useFadeIn()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) { setSent(true) }
  }

  return (
    <section className="newsletter" id="newsletter">
      <div className="container">
        <div className="newsletter-inner fade-in" ref={ref}>
          <h2 className="newsletter-title">Never Miss a <span>Journey</span></h2>
          <p className="newsletter-desc">
            Get weekly vlog drops, hidden gems, travel itineraries, and exclusive Rajasthan guides straight to your inbox.
          </p>
          {sent ? (
            <div style={{ color: 'var(--gold)', fontSize: '1.2rem', fontWeight: 700, padding: '20px', background: 'rgba(247,183,49,0.1)', borderRadius: 16, border: '1px solid rgba(247,183,49,0.3)' }}>
              🎉 You're subscribed! Welcome to the RajVlog family!
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubmit} id="newsletter-form">
              <input
                id="newsletter-email"
                className="newsletter-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <button className="newsletter-btn" type="submit" id="newsletter-submit">
                Subscribe ✦
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ============================
   FOOTER
   ============================ */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <p className="logo">RajVlog</p>
            <p>Documenting the magic of Rajasthan through cinematic travel vlogs. Join us on the road as we explore forts, deserts, food, and culture.</p>
            <div className="footer-social">
              {['📺', '📸', '🐦', '🎵'].map((icon, i) => (
                <a className="social-link" key={i} href="#" aria-label={`Social link ${i + 1}`}>{icon}</a>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <h4>Destinations</h4>
            <ul>
              {['Jaipur', 'Jodhpur', 'Jaisalmer', 'Udaipur', 'Pushkar', 'Bikaner'].map(d => (
                <li key={d}><a href="#destinations">{d}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Vlogs</h4>
            <ul>
              {['Latest Episodes', 'City Vlogs', 'Desert Life', 'Food Diaries', 'Culture & Heritage'].map(v => (
                <li key={v}><a href="#vlogs">{v}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              {['About Us', 'Contact', 'Collaborate', 'Press Kit', 'Privacy Policy'].map(c => (
                <li key={c}><a href="#">{c}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2025 RajVlog · Made with <span className="footer-heart">♥</span> in Rajasthan</p>
          <p className="footer-tagline">पधारो म्हारे देश · Welcome to our land</p>
        </div>
      </div>
    </footer>
  )
}

/* ============================
   APP ROOT
   ============================ */
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Destinations />
        <ExperienceStrip />
        <Vlogs />
        <Food />
        <Tips />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}

import { useState } from 'react'
import ThemeToggle from '../common/ThemeToggle'

const navLinks = [
  ['Models', '#models'],
  ['Gateway', '#gateway'],
  ['Pricing', '#rates'],
  ['Docs', '/console/docs'],
]

function LandingHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="landing-nav container">
      <a className="wordmark" aria-label="LLMHub home" href="/">llm<span>hub</span></a>
      <nav className={open ? 'nav-links nav-links-open' : 'nav-links'} aria-label="Primary navigation">
        {navLinks.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="nav-console" href="/console">Open console</a>
      </nav>
      <div className="nav-tools">
        <ThemeToggle />
        <button className="menu-button" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
      </div>
    </header>
  )
}

export default LandingHeader

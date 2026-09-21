function MainLayout({ children }) {
  return (
    <main className="app-shell">
      <header className="app-header">
        <a className="brand" href="/">LLMHub</a>
      </header>
      {children}
    </main>
  )
}

export default MainLayout

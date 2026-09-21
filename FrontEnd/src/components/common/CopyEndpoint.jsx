import { useState } from 'react'

function CopyEndpoint() {
  const [copied, setCopied] = useState(false)

  async function copyUrl() {
    await navigator.clipboard?.writeText(`${window.location.origin}/v1`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="endpoint-band">
      <div className="endpoint container">
        <span>Gateway base URL</span><code>/v1</code>
        <button type="button" onClick={copyUrl}>{copied ? 'Copied!' : 'Copy URL'}</button>
        <span className="sr-only" role="status">{copied && 'Gateway URL copied'}</span>
      </div>
    </div>
  )
}

export default CopyEndpoint

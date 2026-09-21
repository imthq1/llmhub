const models = [
  { name: 'GPT-4.1 mini', provider: 'OpenAI', input: '$0.40', output: '$1.60' },
  { name: 'Claude 3.5 Haiku', provider: 'Anthropic', input: '$0.80', output: '$4.00' },
  { name: 'Gemini 2.0 Flash', provider: 'Google', input: '$0.10', output: '$0.40' },
]

function ModelCatalog() {
  return (
    <div className="table-wrap" tabIndex="0" role="region" aria-label="Published model pricing">
      <table>
        <thead><tr><th>Model</th><th>Provider</th><th>Input</th><th>Output</th></tr></thead>
        <tbody>{models.map((model) => (
          <tr key={model.name}><td>{model.name}</td><td>{model.provider}</td><td>{model.input}</td><td>{model.output}</td></tr>
        ))}</tbody>
      </table>
    </div>
  )
}

export default ModelCatalog

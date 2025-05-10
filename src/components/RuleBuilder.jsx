import { useState } from 'react'

const defaultRule = { field: 'total_spend', operator: '>', value: '', logic: 'AND' }

export default function RuleBuilder({ rules, setRules }) {
  const fields = ['total_spend', 'visits', 'last_active_days']
  const operators = ['>', '<', '=', '>=', '<=']

  const handleRuleChange = (index, key, value) => {
    const updated = [...rules]
    updated[index][key] = value
    setRules(updated)
  }

  const addRule = () => {
    setRules([...rules, { ...defaultRule }])
  }

  const removeRule = (index) => {
    const updated = rules.filter((_, i) => i !== index)
    setRules(updated)
  }

  return (
    <div className="space-y-4">
      {rules.map((rule, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <select
              value={rule.logic}
              onChange={(e) => handleRuleChange(index, 'logic', e.target.value)}
              className="border p-2 rounded"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          )}

          <select
            value={rule.field}
            onChange={(e) => handleRuleChange(index, 'field', e.target.value)}
            className="border p-2 rounded"
          >
            {fields.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            value={rule.operator}
            onChange={(e) => handleRuleChange(index, 'operator', e.target.value)}
            className="border p-2 rounded"
          >
            {operators.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={rule.value}
            onChange={(e) => handleRuleChange(index, 'value', e.target.value)}
            className="border p-2 rounded"
            placeholder="Enter value"
          />

          <button
            onClick={() => removeRule(index)}
            className="text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addRule}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
      >
        + Add Rule
      </button>
    </div>
  )
}

import { useCallback, useMemo, useRef, useState } from 'react'
import { fetchIntentRoute } from '../api'

export const MAX_INSTRUCTION_LENGTH = 500

// Owns the pin placement, instruction text and objective for natural-language
// routing, plus the single route that comes back. Responses from superseded
// requests are dropped via a request counter.
export function useIntentRoute() {
  const [startPin, setStartPin] = useState(null)
  const [endPin, setEndPin] = useState(null)
  const [instruction, setInstruction] = useState('')
  const [objective, setObjective] = useState('AUTO')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const requestId = useRef(0)

  const run = useCallback((start, end, text, obj, policy) => {
    const id = ++requestId.current
    setLoading(true)
    setError(null)

    fetchIntentRoute({ start, end, instruction: text, objective: obj, unknownDataPolicy: policy }).then(
      ({ data, error: err }) => {
        if (id !== requestId.current) return
        setLoading(false)
        if (err) {
          setError(err)
          setResult(null)
        } else {
          setResult(data)
        }
      },
    )
  }, [])

  const clearResult = useCallback(() => {
    requestId.current++
    setLoading(false)
    setError(null)
    setResult(null)
  }, [])

  const canSubmit = Boolean(startPin && endPin && instruction.trim()) && !loading

  const submit = useCallback(
    (policy = 'STRICT') => {
      if (!startPin || !endPin || !instruction.trim()) return
      run(startPin, endPin, instruction.trim(), objective, policy)
    },
    [startPin, endPin, instruction, objective, run],
  )

  const changeObjective = useCallback(
    (value) => {
      setObjective(value)
      if (result && startPin && endPin) {
        run(startPin, endPin, instruction.trim(), value, result.unknownDataPolicy || 'STRICT')
      }
    },
    [result, startPin, endPin, instruction, run],
  )

  const handleMapClick = useCallback(
    ({ lat, lng }) => {
      clearResult()
      if (!startPin) {
        setStartPin({ lat, lng })
      } else if (!endPin) {
        setEndPin({ lat, lng })
      } else {
        setStartPin(null)
        setEndPin(null)
      }
    },
    [startPin, endPin, clearResult],
  )

  const routes = useMemo(() => (result ? [result] : []), [result])

  // Dashed links from each pin to where the path really begins and ends.
  const snapLinks = useMemo(() => {
    if (!result) return []
    const links = []
    if (startPin && result.snappedStart) links.push([startPin, result.snappedStart])
    if (endPin && result.snappedEnd) links.push([endPin, result.snappedEnd])
    return links
  }, [result, startPin, endPin])

  return {
    startPin,
    endPin,
    instruction,
    setInstruction,
    objective,
    changeObjective,
    result,
    routes,
    snapLinks,
    loading,
    error,
    canSubmit,
    submit,
    handleMapClick,
  }
}

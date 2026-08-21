import axios from 'axios'

const API_BASE = '/api'

function describeError(err, context) {
  const status = err.response?.status
  const serverMsg = err.response?.data?.error || err.response?.data?.message

  if (status === 400) {
    if (serverMsg) return serverMsg
    return context === 'isochrone'
      ? 'That survey point falls outside the charted region.'
      : 'Start or end falls outside the charted region — pick a point inside the bordered map.'
  }

  if (status === 404) {
    if (serverMsg) return serverMsg
    return context === 'isochrone'
      ? 'No roads reach out from that point on the chart.'
      : 'No route connects those two points — they may sit on disconnected roads.'
  }

  if (status === 503) {
    return serverMsg || 'The routing engine is still loading its charts. Try again in a moment.'
  }

  if (!err.response) {
    return 'Cannot reach the survey office — make sure the backend is running on port 8080.'
  }

  return serverMsg || `Unexpected reading from the survey office (HTTP ${status}).`
}

export async function fetchRegion() {
  const res = await axios.get(`${API_BASE}/region`)
  return res.data
}

export async function fetchShortestPath({ start, end, optimize, alternates }) {
  try {
    const res = await axios.post(`${API_BASE}/shortest-path`, { start, end, optimize, alternates })
    return { data: res.data, error: null }
  } catch (err) {
    return { data: null, error: describeError(err, 'route') }
  }
}

export async function fetchIsochrone({ lat, lng, minutes, optimize }) {
  try {
    const res = await axios.get(`${API_BASE}/isochrone`, { params: { lat, lng, minutes, optimize } })
    return { data: res.data, error: null }
  } catch (err) {
    return { data: null, error: describeError(err, 'isochrone') }
  }
}

// The backend returns a bare { path, distanceMeters, estimatedTimeSecs } when
// alternates=false, or { routes: [...] } of the same shape when alternates=true.
export function normalizeRoutes(data) {
  if (!data) return []
  if (Array.isArray(data.routes)) return data.routes
  if (data.path) return [data]
  return []
}

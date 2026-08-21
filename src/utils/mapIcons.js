import L from 'leaflet'

const INK = '#0E1B2B'

function pinIcon(fill) {
  const html = `
    <svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 9.8 14 24 14 24s14-14.2 14-24C28 6.3 21.7 0 14 0z" fill="${fill}" stroke="${INK}" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="4.5" fill="${INK}"/>
    </svg>`

  return L.divIcon({
    html,
    className: 'atlas-pin',
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -34],
  })
}

export const startIcon = pinIcon('#C9A15C')
export const endIcon = pinIcon('#8B4B3B')

export const isoCenterIcon = L.divIcon({
  html: `
    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="15" cy="15" r="12.5" fill="${INK}" stroke="#C9A15C" stroke-width="2"/>
      <path d="M15 5.5 L18 15 L15 24.5 L12 15 Z" fill="#C9A15C"/>
      <circle cx="15" cy="15" r="2" fill="#F4EFE4"/>
    </svg>`,
  className: 'atlas-compass',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

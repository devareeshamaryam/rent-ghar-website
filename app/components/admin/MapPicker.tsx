 'use client'

import { useEffect, useRef } from 'react'

interface Props {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}

export default function MapPicker({ lat, lng, onChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return

    import('leaflet').then((L) => {
      // Destroy existing instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }

      // ⚠️ Key fix: delete Leaflet's internal DOM tracking ID
      // React Strict Mode runs useEffect twice — this prevents "already initialized" error
      delete (mapRef.current as any)._leaflet_id

      // Fix broken default marker icons in webpack/Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      // Init map
      const map = L.map(mapRef.current!).setView([lat, lng], 13)
      mapInstanceRef.current = map

      // Tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Draggable marker
      const marker = L.marker([lat, lng], { draggable: true }).addTo(map)
      markerRef.current = marker

      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        onChange(+pos.lat.toFixed(6), +pos.lng.toFixed(6))
      })

      map.on('click', (e: any) => {
        marker.setLatLng([e.latlng.lat, e.latlng.lng])
        onChange(+e.latlng.lat.toFixed(6), +e.latlng.lng.toFixed(6))
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync marker when lat/lng change externally
  useEffect(() => {
    if (!markerRef.current || !mapInstanceRef.current) return
    markerRef.current.setLatLng([lat, lng])
    mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom())
  }, [lat, lng])

  return (
    <div
      ref={mapRef}
      className="w-full h-64 rounded-lg overflow-hidden border border-gray-200"
      style={{ zIndex: 0 }}
    />
  )
}
import { ref } from 'vue'

const useLocationMap = () => {
  const zoom = ref(18)
  const center = ref([-11.9893762, -77.0656702])

  const pin = (e) => {
    
    const marker = e.target.getLatLng()
    center.value = [marker.lat, marker.lng]

    console.log(center.value)
  }

  return {
    zoom,
    center,
    pin
  }
}
export default useLocationMap

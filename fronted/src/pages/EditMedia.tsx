import MediaForm from "@/components/ui/MediaForm"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

export default function EditMedia() {
  const { id } = useParams()
  const [mediaData, setMediaData] = useState<any>(null)

  useEffect(() => {
    const fetchMedia = async () => {
      const res = await axios.get(`http://localhost:5000/api/media/${id}`)
      setMediaData(res.data)
    }
    fetchMedia()
  }, [id])

  if (!mediaData) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white p-4">
      <MediaForm mode="edit" initialData={mediaData} mediaId={parseInt(id!)} />
    </div>
  )
}

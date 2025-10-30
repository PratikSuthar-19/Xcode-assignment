import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createMedia, updateMedia , uploadToCloudinary } from "@/api/media"
import { Link, useNavigate } from "react-router-dom"

interface MediaFormProps {
  mode?: "create" | "edit"
  initialData?: any
  mediaId?: number
}

export default function MediaForm({ mode = "create", initialData, mediaId }: MediaFormProps) {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "MOVIE",
    director: initialData?.director || "",
    budget: initialData?.budget || null,
  location: initialData?.location || null,
  duration: initialData?.duration || null,
    yearOrTime: initialData?.yearOrTime || "",
    posterUrl: initialData?.posterUrl || "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [uploading, setUploading] = useState(false)


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const imageUrl = await uploadToCloudinary(file)
      setFormData((prev) => ({ ...prev, posterUrl: imageUrl }))
      setUploading(false)
    } catch (err) {
      console.error("Upload failed:", err)
      setUploading(false)
      setMessage("Image upload failed. Try again.")
    }
  }

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const payload = { ...formData }

      if (mode === "edit" && mediaId) {
        await updateMedia(mediaId, payload)
        setMessage("Media updated successfully!")
      } else {
        await createMedia(payload)
        setMessage("Media created successfully!")
      }

      if (mode === "create") {
        setFormData({
          title: "",
          description: "",
          type: "MOVIE",
          director: "",
          budget: "",
          location: "",
          duration: "",
          yearOrTime: "",
          posterUrl: "",
        })
      }
       setTimeout(() => navigate("/media"), 1000)
    } catch (err: any) {
      setMessage(" Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl border border-gray-800 bg-neutral-950 text-white shadow-xl">
      <h2 className="text-3xl font-semibold text-center mb-6">
        {mode === "edit" ? "Edit Media" : "Create Media"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
      
        <Input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

      
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gray-400 focus:ring-0 transition-all duration-300"
          rows={4}
        />

       
        <Input
          name="director"
          placeholder="Director"
          value={formData.director}
          onChange={handleChange}
        />

      
        <Input
          name="yearOrTime"
          placeholder="Year or Duration"
          value={formData.yearOrTime}
          onChange={handleChange}
        />

       <Input name="budget" placeholder="Budget" value={formData.budget} onChange={handleChange} />
        <Input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <Input name="duration" placeholder="Duration (e.g., 2h 30m)" value={formData.duration} onChange={handleChange} />

        
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-gray-400 focus:ring-0"
        >
          <option value="MOVIE" className="bg-black text-white">
            Movie
          </option>
          <option value="TVSHOW" className="bg-black text-white">
            TV Show
          </option>
        </select>

       
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Poster Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-300 border border-gray-700 rounded-md p-2 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-gray-800 file:text-gray-200 hover:file:bg-gray-700 cursor-pointer"
          />

      
          {uploading ? (
            <p className="text-gray-400 text-sm mt-2">Uploading image...</p>
          ) : formData.posterUrl ? (
            <img
              src={formData.posterUrl}
              alt="Preview"
              className="mt-2 rounded-lg border border-gray-700 max-h-48 w-full object-cover"
            />
          ) : null}
        </div>

    
        <Button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-white text-black font-medium py-2 rounded-xl hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          {loading
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : mode === "edit"
            ? "Update Media"
            : "Create Media"}
        </Button>
      </form>

      
      {message && (
        <p
          className={`text-center text-sm mt-4 transition-all duration-300 ${
            message.includes("Error") || message.includes("failed")
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}

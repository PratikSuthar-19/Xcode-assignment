import MediaForm from "@/components/ui/MediaForm"

export default function CreateMediaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <MediaForm mode="create" />
    </div>
  )
}

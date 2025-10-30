import MediaTable from "@/components/ui/MediaTable";

export default function MediaList() {

  return (
    <div className="min-h-screen bg-black text-white ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Media Library</h1>
        <MediaTable />
      </div>
    </div>
  );
}

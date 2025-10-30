import { useEffect, useRef, useState } from "react";
import { deleteMedia, getMedia } from "@/api/media";
import ImageModal from "./ImageModal";
import { Input } from "./input";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { searchMediaApi } from "@/api/media";

type MediaItem = {
  id: number;
  title: string;
  description?: string;
  type?: string;
  director?: string;
  budget?: string | null;
  location?: string | null;
  duration?: string | null;
  yearOrTime?: string | null;
  posterUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

interface Props {
  initialQuery?: string;
  pageSize?: number;
}

export default function MediaTable({ initialQuery = "", pageSize = 10 }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(initialQuery);
  const [showImage, setShowImage] = useState<string | null>(null);
  const [mobileDetails, setMobileDetails] = useState<MediaItem | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [search]);

  useEffect(() => {
    
    const fetchPage = async () => {
      if (!hasMore) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getMedia({ page, limit: pageSize, q: search });
        
        const data = Array.isArray(res) ? res : res.data ?? res.items ?? res;
        const meta = res.meta ?? res.pagination ?? null;
        setItems((prev) => (page === 1 ? data : [...prev, ...data]));
       
        if (meta) {
          const total = meta.total ?? meta.count ?? null;
          if (total != null) {
            setHasMore(page * pageSize < total);
          } else {
            setHasMore(data.length >= pageSize); 
          }
        } else {
          setHasMore(data.length >= pageSize); 
        }
      } catch (err: any) {
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
    
  }, [page, search]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [loading, hasMore]);

   useEffect(() => {
  console.log("Search changed:", search);
  if (debounceRef.current) clearTimeout(debounceRef.current);

  debounceRef.current = setTimeout(async () => {
    console.log("⏱️ Debounced call triggered for:", search);
    try {
      setIsSearching(true);
      console.log("API HIT START");
      const results = await searchMediaApi(search);
      console.log("API RESPONSE", results);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  return () => clearTimeout(debounceRef.current);
}, [search]);
console.log(search)


const handleDeleteClick = (media: any) => {
  setSelectedMedia(media);
  setShowConfirm(true);
};

const confirmDelete = async () => {
  if (!selectedMedia) return;
  try {
    await deleteMedia(selectedMedia.id);
    setItems((prev) => prev.filter((item) => item.id !== selectedMedia.id));
  } catch (err: any) {
    console.error(err);
  } finally {
    setShowConfirm(false);
    setSelectedMedia(null);
  }
}

  // responsive detection
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const displayedItems = search.trim() ? searchResults : items;

  return (
    <div className="w-full">
      {/* Search input */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center">
        <Input
          placeholder="Search by title, director, year..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xl bg-transparent border border-gray-700 text-white placeholder-gray-400"
        />
          {isSearching && <span className="text-sm text-gray-400 ml-3">Searching...</span>}

      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-neutral-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Director</th>
                <th>Budget</th>
    <th>Location</th>
    <th>Duration</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Year/Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Poster</th>

              </tr>
            </thead>
            <tbody className="bg-black divide-y divide-gray-800">
              {displayedItems.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-gray-900 transition-colors duration-150"
                >
                  <td className="px-4 py-3 text-sm text-gray-300">{m.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-100">{m.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{m.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{m.director ?? "-"}</td>
                  <td>{m.budget ?? "-"}</td>
                  <td>{m.location ?? "-"}</td>
                  <td>{m.duration ?? "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{m.yearOrTime ?? "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    <div className="flex gap-2">
                      <a
                       href={`/media/edit/${m.id}`}
                       className="text-sm px-3 py-1 rounded-md border border-gray-700 hover:bg-gray-800"
                      >
                       Edit
                     </a>
                     <button
                      onClick={() => handleDeleteClick(m)}
                      className="text-sm px-3 py-1 rounded-md border border-red-700 text-red-400 hover:bg-red-900/30"
                     >
                      Delete
                    </button>

                      {/* Other actions */}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-orange-400">
                    {m.posterUrl ? (
                      <button
                        onClick={() => setShowImage(m.posterUrl!)}
                        className="underline hover:text-orange-300"
                      >
                        View Poster
                      </button>
                    ) : (
                      <span className="text-gray-600">No poster</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile / tablet: compact list */}
      <div className="md:hidden space-y-3">
        {displayedItems.map((m) => (
          <div
            key={m.id}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-neutral-950 hover:bg-gray-900 transition"
          >
            <div>
              <div className="text-sm text-gray-300">#{m.id}</div>
              <div className="text-lg text-white font-medium">{m.title}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => setMobileDetails(m)}
                className="text-sm text-orange-400 underline"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* sentinel for observer */}
      <div ref={sentinelRef} />

      {/* loading / error */}
      <div className="mt-4 flex items-center justify-center">
        {loading && <div className="text-gray-400">Loading...</div>}
        {!loading && !hasMore && items.length > 0 && (
          <div className="text-gray-500">No more records</div>
        )}
        {error && <div className="text-red-400">{error}</div>}
      </div>

      {/* Image modal */}
      {showImage && (
        <ImageModal src={showImage} onClose={() => setShowImage(null)} />
      )}

      {/* Mobile details modal */}

      {mobileDetails && (
  <div className="fixed inset-0 z-40 flex items-end md:hidden">
    {/* Background Overlay */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={() => setMobileDetails(null)}
    />

    {/* Modal Content */}
    <div className="relative z-10 w-full bg-neutral-950 rounded-t-2xl p-5 border-t border-gray-800 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
      <button
        onClick={() => setMobileDetails(null)}
        className="text-gray-400 text-sm mb-4 hover:text-white transition"
      >
        ✕ Close
      </button>

      {/* Card */}
      <div className="bg-neutral-900 rounded-xl border border-gray-800 overflow-hidden shadow-lg">
        {/* Poster Image */}
        {mobileDetails.posterUrl ? (
          <img
            src={mobileDetails.posterUrl}
            alt="poster"
            className="w-full h-56 object-cover"
          />
        ) : (
          <div className="w-full h-56 bg-neutral-800 flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-3">
          <h2 className="text-lg font-semibold text-white">{mobileDetails.title}</h2>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-neutral-800/60 rounded-lg p-2 border border-gray-700">
              <span className="text-gray-400 block text-xs">Type</span>
              <span className="text-gray-200">{mobileDetails.type}</span>
            </div>

            <div className="bg-neutral-800/60 rounded-lg p-2 border border-gray-700">
              <span className="text-gray-400 block text-xs">Director</span>
              <span className="text-gray-200">{mobileDetails.director}</span>
            </div>

            <div className="bg-neutral-800/60 rounded-lg p-2 border border-gray-700">
              <span className="text-gray-400 block text-xs">Budget</span>
              <span className="text-gray-200">{mobileDetails.budget ?? "-"}</span>
            </div>

            <div className="bg-neutral-800/60 rounded-lg p-2 border border-gray-700">
              <span className="text-gray-400 block text-xs">Location</span>
              <span className="text-gray-200">{mobileDetails.location ?? "-"}</span>
            </div>

            <div className="bg-neutral-800/60 rounded-lg p-2 border border-gray-700">
              <span className="text-gray-400 block text-xs">Duration</span>
              <span className="text-gray-200">{mobileDetails.duration ?? "-"}</span>
            </div>

            <div className="bg-neutral-800/60 rounded-lg p-2 border border-gray-700">
              <span className="text-gray-400 block text-xs">Year/Time</span>
              <span className="text-gray-200">{mobileDetails.yearOrTime}</span>
            </div>


          {/* Description
          <div className="bg-neutral-800/60 rounded-lg p-3 border border-gray-700 mt-3">
            <span className="text-gray-400 block text-xs mb-1">Description</span>
            <p className="text-gray-200 text-sm leading-relaxed">
              {mobileDetails.description || "No description provided."}
            </p>
          </div> */}

          </div>
           {/* Description */}
          <div className="bg-neutral-800/60 rounded-lg p-3 border border-gray-700 mt-3">
            <span className="text-gray-400 block text-xs mb-1">Description</span>
            <p className="text-gray-200 text-sm leading-relaxed">
              {mobileDetails.description || "No description provided."}
            </p>
          </div> 

         
                      <div className="flex gap-3.5">
                      <a
                       href={`/media/edit/${mobileDetails.id}`}
                       className="text-sm px-3 py-1 rounded-md border border-gray-700 hover:bg-gray-800"
                      >
                       Edit
                     </a>
                     <button
                      onClick={() => handleDeleteClick(mobileDetails)}
                      className="text-sm px-3 py-1 rounded-md border border-red-700 text-red-400 hover:bg-red-900/30"
                     >
                      Delete
                    </button>

                    </div>

        </div>
      </div>
    </div>
  </div>
)}

      {showConfirm && (
  <ConfirmDialog
    title={`Delete "${selectedMedia?.title}"?`}
    message="This action cannot be undone."
    onConfirm={confirmDelete}
    onCancel={() => setShowConfirm(false)}
  />
)}

    </div>
  );
}

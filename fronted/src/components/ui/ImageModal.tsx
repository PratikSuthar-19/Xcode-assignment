interface Props {
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function ImageModal({ src, alt = "Poster", onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
     
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/60"
        onClick={onClose}
      />
      <div className="relative z-10 max-w-3xl w-full rounded-xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-black/60 text-white px-3 py-1 rounded-md hover:bg-black/80"
        >
          Close
        </button>
        <div className="bg-black p-6 flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            className="max-h-[80vh] w-auto object-contain rounded-md"
          />
        </div>
      </div>
    </div>
  );
}

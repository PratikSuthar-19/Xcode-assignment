// src/pages/MediaList.tsx
import React, { useState } from "react";
import MediaTable from "@/components/ui/MediaTable";
import { useDebounce } from "@/hooks/useDebounce";

export default function MediaList() {
  // we'll pass search via props later if you want; MediaTable has its own search
  return (
    <div className="min-h-screen bg-black text-white ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Media Library</h1>
        <MediaTable />
      </div>
    </div>
  );
}

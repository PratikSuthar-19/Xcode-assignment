import * as mediaService from '../services/mediaService.js';
import { uploadStream } from '../config/cloudinary.js';

export async function createMedia(req, res, next) {
  try {
    const data = req.body;

    // If file uploaded via multer as `poster`
    if (req.file && req.file.buffer) {
      const result = await uploadStream(req.file.buffer, 'favorite-media');
      data.posterUrl = result.secure_url;
    }

    data.createdBy = req.user.id;
    const media = await mediaService.createMedia(data);
    res.status(201).json(media);
  } catch (err) {
    next(err);
  }
}

export async function listMedia(req, res, next) {
  try {
    const { cursor, limit, type, search } = req.query;
    const { items, nextCursor } = await mediaService.getMediaList({
      cursor,
      limit: Number(limit) || 20,
      type,
      search,
    });
    res.json({ items, nextCursor });
  } catch (err) {
    next(err);
  }
}

export async function getMedia(req, res, next) {
  try {
    const id = Number(req.params.id);
    const media = await mediaService.getMediaById(id);
    if (!media) return res.status(404).json({ error: 'Not found' });
    res.json(media);
  } catch (err) {
    next(err);
  }
}

export async function updateMedia(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    // Handle file upload
    if (req.file && req.file.buffer) {
      const result = await uploadStream(req.file.buffer, 'favorite-media');
      data.posterUrl = result.secure_url;
    }

    const isAdmin = req.user.role === 'ADMIN';
    const updated = await mediaService.updateMedia(id, data, req.user.id, isAdmin);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteMedia(req, res, next) {
  try {
    const id = Number(req.params.id);
    const isAdmin = req.user.role === 'ADMIN';
    await mediaService.deleteMedia(id, req.user.id, isAdmin);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function searchMedia(req, res, next) {
  try {
    const q = req.query?.q || ""; // ✅ safely handle missing q
    const results = await mediaService.searchMedia(q); // ✅ pass only q, not req
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    next(err);
  }
}

// export async function searchMedia(req, res, next) {
//   try {
//     const { q, limit } = req.query;

//     if (!q || q.trim() === "") {
//       return res.status(400).json({ error: "Search query (q) is required" });
//     }

//     const results = await mediaService.searchMedia({
//       query: q,
//       limit: Number(limit) || 10,
//     });

//     res.json({ items: results });
//   } catch (err) {
//     next(err);
//   }
// }

import prisma from '../config/db.js';

/* ---------- Cursor Helpers ---------- */
function decodeCursor(cursor) {
  if (!cursor) return null;
  const buff = Buffer.from(cursor, 'base64').toString('ascii');
  const [createdAt, id] = buff.split('|');
  return { createdAt: new Date(createdAt), id: Number(id) };
}

function encodeCursor(createdAt, id) {
  const str = `${createdAt.toISOString()}|${id}`;
  return Buffer.from(str).toString('base64');
}

/* ---------- Create Media ---------- */
/**
 * createMedia - data contains posterUrl optional, createdBy
 */
export async function createMedia(data) {
  const media = await prisma.media.create({
    data,
  });
  return media;
}

/* ---------- Get Media List ---------- */
/**
 * getMediaList - supports cursor pagination, optional type and search
 */
export async function getMediaList({ cursor, limit = 20, type, search }) {
  const take = Number(limit) + 1; // fetch one more to determine next cursor
  const where = {};

  if (type) where.type = type;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { director: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const decoded = decodeCursor(cursor);
  let items;

  if (!decoded) {
    items = await prisma.media.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take,
      include: { creator: { select: { id: true, email: true, name: true } } },
    });
  } else {
    // Fallback: raw SQL for composite pagination
    items = await prisma.$queryRawUnsafe(`
      SELECT * FROM Media
      WHERE (${type ? `type = '${type}'` : '1=1'})
      AND (createdAt < '${decoded.createdAt.toISOString()}' 
        OR (createdAt = '${decoded.createdAt.toISOString()}' AND id < ${decoded.id}))
      ${search ? `AND (title LIKE '%${search}%' OR director LIKE '%${search}%' OR description LIKE '%${search}%')` : ''}
      ORDER BY createdAt DESC, id DESC
      LIMIT ${take};
    `);
  }

  let nextCursor = null;
  if (items.length > limit) {
    const next = items.pop();
    nextCursor = encodeCursor(next.createdAt, next.id);
  }

  return { items, nextCursor };
}

/* ---------- Get Media by ID ---------- */
export async function getMediaById(id) {
  return prisma.media.findUnique({ where: { id: Number(id) } });
}

/* ---------- Update Media ---------- */
export async function updateMedia(id, data, userId, isAdmin = false) {
  const media = await prisma.media.findUnique({ where: { id: Number(id) } });
  if (!media) {
    const err = new Error('Media not found');
    err.statusCode = 404;
    throw err;
  }

  if (!isAdmin && media.createdBy !== userId) {
    const err = new Error('Not authorized to update this item');
    err.statusCode = 403;
    throw err;
  }

  return prisma.media.update({ where: { id: Number(id) }, data });
}

/* ---------- Delete Media ---------- */
export async function deleteMedia(id, userId, isAdmin = false) {
  const media = await prisma.media.findUnique({ where: { id: Number(id) } });
  if (!media) {
    const err = new Error('Media not found');
    err.statusCode = 404;
    throw err;
  }

  if (!isAdmin && media.createdBy !== userId) {
    const err = new Error('Not authorized to delete this item');
    err.statusCode = 403;
    throw err;
  }

  await prisma.media.delete({ where: { id: Number(id) } });
  return true;
}

export async function searchMedia(q) {
  try {
    // Convert query to lowercase for manual case-insensitive search
    const items = await prisma.media.findMany({
      where: {
        OR: [
          {
            title: { contains: q },
          },
          {
            description: { contains: q },
          },
          {
            director: { contains: q },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Optional: if your DB is case-sensitive, you can filter in JS instead:
    const filtered = items.filter(
      (item) =>
        item.title?.toLowerCase().includes(q.toLowerCase()) ||
        item.description?.toLowerCase().includes(q.toLowerCase()) ||
        item.director?.toLowerCase().includes(q.toLowerCase())
    );

    return filtered;
  } catch (err) {
    console.error("Search service error:", err);
    throw err;
  }
}


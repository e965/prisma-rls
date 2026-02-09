import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./__generated__/client";

(async () => {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  try {
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.createMany({
      data: [
        { id: 1, email: "john.doe@test.local", name: "John Doe" },
        { id: 2, email: "zara.nightshade@test.local", name: "Zara Nightshade" },
        { id: 3, email: "ben.matlock@test.local", name: "Ben Matlock" },
      ],
    });

    await prisma.category.createMany({
      data: [
        { id: 1, name: "First" },
        { id: 2, name: "Second" },
      ],
    });

    await prisma.post.createMany({
      data: [
        { id: 1, published: true, categoryId: 1, authorId: 1, title: "Quick bites", content: "Easy 5-minute snack recipes" },
        { id: 2, published: false, categoryId: 1, authorId: 1, title: "Tech today", content: "Latest gadget news & reviews" },
        { id: 3, published: true, categoryId: 2, authorId: 2, title: "Green living", content: "Eco-friendly home hacks" },
      ],
    });

    await prisma.comment.createMany({
      data: [
        { postId: 1, content: "Easy 5-minute snack recipes" },
        { postId: 2, content: "Latest gadget news & reviews" },
        { postId: 3, content: "Eco-friendly home hacks" },
      ],
    });

    // sync sequences
    await prisma.$executeRaw`SELECT setval('"User_id_seq"', COALESCE((SELECT MAX(id) FROM "User"), 0) + 1, false)`;
    await prisma.$executeRaw`SELECT setval('"Category_id_seq"', COALESCE((SELECT MAX(id) FROM "Category"), 0) + 1, false)`;
    await prisma.$executeRaw`SELECT setval('"Post_id_seq"', COALESCE((SELECT MAX(id) FROM "Post"), 0) + 1, false)`;
    await prisma.$executeRaw`SELECT setval('"Comment_id_seq"', COALESCE((SELECT MAX(id) FROM "Comment"), 0) + 1, false)`;

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
})();

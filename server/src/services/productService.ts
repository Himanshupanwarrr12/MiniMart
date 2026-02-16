import { prisma } from "../lib/prisma.js";

interface ProductFilters {
  search?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  order: "asc" | "desc";
}

export const getProductsWithPagination = async (
  filters: ProductFilters,
  pagination: PaginationOptions
) => {
  const { search, minPrice, maxPrice } = filters;
  const { page, limit, sortBy, order } = pagination;

  const skip = (page - 1) * limit;
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getProductById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      price: true,
      description: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!product) {
    return null;
  }

  const inStock = true; 
  const stockQuantity = 23; 

  return {
    ...product,
    inStock,
    stockQuantity,
    stockStatus: inStock
      ? `In Stock (${stockQuantity} available)`
      : "Out of Stock",
  };
};

export const getRelatedProducts = async (
  productId: number,
  limit: number = 4
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { price: true },
  });

  if (!product) return [];

  const productPrice = Number(product.price);

  const minPrice = productPrice * 0.8;
  const maxPrice = productPrice * 1.2;

  return await prisma.product.findMany({
    where: {
      id: { not: productId },
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    },
    take: limit,
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
    },
  });
};

export const createNewProduct = async (data: {
  name: string;
  price: number;
  description?: string;
  image: string;
}) => {
  return await prisma.product.create({
    data: {
      name: data.name.trim(),
      price: data.price,
      description: data.description?.trim() || null,
      image: data.image,
    },
    select: {
      id: true,
      name: true,
      price: true,
      description: true,
      image: true,
      createdAt: true,
    },
  });
};
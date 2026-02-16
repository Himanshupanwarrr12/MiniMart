import type { Request, Response } from "express";
import * as productService from "../services/productService.js";

//products - See all products (FOR USERS)
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "20",
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filters = {
      search: search as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    };

    const pagination = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy: sortBy as string,
      order: order as "asc" | "desc",
    };

    const result = await productService.getProductsWithPagination(filters, pagination);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// GET /products/:id - Get single product with full details
export const getProductDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.id as string);

    // Validate ID
    if (isNaN(productId)) {
      res.status(400).json({
        success: false,
        error: "Invalid product ID",
      });
      return;
    }

    // Get product details
    const product = await productService.getProductById(productId);

    // Handle product not found
    if (!product) {
      res.status(404).json({
        success: false,
        error: "Product not found",
      });
      return;
    }

    // Get related products
    const relatedProducts = await productService.getRelatedProducts(productId, 4);

    res.status(200).json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};


// POST /admin/products - Add product (FOR ADMIN)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, description, image } = req.body;

    // Validation
    if (!name || !price || !image) {
      res.status(400).json({
        success: false,
        error: "Name, price, and image are required",
      });
      return;
    }

    if (price <= 0) {
      res.status(400).json({
        success: false,
        error: "Price must be greater than 0",
      });
      return;
    }

    const product = await productService.createNewProduct({
      name,
      price,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
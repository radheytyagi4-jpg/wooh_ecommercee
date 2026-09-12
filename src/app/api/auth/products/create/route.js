import { NextResponse } from "next/server";
import { Readable } from "stream";

import cloudinary from "@/app/lib/cloudinary";
import { connectDb } from "@/app/config/db";
import { getCurrentUser } from "@/app/lib/auth";
import Product from "@/app/model/product";

export const runtime = "nodejs";

async function uploadToCloudinary(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "wooh/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function POST(request) {
  try {

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login before listing a product",
        },
        { status: 401 }
      );
    }

    await connectDb();


    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const price = formData.get("price");
    const category = formData.get("category");
    const stock = formData.get("stock");

    const imageFiles = formData
      .getAll("images")
      .filter(
        (file) =>
          file &&
          typeof file === "object" &&
          file.size > 0
      );

    if (!title || !description || !price || !category || !stock) {
      return NextResponse.json(
        {
          success: false,
          message: "All product fields are required",
        },
        { status: 400 }
      );
    }

    if (Number(price) < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Price cannot be negative",
        },
        { status: 400 }
      );
    }

    if (Number(stock) < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Stock cannot be negative",
        },
        { status: 400 }
      );
    }

    if (imageFiles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please upload at least one product image",
        },
        { status: 400 }
      );
    }

    if (imageFiles.length > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "You can upload maximum 5 images",
        },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (const file of imageFiles) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Only image files are allowed",
          },
          { status: 400 }
        );
      }

      const uploaded = await uploadToCloudinary(file);

      uploadedImages.push(uploaded.secure_url);
    }

    const product = await Product.create({
      title: title.trim(),

      detail: description.trim(),

      price: Number(price),

      category: category.trim(),

      stock: Number(stock),

      images: uploadedImages,

      uploadBy: user._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product listed successfully",

        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to list product",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
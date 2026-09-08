import { NextResponse } from "next/server";

import {connectDb} from "@/app/config/db";
import { getCurrentUser } from "@/app/lib/auth";

import Cart from "@/app/model/cart";
import Product from "@/app/model/product";


export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        {
          status: 401,
        }
      );
    }

    await connectDb();

    let cart = await Cart.findOne({
      user: user._id,
    }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        items: [],
      });
    }

    const subtotal = cart.items.reduce((total, item) => {
      if (!item.product) return total;

      return (
        total +
        item.product.price * item.quantity
      );
    }, 0);

    return NextResponse.json({
      success: true,

      cart: {
        _id: cart._id,
        items: cart.items,
        subtotal,
      },
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load cart",
      },
      {
        status: 500,
      }
    );
  }
}


export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        {
          success: false,
          message: "Not enough stock available",
        },
        {
          status: 400,
        }
      );
    }

    let cart = await Cart.findOne({
      user: user._id,
    });

    if (!cart) {
      cart = new Cart({
        user: user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + Number(quantity);

      if (newQuantity > product.stock) {
        return NextResponse.json(
          {
            success: false,
            message: `Only ${product.stock} items available`,
          },
          {
            status: 400,
          }
        );
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
      });
    }

    await cart.save();

    await cart.populate("items.product");

    return NextResponse.json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("ADD CART ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to add product",
      },
      {
        status: 500,
      }
    );
  }
}



export async function PUT(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const {
      productId,
      quantity,
    } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID and quantity are required",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    if (quantity > product.stock) {
      return NextResponse.json(
        {
          success: false,
          message: `Only ${product.stock} items available`,
        },
        {
          status: 400,
        }
      );
    }

    const cart = await Cart.findOne({
      user: user._id,
    });

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart not found",
        },
        {
          status: 404,
        }
      );
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId
    );

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          message: "Product is not in cart",
        },
        {
          status: 404,
        }
      );
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) =>
          item.product.toString() !== productId
      );
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();

    await cart.populate("items.product");

    return NextResponse.json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update cart",
      },
      {
        status: 500,
      }
    );
  }
}



export async function DELETE(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const cart = await Cart.findOne({
      user: user._id,
    });

    if (!cart) {
      return NextResponse.json({
        success: true,
        message: "Cart is already empty",
      });
    }

    let productId = null;

    try {
      const body = await request.json();
      productId = body?.productId;
    } catch {
      
    }

    if (productId) {
      cart.items = cart.items.filter(
        (item) =>
          item.product.toString() !== productId
      );

      await cart.save();

      return NextResponse.json({
        success: true,
        message: "Product removed from cart",
        cart,
      });
    }

    cart.items = [];

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    console.error("DELETE CART ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update cart",
      },
      {
        status: 500,
      }
    );
  }
}
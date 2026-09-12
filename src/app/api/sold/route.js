import { NextResponse } from "next/server";

import { connectDb } from "@/app/config/db";
import { getCurrentUser } from "@/app/lib/auth";

import { Order } from "@/app/model/order";
import Product from "@/app/model/product"

import User from "@/app/model/user";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    await connectDb();

    const orders = await Order.find({
      uploadedBy: user._id,
    })
      .populate({
        path: "product",
        model: Product,
        select: "title detail price image images",
      })
      .populate({
        path: "orderedby",
        model: User,
        select: "username email",
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET SOLD ORDERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch sold products",
      },
      { status: 500 }
    );
  }
}


export async function PATCH(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    await connectDb();

    const body = await request.json();

    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID and status are required",
        },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "Pending",
      "Delivered",
      "Cancel",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status",
        },
        { status: 400 }
      );
    }


    const order = await Order.findOne({
      _id: orderId,
      uploadedBy: user._id,
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found or unauthorized",
        },
        { status: 404 }
      );
    }

    order.status = status;

    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated",
        order: {
          _id: order._id,
          status: order.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE SOLD ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order status",
      },
      { status: 500 }
    );
  }
}
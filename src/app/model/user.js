import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },

    otp: {
      type: Number,
    },

    otpVerify: {
      type: Boolean,
      default: false,
    },

    otpExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(
    this.password,
    10
  );
});

userSchema.methods.comparePassword = async function (
  password
) {
  return bcrypt.compare(
    password,
    this.password
  );
};

export default mongoose.models.User ||
  mongoose.model("User", userSchema);
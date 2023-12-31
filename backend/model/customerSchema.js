import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    name: {
      type: String,
    },
    time: {
      type: Date,
      default: new Date(),
    },
  },
  {
    _id: false, // Disable automatic creation of _id for each comment
  }
);
const customerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      // required: true,
    },
    companyPhone: {
      type: String,
      // required: true,
    },
    companyFax: String,
    companyAddress: {
      type: String,
      // required: true,
    },
    country: {
      type: String,
      // required: true,
    },
    state: {
      type: String,
      // required: true,
    },
    city: {
      type: String,
      // required: true,
    },
    zipCode: {
      type: String,
      // required: true,
    },
    personName: {
      type: String,
      // required: true,
    },
    personPhone: {
      type: String,
      // required: true,
    },
    personEmail: {
      type: String,
      // required: true,
    },
    comments: [commentSchema],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
      // required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;

// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");
const Item = require("./models/Item");
const User = require("./models/User"); // your user schema
const Order = require("./models/Order.js");
const isathenticate = require("./isvaliduser/Authentication.js");
const isadmin = require("./isvaliduser/isadmin.js");
const app = express();
const cookieParser = require("cookie-parser");
const { log } = require("console");

app.use(cookieParser());

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// GET registration form
app.get("/register", (req, res) => {
  res.render("signup.ejs");
});

// POST registration handler
app.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      phone,
      street,
      city,
      state,
      zip,
      country,
      image,
    } = req.body;

    if (![name, email, password, age, gender, phone, street, city, state, zip, country, image].every(Boolean)) {
      console.log("something is missing");
      return res.render("signup.ejs", { error: "Fill full information." });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup.ejs", { error: "Email already registered." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const address = {
      street,
      city,
      state,
      zipCode: zip,
      country,
    };

    const newUser = new User({
      address,
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      phone,
      profileImage: image,
    });

    try {
      await newUser.save();
    } catch (saveErr) {
      console.error('Error saving user:', saveErr);
      return res.render("signup.ejs", { error: "Error saving user: " + saveErr.message });
    }

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIREIN }
    );

    res.cookie("token", token, { httpOnly: true });
    req.user = newUser;
    res.redirect("/");
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send("An error occurred. Please try again.");
  }
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", { error: "Invalid email or password." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { error: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET, // Use your secret
      { expiresIn: process.env.EXPIREIN }
    );

    // Set token in cookie (or you could set in session)
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/"); // or wherever you want
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token"); // clears the 'token' cookie
  res.redirect("/login"); // redirect to login page or any other page
});
app.get("/", isathenticate, async (req, res) => {
  let products = await Item.find();
  let user = req.user;
  // console.log(req.user);

  // user: req.user ,
  res.render("mainpage.ejs", { user, products });
});

app.get("/item/view/:id", async (req, res) => {
  let item = await Item.findById(req.params.id);
  console.log(item + " " + req.params.id);

  // res.send("hy")
  res.render("view.ejs", { item });
});
app.get("/item/addtocart/:id", isathenticate, async (req, res) => {
  console.log("add to card");

  try {
    const itemId = req.params.id;
    const userId = req.user; // Assuming user is authenticated and req.user is set

    // Optionally, check if the item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add item to cartitems array if not already present (optional)
    if (!user.cartitems.includes(itemId)) {
      user.cartitems.push(itemId);
    }

    await user.save();

    res
      .status(200)
      .json({ message: "Item added to cart", cart: user.cartitems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/item/search/", isathenticate, async (req, res) => {
  const key = req.body.key;
  console.log(req.body);

  try {
    const results = await Item.find({
      $or: [
        { category: { $regex: key, $options: "i" } },
        { name: { $regex: key, $options: "i" } },
      ],
    });
    res.render("serchresult.ejs", { products: results, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching items");
  }
});

app.get("/user/cart", isathenticate, async (req, res) => {
  let cartid = req.user.cartitems;
  const carts = await Item.find({ _id: { $in: cartid } });
  console.log("hy");

  res.render("cart.ejs", { cartItems: carts });
});

app.get("/user/profile", isathenticate, async (req, res) => {
  const orders = await Order.find({ _id: { $in: req.user.orders } });
  res.render("userprofile.ejs", { user: req.user, orders: orders });
});

app.get("/item/removeitem/:id", isathenticate, async (req, res) => {
  let userid = req.user._id;
  let id = req.params.id;
  console.log(id + " " + userid);
  await User.updateOne({ _id: userid }, { $pull: { cartitems: id } });
  res.redirect("/user/cart");
});

app.post("/item/placeorder", isathenticate, async (req, res) => {
  console.log(req.body.itemids);
  let item = await Item.find({ _id: { $in: req.body.itemids } });
  console.log(item);

  res.render("orderform.ejs", { orderItems: item, user: req.user });
});
app.post("/item/placeorderfinal", isathenticate, async (req, res) => {
  try {
    console.log(req.body);
    const {
      productid,
      quantity,
      name,
      address,
      paymentMethod,
      city,
      state,
      postalCode,
      country,
      phone,
    } = req.body;

    // Validate input
    if (
      !productid ||
      !quantity ||
      !name ||
      !address ||
      !paymentMethod ||
      !city ||
      !state ||
      !postalCode ||
      !country ||
      !phone
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (paymentMethod == "Credit Card") {
      console.log(paymentMethod);
      return res.status(201).json({
        message: "no payment information available to proceed",
        orderId: "non",
      });
    }

    const item = await Item.findById(productid);
    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    const totalAmount = item.price * quantity;

    // Check stock
    if (item.stockQuantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Determine payment status
    let paymentStatus = "Pending";

    // Check wallet balance for non-admin users
    const user = await User.findById(req.user._id);

    if (paymentMethod == "Wallet") {
      if (user.role !== "admin" && user.wallet < totalAmount) {
        return res.send("<h1>Your wallet does not have enough money</h1>");
      }
      if (user.role !== "admin") {
        paymentStatus = "Done"; // Wallet payment proceeds
      }
    }

    // Create order data
    const orderData = {
      user: req.user._id,
      items: [
        {
          item: item._id,
          quantity,
          priceAtPurchase: item.price,
        },
      ],
      totalAmount,
      status: "Pending",
      shippingAddress: {
        name,
        addressLine1: address,
        city,
        state,
        postalCode,
        country,
        phone,
      },
      paymentMethod,
      paymentStatus,
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Deduct stock
    item.stockQuantity -= quantity;
    await item.save();

    // Handle wallet deduction and admin wallet addition
    if (paymentMethod === "Wallet") {
      if (user.role !== "admin") {
        // Deduct from user wallet
        await User.findByIdAndUpdate(req.user._id, {
          $inc: { wallet: -totalAmount },
          $push: { orders: newOrder._id },
        });

        // Find first admin to add money
        const adminUser = await User.findOne({ role: "admin" }).sort({
          _id: 1,
        });
        if (adminUser) {
          await User.findByIdAndUpdate(adminUser._id, {
            $inc: { wallet: totalAmount },
          });
        }
      } else {
        // For admin, just push order (no wallet change)
        await User.findByIdAndUpdate(req.user._id, {
          $push: { orders: newOrder._id },
        });
      }
    } else if (paymentMethod === "Cash on Delivery") {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { orders: newOrder._id },
      });
    }

    res.send(
      `<a href="/"><img src="https://img.icons8.com/?size=50&id=80689&format=png&color=000000" alt="" srcset="">Order placed</a> message: 'Order placed successfully', orderId: ${newOrder._id}`
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/item/cancel/:id", isathenticate, async (req, res) => {
  try {
    const userId = req.user._id; // authenticated user ID
    const orderId = req.params.id; // order ID to cancel

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the order belongs to this user
    if (!user.orders.includes(orderId)) {
      return res
        .status(403)
        .json({ message: "Order does not belong to this user." });
    }

    const totalAmount = order.totalAmount;

    // Handle refund / wallet adjustment if order not yet delivered
    if (order.status !== "Delivered") {
      if (order.paymentMethod === "Wallet") {
        if (user.role !== "admin") {
          // Refund to user wallet
          await User.updateOne(
            { _id: userId },
            { $inc: { wallet: totalAmount } }
          );
          // Deduct from first admin's wallet
          const adminUser = await User.findOne({ role: "admin" }).sort({
            _id: 1,
          });
          if (adminUser) {
            await User.updateOne(
              { _id: adminUser._id },
              { $inc: { wallet: -totalAmount } }
            );
          }
        }
        // For admin cancel, no wallet adjustments needed
      }
    }

    // Remove the order ID from user's orders array
    await User.updateOne({ _id: userId }, { $pull: { orders: orderId } });

    // Delete the order
    await Order.deleteOne({ _id: orderId });
    res.send(
      `<a href="/"><img src="https://img.icons8.com/?size=50&id=80689&format=png&color=000000" alt="" srcset="">Order canceled and amount refunded</a>`
    );
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/admin/orders", isathenticate, isadmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user items.item");
    console.log(orders);

    res.render("admin.ejs", { orders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Route to update order status
app.post(
  "/admin/orders/:id/status",
  isathenticate,
  isadmin,
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      await Order.findByIdAndUpdate(id, { status });
      res.redirect("/admin/orders");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

app.get("/admin/additem", isathenticate, isadmin, (req, res) => {
  res.render("adminadditem.ejs");
});

app.post("/admin/add-item", isathenticate, isadmin, async (req, res) => {
  try {
    const { name, description, price, category, images, stockQuantity } =
      req.body;

    let imagesArray = [];
    if (images) {
      // Convert comma-separated string to array of objects { url: string }
      const urls = images.split(",").map((url) => url.trim());
      imagesArray = urls.map((url) => ({ url }));
    }

    const newItem = new Item({
      name,
      description,
      price: parseFloat(price),
      category,
      images: imagesArray,
      stockQuantity: parseInt(stockQuantity),
    });

    await newItem.save();

    res.status(201).send("Item created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating item");
  }
});

app.get("/admin/delete-item/:id", async (req, res) => {
  const itemId = req.params.id;

  try {
    // Check if the item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).send("Item not found");
    }

    // Check if item exists in any order
    const orderWithItem = await Order.findOne({
      "items.item": itemId,
    });

    if (orderWithItem) {
      // Item is part of an existing order, don't delete
      return res
        .status(400)
        .send("Cannot delete item: it is part of existing orders.");
    }

    // Remove item from any user carts if applicable
    // Assuming you have a User schema with a cart array
    await User.updateMany({ cart: itemId }, { $pull: { cart: itemId } });

    // Delete the item
    await Item.findByIdAndDelete(itemId);
    res.send(
      '<a href="/"><img src="https://img.icons8.com/?size=50&id=80689&format=png&color=000000" alt="" srcset=""></a> Item deleted successfully.'
    );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send(
        ' <a href="/"><img src="https://img.icons8.com/?size=50&id=80689&format=png&color=000000" alt="" srcset=""></a> Error deleting item'
      );
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`server running on port ${process.env.PORT}`)
    )
  )
  .catch((err) => console.log(err.message));

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
// const apiRoutes = require("./routes/apiRoutes");

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 4000;

// Middleware setup
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies and other credentials
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Define the user schema and model
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String }, // To store the user's profile picture
});

const User = mongoose.model("User", userSchema);

// Google OAuth 2.0 strategy setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        const user = await User.findOneAndUpdate(
          { googleId: profile.id },
          {
            displayName: profile.displayName,
            email: profile.emails[0]?.value,
            imageUrl: profile.photos[0]?.value, // Save user's profile picture
          },
          {
            upsert: true, // Create new user if not found
            new: true, // Return the updated/new user
          }
        );
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialization and deserialization of the user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Use the routes
app.use("/auth", authRoutes);
// app.use("/api", apiRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

import express from "express";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = express.Router();

// registration auth
router.post("/registration", async (req, res) => {
  // get data from request
  const { username, password, phone, email, dob, isAdmin } = req.body;
  // check if user exists
  const userExists = await prisma.User.count({
    where: {
      OR: [{ phoneNumber: phone }, { email: email }],
    },
  });
  // if user not exists, create user
  if (userExists === 0) {
    const user = await prisma.User.create({
      data: {
        password: password,
        email: email,
        username: username,
        phoneNumber: phone,
        dateOfBirth: dob.substring(0, 10),
        is_admin: isAdmin,
      },
    });
    res.json({ result: "Registration success" });
  } else {
    res.json({ result: "This email or phone number is already registered" });
  }
});

// login auth
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.User.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) return res.json({ result: "user not found" });

  if (user.password !== password) return res.json({ result: "wrong password" });

  const accessToken = sign(
    { username: user.username, id: user.user_id },
    "secret"
  );
  res.json({
    result: "successful login",
    accessToken: accessToken,
    userId: user.user_id,
    is_Admin: user.is_admin,
  });
});

export { router as userRouter };

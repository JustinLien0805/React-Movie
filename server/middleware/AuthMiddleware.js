import pkg from "jsonwebtoken";
const { verify } = pkg;
const validateToken = (req, res, next) => {
  // get token
  const accessToken = req.header("accessToken");
  if (!accessToken) return res.json({ result: "user not logged in" });
  try {
    const validToken = verify(accessToken, "secret");
    // we can get uid by req.user.id
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ result: err });
  }
};

export { validateToken };

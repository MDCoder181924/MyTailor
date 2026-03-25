const isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Only user allowed" });
  }
  next();
};

export default isUser;
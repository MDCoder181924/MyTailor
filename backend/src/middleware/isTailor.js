const isTailor = (req, res, next) => {
  if (req.user.role !== "tailor") {
    return res.status(403).json({ message: "Only tailor allowed" });
  }
  next();
};

export default isTailor;
module.exports = {
    secret: process.env.JWT_SECRET || "segredo_super_forte",
    expiresIn: "7d",
};
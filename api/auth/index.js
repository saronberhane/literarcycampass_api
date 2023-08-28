const AppError = require("../../utils/appError");

const authByRole = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next (
                new AppError("You are not authorized to access this recource", 403)
            );
        }
        next();
    };
};

module.exports = authByRole;
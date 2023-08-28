const jwt = require("jsonwebtoken");
const configs = require("../../configs")

const user = require("../User/model");
const UserModel = require("../User/model");
const Admin = require("../Admins/model");

//protection route
module.exports = async (req, res, next) => {
    try {
        let token = "";
        let user;

        //get the token
        if (
            req.headers.authorization && 
            req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        //checking the token
        if (!token) return res.status(401).json({status:"FAIL",message:"Please login"});

        //verifiying the token
        const data = jwt.verify(token, configs.jwt);

        if(data.role === "Client"){
            user = await UserModel.findOne({ _id: data.id });
            if(!user){
                return res.status(401).json({status:"FAIL",message:"Please login"});
            }
        }
        //check user
        if(data.role === "Admin" || data.role === "Super-admin"){

            const admin  = await Admin.findById(data.id)

            user = admin
            if(!user){
                return res.status(401).json({status:"FAIL",message:"Please login"});
            }
        }

        //attach user on request object
        req.user = user;

        next();
    } catch (error) {
        next(error)
    }
};
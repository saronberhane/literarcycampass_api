const AppError = require("../../utils/appError");
const Admin = require("./model");

const bcrypt = require("bcrypt");
const { createJWT } = require("../../utils/createToken");
const configs = require("../../configs");
const User = require("../User/model");
const Report = require("../reports/model");

//creating a super admin
exports.createSuperAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return next(new AppError("Missing required fields", 400));
    }

    const data = req.body;

    const existingAdmin = await Admin.findOne({is_first_time: true});

    if(existingAdmin){
        return next(new AppError("There is already an existing admin.", 400));
    }
    
    const encryptedPassword = await bcrypt.hash(password, 10);

    data.password = encryptedPassword;
    data.is_first_time = true;
    data.role = "Super-admin";

    //creating a new book entry
    const admin = await Admin.create(data);

    //return the new book entry
    res.status(200).json({
      status: "SUCCESS",
      message: "Admin account is created successfully",
      data: {
        admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

//creating an admin
exports.createAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return next(new AppError("Missing required fields", 400));
    }

    const data = req.body;

    if(!req.user.is_first_time){
        return next(new AppError("Only first time admins can create other admins.", 404));
    }

    const checkAdmin = await Admin.findOne({email})

    if(checkAdmin){
        return next(new AppError("There is already existing admin with this email.", 404));
    }
    
    const encryptedPassword = await bcrypt.hash(password, 10);

    data.password = encryptedPassword;
    
    //creating a new book entry
    const admin = await Admin.create(data);

    //return the new book entry
    res.status(200).json({
      status: "SUCCESS",
      message: "Admin account is created successfully",
      data: {
        admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

//to login
module.exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return next(new AppError("Invalid password of email", 400));
      }
  
      //search
      const admin = await Admin.findOne({ email: email });
  
      //does it exists
      if (!admin) {
        return next(new AppError("Invalid password of email", 400));
      }

      if(!admin.is_active){
        return next(new AppError("You have been blocked from accessing the system", 400));
      }
  
      //compare
      const checkAdmin = await bcrypt.compare(password, admin.password);
  
      //validate
      if (!checkAdmin) {
        return next(new AppError("Invalid password or email", 400));
      }
  
      const token = createJWT(admin.id, admin.role);
  
      res.status(201).json({
        status: "SUCCESS",
        message:"successfuly logged in",
        data: { admin: admin },
        token
      });
    } catch (error) {
      next(error);
    }
  };
  

exports.changeAdminStatus = async (req, res, next) => {
  try {

    const {id} = req.params;

    const {is_active} = req.body;

    if(is_active == undefined){
        return next(new AppError("Enter the activation status", 400));
    }

    if(!req.user.is_first_time){
        return next(new AppError("Only first time admins can ban other admins.", 404));
    }

    const admin = await Admin.findByIdAndUpdate(id, {is_active}, {new: true});
    if(!admin){
      return next(new AppError("Admin does not exist", 400));
    }
    res.status(200).json({
      status: "SUCCESS",
      message: `Admin account ${is_active ? "activated" :"deactivated" } successfuly!!`,
      data: {admin}
    });
  } catch (error) {
    next(error);
  }
};

exports.changeAdminRole = async (req, res, next) => {
  try {

    const {role, id} = req.body;

    if(req.user.id === id){
      return next(new AppError("You can not change your own role!!!", 400));
    }

    if(!role){
        return next(new AppError("Enter the role status", 400));
    }

    if(!req.user.is_first_time){
        return next(new AppError("Only first time admins can change other admins role.", 404));
    }

    await Admin.findByIdAndUpdate(id, {role});

    res.status(200).json({
      status: "SUCCESS",
      message: `Admin role successfuly changed!!`,
    });

  } catch (error) {
    next(error);
  }
};

exports.changeUserStatus = async (req, res, next) => {
  try {

    const {id} = req.params;

    const {is_active} = req.body;

    if(is_active == undefined){
        return next(new AppError("Enter the activation status", 400));
    }

    const user = await User.findByIdAndUpdate(id, {is_active}, {new: true});

    await Report.findOneAndDelete({reported_user: id});

    if(!user){
      return next(new AppError("user does not exist", 400));
    }
    res.status(200).json({
      status: "SUCCESS",
      message: `User account ${is_active ? "activated" :"deactivated" } successfuly!!`,
    });
  } catch (error) {
    next(error);
  }
};
  

exports.deleteAdmin = async (req, res, next) => {
  try {    
    if(req.body.deleteKey !== configs.deleteKey){
        return next(new AppError("Please provide the correct delete key.", 400));
    }

    if(!req.user.is_first_time){
      return next(new AppError("Only first time admins can delete all admins.", 404));
    }
    
    await Admin.deleteMany({is_first_time: false});

    res.status(200).json({
      status: "SUCCESS",
      message:"admins deleted successfuly!"
    });

  } catch (error) {
    next(error);
  }
};

exports.getAllAdmins = async (req, res, next) => {
  try {    

    const admins = await Admin.find();

    res.status(200).json({
      status: "SUCCESS",
      data:{admins}
    });

  } catch (error) {
    next(error);
  }
};

exports.viewAdmin = async (req, res, next) => {
  try {    
    const {id} = req.params;

    const admins = await Admin.findById(id);

    res.status(200).json({
      status: "SUCCESS",
      data:{admins}
    });

  } catch (error) {
    next(error);
  }
};

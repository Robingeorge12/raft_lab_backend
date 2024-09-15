import { UserSchema } from "../model/user.model.js";

  export const isAdmin = async (req, res, next) => {
    try {
      
   
      const { authorize_email } = req;
       if (!authorize_email) {
         return res
           .status(401)
           .send({ message: "Unauthorized, email is not provided" });
       }
  
      console.log("email_auhorize", authorize_email);
      
    const admin_email = await UserSchema.findOne({ email: authorize_email });

    if (admin_email.email!=="admin@gmail.com") {
      return res.send({ message: "You can't Access" });
    }

      req.email = admin_email.email;
      return next();




      // try {
      //   const Admin = await UserSchema.findOne({ email: authorize_email });

      //   if (!Admin || user.role !== "admin") {
      //     // Assuming the role field in UserSchema is used to identify admin users
      //     return res.status(403).send({
      //       message: "You don't have permission to access this resource",
      //     });
      //   }

      //   next();
      // } catch (err) {
      //   return res.status(500).send({ message: "Internal server error" });
      // }


   
   
  } catch (er) {
    console.log(er);
    res.status(500).send({ message: er });
  }
};

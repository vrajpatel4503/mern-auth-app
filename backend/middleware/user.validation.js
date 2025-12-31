// -------------- User field validation -----------------

export const userFieldValidationMiddleware = (req, res, next) => {
  const { fullName, email, password, phoneNumber } = req.body;

  if (!fullName) {
    return res.status(400).json({
      success: false,
      message: "Fullname is required",
    });
  }

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "Phone Number is required",
    });
  }

  //   Validate Email (must contain '@' and have a proper format)
  const emailRegrex = /^\S+@\S+\.\S+$/;
  if (!emailRegrex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format. It must contain '@' and a domain",
    });
  }

    // Validate phone number (must be exactly 10 digit)
    const phoneNumberRegrex = /^\d{10}$/;
    if(!phoneNumberRegrex.test(phoneNumber)) {
        return res.status(400).json({
            success: false,
            message : ""
        })
    }

  next();
};

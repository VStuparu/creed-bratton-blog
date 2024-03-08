const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const sessionFlash = require("../util/session-flash");
const validation = require("../util/validation");

function getSignup(request, response) {
  let sessionData = sessionFlash.getSessionData(request);

  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      fullname: "",
    };
  }
  response.render("user/auth/signup", { inputData: sessionData });
}

async function signup(request, response, next) {
  const user = new User(
    request.body.email,
    request.body.password,
    request.body.fullname
  );

  const enteredData = {
    email: request.body.email,
    confirmEmail: request.body["confirm-email"],
    password: request.body.password,
    fullname: request.body.fullname,
  };

  if (
    !validation.userDetailsAreValid(
      request.body.email,
      request.body.password,
      request.body.fullname
    ) ||
    !validation.emailIsConfirmed(
      request.body.email,
      request.body["confirm-email"]
    )
  ) {
    sessionFlash.flashDataToSession(
      request,
      {
        errorMessage:
          "Please check your input. Password must be at least 6 characters long",
        ...enteredData,
      },
      function () {
        response.redirect("/signup");
      }
    );

    return;
  }

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        request,
        {
          errorMessage: "User already exists! Try logging in instead!",
          ...enteredData,
        },
        function () {
          response.redirect("/signup");
        }
      );

      return;
    }
  } catch (error) {
    next(error);
  }

  try {
    await user.signup();
  } catch (error) {
    next(error);
  }

  response.redirect("/login");
}

function getLogin(request, response) {
  let sessionData = sessionFlash.getSessionData(request);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }

  response.render("user/auth/login", { inputData: sessionData });
}

async function login(request, response, next) {
  const user = new User(request.body.email, request.body.password);

  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage:
      "Invalid credentials - please double-check your email and password",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(request, sessionErrorData, function () {
      response.redirect("/login");
    });

    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(request, sessionErrorData, function () {
      response.redirect("/login");
    });

    return;
  }

  authUtil.createUserSession(request, existingUser, function () {
    response.redirect("/");
  });
}

function logout(request, response) {
  authUtil.destroyUserAuthSession(request);
  response.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  signup: signup,
  getLogin: getLogin,
  login: login,
  logout: logout,
};

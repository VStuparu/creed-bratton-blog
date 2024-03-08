function protectRoutes(request, response, next) {
  if (request.path.startsWith("/admin") && !response.locals.isAdmin) {
    return response.redirect("/403");
  }

  next();
}

module.exports = protectRoutes;

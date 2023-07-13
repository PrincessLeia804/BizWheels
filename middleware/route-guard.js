/* is logged in */
const isLoggedIn = (req, res, next) => {
    if(!req.session.user) {
        return res.redirect("/auth/login")
    }
    next()
}

/* is admin */
const isAdmin = (req, res, next) => {
    if(req.session.user.role !== "admin"){
        return res.render("authentication/unauthorized")
    }
    next()
}

module.exports = {
    isLoggedIn,
    isAdmin,
}
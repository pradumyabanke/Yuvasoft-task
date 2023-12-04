const express = require("express");
const Router = express.Router();
const bodyParser = require("body-parser");
const Controller = require("../Controllers/user");
const Middleware = require("../Middleware/auth")


Router.post("/createUser", Controller.createUser);
Router.post("/UserLogin", Middleware.jwtValidation, Controller.userLogin);
Router.post("/:userId/post-details", Middleware.jwtValidation, Middleware.authorization, Controller.PostOperation);
Router.get('/:userId/get-details', Middleware.jwtValidation, Middleware.authorization, Controller.GetOperation);
Router.put('/:userId/update-details', Middleware.jwtValidation, Middleware.authorization, Controller.UpdateOperation);
Router.delete('/:userId/delete-details', Middleware.jwtValidation, Middleware.authorization, Controller.DeleteOperation);




Router.use(bodyParser.json());
Router.use(bodyParser.urlencoded({ extended: true }));


//===================== [ checking your end point valid or not ] =======================//

Router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct or Not!!!"
    })
});


module.exports = Router;

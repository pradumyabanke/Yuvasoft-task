const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRegister = require("../Models/UserRegister");
const CrudOperation = require("../Models/OperationModel");


//===================== [ Create User ] =====================/

const createUser = async function (req, res) {
    try {
        let data = req.body;
        let { username, email, password } = data;

        if (await UserRegister.findOne({ username: username }))
            return res
                .status(400)
                .send({ status: false, message: "username already exist" });

        if (await UserRegister.findOne({ email: email }))
            return res
                .status(400)
                .send({ status: false, message: "Email already exist" });

        const encryptedPassword = bcrypt.hashSync(password, 12);
        req.body["password"] = encryptedPassword;

        var token = jwt.sign(
            {
                userId: UserRegister._id,
            },
            "project"
        );
        data.token = token;

        let savedData = await UserRegister.create(data);
        res.status(201).send({
            status: true,
            msg: "User Register successfull",
            data: {
                _id: savedData._id,
                username: savedData.username,
                email: savedData.email,
                password: savedData.password,
                token: savedData.token,
            },
        });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};


//===================== [ User Login ] =====================/

const userLogin = async function (req, res) {
    try {
        const userId = req.params.userId;
        let data = req.body;
        let { email, password } = data;

        let userExists = await UserRegister.findOne({ email: email, _id: userId });

        if (!userExists) {
            return res.status(400).send({
                status: false,
                msg: "Email and Password are Invalid",
            });
        }

        let compared = await bcrypt.compare(password, userExists.password);
        if (!compared) {
            return res.status(400).send({
                status: false,
                message: "Your password is invalid",
            });
        }

        var token = jwt.sign(
            {
                userId: userExists._id,
            },
            "project"
        );

        let updateToken = await UserRegister.findByIdAndUpdate(
            { _id: userExists._id },
            { token },
            { new: true }
        );

        userExists.token = updateToken.token;

        return res.status(200).send({
            status: true,
            msg: "User Login successfully",
            data: userExists,
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            msg: error.message,
        });
    }
};


//===================== [ Post Crud Operation ]====================/

const PostOperation = async function (req, res) {
    try {
        const userId = req.params.userId;
        const { title, description, user_id } = req.body;

        const newOperation = new CrudOperation({
            title,
            description,
            user_id: userId,
        });

        const savedOperation = await newOperation.save();

        res.status(201).json({
            status: true,
            message: 'Post created successfully',
            data: savedOperation,
        });
    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
};


//===================== [ Get Crud Operation ]====================/

const GetOperation = async function (req, res) {
    try {
        const userId = req.params.userId;
        const postId = req.query.postId;

        const operation = await CrudOperation.findOne({
            _id: postId,
            user_id: userId,
        });

        if (!operation) {
            return res.status(404).json({
                status: false,
                message: 'Post not found',
            });
        }

        res.status(200).json({
            status: true,
            message: 'Post retrieved successfully',
            data: operation,
        });
    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
};


//===================== [ Update Crud Operation ]================/

const UpdateOperation = async function (req, res) {
    try {
        const userId = req.params.userId;
        const postId = req.query.postId;

        let operation = await CrudOperation.findOne({
            _id: postId,
            user_id: userId,
        });

        if (!operation) {
            return res.status(404).json({
                status: false,
                message: 'Post not found',
            });
        }

        operation = await CrudOperation.findOneAndUpdate(
            { _id: postId, user_id: userId },
            { $set: req.body },
            { new: true }
        );

        res.status(200).json({
            status: true,
            message: 'Post updated successfully',
            data: operation,
        });
    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
};


//===================== [ Delete Crud Operation ]================/

const DeleteOperation = async function (req, res) {
    try {
        const userId = req.params.userId;
        const postId = req.query.postId;

        const operation = await CrudOperation.findOne({
            _id: postId,
            user_id: userId,
        });

        if (!operation) {
            return res.status(404).json({
                status: false,
                message: 'Post not found',
            });
        }

        await CrudOperation.deleteOne({
            _id: postId,
            user_id: userId,
        });

        res.status(200).json({
            status: true,
            message: 'Post deleted successfully',
            data: operation
        });
    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
};





module.exports = {
    createUser,
    userLogin,
    PostOperation,
    GetOperation,
    UpdateOperation,
    DeleteOperation,
};


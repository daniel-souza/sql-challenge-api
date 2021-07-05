import UserModel from '../models/UserModel.js';

class ProfileController {
    async show(req, res) {
        UserModel.findById(req.userId)
            .then(user => res.json({error: false, user}))
            .catch(err => res.status(404).json({error: true, message: "User not found!"}))
    }
}

export default new ProfileController();
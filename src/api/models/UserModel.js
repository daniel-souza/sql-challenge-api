import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    sex: {
        type: String,
        required: true,
        enum: ["M", "F"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 8
    },
    expireAt: {
        type: Date,
        default: Date.now(),
        expires: '1h',
        select: false
    }
}, {
    timestamps: true, discriminatorKey: "role"
});

UserSchema.pre("save", function (next) {
    const user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        return next();
    });
});

const UserModel = mongoose.model('User', UserSchema);

await UserModel.init();

export const AdminModel = UserModel.discriminator('Admin', new mongoose.Schema({}))

export default UserModel;
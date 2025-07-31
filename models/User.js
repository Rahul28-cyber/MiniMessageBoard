const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
    {
        username: {
            type:String,
            required:true,
            unique:true
        },
        email: {
            type:String,
            required:true,
            unique:true
        },
        password: {
            type:String,
            required:true
        },
        verified: {
            type: Boolean,
            default: false
        },
        verificationToken: {
            type: String
        },
        tokenExpires: {
          type: Date
        }
    }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
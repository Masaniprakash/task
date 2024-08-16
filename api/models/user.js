const jwt = require('jsonwebtoken');
const { CONFIG } = require('../config/configData');
const { TE, to, isNull } = require('../service/util.service');
const bcrypt = require('bcryptjs');

module.exports=(sequelize, DataTypes)=>{
    let user=sequelize.define('user',{
        _id:{
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        phoneNo: {
            type: DataTypes.STRING(100)
        },
        designation: {
            type: DataTypes.STRING(100)
        },
        address:{
            type: DataTypes.TEXT
        }
    });

    user.beforeSave('create', async function (next) {

        if (isNull(this.password)) {
            return
        }

        if (this.isModified('`password`') || this.isNew) {

            let err, salt, hash;
            [err, salt] = await to(bcrypt.genSalt(10))
            if (err) TE(err.message, true);

            [err, hash] = await to(bcrypt.hash(this.password, salt))
            if (err) TE(err.message, true)

            this.password = hash

        } else {
            return next()
        }
    });

    user.prototype.comparePassword = async function (pw) {

        let err, pass
        if (!this.password) TE('password not set');
        [err, pass] = await to(bcrypt.compare(pw, this.password))
        if (err) TE(err)

        if (!pass) return null

        return this

    }

    user.prototype.getJWT = function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration)
        return 'Bearer ' + jwt.sign({ _id: this._id, userName: this.userName }, CONFIG.jwt_encryption,
            { expiresIn: expiration_time })
    }

    user.associate = function (models) {
        user.hasMany(models.user, { foreignKey: '_id'});
    }

    return user;
}
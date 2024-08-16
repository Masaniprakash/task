module.exports=(sequelize, DataTypes)=>{
    let user=sequelize.define('user',{
        _id:{
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        scheduleTime:{
            type: DataTypes.DATE,
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false
        },
            
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    // user.associate = function (models) {
    //     user.hasMany(models.user, { foreignKey: '_id'});
    // }

    return user;
}
const { where } = require("sequelize");
const { user } = require("../models");
const { isEmpty, ReS, ReE, isNull, to } = require("../service/util.service");

module.exports.uploadMultiple = async (req, res) => {

    let err, body = req.body;

    let { data } = body;


    if(isNull(data)){
        return ReE(res, 'Please provide data', 400);
    }

    if(isEmpty(data)){
        return ReE(res, 'Please provide data', 400);
    }

    for (let index = 0; index < data.length; index++) {

        const element = data[index];
        element.phoneNo = element.phoneNo.toString();
        let checkEmail, optionsForEmail = {
            where:{
                email:element.email
            }
        };

        [err, checkEmail] = await to(user.findOne(optionsForEmail));

        if(err){
            return ReE(res, err, 400);
        }

        if(!isNull(checkEmail)){
            return ReE(res, "Si no " + index+1 + ' Email already exists for '+element.email, 400);
        }

        let checkPhoneNo, optionsForPhoneNo = {
            where:{
                phoneNo:element.phoneNo
            }
        };

        [err, checkPhoneNo] = await to(user.findOne(optionsForPhoneNo));

        if(err){
            return ReE(res, err, 400);
        }

        if(!isNull(checkPhoneNo)){
            return ReE(res,  "Si no " + index+1 + ' PhoneNo already exists for '+element.phoneNo, 400);
        }

        let createEmployee, optionsForEmployee = {
            name:element.name,
            email:element.email,
            phoneNo:element.phoneNo,
            designation:element.designation,
            address:element.address
        };

        [err, createEmployee] = await to(user.create(optionsForEmployee));

        if(err){
            return ReE(res, err, 400);
        }

        if(isNull(createEmployee)){
            return ReE(res, "Si no "+ index+1 + ' Employee not created for this user email '+element.email, 400);
        }
        
    }


    return ReS(res, { message: 'Files uploaded successfully'}, 200);

}

module.exports.uploadMultiple2 = async (req, res) => {

    let err, body = req.body;

    let { data, schedule } = body;

    if(isNull(schedule)){
        return ReE(res, 'Please provide schedule time', 400);
    }

    if(new Date(schedule) < new Date()){
        return ReE(res, 'Please provide future schedule time', 400);
    }

    if(isNull(data)){
        return ReE(res, 'Please provide data', 400);
    }

    if(isEmpty(data)){
        return ReE(res, 'Please provide data', 400);
    }

    console.log(data);

    for (let index = 0; index < data.length; index++) {

        const element = data[index];
        let checkEmail, optionsForEmail = {
            where:{
                email:element.email
            }
        };

        [err, checkEmail] = await to(user.findOne(optionsForEmail));

        if(err){
            return ReE(res, err, 400);
        }

        if(!isNull(checkEmail)){
            return ReE(res, "Si no " + index+1 + ' Email already exists for '+element.email, 400);
        }

        let checkPhoneNo, optionsForPhoneNo = {
            where:{
                phoneNo:element.phoneNo
            }
        };

        [err, checkPhoneNo] = await to(user.findOne(optionsForPhoneNo));

        if(err){
            return ReE(res, err, 400);
        }

        if(!isNull(checkPhoneNo)){
            return ReE(res,  "Si no " + index+1 + ' PhoneNo already exists for '+element.phoneNo, 400);
        }

    }

    let createSchedule, optionsForSchedule = {
        scheduleTime:schedule,
        data:data
    };

    [err, createSchedule] = await to(user.create(optionsForSchedule));

    return ReS(res, { message: 'Files uploaded successfully'}, 200);

}
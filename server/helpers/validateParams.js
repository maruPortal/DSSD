const validateParams = function (requestParams) {
  return function (req, res, next) {
    for (let param of requestParams) {
      let reqAttr = param.req_attr ? param.req_attr : "body";
      let reqParam = req[reqAttr] ? req[reqAttr][param.param_key] : null;
      if (req[reqAttr] && checkParamPresent(Object.keys(req[reqAttr]), param)) {
        if (!checkParamType(reqParam, param)) {
          return res.send(400, {
            status: 400,
            validation:
              `${param.param_key} is of type ` +
              `${typeof reqParam} but should be ${param.type}`,
            key: param.param_key,
          });
        } else {
          const validators = runValidators(reqParam, param);
          if (validators !== true) {
            return res.send(400, {
              status: 400,
              validation:
                validators.message ||
                `Validation failed for ${param.param_key}`,
              key: param.param_key,
            });
          }
        }
      } else if (param.required) {
        return res.send(400, {
          status: 400,
          validation: `Missing parameter ${param.param_key}`,
          key: param.param_key,
        });
      }
    }
    next();
  };
};

const checkParamPresent = function (reqParams, paramObj) {
  return reqParams.includes(paramObj.param_key);
};

const checkParamType = function (reqParam, paramObj) {
  const reqParamType = typeof reqParam;
  return reqParamType === paramObj.type;
};

const runValidators = function (reqParam, paramObj) {
  if (!!paramObj.validator_functions) {
    for (let validator of paramObj.validator_functions) {
      if (!validator.fn(reqParam)) {
        return validator;
      }
    }
  }
  return true;
};

module.exports = validateParams;

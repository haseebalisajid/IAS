

function hasRole(role){
    return async function (req, res, next) {
      if(role !== req.USER.userType){
          res.status(403).json({'msg':'Permission Denied'})
      }
      else{
        next();
      }
    };
}
module.exports = hasRole;
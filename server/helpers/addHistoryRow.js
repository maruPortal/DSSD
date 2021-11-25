const supabase = require("./supabase");

module.exports = (descripcion) => {
  return async (req, res, next) => {
    let username = 'SISTEMA';

    if(req.__jwtUserPayload){
      let userPayload = req.__jwtUserPayload;
      username = userPayload.username;
    }

    const data = { usuario: username, expediente_id: req.params.id, descripcion: (typeof descripcion === 'function') ? descripcion(req) : descripcion };
    const resultHistory = await supabase.from('historial').insert([data]);
    
    if (resultHistory.error) {
      res.status(500).json(resultHistory.error);
      return;
    }

    next();
  }
};
var express = require("express");
var router = express.Router();
const supabase = require("../helpers/supabase");
function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    let key = obj[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}
/* GET stats page. */
router.get("/", async (req, res) => {
  let { data: historial, error } = await supabase.from('historial').select("*");
  res.json(historial);
});


/* GET expediente mas reciente y mas antiguo. */
router.get("/firstLastExpedient", async (req, res) => {
  let { data: expedientes, error } = await supabase.from('expedient').select("*");
  res.json({
    first: expedientes[0].fechaCreacion,
    last: expedientes[expedientes.length-1].fechaCreacion
  });
});

/* GET expediente mas reciente y mas antiguo. */
router.get("/avgTime/:id", async (req, res) => {
  let { data: historial, error } = await supabase.from('historial').select("*").eq('expediente_id', req.params.id);
  const first = historial[0];
  const last = historial[historial.length-1];

  const avgTime = ((new Date(last.created_at)) - (new Date(first.created_at)))/2;

  res.json({
    avgTime: new Date(avgTime).toISOString().substr(11, 8)
  });
});

/* GET expediente mas reciente y mas antiguo. */
router.get("/userAvgTime/:username", async (req, res) => {
  let { data: historial, error } = await supabase.from('historial').select("*").eq('usuario', req.params.username) .order('created_at', { ascending: true });

  const groupedByExpedients=groupBy(historial, 'expediente_id');
  let dates = {}, avg = 0;
  let expedientsKeys = Object.keys(groupedByExpedients);
  expedientsKeys.map(expedientsKey => {
    if (!dates[expedientsKey]) {
      dates[expedientsKey] = null;
    }

    const first = groupedByExpedients[expedientsKey][0];
    const last = groupedByExpedients[expedientsKey][groupedByExpedients[expedientsKey].length-1];

    const avgTime = ((new Date(last.created_at)) - (new Date(first.created_at)))/2;
    dates[expedientsKey] = avgTime;

  });

  avg = Object.values(dates).reduce((acc, nextV) => (acc += nextV), 0)/Object.values(dates).length;

  res.json({
    avgTime: new Date(avg).toISOString().substr(11, 8)
  });
});

module.exports = router;

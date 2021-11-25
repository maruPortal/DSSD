import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import { getExpedientes } from "../../services/service";

const ExpedienteAvgTimeSelect = (props) => {
  let [expedientes, setExpedientes] = useState([]);

  const handleChange = (event) => {
    props.onExpedienteSelected(event.target.value);
  };

  useEffect(() => {
    let requestExpedientes = async () => {
      const exps = await getExpedientes();
      setExpedientes([...exps]);
    };
    requestExpedientes();
  }, []);

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Expedientes</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Expedientes"
          onChange={handleChange}
        >
          {
            expedientes.map(expediente => <MenuItem key={expediente.id} value={expediente.id}>{expediente.nombreSociedad} #{expediente.id}</MenuItem>)
          }
        </Select>
      </FormControl>
    </Box>
  );
};
export default ExpedienteAvgTimeSelect;

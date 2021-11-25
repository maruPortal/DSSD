import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const UsuarioAvgTimeSelect = (props) => {
  const usuarios = ['mesaentradas1', 'mesaentradas2', 'legales1', 'legales2', 'escribano1', 'escribano2' ]

  const handleChange = (event) => {
    props.onUsuarioSelected(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Usuarios</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Usuarios"
          onChange={handleChange}
        >
          {
            usuarios.map(usuario => <MenuItem key={usuario} value={usuario}>{usuario}</MenuItem>)
          }
        </Select>
      </FormControl>
    </Box>
  );
};
export default UsuarioAvgTimeSelect;

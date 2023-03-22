import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function ControlledRadioButtonsGroup({ setTipCO, tipCO }) {
  const handleChange = (event) => {
    setTipCO(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group">Tip Cutie</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={tipCO}
        onChange={handleChange}
      >
        <FormControlLabel value={0.57} control={<Radio />} label="CO5" />
        <FormControlLabel value={0.38} control={<Radio />} label="CO3" />
      </RadioGroup>
    </FormControl>
  );
}

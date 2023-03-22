import { useState, useEffect } from "react";
import axios from "axios";
import ControlledRadioButtonsGroup from "./componenets/Select";

function App() {
  const [curat, setCurat] = useState(null);
  const [final, setFinal] = useState(null);
  const [lungime, setLungime] = useState(null);
  const [latime, setLatime] = useState(null);
  const [inaltime, setInaltime] = useState(null);
  const [bucati, setBucati] = useState(null);
  const [procent, setProcent] = useState(null);
  const [tipCO, setTipCO] = useState(0.57);

  const [costModificat, setCostModificat] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const calcul =
      (((lungime / 10 + latime / 10 + 6) *
        (latime / 10 + inaltime / 10 + 4) *
        2) /
        10000) *
      tipCO *
      bucati;
    setCurat(calcul);
    setFinal(calcul * 2.58 + 0.19);
  };
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    const getExchangeRate = async () => {
      const rate = await fetchExchangeRate();
      setExchangeRate(rate);
    };
    getExchangeRate();
  }, []);

  useEffect(() => {
    if (procent < 0) {
      setCostModificat(final - Math.abs(procent / 100) * final);
    } else if (procent > 0) {
      setCostModificat(final * (procent / 100) + final);
    } else if (procent == 0) {
      setCostModificat(final);
    }
  }, [procent, final]);

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="App">

        {exchangeRate && exchangeRate !== 0 && (
          <p
            style={{
              alignSelf: "center",
              padding: 2,
              borderRadius: 3,
              fontSize: "1.2rem",
              color: "green",
              marginTop: "10px",
              marginBottom:"50px"
            }}
          >
            EUR/RON - {exchangeRate.toFixed(2)}
          </p>
        )}

      <ControlledRadioButtonsGroup tipCO={tipCO} setTipCO={setTipCO} />
      <form
        className="form"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          required
          step="0.01"
          type="number"
          placeholder="Lungime(mm)"
          onChange={(e) => {
            setLungime(Number(e.target.value));
          }}
        />
        <input
          required
          step="0.01"
          type="number"
          placeholder="Latime(mm)"
          onChange={(e) => {
            setLatime(Number(e.target.value));
          }}
        />
        <input
          required
          step="0.01"
          type="number"
          placeholder="Inaltime(mm)"
          onChange={(e) => {
            setInaltime(Number(e.target.value));
          }}
        />
        {/* <input
          required
          step="0.01"
          type="number"
          placeholder="Pret/m2/lei"
          onChange={(e) => {
            setPretCarton(Number(e.target.value));
          }}
        /> */}
        <input
          required
          type="number"
          placeholder="Bucati"
          onChange={(e) => {
            setBucati(Number(e.target.value));
          }}
        />
        <button>Calculeaza</button>
      </form>
      {curat && curat !== 0 && (
        <div className="rezultat">
          <p>
            {" "}
            Cost Curat : {curat.toFixed(2)}€{" "}
            <span style={{ fontSize: "1rem" }}>
              ({(exchangeRate * curat).toFixed(2)}RON)
            </span>{" "}
          </p>
          <p>
            {" "}
            Cost Final : {final.toFixed(2)}€{" "}
            <span style={{ fontSize: "1rem" }}>
              ({(exchangeRate * final).toFixed(2)}RON){" "}
            </span>
          </p>
          <input
            style={{
              width: "20%",
              justifySelf: "center",
              alignSelf: "center",
              textAlign: "center",
            }}
            type="number"
            placeholder="-/+ %"
            onChange={(e) => {
              setProcent(e.target.value);
            }}
          />
          {costModificat && (
            <>
              <p>
                Noul Cost: {costModificat.toFixed(2)}€{" "}
                <span style={{ fontSize: "1rem" }}>
                  ({(costModificat * exchangeRate).toFixed(2)} RON)
                </span>
              </p>
            </>
          )}
        </div>
      )}

      {/* <input type="text" placeholder="Lungime"/> */}

      <button style={{ marginTop: "20px" }} onClick={handleReset}>
        reset
      </button>
    </div>
  );
}

export default App;

const fetchExchangeRate = async () => {
  const response = await axios.get(
    "https://openexchangerates.org/api/latest.json?app_id=5452074557464010ba47800c66f45b5a&symbols=EUR,RON"
  );
  const { rates } = response.data;
  const euroRate = rates.EUR;
  const ronRate = rates.RON;
  return ronRate / euroRate;
};

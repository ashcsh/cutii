import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [calcul, setCalcul] = useState(null);
  const [lungime, setLungime] = useState(null);
  const [latime, setLatime] = useState(null);
  const [inaltime, setInaltime] = useState(null);
  const [pretCarton, setPretCarton] = useState(null);
  const [bucati, setBucati] = useState(null);
  const [procent, setProcent] = useState(null);

  const [costModificat, setCostModificat] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCalcul(
      (((lungime + latime + 6) * (latime + inaltime + 4) * 2) / 10000) *
        pretCarton *
        bucati
    );
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
      setCostModificat(calcul - Math.abs(procent / 100) * calcul);
    } else if (procent > 0) {
      setCostModificat(calcul * (procent / 100) + calcul);
    }
  },[procent, calcul])
  const handleClick = () => {

  };

  const handleReset = () => {
    window.location.reload();
  };
  return (
    <div className="App">
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
          placeholder="Lungime(cm)"
          onChange={(e) => {
            setLungime(Number(e.target.value));
          }}
        />
        <input
          required
          step="0.01"
          type="number"
          placeholder="Latime(cm)"
          onChange={(e) => {
            setLatime(Number(e.target.value));
          }}
        />
        <input
          required
          step="0.01"
          type="number"
          placeholder="Inaltime(cm)"
          onChange={(e) => {
            setInaltime(Number(e.target.value));
          }}
        />
        <input
          required
          step="0.01"
          type="number"
          placeholder="Pret/m2/lei"
          onChange={(e) => {
            setPretCarton(Number(e.target.value));
          }}
        />
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
      {calcul && calcul !== 0 && (
        <div className="rezultat">
          <p> Cost : {calcul.toFixed(2)}</p>
          <p>Cost in Euro: {(calcul / exchangeRate).toFixed(2)}</p>
          <input
          style={{width:"20%", justifySelf:"center", alignSelf:"center", textAlign:"center"}}
            type="number"
            placeholder="-/+ %"
            onChange={(e) => {
              setProcent(e.target.value);
            }}
          />
          {costModificat && (
            <>
              <p>Noul Cost: {costModificat.toFixed(2)}</p>
              <p>
                Noul Cost in Euro: {(costModificat / exchangeRate).toFixed(2)}
              </p>
            </>
          )}
        </div>
      )}

      {/* <input type="text" placeholder="Lungime"/> */}
      {exchangeRate && exchangeRate !== 0 && (
        <p
          style={{
            fontSize: "1.2rem",
            backgroundColor: "green",
            color: "white",
            marginTop: "10px",
          }}
        >
          {" "}
          EURO/RON {exchangeRate.toFixed(2)}
        </p>
      )}
      <button style={{marginTop:"20px"}} onClick={handleReset}>reset</button>
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

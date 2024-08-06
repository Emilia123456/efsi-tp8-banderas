"use client";
import Image from 'next/image';
import api from './api';
import { useEffect, useState } from 'react';
import styles from './page.module.css'; 

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomNumber, setRandomNumber] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState(null);
  const [puntaje, setPuntaje] = useState(null);
  const [shouldHide,setShouldHide] = useState(false); 

  function timerCallback() {
    return alert("¡Se te termino el tiempo!");
  };

  // Generar número aleatorio
  const generateRandomNumber = () => {

    if(result == null && countries.length > 0){
      setPuntaje(puntaje-1);
    }

    const rnd = Math.floor(Math.random() * 100); 
    setRandomNumber(rnd);
    setInputValue(''); 
    setResult(null); 
    setShouldHide(false);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get('/countries/flag/images'); // Traemos todos los datos de la API
        setCountries(response.data.data); // Metemos todos los países y las banderas en countries
        generateRandomNumber();
        setTimeout(timerCallback, 15000);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const verificarIngreso = () => {    
    if (randomNumber !== null) {
      const countryName = countries[randomNumber].name.toLowerCase();
      const userInput = inputValue.toLowerCase();
      if (userInput === countryName) {
        setResult('Correcto');        
        setPuntaje(puntaje+10);
        setShouldHide(true);
      } else {
        setResult('Incorrecto');
        setPuntaje(puntaje-1);
      }
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Adivina la Bandera</h1>
        <h2 className={styles.description}>Ingrese el nombre correspondiente</h2>

        {randomNumber !== null && countries.length > 0 && (
          <div className={styles.flag}>
            <Image 
              src={countries[randomNumber].flag} 
              alt={`Bandera de ${countries[randomNumber].name}`} 
              width={700} 
              height={350} 
              className={styles.flagImage}
            />
            <p>{countries[randomNumber].name}</p>
            <p>Puntaje: {puntaje}</p>
          </div>
        )}

        <div className={styles.inputContainer}>
          <input 
            type="text" 
            value={inputValue} 
            onChange={handleInputChange} 
            placeholder="Nombre del país"
            className={styles.input} 
          />
          <button hidden={shouldHide} className={styles.button} onClick={verificarIngreso}>Verificar</button>
        </div>
        {result && <p className={`${styles.result} ${result === 'Correcto' ? styles.correct : styles.incorrect}`}>{result}</p>}
        <button className={styles.button} onClick={generateRandomNumber}>Siguiente país</button>
      </main>
    </div>
  );
};

export default Home;

"use client";
import Image from 'next/image';
import api from './api';
import { useEffect, useState, useRef } from 'react';
import styles from './page.module.css'; 

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomNumber, setRandomNumber] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState(null);
  const [puntaje, setPuntaje] = useState(0);
  const [shouldHide, setShouldHide] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // Estado para el tiempo restante
  const timerIdRef = useRef(null); // Para almacenar el ID del temporizador

  // Verificar la entrada del usuario
  const verificarIngreso = (timeOut = false) => {    
    if (randomNumber !== null) {
      const countryName = countries[randomNumber].name.toLowerCase();
      const userInput = inputValue.toLowerCase();
      
      if (!timeOut && userInput === countryName) {
        setResult('Correcto');
        setPuntaje(puntaje + 10);
        setShouldHide(true);
        stopTimer(); // Detener el temporizador cuando la respuesta es correcta
      } else {
        setResult('Incorrecto');
        setPuntaje(puntaje - 1);
        if (timeOut) {
          setPuntaje((prevPuntaje) => prevPuntaje - 1); // Restar un punto adicional si se acabó el tiempo
          stopTimer(); // Detener el temporizador
        } else {
          // Si es incorrecto pero el tiempo no ha terminado, no detenemos el temporizador.
          setInputValue(''); // Limpiar el input para seguir intentando
        }
      }
    }
  };

  // Iniciar el temporizador
  const startTimer = () => {
    setTimeLeft(15); // Reiniciar el tiempo a 15 segundos
    timerIdRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerIdRef.current);
          verificarIngreso(true); // Verifica automáticamente como incorrecto si se acaba el tiempo
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Detener el temporizador
  const stopTimer = () => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  };

  // Generar número aleatorio
  const generateRandomNumber = () => {
    stopTimer(); // Detener cualquier temporizador activo

    if(result == null && countries.length > 0){
      setPuntaje(puntaje - 1);
    }

    const rnd = Math.floor(Math.random() * 100); 
    setRandomNumber(rnd);
    setInputValue(''); 
    setResult(null); 
    setShouldHide(false);
    
    startTimer(); // Iniciar el temporizador para la nueva ronda
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get('/countries/flag/images');
        setCountries(response.data.data);
        generateRandomNumber();
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

        <div className={styles.timer}>
          <p>Tiempo restante: {timeLeft} segundos</p>
        </div>

        <div className={styles.inputContainer}>
          <input 
            type="text" 
            value={inputValue} 
            onChange={handleInputChange} 
            placeholder="Nombre del país"
            className={styles.input} 
          />
          <button hidden={shouldHide} className={styles.button} onClick={() => verificarIngreso()}>Verificar</button>
        </div>
        {result && <p className={`${styles.result} ${result === 'Correcto' ? styles.correct : styles.incorrect}`}>{result}</p>}
        <button className={styles.button} onClick={generateRandomNumber}>Siguiente país</button>
      </main>
    </div>
  );
};

export default Home;

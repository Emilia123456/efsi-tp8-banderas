// pages/index.js
"use client";
import Image from 'next/image';
import api from './api';
import { useEffect, useState } from 'react';
import styles from './page.module.css'; // Importa el archivo CSS

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomNumber, setRandomNumber] = useState(null);

  // Generar número aleatorio
  const generateRandomNumber = () => {
    const rnd = Math.floor(Math.random() * 100); // Genera un número entre 0 y 99
    setRandomNumber(rnd);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get('/countries/flag/images'); // Traemos todos los datos de la API
        setCountries(response.data.data); // Metemos todos los países y las banderas en countries
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
              width={100} 
              height={50} 
            />
            <p>{countries[randomNumber].name}</p>
          </div>
        )}
        <button className={styles.button} onClick={generateRandomNumber}>Generar Nuevo Número</button>
      </main>
    </div>
  );
};

export default Home;

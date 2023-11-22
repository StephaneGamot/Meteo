"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/page.module.css";
import Loader from "@/public/img/loader.svg";
import Browser from "@/public/img/browser.svg";

type WeatherData = {                       	                                   // Définition du type pour les données météo
	city: string;
	country: string;
	iconId: string;
	temperature: number;
};

export default function AppliMeteo() {
	const secretKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;                 // Récupération de la clé API depuis les variables d'environnement
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);  // Déclaration des états pour les données météo 
	const [error, setError] = useState<string>("");                            // Déclaration des états pour les messages d'erreur

	useEffect(() => {                                                          // On utilise useEffect pour charger les données météo à l'initialisation du composant
		const fetchData = async () => {                                        // Fonction asynchrone pour récupérer les données météo
			try {                                                              // Si une erreur se produit dans ce bloc, le contrôle passe immédiatement au bloc 'catch'.
				const response = await fetch(`http://api.airvisual.com/v2/nearest_city?key=${secretKey}`); // Appel API (avec la méthode Fetch) pour obtenir les données météo
				if (!response.ok) {                                            // Vérification si la réponse est une erreur HTTP
					console.log(response);
					const errorStatus = `Erreur HTTP ! statut : ${response.status}`;// 'errorStatus' est une variable qui stocke un message d'erreur personnalisé + le code de statut HTTP.
					throw new Error(errorStatus);                              // 'throw' interrompt l'exécution du bloc 'try', avec le message d'erreur défini et passe au bloc 'catch'.
				}
				const responseData = await response.json();                    // Extraction des données JSON de la réponse
				setWeatherData({                                               // Mise à jour de l'état weatherData avec les données reçues
					city: responseData.data.city,                              // extrait la propriété 'city' des données de réponse JSON et la stocke dans l'objet 'weatherData'
					country: responseData.data.country,                        // extrait la propriété 'country' des données de réponse JSON et la stocke dans l'objet 'weatherData'
					iconId: responseData.data.current.weather.ic,              // extrait la propriété 'iconId' des données de réponse JSON et la stocke dans l'objet 'weatherData'
					temperature: responseData.data.current.weather.tp,         // extrait la propriété 'temperature' des données de réponse JSON et la stocke dans l'objet 'weatherData'
				});
			} catch (err) {                                                    // catch est exécuté si une exception est levée dans le bloc 'try', 'err' est l'objet d'erreur qui contient les infos sur l'erreur
				let errorMessage = "Erreur lors de la récupération des données météo";
				if (err instanceof Error && err.message) {                     // Cette condition vérifie si 'err' est une instance de l'objet 'Error' et si elle contient un message.
					errorMessage += ` - ${err.message}`;                       // Si c'est le cas, le message d'erreur (défini par 'throw new Error'.)est ajouté à 'errorMessage'.
				}
				setError(errorMessage);                                        // La fonction 'setError' met à jour l'état 'error' avec le message d'erreur complet qui sera utilisé dans l'IU.
				console.error(errorMessage);
			}
		};

		fetchData();                                                           // Appel de la fonction fetchData
	}, []);                                                                    // Les crochets vides '[]' en tant que second argument nous informe que l'effet s'exécute une seule fois

	return (
		<div className={styles.meteoContaineur}>
			<div className={styles.meteoCard}>
				{error ? (                                                     // Bloc expression conditionnelle (ternaire) qui vérifie si 'error' contient une valeur sinon le bloc de code suivant est exécuté.
					<>
						<p className={styles.error}>{error}</p>
						<Image src={Browser} height={50} width={50} alt="Erreur lors du Chargement" />
					</>
				) : weatherData ? (                                            // Si 'error' est false (pas d'erreur), cette partie vérifie ensuite si 'weatherData' contient des données.
					                                                           // Si les données météo sont disponibles, alors le contenu suivant est rendu 
					<>
						<p className={styles.cityName}>{weatherData.city}</p>
						<p className={styles.countryName}>{weatherData.country}</p>
						<p className={styles.temperature}>{weatherData.temperature}°C</p>
						<Image src={`/img/${weatherData.iconId}.svg`} height={80} width={80} alt="Météo" />
					</>
				) : (                                                          // Si ni 'error' ni data à afficher alors le loader est affiché pour indiquer que les données sont en cours de chargement.
					<Image src={Loader} height={50} width={50} alt="Chargement" />// Affichage d'un loader pendant le chargement
				)}
			</div>
		</div>
	);
}




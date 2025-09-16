/**
 * Données des vidéos et leurs questions associées
 */

const VIDEO_DATA = [
    {
        id: 1,
        title: "Reportage France 3",
        filename: "France3.mp4",
        description: "Reportage sur l'immobilier et les nouvelles réglementations",
        duration: "02:30", // Durée approximative
        questions: [
            {
                id: 1,
                question: "Selon le reportage, quel est le principal défi du marché immobilier actuel ?",
                answers: [
                    { text: "La hausse des taux d'intérêt", correct: true },
                    { text: "Le manque de terrains constructibles", correct: false },
                    { text: "La baisse de la demande", correct: false },
                    { text: "Les nouvelles normes environnementales", correct: false }
                ],
                correctReward: 150, // Bonus en euros pour bonne réponse
                wrongPenalty: 75    // Malus en euros pour mauvaise réponse
            },
            {
                id: 2,
                question: "Quelle mesure gouvernementale a été évoquée dans le reportage ?",
                answers: [
                    { text: "Suppression du PTZ", correct: false },
                    { text: "Réduction des frais de notaire", correct: true },
                    { text: "Augmentation des taxes foncières", correct: false },
                    { text: "Interdiction des locations courte durée", correct: false }
                ],
                correctReward: 100,
                wrongPenalty: 50
            }
        ]
    },
    {
        id: 2,
        title: "Interview Expert Immobilier",
        filename: "expert_interview.mp4",
        description: "Comment devenir expert en évaluation immobilière - Formation SNPI",
        duration: "02:37",
        questions: [
            {
                id: 1,
                question: "Selon la vidéo, l'activité d'expertise en évaluation immobilière en France est :",
                answers: [
                    { text: "Strictement réglementée par la loi Hoguet", correct: false },
                    { text: "Une activité non réglementée, hors champ de la loi Hoguet", correct: true },
                    { text: "Réservée aux agents immobiliers diplômés", correct: false },
                    { text: "Accessible uniquement aux notaires", correct: false }
                ],
                correctReward: 150,
                wrongPenalty: 75
            },
            {
                id: 2,
                question: "Quels types de missions d'expertise sont mentionnés dans la vidéo ?",
                answers: [
                    { text: "Uniquement les mandats de vente et location", correct: false },
                    { text: "Déclarations de succession, donations, impôts sur la fortune", correct: true },
                    { text: "Seulement l'évaluation de commerces", correct: false },
                    { text: "Exclusivement les expertises judiciaires", correct: false }
                ],
                correctReward: 120,
                wrongPenalty: 60
            },
            {
                id: 3,
                question: "Pour devenir expert agréé, que propose le SNPI ?",
                answers: [
                    { text: "Des formations modulaires à Paris et en régions", correct: true },
                    { text: "Un simple examen en ligne", correct: false },
                    { text: "Une formation uniquement à distance", correct: false },
                    { text: "Un stage obligatoire de 6 mois", correct: false }
                ],
                correctReward: 100,
                wrongPenalty: 50
            },
            {
                id: 4,
                question: "Quels sont les avantages mentionnés pour devenir expert en évaluation ?",
                answers: [
                    { text: "Seulement l'amélioration des compétences", correct: false },
                    { text: "Améliorer ses compétences, son chiffre d'affaires et avoir une nouvelle carte de visite valorisante", correct: true },
                    { text: "Uniquement l'accès à la RCP spécialisée", correct: false },
                    { text: "Seulement la reconnaissance professionnelle", correct: false }
                ],
                correctReward: 130,
                wrongPenalty: 65
            }
        ]
    },
    {
        id: 3,
        title: "Portail des Successions Vacantes",
        filename: "successions_vacantes.mp4",
        description: "Présentation du portail des successions vacantes pour les professionnels - DGFiP",
        duration: "03:15",
        questions: [
            {
                id: 1,
                question: "Combien de dossiers de successions vacantes ont été traités en 2024 ?",
                answers: [
                    { text: "15 000 dossiers", correct: false },
                    { text: "21 000 dossiers", correct: true },
                    { text: "25 000 dossiers", correct: false },
                    { text: "18 000 dossiers", correct: false }
                ],
                correctReward: 150,
                wrongPenalty: 75
            },
            {
                id: 2,
                question: "Quel pourcentage des décès annuels en France représentent les successions vacantes ?",
                answers: [
                    { text: "2%", correct: false },
                    { text: "3%", correct: true },
                    { text: "4%", correct: false },
                    { text: "5%", correct: false }
                ],
                correctReward: 100,
                wrongPenalty: 50
            },
            {
                id: 3,
                question: "Par quel moyen peut-on accéder au portail des successions vacantes ?",
                answers: [
                    { text: "Directement sur le site de la mairie", correct: false },
                    { text: "Via l'espace professionnel sur impots.gouv.fr", correct: true },
                    { text: "Sur le site du ministère de la Justice", correct: false },
                    { text: "Via un portail dédié indépendant", correct: false }
                ],
                correctReward: 120,
                wrongPenalty: 60
            },
            {
                id: 4,
                question: "Quels sont les principaux services disponibles sur le portail ?",
                answers: [
                    { text: "Uniquement la consultation des dossiers", correct: false },
                    { text: "Déclaration de créance, revendication d'un bien, transmission de justificatifs", correct: true },
                    { text: "Seulement la déclaration de succession", correct: false },
                    { text: "Uniquement le suivi des procédures", correct: false }
                ],
                correctReward: 140,
                wrongPenalty: 70
            },
            {
                id: 5,
                question: "Dans quel plan s'inscrit ce portail selon la vidéo ?",
                answers: [
                    { text: "Plan de digitalisation des services publics", correct: false },
                    { text: "Plan de modernisation de la mission des successions vacantes", correct: true },
                    { text: "Plan de réforme des successions", correct: false },
                    { text: "Plan de dématérialisation fiscale", correct: false }
                ],
                correctReward: 110,
                wrongPenalty: 55
            }
        ]
    }
];

/**
 * Obtient toutes les vidéos disponibles
 */
function getAllVideos() {
    return VIDEO_DATA;
}

/**
 * Obtient une vidéo par son ID
 */
function getVideoById(videoId) {
    return VIDEO_DATA.find(video => video.id === videoId);
}

/**
 * Obtient une vidéo aléatoire parmi celles non encore vues
 */
function getRandomUnwatchedVideo() {
    const gameState = getGameState();
    const watchedVideos = gameState.watchedVideos || [];

    const unwatchedVideos = VIDEO_DATA.filter(video => 
        !watchedVideos.includes(video.id)
    );
    
    if (unwatchedVideos.length === 0) {
        return null; // Toutes les vidéos ont été vues
    }
    
    const randomIndex = Math.floor(Math.random() * unwatchedVideos.length);
    return unwatchedVideos[randomIndex];
}

/**
 * Marque une vidéo comme vue
 */
function markVideoAsWatched(videoId) {
    const gameState = getGameState();
    if (!gameState.watchedVideos) {
        gameState.watchedVideos = [];
    }
    
    if (!gameState.watchedVideos.includes(videoId)) {
        gameState.watchedVideos.push(videoId);
        updateGameState(gameState);
    }
}

/**
 * Remet à zéro les vidéos vues (pour une nouvelle partie)
 */
function resetWatchedVideos() {
    const gameState = getGameState();
    gameState.watchedVideos = [];
    updateGameState(gameState);
}

/**
 * Vérifie s'il reste des vidéos non vues
 */
function hasUnwatchedVideos() {
    const gameState = getGameState();
    const watchedVideos = gameState.watchedVideos || [];
    return watchedVideos.length < VIDEO_DATA.length;
}

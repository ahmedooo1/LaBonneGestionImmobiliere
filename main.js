/**
 * Fichier principal pour initialiser et gérer le jeu
 */

// Initialise le jeu au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
    initGame();
    updateTeamsCorners(); // Affiche les coins dès le chargement

    const gameState = getGameState();
    const teamCards = document.querySelectorAll(".team-card");

    teamCards.forEach((teamCard) => {
        const teamId = teamCard.dataset.teamId;
        const playerInputs = teamCard.querySelectorAll(".player-input");
        const checkbox = teamCard.querySelector(
            '.toggle input[type="checkbox"]',
        );

        if (gameState.teams[teamId] && gameState.teams[teamId].active) {
            // Si l'équipe est active, remplir le premier champ avec une valeur par défaut
            if (playerInputs[0]) {
                playerInputs[0].value = `Joueur 1`;
            }
            // Cocher la checkbox si elle ne l'est pas déjà
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
        }
    });
});

function initGame() {
    // Initialise les gestionnaires d'événements
    setupEventListeners();

    // Vérifie s'il y a un état de jeu sauvegardé
    const gameState = getGameState();

    // Initialize le premier écran
    showScreen("welcome-screen");

    // Précharge les images depuis assets
    preloadAssets();
    // a voir apres -----------------------------------------------------------------------
    // const voices = speechSynthesis.getVoices();
    // maleVoice = voices.find(
    //     (voice) => voice.name === "Microsoft Paul - French (France)",
    // );
    // // Lire le texte
    // let speechText = "Bienvenue dans votre jeu, La Bonne Gestion Immobilière"
    //  const speech = new SpeechSynthesisUtterance(speechText);
    // speech.lang = "fr-FR"; // Langue française
    // speech.volume = 1; // Volume maximum
    // speech.rate = 1; // Vitesse normale
    // speech.pitch = 1; // Ton normal
    // if (maleVoice) {
    //     speech.voice = maleVoice;
    // }

    // // Lire le texte
    // window.speechSynthesis.speak(speech);
}

// Précharge les images pour une utilisation ultérieure
function preloadAssets() {
    const ASSETS_PATH = "assets/";
    const imagesToPreload = [
        // Add your actual image files here if needed
    ];

    imagesToPreload.forEach((imagePath) => {
        const img = new Image();
        img.src = ASSETS_PATH + imagePath;
    });
}

let dicelandBG;
let landSound;

function blamSoundEffect() {
    // Joue un son quand le dé s'arrête
    try {
        landSound = new Audio("assets/blam.wav");
        landSound.volume = 0.5;

        landSound.play().catch((e) => console.log("Pas de son disponible"));
    } catch (e) {
        console.log("Audio non supporté");
    }
}

function setupEventListeners() {
    // Boutons de navigation entre les écrans
    document.getElementById("start-button").addEventListener("click", () => {
        // Ajoutez cela pour le bouton d'historique
        const historyButton = document.getElementById("show-history-button");
        if (historyButton) {
            historyButton.addEventListener("click", () => {
                console.log('Bouton "Voir Historique des Scores" cliqué !'); // Log pour vérifier si c'est appelé
                showScoreHistory(); // Appelle la fonction
            });
        } else {
            console.error(
                'Le bouton avec ID "show-history-button" n\'est pas trouvé dans le HTML !',
            );
        }
        // Efface complètement le localStorage pour repartir de zéro
        localStorage.clear();
        // Réinitialise l'état du jeu avec les scores à 0
        resetGameState();
        showScreen("team-setup-screen");

        if (dicelandBG) {
            dicelandBG.pause();
            dicelandBG.currentTime = 0; // Réinitialise le temps de lecture à 0
        }
        // Joue un son quand le dé s'arrête
        try {
            landSound = new Audio("assets/bigenGame.wav");
            landSound.volume = 0.5;

            landSound.play().catch((e) => console.log("Pas de son disponible"));
        } catch (e) {
            console.log("Audio non supporté");
        }
        const rollButton = document.getElementById("roll-button");
        rollButton.style.display = "none";
    });

    document.getElementById("continue-button").addEventListener("click", () => {
        if (landSound) {
            landSound.pause();
            landSound.currentTime = 0; // Réinitialise le temps de lecture à 0
        }
        // Joue un son quand le dé s'arrête
        blamSoundEffect();

        // Réinitialise complètement l'état du jeu avec des scores à 0
        resetGameState();
        // Sauvegarde les informations des équipes avant de continuer
        saveTeamSetup();
        showScreen("dice-screen");
        updateTeamsDisplay();
    });

    document
        .getElementById("roll-dice-button")
        .addEventListener("click", () => {
            blamSoundEffect();
            // Joue un son quand le dé s'arrête
            dicelandBGSound();
            // Démarre le timer du jeu dès qu'on lance le dé la première fois
            showScreen("board-screen");
            startGameTimer();
            rollDice();
        });

    document.getElementById("roll-button").addEventListener("click", () => {
        blamSoundEffect();
        rollDice();

        const rollButton = document.getElementById("roll-button");
        rollButton.style.display = "none";
        const nextButton = document.getElementById("next-turn-button");
        nextButton.style.display = "block";
    });

    document
        .getElementById("next-turn-button")
        .addEventListener("click", () => {
            blamSoundEffect();
            nextTurn();
            const rollButton = document.getElementById("roll-button");
            rollButton.style.display = "block";
            const nextButton = document.getElementById("next-turn-button");
            nextButton.style.display = "none";
        });

    // document.getElementById('bonus-continue').addEventListener('click', () => {
    //     blamSoundEffect();
    //     console.log('clické');
    // });

    document.getElementById("exit-button").addEventListener("click", () => {
        blamSoundEffect();
        showExitModal();
    });

    document.getElementById("skip-video").addEventListener("click", () => {
        blamSoundEffect();
        // Arrête le timer de la vidéo
        if (window.videoTimer) {
            clearInterval(window.videoTimer);
        }
        toggleModal("video-modal", false);
    });

    document.getElementById("replay-button").addEventListener("click", () => {
        blamSoundEffect();
        // Efface complètement le localStorage
        localStorage.clear();

        // Réinitialise complètement l'état du jeu avec des scores à 0
        resetGameState();

        // Ferme la modale et nettoie les styles
        toggleModal("win-modal", false);
        document.body.classList.remove("win-celebration");

        // Revient à l'écran d'accueil
        showScreen("welcome-screen");

        // Réinitialise le timer
        if (window.gameTimerInterval) {
            clearInterval(window.gameTimerInterval);
        }

        // Réinitialise l'affichage du timer
        const timerElement = document.getElementById("game-timer");
        if (timerElement) {
            timerElement.textContent = "30:00";
            timerElement.classList.remove("warning", "danger");
        }

        console.log(
            "Jeu réinitialisé avec scores à 0, localStorage effacé complètement",
        );
    });

    document.getElementById("confirm-exit").addEventListener("click", () => {
        blamSoundEffect();

        // Ferme la modale
        toggleModal("exit-modal", false);

        // Efface tous les données du localStorage
        localStorage.clear();

        // Réinitialise complètement l'état du jeu
        resetGameState();

        // Arrête le timer si actif
        if (window.gameTimerInterval) {
            clearInterval(window.gameTimerInterval);
        }

        location.reload();
        // Revient à l'écran d'accueil
        showScreen("welcome-screen");

        console.log("Jeu quitté, localStorage effacé");
    });

    document.getElementById("cancel-exit").addEventListener("click", () => {
        blamSoundEffect();
        toggleModal("exit-modal", false);
    });
}
function updateScoreBlocks(gameState) {
    const scoreBlocksContainer = document.getElementById("score-blocks");
    scoreBlocksContainer.innerHTML = ""; // Vide le conteneur avant de le remplir

    Object.keys(gameState.teams).forEach((teamId) => {
        const team = gameState.teams[teamId];
        if (team.active) {
            const teamScoreBlock = document.createElement("div");
            teamScoreBlock.className = `team-score-block team${teamId}`;
            teamScoreBlock.id = `team${teamId}-score-block`;
            teamScoreBlock.innerHTML = `
                <div>Équipe ${teamId}</div>
                <div class="score">0 K</div>
            `;
            scoreBlocksContainer.appendChild(teamScoreBlock);
        }
    });
}

// Exemple d'utilisation
const gameState = getGameState();
updateScoreBlocks(gameState);

// Sauvegarde les informations des équipes
function saveTeamSetup() {
    const gameState = getGameState();

    document.querySelectorAll(".team-card").forEach((card) => {
        const teamId = card.dataset.teamId;

        const playerInputs = card.querySelectorAll(".player-input");
        const players = Array.from(playerInputs)
            .map((input) => input.value.trim())
            .filter((name) => name !== ""); // Filtre les noms vides

        // Convertir en objets avec score et scoreHistory
        const playersAsObjects = players.map((name) => ({
            name: name,
            score: 0, // Initialiser le score à 0
            scoreHistory: [0], // Initialiser l'historique avec 0
        }));

        const isActive = card.querySelector('input[type="checkbox"]').checked;

        if (gameState.teams[teamId]) {
            gameState.teams[teamId].players = playersAsObjects; // Utiliser le nouveau tableau d'objets
            gameState.teams[teamId].active = isActive;
        }
    });

    // Le reste du code reste inchangé...
    const activeTeamIds = Object.keys(gameState.teams)
        .filter((id) => gameState.teams[id].active)
        .map(Number);

    if (activeTeamIds.length > 0) {
        gameState.activeTeam = activeTeamIds[0];
    }

    updateGameState(gameState);
    updateScoreBlocks(gameState); // Mettre à jour l'affichage si nécessaire
}
function dicelandBGSound() {
    try {
        if (!dicelandBG) { // Crée l'instance une seule fois
            dicelandBG = new Audio("assets/dicelandBG.wav");
            dicelandBG.loop = true;
            dicelandBG.volume = 0.5;
        }
        dicelandBG.play().catch((e) => console.log("Pas de son disponible"));
    } catch (e) {
        console.log("Audio non supporté");
    }
}
// Gère le lancement du dé
function rollDice() {
    // Désactive le bouton pendant l'animation
    const rollButton = document.getElementById("roll-button");
    if (rollButton) rollButton.disabled = true;

    // Affiche le dé en plein écran
    const diceOverlay = document.getElementById("dice-fullscreen-overlay");
    const fullscreenDice = document.getElementById("fullscreen-dice");

    // Affiche l'overlay
    diceOverlay.classList.add("show");

    // Anime le dé avec des rotations dynamiques
    fullscreenDice.classList.add("rolling");

    // Ajouter un effet de tremblement au dé
    if (fullscreenDice.parentElement) {
        fullscreenDice.parentElement.classList.add("shake");
    }

    // Ajouter un son de dé qui roule
    try {
        const rollSound = new Audio("assets/diceland.wav");
        rollSound.volume = 0.5;
        rollSound.play().catch((e) => console.log("Pas de son disponible"));
    } catch (e) {
        console.log("Audio non supporté");
    }

    // Prolonger la durée de l'animation pour mieux voir le dé tourner
    setTimeout(() => {
        // Génère un nombre aléatoire entre 1 et 6
        const diceValue = getRandomInt(1, 6);

        // Arrête l'animation du dé
        fullscreenDice.classList.remove("rolling");
        if (fullscreenDice.parentElement) {
            fullscreenDice.parentElement.classList.remove("shake");
        }

        // Met à jour l'affichage du dé en plein écran
        fullscreenDice.setAttribute("data-value", diceValue);

        // Met à jour aussi le dé normal (pour la cohérence)
        const normalDice = document.getElementById("dice");
        if (normalDice) {
            normalDice.setAttribute("data-value", diceValue);
        }

        // Met à jour l'état du jeu
        updateDiceValue(diceValue);
        updateDiceDisplay(diceValue);

        // Après un délai pour montrer le résultat, cache l'overlay
        setTimeout(() => {
            // Cache l'overlay du dé
            diceOverlay.classList.remove("show");
            // Joue un son quand le dé s'arrête
            try {
                landSound = new Audio("assets/trn.wav");
                landSound.volume = 0.5;

                landSound
                    .play()
                    .catch((e) => console.log("Pas de son disponible"));
            } catch (e) {
                console.log("Audio non supporté");
            }
            // Si nous sommes sur l'écran de lancement du dé, passe au plateau de jeu
            if (
                document
                    .getElementById("dice-screen")
                    .classList.contains("active-screen")
            ) {
                showScreen("board-screen");
                renderGameBoard();
                updateTeamsDisplay();
            } else {
                // Si nous sommes déjà sur le plateau, déplace le joueur du nombre de cases indiqué par le dé
                // Déplace le joueur du nombre de cases indiqué par le dé
                const updatedState = movePlayer(diceValue);

                // Récupère la carte sur laquelle le joueur est arrivé
                const activeCard = getActiveCardFromPosition();

                // Met à jour l'affichage du plateau
                renderGameBoard();

                // Applique l'effet de la carte
                handleCellClick(activeCard.id, activeCard.type);

                // Réactive le bouton
                if (rollButton) rollButton.disabled = false;
            }
        }, 1500);
    }, 2500); // Augmenté à 2.5 secondes pour voir le dé qui tourne plus longtemps
}

// Passe au tour suivant
function nextTurn() {
    const gameState = advanceTurn();
    updateTeamsDisplay();
    updatePlayerList(); // Update the player list display
    updateTeamsCorners(); // Met à jour l'affichage des coins
    // **Ajout pour l'historique des tours**
    const activeTeam = gameState.teams[gameState.activeTeam];
    const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
    if (currentPlayer) {
        updatePlayerTurn(
            currentPlayer,
            `Fin du tour: Passage au joueur suivant`,
        );
    }
    // Réactive le bouton de lancer de dé
    const rollButton = document.getElementById("roll-button");
    if (rollButton) rollButton.disabled = false;

    // Vérifier si une équipe a atteint le score de victoire (2000 points)
    const winningTeam = Object.values(gameState.teams).find(
        (team) => team.active && team.score >= 2000,
    );

    if (winningTeam) {
        showWinModal(winningTeam.score, winningTeam.name);
    }

    // Vérifier si le temps restant est inférieur à 30 secondes
    if (gameState.gameTime <= 30) {
        // Ajouter une alerte visuelle
        const timerElement = document.getElementById("game-timer");
        if (timerElement) {
            timerElement.classList.add("danger");
        }
    }
}

// Gère le clic sur une cellule du plateau
function handleCellClick(cellId, cellType) {
    const gameState = getGameState();
    setActiveCard(cellId);

    switch (cellType) {
        case CARD_TYPES.BONUS:
            handleBonusCard();
            break;
        case CARD_TYPES.FACTURE:
            handleFactureCard();
            break;
        case CARD_TYPES.INTERACTION:
            handleInteractionCard();
            break;
        case CARD_TYPES.BIENS:
            handleBiensCard();
            break;
        case CARD_TYPES.PDB:
            handlePDBCard();
            break;
        case CARD_TYPES.REDEVANCE:
            handleRedevanceCard();
            break;
        case CARD_TYPES.VIDEO:
            handleVideoCard();
            break;
    }
}
/**
 * Gère l'affichage et le traitement des cartes Redevance
 */
function handleRedevanceCard() {
    // Montant pour la redevance (bonus)

    const amount = getRandomInt(10,40)


    // Met à jour le texte et le montant dans la modale bonus (réutilisation)
    document.getElementById("bonus-text").textContent = "Redevance annuelle";
    document.getElementById("bonus-amount").textContent = `+${amount} K`;
    document.getElementById("bonus-amount").classList.remove("danger-amount");

    // Affiche une description spécifique pour la redevance
    const descriptionElement = document.getElementById("bonus-description");
    if (descriptionElement) {
        descriptionElement.textContent =
            "Encaissement de la redevance annuelle.";
        descriptionElement.style.display = "block";
    }

    // Affiche la carte bonus avec l'animation de retournement
    showFlipCardModal("bonus");

    // Quand l'utilisateur clique sur continuer, ferme la modale et met à jour le score
    document.getElementById("bonus-continue").onclick = () => {
        closeFlipCardModal("bonus-modal");

        // Ajoute le montant au score de l'équipe
        const gameState = getGameState();
        console.log(
            `Updating redevance card: Adding ${amount} to team ${gameState.activeTeam}`,
        );

        // Log before update
        debugTeamScores();

        updateTeamScore(gameState.activeTeam, amount);

        // **Ajout pour l'historique des tours**
        const activeTeam = gameState.teams[gameState.activeTeam];
        const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
        if (currentPlayer) {
            updatePlayerTurn(
                currentPlayer,
                `Tour: +${amount} K pour Redevance annuelle`,
            );
        }

        updateTeamsDisplay();

        // Log after update to verify
        console.log("After redevance card update:");
        debugTeamScores();
    };
}
    


function handleBonusCard() {
    // Utilise les données des cartes bonus
    const bonusCard = getRandomCard("bonus");
    // Affiche le titre de la carte
    document.getElementById("bonus-text").textContent = bonusCard.title;

    // Gestion des effets spéciaux ou des montants
    if (bonusCard.type === "special") {
        // Pour les cartes à effets spéciaux
        let effectText = "";

        switch (bonusCard.effect) {
            case "increase":
                effectText = `+${bonusCard.value}% sur votre prochaine transaction`;
                break;
            case "no_rent":
                effectText = "Pas de loyer au prochain tour";
                break;
            default:
                effectText = "Effet spécial";
        }

        document.getElementById("bonus-amount").textContent = effectText;
    } else {
        // Pour les cartes avec un montant
        const amount = bonusCard.amount || 0;
        document.getElementById("bonus-amount").textContent = `+${amount} K`;
    }

    // Toujours positif pour un bonus
    document.getElementById("bonus-amount").classList.remove("danger-amount");

    // Affiche la description si disponible
    const descriptionElement = document.getElementById("bonus-description");
    if (descriptionElement) {
        descriptionElement.textContent = bonusCard.description || "";
        descriptionElement.style.display = bonusCard.description
            ? "block"
            : "none";
    }

    // Affiche la carte bonus avec l'animation de retournement
    showFlipCardModal("bonus");

    // Quand l'utilisateur clique sur continuer, ferme la modale et applique l'effet
    document.getElementById("bonus-continue").onclick = () => {
        closeFlipCardModal("bonus-modal");

        const gameState = getGameState();

        // Applique l'effet selon le type de carte
        if (bonusCard.type === "special") {
            // Sauvegarde l'effet spécial pour l'équipe active
            const teamState = gameState.teams[gameState.activeTeam];
            if (!teamState.effects) teamState.effects = [];

            teamState.effects.push({
                type: bonusCard.effect,
                value: bonusCard.value,
                applied: false,
            });

            updateGameState(gameState);
        } else if (bonusCard.amount) {
            // Applique le montant au score
            console.log(
                `Updating bonus card: Adding ${bonusCard.amount} to team ${gameState.activeTeam}`,
            );

            // Log before update
            debugTeamScores();

            updateTeamScore(gameState.activeTeam, bonusCard.amount);

            // **Ajout pour l'historique des tours**
            const activeTeam = gameState.teams[gameState.activeTeam];
            const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
            if (currentPlayer) {
                updatePlayerTurn(
                    currentPlayer,
                    `Tour: +${bonusCard.amount} K pour bonus ${bonusCard.title}`,
                );
            }
            // Log after update to verify
            console.log("After bonus card update:");
            debugTeamScores();
        }

        updateTeamsDisplay();
    };
}

function handleFactureCard() {
    // Utilise les données des cartes de facturation
    const factureCard = getRandomCard("facture");
    const amount = factureCard.amount || getRandomInt(10, 50); // Utilise un montant par défaut si nécessaire

    // Met à jour le texte et le montant dans la modale
    document.getElementById("facture-text").textContent = factureCard.title;
    document.getElementById("facture-amount").textContent = `-${amount} K`;

    // Si il y a une description, l'afficher
    const descriptionElement = document.getElementById("facture-description");
    if (descriptionElement) {
        descriptionElement.textContent = factureCard.description || "";
        descriptionElement.style.display = factureCard.description
            ? "block"
            : "none";
    }

    // Affiche la carte facture avec l'animation de retournement
    showFlipCardModal("facture");

    // Quand l'utilisateur clique sur payer, ferme la modale et met à jour le score
    document.getElementById("facture-continue").onclick = () => {
        closeFlipCardModal("facture-modal");

        // Retire le montant du score de l'équipe
        const gameState = getGameState();
        updateTeamScore(gameState.activeTeam, -amount);
        
        // **Ajout pour l'historique des tours**
        const activeTeam = gameState.teams[gameState.activeTeam];
        const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
        if (currentPlayer) {
            updatePlayerTurn(
                currentPlayer,
                `Tour: -${amount} K pour facture ${factureCard.title}`,
            );
        }
        
        updateTeamsDisplay();
    };
}

/**
 * Gère l'affichage et le traitement des cartes Biens
 */
function handleBiensCard() {
    // Utilise les données des cartes biens
    const biensCard = getRandomCard("biens");
    
    console.log("Carte de biens récupérée:", biensCard);
    
    // Met à jour le texte dans la modale
    document.getElementById("biens-text").textContent = biensCard.title;
    document.getElementById("biens-amount").textContent =
        `+${biensCard.value} K`;

    // Affiche la description si disponible
    const descriptionElement = document.getElementById("biens-description");
    if (descriptionElement) {
        descriptionElement.textContent = biensCard.description || "";
        descriptionElement.style.display = biensCard.description
            ? "block"
            : "none";
    }

    // Affiche la carte biens avec l'animation de retournement
    showFlipCardModal("biens");

    // Quand l'utilisateur clique sur encaisser, ferme la modale et met à jour le score
    document.getElementById("biens-continue").onclick = () => {
        console.log("Bouton Encaisser cliqué pour la carte:", biensCard);
        closeFlipCardModal("biens-modal");

        // Ajoute la valeur du bien au score de l'équipe
        const gameState = getGameState();

        console.log(
            `Updating biens card: Adding ${biensCard.value} to team ${gameState.activeTeam}`,
        );
        console.log("État avant mise à jour:", gameState.teams[gameState.activeTeam]);

        // Log before update
        debugTeamScores();

        updateTeamScore(gameState.activeTeam, biensCard.value);

        // Log after update to verify
        console.log("After biens card update:");
        debugTeamScores();
        
        // Vérification de l'état après la mise à jour
        const updatedGameState = getGameState();
        console.log("État après mise à jour:", updatedGameState.teams[updatedGameState.activeTeam]);
        
        // **Ajout pour l'historique des tours**
        const activeTeam = updatedGameState.teams[updatedGameState.activeTeam];
        const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
        if (currentPlayer) {
            updatePlayerTurn(
                currentPlayer,
                `Tour: +${biensCard.value} K pour bien ${biensCard.title}`,
            );
        }
        
        // Ajoute le bien à la liste des biens de l'équipe
        if (!updatedGameState.teams[updatedGameState.activeTeam].properties) {
            updatedGameState.teams[updatedGameState.activeTeam].properties = [];
        }

        updatedGameState.teams[updatedGameState.activeTeam].properties.push({
            id: biensCard.id,
            title: biensCard.title,
            description: biensCard.description,
            value: biensCard.value,
        });

        updateGameState(updatedGameState);
        
        console.log("Appel de updateTeamsDisplay()");
        updateTeamsDisplay();
        
        console.log("Fin de la gestion de la carte de biens");
    };
}

function handleInteractionCard() {
    // Utilise les données des cartes d'interaction
    const interactionCard = getRandomCard("interaction");
    
    // Configurer le contenu du modal de la carte d'interaction
    document.getElementById("interaction-title").textContent =
        interactionCard.title || "Interaction";
    document.getElementById("interaction-description").textContent =
        interactionCard.description || "";

    // Vérifier si c'est une carte quiz
    if (interactionCard.type === "quiz") {
        // Afficher la zone quiz et masquer les autres éléments
        document.getElementById("quiz-container").style.display = "block";
        document.getElementById("interaction-teams").style.display = "none";
        document.getElementById("interaction-skip").style.display = "none";
        
        // Créer les boutons de réponse
        const quizAnswersContainer = document.getElementById("quiz-answers");
        quizAnswersContainer.innerHTML = "";
        
        interactionCard.answers.forEach((answer, index) => {
            const answerButton = document.createElement("div");
            answerButton.className = "quiz-answer";
            answerButton.textContent = answer.text;
            answerButton.onclick = (event) => handleQuizAnswer(answer.correct, interactionCard, event.target);
            quizAnswersContainer.appendChild(answerButton);
        });
    } else {
        // Masquer la zone quiz pour les autres types de cartes
        document.getElementById("quiz-container").style.display = "none";
        document.getElementById("interaction-teams").style.display = "block";
        document.getElementById("interaction-skip").style.display = "block";
    }

    // Afficher le modal sous forme de carte qui se retourne
    showFlipCardModal("interaction");

    // Variable pour stocker la carte pour utilisation après le flip
    const gameState = getGameState();
    gameState.currentInteractionCard = interactionCard;
    updateGameState(gameState);
    
    // Configuration du bouton "Passer" pour l'interaction (seulement pour les cartes non-quiz)
    if (interactionCard.type !== "quiz") {
        document.getElementById("interaction-skip").onclick = () => {
            closeFlipCardModal("interaction-modal");

            // Affiche d'abord la vidéo si nécessaire
            // showVideoModal("00:15");

            // Après la vidéo, traite la carte d'interaction
            document.getElementById("skip-video").onclick = () => {
                toggleModal("video-modal", false);

                // Récupère la carte d'interaction actuelle
                const currentState = getGameState();
                const card = currentState.currentInteractionCard;

                console.log("Card type:", card.type, "Card title:", card.title);

                // Détermine le type de traitement selon la carte
                if (card.type === "team_effect") {
                    console.log("Processing as team_effect card");
                    // Cartes qui permettent de choisir une équipe cible
                    handleTeamEffectInteraction(card, currentState);
                } else if (card.type === "cost" || card.type === "bonus" || !card.type) {
                    console.log("Processing as direct effect card");
                    // Cartes qui affectent directement l'équipe qui joue (pas de choix d'équipe)
                    handleDirectEffectInteraction(card, currentState);
                } else {
                    console.log("Processing as unknown type, using direct effect");
                    // Type inconnu, traitement par défaut
                    handleDirectEffectInteraction(card, currentState);
                }
                    // Réinitialise le sélecteur d'équipes
                    const interactionTeamsContainer =
                        document.getElementById("interaction-teams");
                    interactionTeamsContainer.innerHTML = "";

                    // Récupère la liste de toutes les équipes actives (y compris celle qui joue)
                    console.log("Active team ID:", currentState.activeTeam, "Type:", typeof currentState.activeTeam);
                    console.log("All teams:", Object.entries(currentState.teams).map(([id, team]) => ({ id, name: team.name, active: team.active })));
                    
                    const activeTeams = Object.entries(currentState.teams).filter(
                        ([id, team]) => {
                            const isActive = team.active;
                            console.log(`Team ${id}: active=${isActive}`);
                            return isActive;
                        }
                    );
                    
                    console.log("All active teams (including current):", activeTeams.map(([id, team]) => ({ id, name: team.name })));

                // S'il y a d'autres équipes actives, affiche les options
                if (activeTeams.length > 0) {
                    activeTeams.forEach(([id, team]) => {
                        const teamOption = document.createElement("div");
                        teamOption.className = `team-option team${id}-bg`;
                        
                        // Ajouter une indication si c'est l'équipe courante
                        if (parseInt(id) === currentState.activeTeam) {
                            teamOption.textContent = `${team.name} (Vous)`;
                            teamOption.classList.add("current-team");
                        } else {
                            teamOption.textContent = team.name;
                        }
                        
                        teamOption.dataset.teamId = id;
                        teamOption.dataset.effect = card.effect;
                        teamOption.dataset.value = card.value;
                        teamOption.onclick = () =>
                            handleTeamInteraction(
                                parseInt(id),
                                card.effect,
                                card.value,
                            );
                        interactionTeamsContainer.appendChild(teamOption);
                    });

                    // Affiche la modale de sélection d'équipe
                    toggleModal("team-selection-modal", true);

                    // Option pour passer
                    document.getElementById("interaction-skip").onclick =
                        () => {
                            toggleModal("team-selection-modal", false);

                            // Bonus par défaut si la carte a un montant
                            if (card.amount) {
                                console.log(
                                    `Updating interaction skip: Adding ${card.amount} to team ${currentState.activeTeam}`,
                                );

                                // Log before update
                                debugTeamScores();

                                updateTeamScore(
                                    currentState.activeTeam,
                                    card.amount,
                                );
                                // **Ajout pour l'historique des tours**
                                const activeTeam =
                                    gameState.teams[gameState.activeTeam];
                                const currentPlayer =
                                    activeTeam.players[
                                        activeTeam.currentPlayer
                                    ];
                                if (currentPlayer) {
                                    updatePlayerTurn(
                                        currentPlayer,
                                        `Tour: +${card.amount} K pour Interaction ${card.title}`,
                                    );
                                }
                                // Log after update to verify
                                console.log("After interaction skip update:");
                                debugTeamScores();
                            } else {
                                // Bonus par défaut si pas de montant spécifié
                                const defaultBonus = 50;

                                console.log(
                                    `Updating interaction skip: Adding default ${defaultBonus} to team ${currentState.activeTeam}`,
                                );

                                // Log before update
                                debugTeamScores();

                                updateTeamScore(
                                    currentState.activeTeam,
                                    defaultBonus,
                                );

                                // **Ajout pour l'historique des tours**
                                const activeTeam2 =
                                    currentState.teams[currentState.activeTeam];
                                const currentPlayer2 =
                                    activeTeam2.players[
                                        activeTeam2.currentPlayer
                                    ];
                                if (currentPlayer2) {
                                    updatePlayerTurn(
                                        currentPlayer2,
                                        `Tour: +${defaultBonus} K pour Interaction (bonus par défaut)`,
                                    );
                                }

                                // Log after update to verify
                                console.log("After interaction skip update:");
                                debugTeamScores();
                            }

                            updateTeamsDisplay();
                        };
                } else {
                    // S'il n'y a pas d'autres équipes actives, donne un bonus direct

                    const amount = card.amount || getRandomInt(1, 3) * 50;

                    // Met à jour le texte et le montant dans la modale bonus
                    document.getElementById("bonus-text").textContent = card.title || "Bonus";

                    const amountEl = document.getElementById("bonus-amount");
                    const a = Number(amount) || 0;
                    const sign = a < 0 ? "-" : a > 0 ? "+" : "";
                    amountEl.textContent = `${sign}${Math.abs(a)} K`;

                    // Toggle des classes selon le signe (évite le inline style)
                    amountEl.classList.toggle("danger-amount", a < 0);
                    amountEl.classList.toggle("success-amount", a > 0);
                    // Nettoie un éventuel style inline résiduel
                    amountEl.style.removeProperty("color");

                    // Description
                    const bonusDescElement = document.getElementById("bonus-description");
                    if (bonusDescElement) {
                    const hasDesc = !!card.description;
                    bonusDescElement.textContent = hasDesc ? card.description : "";
                    bonusDescElement.style.display = hasDesc ? "block" : "none";
                    }

                    // Affiche la modale bonus avec l'animation de retournement
                    showFlipCardModal("bonus");

                    // Quand l'utilisateur clique sur continuer, ferme la modale et met à jour le score
                    document.getElementById("bonus-continue").onclick = () => {
                        closeFlipCardModal("bonus-modal");

                        // Ajoute le montant au score de l'équipe
                        updateTeamScore(currentState.activeTeam, amount);
                        
                        // **Ajout pour l'historique des tours**
                        const activeTeam = currentState.teams[currentState.activeTeam];
                        const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
                        if (currentPlayer) {
                            updatePlayerTurn(
                                currentPlayer,
                                `Tour: +${amount} K pour Interaction ${card.title}`,
                            );
                        }
                        
                        updateTeamsDisplay();
                    };
                }
            };
        };
    }
}

/**
 * Gère la réponse à une question quiz
 */
function handleQuizAnswer(isCorrect, card, clickedButton) {
    const gameState = getGameState();
    
    // Désactiver tous les boutons de réponse
    const answerButtons = document.querySelectorAll('.quiz-answer');
    answerButtons.forEach(button => {
        button.classList.add('disabled');
    });
    
    // Marquer visuellement la bonne/mauvaise réponse
    answerButtons.forEach(button => {
        const buttonAnswer = card.answers.find(a => a.text === button.textContent);
        if (buttonAnswer && buttonAnswer.correct) {
            button.classList.add('correct');
        } else if (button === clickedButton && !isCorrect) {
            button.classList.add('wrong');
        }
    });
    
    // Attendre un peu pour que l'utilisateur voie le résultat
    setTimeout(() => {
        closeFlipCardModal("interaction-modal");
        
        // Calculer le bonus/malus
        const amount = isCorrect ? card.correctReward : -card.wrongPenalty;
        const resultText = isCorrect ? "Bonne réponse !" : "Mauvaise réponse...";
        
        // Mettre à jour le score
        updateTeamScore(gameState.activeTeam, amount);
        
        // Ajouter à l'historique
        const activeTeam = gameState.teams[gameState.activeTeam];
        const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
        if (currentPlayer) {
            updatePlayerTurn(
                currentPlayer,
                `Tour: ${amount > 0 ? '+' : ''}${amount} K pour Quiz "${card.title}" - ${resultText}`,
            );
        }
        
        // Afficher le résultat dans la modale bonus/malus
               // Afficher le résultat
 if (isCorrect) {
    showNotification(`${resultText} +${card.correctReward} K`, true); // Passer true pour indiquer que c'est correct
} else {
    showNotification(`${resultText} -${card.wrongPenalty} K`, false); // Passer false pour indiquer que ce n'est pas correct
}
        
        updateTeamsDisplay(); 
    }, 1500); // Attendre 1.5 secondes pour voir le résultat
}

/**
 * Gère les cartes d'interaction qui affectent d'autres équipes
 */
function handleTeamEffectInteraction(card, currentState) {
    const interactionTeamsContainer = document.getElementById("interaction-teams");
    interactionTeamsContainer.innerHTML = "";

    console.log("handleTeamEffectInteraction - Active team ID:", currentState.activeTeam, "Type:", typeof currentState.activeTeam);
    console.log("handleTeamEffectInteraction - All teams:", Object.entries(currentState.teams).map(([id, team]) => ({ id, name: team.name, active: team.active })));

    // Récupère toutes les équipes actives (y compris l'équipe courante)
    const activeTeams = Object.entries(currentState.teams).filter(
        ([id, team]) => {
            const isActive = team.active;
            console.log(`handleTeamEffectInteraction - Team ${id}: active=${isActive}`);
            return isActive;
        }
    );
    
    console.log("handleTeamEffectInteraction - All active teams (including current):", activeTeams.map(([id, team]) => ({ id, name: team.name })));

    if (activeTeams.length > 0) {
        activeTeams.forEach(([id, team]) => {
            const teamOption = document.createElement("div");
            teamOption.className = `team-option team${id}-bg`;
            
            // Ajouter une indication si c'est l'équipe courante
            if (parseInt(id) === currentState.activeTeam) {
                teamOption.textContent = `${team.name} (Vous)`;
                teamOption.classList.add("current-team");
            } else {
                teamOption.textContent = team.name;
            }
            
            teamOption.onclick = () =>
                handleTeamInteraction(parseInt(id), card.effect, card.value);
            interactionTeamsContainer.appendChild(teamOption);
        });

        toggleModal("team-selection-modal", true);
    } else {
        handleDirectEffectInteraction(card, currentState);
    }
}

/**
 * Gère les cartes d'interaction qui affectent directement l'équipe courante
 */
function handleDirectEffectInteraction(card, currentState) {
    let amount;
    let isNegative = false;
    
    // Déterminer le montant selon le type de carte
    if (card.type === "cost") {
        // Pour les cartes de coût, c'est un malus
        amount = card.minAmount ? getRandomInt(card.minAmount, card.maxAmount) : (card.amount || getRandomInt(20, 50));
        isNegative = true;
    } else {
        // Pour les autres cartes, c'est un bonus
        amount = card.amount || getRandomInt(1, 3) * 25;
        isNegative = false;
    }

    // Configurer l'affichage selon le type
    if (isNegative) {
        document.getElementById("bonus-text").textContent = card.title || "Malus";
        document.getElementById("bonus-amount").textContent = `-${amount} K`;
        document.getElementById("bonus-amount").classList.add("danger-amount");
    } else {
        document.getElementById("bonus-text").textContent = card.title || "Bonus";
        document.getElementById("bonus-amount").textContent = `+${amount} K`;
        document.getElementById("bonus-amount").classList.remove("danger-amount");
    }

    const bonusDescElement = document.getElementById("bonus-description");
    if (bonusDescElement) {
        bonusDescElement.textContent = card.description || "";
        bonusDescElement.style.display = card.description ? "block" : "none";
    }

    showFlipCardModal("bonus");

    document.getElementById("bonus-continue").onclick = () => {
        closeFlipCardModal("bonus-modal");
        
        // Appliquer le montant (positif ou négatif)
        const finalAmount = isNegative ? -amount : amount;
        updateTeamScore(currentState.activeTeam, finalAmount);
        
        const activeTeam = currentState.teams[currentState.activeTeam];
        const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
        if (currentPlayer) {
            updatePlayerTurn(
                currentPlayer,
                `Tour: ${finalAmount > 0 ? '+' : ''}${finalAmount} K pour ${card.title}`,
            );
        }
        
        updateTeamsDisplay();
    };
}

/**
 * Gère l'interaction entre équipes (applique un effet à une équipe cible)
 */
function handleTeamInteraction(targetTeamId, effect, value) {
    const gameState = getGameState();
    
    console.log(`Applying team interaction: ${effect} ${value} to team ${targetTeamId}`);
    
    // Fermer la modale de sélection d'équipe
    toggleModal("team-selection-modal", false);
    
    // Appliquer l'effet selon le type
    if (effect === "bonus") {
        // Donner un bonus à l'équipe cible
        updateTeamScore(targetTeamId, value);
        
        // Ajouter à l'historique de l'équipe active (qui a joué la carte)
        const activeTeam = gameState.teams[gameState.activeTeam];
        const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
        if (currentPlayer) {
            updatePlayerTurn(
                currentPlayer,
                `Tour: Bonus +${value} K donné à ${gameState.teams[targetTeamId].name}`,
            );
        }
        
        showNotification(`Bonus de +${value} K donné à ${gameState.teams[targetTeamId].name} !`);
        
    } else if (effect === "malus") {
        // Donner un malus à l'équipe cible
        updateTeamScore(targetTeamId, -value);
        
        // Ajouter à l'historique de l'équipe active
        const activeTeam = gameState.teams[gameState.activeTeam];
        const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
        if (currentPlayer) {
            updatePlayerTurn(
                currentPlayer,
                `Tour: Malus -${value} K infligé à ${gameState.teams[targetTeamId].name}`,
            );
        }
        
        showNotification(`Malus de -${value} K infligé à ${gameState.teams[targetTeamId].name} !`);
        
    } else {
        // Effet par défaut - bonus
        updateTeamScore(targetTeamId, value || 25);
        
        const activeTeam = gameState.teams[gameState.activeTeam];
        const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
        if (currentPlayer) {
            updatePlayerTurn(
                currentPlayer,
                `Tour: Effet appliqué à ${gameState.teams[targetTeamId].name}`,
            );
        }
        
        showNotification(`Effet appliqué à ${gameState.teams[targetTeamId].name} !`);
    }
    
    // Mettre à jour l'affichage
    updateTeamsDisplay();
}

// Fonction pour déboguer les scores des équipes
function debugTeamScores() {
    const gameState = getGameState();
    console.log("=== CURRENT TEAM SCORES ===");

    Object.entries(gameState.teams).forEach(([teamId, team]) => {
        if (team.active) {
            console.log(`Team ${teamId} (${team.name}): Score = ${team.score}`);
        }
    });

    console.log("==========================");
}

// Appel automatique au démarrage pour vérifier l'état initial
document.addEventListener("DOMContentLoaded", function () {
    // Ajout d'un délai pour s'assurer que le jeu soit initialisé
    setTimeout(debugTeamScores, 1000);
});

/**
 * Gère l'affichage et le traitement des cartes PDB (Pas de Bol)
 */
function handlePDBCard() {
    // Utilise les données des cartes PDB
    const pdbCard = getRandomCard("pdb");
    const amount = getRandomInt(pdbCard.minAmount, pdbCard.maxAmount);

    // Configure le contenu du modal de la carte PDB
    document.getElementById("pdb-text").textContent = pdbCard.title;
    document.getElementById("pdb-amount").textContent = `-${amount} K`;
    document.getElementById("pdb-description").textContent = pdbCard.description;

    // Affiche la modale PDB avec l'animation de retournement
    showFlipCardModal("pdb");

    // Quand l'utilisateur clique sur continuer, ferme la modale et met à jour le score
    document.getElementById("pdb-continue").onclick = () => {
        closeFlipCardModal("pdb-modal");

        // Soustrait le montant du score de l'équipe
        const gameState = getGameState();
        updateTeamScore(gameState.activeTeam, -amount);

        // Ajouter à l'historique des tours
        const activeTeam = gameState.teams[gameState.activeTeam];
        const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
        if (currentPlayer) {
            updatePlayerTurn(
                currentPlayer,
                `Tour: -${amount} K pour PDB "${pdbCard.title}"`,
            );
        }

        updateTeamsDisplay();
    };
}

/**
 * Affiche une notification temporaire à l'utilisateur
 */
function showNotification(message, isCorrect = false, duration = 3000) {
    // Créer l'élément de notification s'il n'existe pas
    let notification = document.getElementById('game-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'game-notification';
        notification.className = 'game-notification';
        document.body.appendChild(notification);
    }

    // Afficher le message
    notification.textContent = message;

    // Ajouter la classe pour le fond vert si la réponse est correcte
    if (isCorrect) {
        notification.classList.add('bg-correct');
        notification.classList.remove('bg-wrong'); // Assurez-vous de retirer la classe bg-wrong
    } else {
        notification.classList.add('bg-wrong');
        notification.classList.remove('bg-correct'); // Assurez-vous de retirer la classe bg-correct
    }

    notification.classList.add('show');

    // Masquer après la durée spécifiée
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.remove('bg-correct');
        notification.classList.remove('bg-wrong');
    }, duration);
}

/**
 * Gère l'affichage et le traitement des cartes Vidéo
 */
function handleVideoCard() {
    // Vérifier s'il reste des vidéos non vues
    if (!hasUnwatchedVideos()) {


        // Toutes les vidéos ont été vues, donner un bonus par défaut
        showNotification("Toutes les vidéos ont déjà été visionnées ! Bonus automatique.");
        
        const gameState = getGameState();
        const bonusAmount = 100;
        updateTeamScore(gameState.activeTeam, bonusAmount);
        
        const activeTeam = gameState.teams[gameState.activeTeam];
        const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
        if (currentPlayer) {
            updatePlayerTurn(
                currentPlayer,
                `Tour: +${bonusAmount} K (toutes les vidéos vues)`,
            );
        }
        
        updateTeamsDisplay();
        return;
    }

    // Obtenir une vidéo aléatoire non vue
    const video = getRandomUnwatchedVideo();
            video.autoplay

    if (!video) {
        console.error("Aucune vidéo disponible");
        return;
    }

    // Arrêter le son d'ambiance s'il est en cours
    if (dicelandBG) {
        dicelandBG.pause();
        dicelandBG.currentTime = 0;
    }
    if (landSound) {
        landSound.pause();
        landSound.currentTime = 0;
    }
    // Marquer la vidéo comme vue
    markVideoAsWatched(video.id);

    // Configurer et afficher la modale vidéo
    document.getElementById("video-title").textContent = video.title;
    document.getElementById("video-description").textContent = video.description;
    
    // Configurer le lecteur vidéo
    const videoPlayer = document.getElementById("main-video-player");
    videoPlayer.src = `assets/${video.filename}`;

    // Cacher la section questions au début
    document.getElementById("video-questions-section").style.display = "none";
    // Afficher la modale
    toggleModal("video-quiz-modal", true);
    
    // Stocker les données de la vidéo pour les questions
    window.currentVideoData = video;
    
    // Écouter la fin de la vidéo
    videoPlayer.onended = () => {
        showVideoQuestions(video);
        // Redémarrer le son d'ambiance si nécessaire
        dicelandBGSound();  

    };
       // Redémarrer le son si on skip la vidéo
    document.getElementById("skip-video").addEventListener("click", () => {
    if (dicelandBG) dicelandBGGSound();
    }); 
    // Permettre de passer la vidéo (pour les tests)
    videoPlayer.onclick = () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }
    };
    // Essayer de lancer la vidéo automatiquement
videoPlayer.play().catch(error => {
    console.error("Erreur lors du lancement automatique de la vidéo:", error);
});
}

/**
 * Affiche les questions après la fin d'une vidéo
 */
function showVideoQuestions(video) {
    if (!video.questions || video.questions.length === 0) {
        // Pas de questions, donner un bonus automatique
        showNotification("Vidéo visionnée ! Bonus automatique.");
        const gameState = getGameState();
        updateTeamScore(gameState.activeTeam, 50);
        toggleModal("video-quiz-modal", false);
        updateTeamsDisplay();
        return;
    }

    // Choisir une question aléatoire
    const randomQuestion = video.questions[Math.floor(Math.random() * video.questions.length)];
    
    // Afficher la section questions
    document.getElementById("video-questions-section").style.display = "block";
    document.getElementById("video-question-text").textContent = randomQuestion.question;
    
    // Créer les boutons de réponse
    const answersContainer = document.getElementById("video-quiz-answers");
    answersContainer.innerHTML = "";
    
    randomQuestion.answers.forEach((answer, index) => {
        const answerButton = document.createElement("div");
        answerButton.className = "quiz-answer";
        answerButton.textContent = answer.text;
        answerButton.onclick = (event) => handleVideoQuizAnswer(
            answer.correct, 
            randomQuestion, 
            event.target
        );
        answersContainer.appendChild(answerButton);
    });
    
    // Faire défiler vers les questions
    document.getElementById("video-questions-section").scrollIntoView({
        behavior: 'smooth'
    });
}

/**
 * Gère la réponse à une question vidéo
 */
function handleVideoQuizAnswer(isCorrect, question, clickedButton) {
    const gameState = getGameState();
    
    // Désactiver tous les boutons de réponse
    const answerButtons = document.querySelectorAll('#video-quiz-answers .quiz-answer');
    answerButtons.forEach(button => {
        button.classList.add('disabled');
    });
    
    // Marquer visuellement la bonne/mauvaise réponse
    answerButtons.forEach(button => {
        const buttonAnswer = question.answers.find(a => a.text === button.textContent);
        if (buttonAnswer && buttonAnswer.correct) {
            button.classList.add('correct');
        } else if (button === clickedButton && !isCorrect) {
            button.classList.add('wrong');
        }
    });
    
    // Attendre un peu pour que l'utilisateur voie le résultat
    setTimeout(() => {
        toggleModal("video-quiz-modal", false);
        
        // Calculer le bonus/malus
        const amount = isCorrect ? question.correctReward : -question.wrongPenalty;
        const resultText = isCorrect ? "Bonne réponse !" : "Mauvaise réponse...";
        
        // Mettre à jour le score
        updateTeamScore(gameState.activeTeam, amount);
        
        // Ajouter à l'historique
        const activeTeam = gameState.teams[gameState.activeTeam];
        const currentPlayer = activeTeam.players[activeTeam.currentPlayer];
        if (currentPlayer) {
            updatePlayerTurn(
                currentPlayer,
                `Tour: ${amount > 0 ? '+' : ''}${amount} K pour Vidéo Quiz - ${resultText}`,
            );
        }
        
        // Afficher le résultat
if (isCorrect) {
    showNotification(`${resultText} +${question.correctReward} K`, true); // Passer true pour indiquer que c'est correct
} else {
    showNotification(`${resultText} -${question.wrongPenalty} K`, false); // Passer false pour indiquer que ce n'est pas correct
}
        
        updateTeamsDisplay();
    }, 2000); // Attendre 2 secondes pour voir le résultat
}

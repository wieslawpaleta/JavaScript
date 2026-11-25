// GESTION DU THEME SOMBRE / CLAIR
// Fonction pour appliquer le thème (clair ou sombre) et mettre à jour l'icône du bouton (Funkcja stosująca motyw (jasny lub ciemny) i aktualizująca ikonę przycisku)
function appliquerTheme(estClair) {
    // Récupération du bouton de thème dans le HTML (Pobranie przycisku motywu z HTML)
    const boutonTheme = document.getElementById("btn-theme");

    // Si le mode clair est activé (Jeśli włączony jest tryb jasny)
    if (estClair) {
        // Ajout de la classe "light-them" sur <body>
        document.body.classList.add("light-theme");
        // Changement de l'icone en lune pour proposer de repasser en mode sombre
        if (boutonTheme) boutonTheme.
    }
}
// ÉTAT DU SON (ACTIF OU COUPÉ)
// Variable booléenne : false = son activé, true = son coupé (Zmienna logiczna: false = dźwięk włączony, true = dźwięk wyciszony)
let sonCoupe = false;

// GESTION DES SONS AVEC WEB AUDIO API 
// Création d'un contexte audio global pour générer des sons sans fichiers externes (Utworzenie globalnego kontekstu audio do generowania dźwięków bez zewnętrznych plików)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Fonction générique pour jouer un son synthétique (Uniwersalna funkcja do odtwarzania dźwięku syntetycznego)
function jouerSon(frequence, typeOnde, duree) {
    // Si le son est coupé, on arrête immédiatement la fonction (Jeśli dźwięk jest wyciszony, natychmiast przerywamy funkcję)
    if (sonCoupe) return;

    // Vérification si le contexte audio est suspendu (par sécurité du navigateur) (Sprawdzenie, czy kontekst audio jest w stanie wstrzymania (ze względów bezpieczeństwa przeglądarki))
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    // Création d'un oscillateur pour générer la fréquence sonore (Utworzenie oscylatora do generowania częstotliwości dźwięku)
    const oscillateur = audioCtx.createOscillator();
    // Création d'un nœud de gain pour contrôler le volume (Utworzenie węzła wzmocnienia do kontrolowania głośności)
    const gainNode = audioCtx.createGain();

    // Définition du type d'onde sonore (ex: 'sine' pour doux, 'square' pour rétro) (Definiowanie typu fali dźwiękowej (np. 'sine' dla miękkiego, 'square' dla retro))
    oscillateur.type = typeOnde;
    // Définition de la fréquence en Hertz (hauteur de la note) (Definiowanie częstotliwości w hercach (wysokość nuty))
    oscillateur.frequency.setValueAtTime(frequence, audioCtx.currentTime);

    // Configuration de la baisse progressive du volume pour éviter les grésillements (Konfiguracja stopniowego spadku głośności, aby uniknąć trzasków)
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duree);

    // Connexion de l'oscillateur au contrôle de volume, puis aux haut-parleurs (Podłączenie oscylatora do kontroli głośności, a następnie do głośników)
    oscillateur.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Démarrage du son (Uruchomienie dźwięku)
    oscillateur.start();
    // Arrêt automatique du son après la durée spécifiée (Automatyczne zatrzymanie dźwięku po określonym czasie)
    oscillateur.stop(audioCtx.currentTime + duree);
}

// Fonctions spécifiques pour chaque type d'effet sonore (Specyficzne funkcje dla każdego typu efektu dźwiękowego)
function sonTaper() {
    jouerSon(440, 'sine', 0.08); // Note La (A4), courte et douce (Nuta A4, krótka i łagodna)
}

function sonEffacer() {
    jouerSon(220, 'sine', 0.08); // Note plus grave (Niższa nuta)
}

function sonErreur() {
    jouerSon(150, 'sawtooth', 0.15); // Bourdonnement grave (Niskie buczenie)
}

function sonVictoire() {
    // Séquence de notes joyeuses (Sekwencja radosnych nut)
    setTimeout(() => jouerSon(523.25, 'sine', 0.1), 0);   // Do (C5)
    setTimeout(() => jouerSon(659.25, 'sine', 0.1), 100); // Mi (E5)
    setTimeout(() => jouerSon(783.99, 'sine', 0.2), 200); // Sol (G5)
}

function sonDefaite() {
    // Séquence de notes tristes / descendantes (Sekwencja smutnych / opadających nut)
    setTimeout(() => jouerSon(300, 'triangle', 0.15), 0);
    setTimeout(() => jouerSon(250, 'triangle', 0.15), 150);
    setTimeout(() => jouerSon(200, 'triangle', 0.3), 300);
}

// Fonction pour basculer entre son activé et son coupé (Funkcja przełączająca między dźwiękiem włączonym a wyciszonym)
function basculerSon() {
    // Inversion de la valeur booléenne : true devient false, et false devient true (Odwrócenie wartości logicznej: true staje się false, a false staje się true)
    sonCoupe = !sonCoupe;

    // Récupération du bouton son dans le HTML (Pobranie przycisku dźwięku z HTML)
    const boutonSon = document.getElementById("btn-son");

    // Mise à jour de l'icône selon l'état du son (Aktualizacja ikony w zależności od stanu dźwięku)
    if (sonCoupe) {
        boutonSon.textContent = "🔇";
        afficherToast("Son coupé (Dźwięk wyciszony)");
    } else {
        boutonSon.textContent = "🔊";
        afficherToast("Son activé (Dźwięk włączony)");
        // Petit son de confirmation quand on réactive le son (Krótki dźwięk potwierdzający ponowne włączenie dźwięku)
        sonTaper();
    }
}
// --------------------------------------------------------

// Dictionnaire des définitions et étymologies (Słownik definicji i etymologii)
const DICTIONNAIRE_INFOS = {
    "DOMUS": {
        definition: "Maison, foyer, demeure familiale. (Dom, ognisko domowe, siedziba rodzinna.)",
        etymologie: "Mot indo-européen très ancien signifiant bâtir/habiter. (Bardzo stary słowo indoeuropejskie oznaczające budowanie/zamieszkiwanie.)"
    },
    "EQUUS": {
        definition: "Cheval, monture. (Koń, wierzchowiec.)",
        etymologie: "Du proto-indo-européen *h₁ekwos* (le rapide). (Z protoindoeuropejskiego *h₁ekwos* (szybki).)"
    },
    "NUBES": {
        definition: "Nuage, nuée, obscurité. (Chmura, obłok, ciemność.)",
        etymologie: "Lié au verbe nubere (voiler, se marier). (Powiązane z czasownikiem nubere (zasłaniać, brać ślub).)"
    },
    "ARBOR": {
        definition: "Arbre, mât, gibet. (Drzewo, maszt, szubienica.)",
        etymologie: "Origine incertaine en latin classique, désignant la structure ligneuse. (Niepewne pochodzenie w klasycznej łacinie, oznaczające strukturę drzewiastą.)"
    },
    "IGNIS": {
        definition: "Feu, flamme, passion. (Ogień, płomień, pasja.)",
        etymologie: "Apparenté au sanskrit *agni* (dieu du feu). (Pokrewne z sanskryckim *agni* (bóg ognia).)"
    },
    "TERRA": {
        definition: "Terre, sol, pays, territoire. (Ziemia, gleba, kraj, terytorium.)",
        etymologie: "Racine liée au fait de sécher ou d'être sec par rapport à la mer. (Rdzeń powiązany z wysychaniem lub byciem suchym w stosunku do morza.)"
    },
    "VERUM": {
        definition: "Le vrai, la vérité, réel. (Prawda, prawdziwość, rzeczywisty.)",
        etymologie: "Issu d'une racine indo-européenne signifiant 'confiance' ou 'fidélité'. (Pochodzi z indoeuropejskiego rdzenia oznaczającego 'zaufanie' lub 'lojalność'.)"
    }
};

// Tableau des mots secrets (Tablica tajnych słów)
const MOTS_SECRETS = ["DOMUS", "EQUUS", "NUBES", "ARBOR", "IGNIS", "TERRA", "VERUM"];

// Tableau élargi des mots valides (Rozszerzona tablica poprawnych słów)
const MOTS_VALIDES = ["DOMUS", "EQUUS", "NUBES", "ARBOR", "IGNIS", "TERRA", "VERUM", "ROSAE", "PUERI", "MAGNA", "BONUS", "NOVUS", "PATER", "MATER", "SOROR", "CAUSA"];

// Sélection aléatoire d'un mot secret (Losowy wybór tajnego słowa)
const motSecret = MOTS_SECRETS[Math.floor(Math.random() * MOTS_SECRETS.length)];

// Définition du nombre maximum d'essais autorisés (Definiowanie maksymalnej dozwolonej liczby prób)
const ESSAIS_MAX = 6;

// Définition de la longueur obligatoire de chaque mot (Definiowanie obowiązkowej długości każdego słowa)
const LONGUEUR_MOT = 5;

// Variable pour suivre la ligne actuelle (Zmienna śledząca aktualny wiersz)
let essaiActuel = 0;

// Variable pour suivre la lettre actuelle (Zmienna śledząca aktualną literę)
let lettreActuelle = 0;

// Création d'une grille vide sous forme de matrice 2D (Tworzenie pustej siatki w formie macierzy 2D)
let grilleMots = Array(ESSAIS_MAX).fill("").map(() => Array(LONGUEUR_MOT).fill(""));

// Variable booléenne pour bloquer le jeu (Zmienna logiczna do zablokowania gry)
let jeuFini = false;

// Fonction pour afficher un toast animé (Funkcja wyświetlająca animowany toast)
function afficherToast(message) {
    const conteneurToast = document.getElementById("toast-container");
    const toastElement = document.createElement("div");
    toastElement.className = "toast";
    toastElement.textContent = message;
    conteneurToast.appendChild(toastElement);
    
    setTimeout(() => {
        toastElement.remove();
    }, 2000);
}

// Fonction pour récupérer les statistiques (Funkcja pobierająca statystyki)
function chargerStatistiques() {
    const statsEnregistrees = localStorage.getItem("wordle_latin_stats");
    if (statsEnregistrees) {
        return JSON.parse(statsEnregistrees);
    } else {
        return {
            partiesJouees: 0,
            partiesGagnees: 0,
            serieActuelle: 0,
            meilleureSerie: 0
        };
    }
}

// Fonction pour sauvegarder les statistiques (Funkcja do zapisywania statystyk)
function sauvegarderStatistiques(stats) {
    localStorage.setItem("wordle_latin_stats", JSON.stringify(stats));
}

// Fonction pour mettre à jour les statistiques (Funkcja aktualizująca statystyki)
function mettreAJourStatistiques(victoire) {
    let stats = chargerStatistiques();
    stats.partiesJouees++;

    if (victoire) {
        stats.partiesGagnees++;
        stats.serieActuelle++;
        if (stats.serieActuelle > stats.meilleureSerie) {
            stats.meilleureSerie = stats.serieActuelle;
        }
    } else {
        stats.serieActuelle = 0;
    }

    sauvegarderStatistiques(stats);
    afficherFenetreStats(stats, victoire);
}

// Fonction pour afficher la modale de fin de partie (Funkcja wyświetlająca modal końca gry)
function afficherFenetreStats(stats, victoire) {
    const pourcentageVictoires = stats.partiesJouees > 0 
        ? Math.round((stats.partiesGagnees / stats.partiesJouees) * 100) 
        : 0;

    const titreMotElement = document.getElementById("info-mot-titre");
    const definitionElement = document.getElementById("text-definition");
    const etymologieElement = document.getElementById("text-etymologie");

    const infosMot = DICTIONNAIRE_INFOS[motSecret];

    if (victoire) {
        titreMotElement.textContent = `Verbum : ${motSecret} (Victoire ! / Wygrana!)`;
    } else {
        titreMotElement.textContent = `Verbum : ${motSecret} (C'était le mot / To było słowo)`;
    }

    definitionElement.textContent = infosMot.definition;
    etymologieElement.textContent = infosMot.etymologie;

    document.getElementById("stat-jouees").textContent = stats.partiesJouees;
    document.getElementById("stat-victoires").textContent = pourcentageVictoires + "%";
    document.getElementById("stat-serie").textContent = stats.serieActuelle;
    document.getElementById("stat-max-serie").textContent = stats.meilleureSerie;

    document.getElementById("stats-modal").classList.add("visible");
}

// Initialisation au chargement de la page (Inicjalizacja podczas ładowania strony)
document.addEventListener("DOMContentLoaded", () => {
    creerGrille();
    creerClavier();
    ecouterClavierPhysique();

    // Écouteur de clic sur le bouton son
    // Nasłuchiwanie kliknięcia przycisku dźwięku
    document.getElementById("btn-son").addEventListener("click", basculerSon);

    document.getElementById("btn-rejouer").addEventListener("click", () => {
        location.reload();
    });
});

// Création de la grille (Tworzenie siatki)
function creerGrille() {
    const grilleConteneur = document.getElementById("game-grid");
    for (let r = 0; r < ESSAIS_MAX; r++) {
        const ligne = document.createElement("div");
        ligne.className = "row";
        for (let c = 0; c < LONGUEUR_MOT; c++) {
            const caseLettre = document.createElement("div");
            caseLettre.className = "tile";
            caseLettre.dataset.row = r;
            caseLettre.dataset.col = c;
            ligne.appendChild(caseLettre);
        }
        grilleConteneur.appendChild(ligne);
    }
}

// Création du clavier virtuel (Tworzenie wirtualnej klawiatury)
function creerClavier() {
    const conteneurClavier = document.getElementById("keyboard");
    const dispositionClavier = [
        ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        ["L", "M", "N", "O", "P", "Q", "R", "S", "T"],
        ["ENTER", "U", "V", "X", "Z", "BACKSPACE"]
    ];

    dispositionClavier.forEach(ligneMots => {
        const ligneElement = document.createElement("div");
        ligneElement.className = "keyboard-row";

        ligneMots.forEach(cle => {
            const boutonCle = document.createElement("button");
            boutonCle.textContent = cle === "BACKSPACE" ? "⌫" : cle;
            boutonCle.className = "key";
            boutonCle.dataset.key = cle;
            if (cle === "ENTER" || cle === "BACKSPACE") {
                boutonCle.classList.add("large");
            }
            
            boutonCle.addEventListener("click", () => traiterTouche(cle));
            ligneElement.appendChild(boutonCle);
        });

        conteneurClavier.appendChild(ligneElement);
    });
}

// Écouteur du clavier physique (Nasłuchiwanie fizycznej klawiatury)
function ecouterClavierPhysique() {
    document.addEventListener("keydown", (e) => {
        if (jeuFini) return;
        
        const touche = e.key.toUpperCase();
        if (touche === "ENTER") {
            traiterTouche("ENTER");
        } else if (touche === "BACKSPACE") {
            traiterTouche("BACKSPACE");
        } else if (/^[A-Z]$/.test(touche)) {
            traiterTouche(touche);
        }
    });
}

// Gestion des touches (Obsługa klawiszy)
function traiterTouche(touche) {
    if (jeuFini) return;

    if (touche === "ENTER") {
        validerEssai();
    } else if (touche === "BACKSPACE") {
        effacerLettre();
    } else if (lettreActuelle < LONGUEUR_MOT && essaiActuel < ESSAIS_MAX) {
        ajouterLettre(touche);
    }
}

// Ajout d'une lettre (Dodanie litery)
function ajouterLettre(lettre) {
    grilleMots[essaiActuel][lettreActuelle] = lettre;
    const caseElement = document.querySelector(`[data-row='${essaiActuel}'][data-col='${lettreActuelle}']`);
    caseElement.textContent = lettre;
    caseElement.classList.add("pop");
    caseElement.addEventListener("animationend", () => caseElement.classList.remove("pop"), { once: true });
    
    // --- NOUVEAUTÉ : Jouer le son de frappe ---
    // --- NOWOŚĆ: Odtworzenie dźwięku wpisywania ---
    sonTaper();
    
    lettreActuelle++;
}

// Effacer une lettre (Usunięcie litery)
function effacerLettre() {
    if (lettreActuelle > 0) {
        lettreActuelle--;
        grilleMots[essaiActuel][lettreActuelle] = "";
        const caseElement = document.querySelector(`[data-row='${essaiActuel}'][data-col='${lettreActuelle}']`);
        caseElement.textContent = "";
        
        // --- NOUVEAUTÉ : Jouer le son d'effacement ---
        // --- NOWOŚĆ: Odtworzenie dźwięku usuwania ---
        sonEffacer();
    }
}

// Validation de l'essai (Walidacja próby)
function validerEssai() {
    if (lettreActuelle !== LONGUEUR_MOT) {
        // Jouer le son d'erreur (Odtworzenie dźwięku błędu)
        sonErreur();
        afficherToast("Le mot doit faire 5 lettres ! (Słowo musi mieć 5 liter!)");
        return;
    }

    const motPropose = grilleMots[essaiActuel].join("");

    // Vérification du dictionnaire (Sprawdzenie słownika)
    if (!MOTS_VALIDES.includes(motPropose)) {
        // Jouer le son d'erreur (Odtworzenie dźwięku błędu)
        sonErreur();
        afficherToast("Ce mot n'est pas dans le dictionnaire ! (To słowo nie jest w słowniku!)");
        return;
    }

    // Boucle d'animation de chaque lettre (Pętla animująca każdą literę)
    for (let i = 0; i < LONGUEUR_MOT; i++) {
        const caseElement = document.querySelector(`[data-row='${essaiActuel}'][data-col='${i}']`);
        const lettreProposee = motPropose[i];
        const boutonClavier = document.querySelector(`[data-key='${lettreProposee}']`);

        setTimeout(() => {
            caseElement.classList.add("flip");

            setTimeout(() => {
                let statutLettre = "";
                if (lettreProposee === motSecret[i]) {
                    statutLettre = "correct";
                } else if (motSecret.includes(lettreProposee)) {
                    statutLettre = "present";
                } else {
                    statutLettre = "absent";
                }

                caseElement.classList.add(statutLettre);
                
                if (boutonClavier) {
                    if (statutLettre === "correct") {
                        boutonClavier.className = "key correct";
                    } else if (statutLettre === "present" && !boutonClavier.classList.contains("correct")) {
                        boutonClavier.className = "key present";
                    } else if (!boutonClavier.classList.contains("correct") && !boutonClavier.classList.contains("present")) {
                        boutonClavier.className = "key absent";
                    }
                }
            }, 250);

        }, i * 300);
    }

    // Fin de partie (Koniec gry)
    setTimeout(() => {
        if (motPropose === motSecret) {
            jeuFini = true;
            // Jouer le son de victoire (Odtworzenie dźwięku wygranej)
            sonVictoire();
            mettreAJourStatistiques(true);
        } else if (essaiActuel === ESSAIS_MAX - 1) {
            jeuFini = true;
            // Jouer le son de défaite (Odtworzenie dźwięku przegranej)
            sonDefaite();
            mettreAJourStatistiques(false);
        } else {
            essaiActuel++;
            lettreActuelle = 0;
        }
    }, LONGUEUR_MOT * 300 + 100);
}
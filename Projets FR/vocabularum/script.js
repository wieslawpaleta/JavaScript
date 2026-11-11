// Déclaration d'un tableau contenant les mots secrets possibles (Definiowanie tablicy zawierającej możliwe tajne słowa)
const MOTS_SECRETS = ["AMICUS", "DOMUS", "EQUUS", "NUBES", "ARBOR", "IGNIS", "CORPUS"];

// Déclaration d'un tableau élargi contenant tous les mots valides acceptés par le jeu (Definiowanie rozszerzonej tablicy zawierającej wszystkie poprawne słowa akceptowane przez grę)
const MOTS_VALIDES = ["AMICUS", "DOMUS", "EQUUS", "NUBES", "ARBOR", "IGNIS", "CORPUS", "ROSAE", "PUERI", "MAGNA", "VERUM"];

// Sélection aléatoire d'un mot secret parmi le tableau MOTS_SECRETS (Losowy wybór tajnego słowa z tablicy MOTS_SECRETS)
const motSecret = MOTS_SECRETS[Math.floor(Math.random() * MOTS_SECRETS.length)];

// Définition du nombre maximum d'essais autorisés (Definiowanie maksymalnej dozwolonej liczby prób)
const ESSAIS_MAX = 6;

// Définition de la longueur obligatoire de chaque mot (Definiowanie obowiązkowej długości każdego słowa)
const LONGUEUR_MOT = 5;

// Variable pour suivre la ligne (l'essai) actuelle du joueur, commence à 0 (Zmienna śledząca aktualny wiersz (próbę) gracza, zaczyna się od 0)
let essaiActuel = 0;

// Variable pour suivre la colonne (la lettre) actuelle dans la ligne, commence à 0 (Zmienna śledząca aktualną kolumnę (literę) w wierszu, zaczyna się od 0)
let lettreActuelle = 0;

// Création d'une grille vide sous forme de matrice 2D (6 lignes, 5 colonnes) (Tworzenie pustej siatki w formie macierzy 2D (6 wierszy, 5 kolumn))
let grilleMots = Array(ESSAIS_MAX).fill("").map(() => Array(LONGUEUR_MOT).fill(""));

// Variable booléenne pour bloquer le jeu une fois qu'il est gagné ou perdu (Zmienna logiczna do zablokowania gry po jej wygraniu lub przegraniu)
let jeuFini = false;

// --- GESTION DES STATISTIQUES VIA LOCALSTORAGE (ZARZĄDZANIE STATYSTYKAMI ZA POMOCĄ LOCALSTORAGE) ---
// Fonction pour récupérer les statistiques enregistrées dans le navigateur (Funkcja pobierająca statystyki zapisane w przeglądarce)
function chargerStatistiques() {
    // Récupération de la chaîne JSON depuis le localStorage (Pobranie ciągu JSON z localStorage)
    const statsEnregistrees = localStorage.getItem("wordle_latin_stats");
    
    // Si des statistiques existent déjà, on les convertit en objet JS, sinon on retourne des valeurs par défaut (Jeśli statystyki już istnieją, konwertujemy je na obiekt JS, w przeciwnym razie zwracamy domyślne wartości)
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

// Fonction pour sauvegarder les statistiques dans le navigateur (Funkcja do zapisywania statystyk w przeglądarce)
function sauvegarderStatistiques(stats) {
    // Conversion de l'objet en chaîne JSON et stockage dans le localStorage (Konwersja obiektu na ciąg JSON i zapisanie w localStorage)
    localStorage.setItem("wordle_latin_stats", JSON.stringify(stats));
}

// Fonction pour mettre à jour les statistiques à la fin d'une partie (Funkcja aktualizująca statystyki na koniec gry)
function mettreAJourStatistiques(victoire) {

}














// Attente que tout le document HTML soit chargé avant d'exécuter le code (Oczekiwanie na załadowanie całego dokumentu HTML przed uruchomieniem kodu)
document.addEventListener("DOMContentLoaded", () => {
    // Appel de la fonction pour créer la grille visuelle (Wywołanie funkcji tworzącej wizualną siatku)
    creerGrille();
    // Appel de la fonction pour créer le clavier virtuel (Wywołanie funkcji tworzącej wirtualną klawiaturę)
    creerClavier();
    // Appel de la fonction pour écouter le clavier de l'ordinateur (Wywołanie funkcji nasłuchującej klawiaturę komputera)
    ecouterClavierPhysique();
});

// Fonction qui génère les cases de la grille dans le HTML (Funkcja generująca kafelki siatki w HTML)
function creerGrille() {
    // Récupération de l'élément conteneur de la grille depuis le HTML (Pobranie elementu kontenera siatki z HTML)
    const grilleConteneur = document.getElementById("game-grid");
    
    // Boucle pour créer les 6 lignes (Pętla tworząca 6 wierszy)
    for (let r = 0; r < ESSAIS_MAX; r++) {
        // Création d'un élément div pour la ligne (Utworzenie elementu div dla wiersza)
        const ligne = document.createElement("div");
        // Attribution de la classe CSS "row" à la ligne (Przypisanie klasy CSS "row" do wiersza)
        ligne.className = "row";
        
        // Boucle interne pour créer les 5 colonnes (lettres) par ligne (Wewnętrzna pętla tworząca 5 kolumn (liter) w wierszu)
        for (let c = 0; c < LONGUEUR_MOT; c++) {
            // Création d'un élément div pour une case individuelle (Utworzenie elementu div dla pojedynczego kafelka)
            const caseLettre = document.createElement("div");
            // Attribution de la classe CSS "tile" à la case (Przypisanie klasy CSS "tile" do kafelka)
            caseLettre.className = "tile";
            // Stockage du numéro de ligne dans un attribut de données (Przechowywanie numeru wiersza w atrybucie danych)
            caseLettre.dataset.row = r;
            // Stockage du numéro de colonne dans un attribut de données (Przechowywanie numeru kolumny w atrybucie danych)
            caseLettre.dataset.col = c;
            // Ajout de la case à l'intérieur de la ligne (Dodanie kafelka do wewnątrz wiersza)
            ligne.appendChild(caseLettre);
        }
        
        // Ajout de la ligne complète à l'intérieur du conteneur principal de la grille (Dodanie kompletnego wiersza do głównego kontenera siatki)
        grilleConteneur.appendChild(ligne);
    }
}

// Fonction qui génère le clavier virtuel à l'écran (Funkcja generująca wirtualną klawiaturę na ekranie)
function creerClavier() {
    // Récupération du conteneur du clavier depuis le HTML (Pobranie kontenera klawiatury z HTML)
    const conteneurClavier = document.getElementById("keyboard");
    
    // Tableau contenant la structure des touches du clavier (Tablica zawierająca strukturę klawiszy klawiatury)
    const dispositionClavier = [
        ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        ["L", "M", "N", "O", "P", "Q", "R", "S", "T"],
        ["ENTER", "U", "V", "X", "Z", "BACKSPACE"]
    ];

    // Boucle pour parcourir chaque rangée du clavier (Pętla przechodząca przez każdy rząd klawiatury)
    dispositionClavier.forEach(ligneMots => {
        // Création d'un div pour la rangée du clavier (Utworzenie div dla rzędu klawiatury)
        const ligneElement = document.createElement("div");
        // Attribution de la classe CSS pour la rangée (Przypisanie klasy CSS dla rzędu)
        ligneElement.className = "keyboard-row";

        // Boucle pour parcourir chaque touche de la rangée (Pętla przechodząca przez każdy klawisz w rzędzie)
        ligneMots.forEach(cle => {
            // Création d'un élément bouton pour la touche (Utworzenie elementu przycisku dla klawisza)
            const boutonCle = document.createElement("button");
            // Si la touche est BACKSPACE, afficher une icône, sinon afficher la lettre (Jeśli klawiszem jest BACKSPACE, wyświetl ikonę, w przeciwnym razie wyświetl literę)
            boutonCle.textContent = cle === "BACKSPACE" ? "⌫" : cle;
            // Attribution de la classe CSS de base pour une touche (Przypisanie podstawowej klasy CSS dla klawisza)
            boutonCle.className = "key";
            // Ajout d'un attribut personnalisé pour identifier la touche facilement (Dodanie niestandardowego atrybutu do łatwej identyfikacji klawisza)
            boutonCle.dataset.key = cle;
            
            // Si la touche est ENTER ou BACKSPACE, ajouter une classe pour l'agrandir (Jeśli klawiszem jest ENTER lub BACKSPACE, dodaj klasę powiększającą)
            if (cle === "ENTER" || cle === "BACKSPACE") {
                boutonCle.classList.add("large");
            }
            
            // Ajout d'un écouteur de clic sur le bouton de la touche (Dodanie nasłuchiwania kliknięcia na przycisk klawisza)
            boutonCle.addEventListener("click", () => traiterTouche(cle));
            // Ajout du bouton dans la rangée du clavier (Dodanie przycisku do rzędu klawiatury)
            ligneElement.appendChild(boutonCle);
        });

        // Ajout de la rangée complète dans le conteneur du clavier (Dodanie kompletnego rzędu do kontenera klawiatury)
        conteneurClavier.appendChild(ligneElement);
    });
}

// Fonction pour écouter les pressions de touches sur le clavier physique (Funkcja nasłuchująca naciśnięć klawiszy na fizycznej klawiaturze)
function ecouterClavierPhysique() {
    // Écoute de l'événement "keydown" sur toute la page (Nasłuchiwanie zdarzenia "keydown" na całej stronie)
    document.addEventListener("keydown", (e) => {
        // Si la partie est finie, on ignore les touches (Jeśli gra jest skończona, ignorujemy klawisze)
        if (jeuFini) return;
        
        // Conversion de la touche pressée en majuscule (Konwersja naciśniętego klawisza na wielką literę)
        const touche = e.key.toUpperCase();
        
        // Si l'utilisateur appuie sur Entrée (Jeśli użytkownik naciska Enter)
        if (touche === "ENTER") {
            traiterTouche("ENTER");
        } 
        // Si l'utilisateur appuie sur Retour arrière (Jeśli użytkownik naciska Backspace)
        else if (touche === "BACKSPACE") {
            traiterTouche("BACKSPACE");
        } 
        // Si la touche est une lettre valide de A à Z (Jeśli klawiszem jest poprawna litera od A do Z)
        else if (/^[A-Z]$/.test(touche)) {
            traiterTouche(touche);
        }
    });
}

// Fonction centrale qui gère l'action à effectuer selon la touche clouée ou pressée (Centralna funkcja zarządzająca akcją do wykonania w zależności od klikniętego lub naciśniętego klawisza)
function traiterTouche(touche) {
    // Si la partie est finie, on arrête l'exécution (Jeśli gra jest skończona, przerywamy wykonywanie)
    if (jeuFini) return;

    // Si la touche est ENTER, on valide la proposition (Jeśli klawiszem jest ENTER, zatwierdzamy propozycję)
    if (touche === "ENTER") {
        validerEssai();
    } 
    // Si la touche est BACKSPACE, on efface une lettre (Jeśli klawiszem jest BACKSPACE, usuwamy literę)
    else if (touche === "BACKSPACE") {
        effacerLettre();
    } 
    // Si on n'a pas encore atteint la fin de la ligne et le nombre max d'essais (Jeśli nie osiągnęliśmy jeszcze końca wiersza ani maksymalnej liczby prób)
    else if (lettreActuelle < LONGUEUR_MOT && essaiActuel < ESSAIS_MAX) {
        ajouterLettre(touche);
    }
}

// Fonction pour ajouter une lettre dans la grille (Funkcja do dodawania litery do siatki)
function ajouterLettre(lettre) {
    // Enregistrement de la lettre dans notre matrice de données (Zapisanie litery w naszej macierzy danych)
    grilleMots[essaiActuel][lettreActuelle] = lettre;
    
    // Sélection de la case HTML correspondante à la ligne et colonne actuelles (Wybór kafelka HTML odpowiadającego aktualnemu wierszowi i kolumnie)
    const caseElement = document.querySelector(`[data-row='${essaiActuel}'][data-col='${lettreActuelle}']`);
    
    // Affichage de la lettre dans le HTML du kafelek (Wyświetlenie litery w HTML kafelka)
    caseElement.textContent = lettre;
    
    // Ajout de la classe CSS pour l'animation de rebond (Dodanie klasy CSS dla animacji odbicia)
    caseElement.classList.add("pop");
    
    // Suppression de la classe d'animation une fois qu'elle est terminée (Usunięcie klasy animacji po jej zakończeniu)
    caseElement.addEventListener("animationend", () => caseElement.classList.remove("pop"), { once: true });

    // Passage à la case suivante sur la droite (Przejście do następnego kafelka po prawej stronie)
    lettreActuelle++;
}

// Fonction pour effacer la dernière lettre saisie (Funkcja do usuwania ostatnio wpisanej litery)
function effacerLettre() {
    // Vérification qu'il y a au moins une lettre à effacer dans la ligne (Sprawdzenie, czy w wierszu jest co najmniej jedna litera do usunięcia)
    if (lettreActuelle > 0) {
        // Recul d'une position (Cofnięcie o jedną pozycję)
        lettreActuelle--;
        
        // Effacement de la lettre dans la matrice de données (Wyczyszczenie litery w macierzy danych)
        grilleMots[essaiActuel][lettreActuelle] = "";
        
        // Sélection de la case HTML correspondante (Wybór odpowiedniego kafelka HTML)
        const caseElement = document.querySelector(`[data-row='${essaiActuel}'][data-col='${lettreActuelle}']`);
        
        // Vidage du texte dans le HTML (Wyczyszczenie tekstu w HTML)
        caseElement.textContent = "";
    }
}

// Fonction principale qui valide l'essai complet du joueur (Główna funkcja zatwierdzająca pełną próbę gracza)
function validerEssai() {
    // Vérification si le mot contient bien 5 lettres (Sprawdzenie, czy słowo ma dokładnie 5 liter)
    if (lettreActuelle !== LONGUEUR_MOT) {
        alert("Le mot doit faire 5 lettres ! (Słowo musi mieć 5 liter!)");
        return; // Arrêt de la fonction si incomplet (Przerwanie funkcji, jeśli jest niekompletne)
    }

    // Assemblage des lettres de la ligne actuelle pour former un mot complet (Złożenie liter aktualnego wiersza w celu utworzenia pełnego słowa)
    const motPropose = grilleMots[essaiActuel].join("");

    // --- NOUVEAUTÉ DU POINT 1 : VÉRIFICATION DU DICTIONNAIRE ---
    // Vérification si le mot proposé existe dans la liste des mots valides (Sprawdzanie, czy proponowane słowo istnieje na liście poprawnych słów)
    if (!MOTS_VALIDES.includes(motPropose)) {
        alert("Ce mot n'est pas dans le dictionnaire latin ! (To słowo nie znajduje się w słowniku łacińskim!)");
        return; // Stoppe la validation si le mot n'est pas valide (Zatrzymuje walidację, jeśli słowo nie jest poprawne)
    }
    // -----------------------------------------------------------

    // Boucle pour parcourir chaque lettre du mot proposé et animer le retournement (Pętla przechodząca przez każdą literę proponowanego słowa i animująca obrót)
    for (let i = 0; i < LONGUEUR_MOT; i++) {
        // Sélection de la case actuelle (Wybór aktualnego kafelka)
        const caseElement = document.querySelector(`[data-row='${essaiActuel}'][data-col='${i}']`);
        
        // Récupération de la lettre à cette position (Pobranie litery z tej pozycji)
        const lettreProposee = motPropose[i];
        
        // Sélection du bouton correspondant sur le clavier virtuel (Wybór odpowiadającego przycisku na wirtualnej klawiaturze)
        const boutonClavier = document.querySelector(`[data-key='${lettreProposee}']`);

        // Utilisation d'un délai pour créer un effet visuel séquentiel lettre par lettre (Użycie opóźnienia w celu stworzenia sekwencyjnego efektu wizualnego litera po literze)
        setTimeout(() => {
            // Ajout de la classe d'animation de retournement 3D (Dodanie klasy animacji obrotu 3D)
            caseElement.classList.add("flip");

            // Au milieu de l'animation (250 millisecondes), on change la couleur (W połowie animacji (250 milisekund) zmieniamy kolor)
            setTimeout(() => {
                let statutLettre = "";
                
                // Si la lettre est exactement au bon endroit (Jeśli litera jest dokładnie na właściwym miejscu)
                if (lettreProposee === motSecret[i]) {
                    statutLettre = "correct";
                } 
                // Si la lettre est présente dans le mot mais mal placée (Jeśli litera jest obecna w słowie, ale na złym miejscu)
                else if (motSecret.includes(lettreProposee)) {
                    statutLettre = "present";
                } 
                // Sinon, la lettre n'est pas du tout dans le mot (W przeciwnym razie litera w ogóle nie występuje w słowie)
                else {
                    statutLettre = "absent";
                }

                // Application de la classe de couleur sur la case (Zastosowanie klasy koloru na kafelku)
                caseElement.classList.add(statutLettre);
                
                // Mise à jour de la couleur de la touche sur le clavier virtuel (Aktualizacja koloru klawisza na wirtualnej klawiaturze)
                if (boutonClavier) {
                    if (statutLettre === "correct") {
                        boutonClavier.className = "key correct";
                    } else if (statutLettre === "present" && !boutonClavier.classList.contains("correct")) {
                        boutonClavier.className = "key present";
                    } else if (!boutonClavier.classList.contains("correct") && !boutonClavier.classList.contains("present")) {
                        boutonClavier.className = "key absent";
                    }
                }
            }, 250); // Fin du premier sous-délai (Koniec pierwszego pod-opóźnienia)

        }, i * 300); // Décalage de 300ms pour chaque lettre suivante (Opóźnienie 300ms dla każdej kolejnej litery)
    }

    // Gestion de la fin de tour ou de partie après que toutes les animations soient finies (Obsługa końca tury lub gry po zakończeniu wszystkich animacji)
    setTimeout(() => {
        // Si le joueur a trouvé le mot exact (Jeśli gracz odgadł dokładne słowo)
        if (motPropose === motSecret) {
            jeuFini = true; // Fin du jeu (Koniec gry)
            alert("Félicitations ! Vous avez gagné ! (Gratulacje! Wygrałeś!)");
        } 
        // Si le joueur a épuisé tous ses essais sans trouver (Jeśli gracz wyczerpał wszystkie próby bez odgadnięcia)
        else if (essaiActuel === ESSAIS_MAX - 1) {
            jeuFini = true; // Fin du jeu (Koniec gry)
            alert(`Défaite ! Le mot était : ${motSecret} (Porażka! Słowem było: ${motSecret})`);
        } 
        // Sinon, on passe à la ligne suivante (W przeciwnym razie przechodzimy do następnego wiersza)
        else {
            essaiActuel++; // Incrémentation du numéro de la ligne (Inkrementacja numeru wiersza)
            lettreActuelle = 0; // Remise à zéro de l'index de la lettre (Reset indeksu litery na początek)
        }
    }, LONGUEUR_MOT * 300 + 100); // Temps total calculé pour attendre la fin des animations (Całkowity obliczony czas oczekiwania na koniec animacji)
}
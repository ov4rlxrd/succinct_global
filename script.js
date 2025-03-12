

const fromHexString = (hexString) =>
    Uint8Array.from(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

const countries = ["United States of America", "Switzerland", "Japan", "Germany", "South Korea", "China", "Czechia","Philippines","France","Greece","India","Indonesia","Italy","Malaysia","Poland","Portugal","Russia","Ukraine","Spain","Thailand","Vietnam","Turkey","United Kingdom"];
let selectedCountries = [];
let foundCountries = new Set();
let activatedNFTs = new Set();
let activatedNFTsforProfile = new Set(JSON.parse(localStorage.getItem('activatedNFTsforProfile')) || []);

function saveActivatedNFTsforProfile() {
    localStorage.setItem('activatedNFTsforProfile', JSON.stringify([...activatedNFTsforProfile]));
}
const defaultBackgroundtMusic = new Audio("music/default_background.mp3");
let score = 0;

function setProofData(data) {
    proofData = data;
}

function setProofDataLoading(loading) {
    proofDataLoading = loading;
}

function updateScore(points) {
    score += points;
    const scoreDisplay = document.getElementById('score_display');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${score}`;
    }
}

const nftCards = [
    {
        imageUrl: "imgs/ov4rlxrd.jpg", 
        description: "Ov4rlxrd NFT card"
    },
    {
        imageUrl: "imgs/freakybird.png",
        description: "FreakyBird NFT card!"
    },
    {
        imageUrl: "imgs/Pink_hair_girl.png",
        description: "Pink hair girl NFT card!"
    },
    {
        imageUrl: "imgs/succint.png",
        description: "Succinct NFT card!"
    },
];

function stopTimer() {
    clearInterval(timerId);
}

function getRandomCountries(difficulty) {
    selectedCountries = []; 
    let availableCountries = [...countries];

    while (selectedCountries.length < difficulty) {
        let country = availableCountries.splice(Math.floor(Math.random() * availableCountries.length), 1)[0];
        selectedCountries.push(country);
    }

    let nftAvailableCountries = availableCountries.filter(c => !selectedCountries.includes(c));

    nftAvailableCountries.sort(() => Math.random() - 0.5);

    nftCards.forEach((nftCard, index) => {
        nftCard.country = nftAvailableCountries[index];
    });

}

window.onload = async function () {
    const globeContainer = document.getElementById('globe-container');
    const tooltip = document.getElementById('tooltip');
    const winWindow = document.getElementById('win_window')
    const startWindow = document.getElementById('start_window')
    const rightAnswer = document.getElementById('right_answer')
    const wrongAnswer = document.getElementById('wrong_answer')
    const countriesToGuess = document.getElementById('countries_to_guess');
    const timerDisplay = document.getElementById('timer_display')
    const scoreDisplay = document.getElementById('score_display')
    const toggleModeCont = document.getElementById('toggle_buttons_cont')
    const toggleModeWhitepaper = document.getElementById('toggle_mode_whitepaper')
    const toggleModeDark = document.getElementById('toggle_mode_dark')
    const difficultySelection = document.getElementById('difficulty_selection')
    const provedBtn  = document.getElementById('difficulty_selection_proved_btn')
    const proverBtn  = document.getElementById('difficulty_selection_prover_btn')
    const superProverBtn  = document.getElementById('difficulty_selection_super_prover_btn')
    const difficultyText = document.getElementById('difficulty_text')
    const winText2 = document.getElementById('win_text_2')
    const profileBtn = document.getElementById('profile_button')
    const restartBtn = document.getElementById('restart_btn')

    profileBtn.onclick = function () {
        showProfile();
    }

    restartBtn.onclick = function () {
        window.location.reload();
    }

    function showProfile() {
        let nickname = localStorage.getItem('nickname');
        if (!nickname) {
            nickname = prompt("Введите ваш ник:");
            if (nickname) {
                localStorage.setItem('nickname', nickname);
            }
        }
        difficultyText.style.display = 'none';
        difficultySelection.style.display = 'none';
        profileBtn.style.display = 'none';

        const maxScore = localStorage.getItem('maxScore') || 0;
    
        const nftGallery = Array.from(activatedNFTsforProfile).map(nft => `<img src="${nft}" style="width: 100px; height: 100px; margin: 15px;">`).join('');
    
        const profileHtml = `
            <div id="profile">
                <h2>Profile</h2>
                <p>Nickname: ${nickname}</p>
                <p>Max Score: ${maxScore} </p>
                <h3>Collected NFT:</h3>
                <div id="nft_gallery">${nftGallery}</div>
                <button onclick="closeProfile()">Close</button>
            </div>
        `;
    
        const profileContainer = document.getElementById('profile_container');
        profileContainer.innerHTML = profileHtml; 
    }
    
    window.closeProfile = function() {
        const profileContainer = document.getElementById('profile_container');
        if (profileContainer) {
            profileContainer.innerHTML = '';
            difficultyText.style.display = 'block';
            difficultySelection.style.display = 'flex';
            profileBtn.style.display = 'flex';
        }
    };


    let startTime = null;
    let timerId = null;
    let elapsedTime = 0;
    
    let selectedCountry = null;
    let hoveredCountry = null;

    let isDarkMode = true;

    let difficulty = null;

    function startTimer() {
        startTime = Date.now();
        timerId = setInterval(() => {
            elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            timerDisplay.textContent = `${elapsedTime} sec`;
        }, 1000);
    }

    function getCountryData() {
        return JSON.parse(localStorage.getItem("countryBadges")) || {};
    }

    function updateMaxScoreDirect(newScore) {
        let maxScore = parseInt(localStorage.getItem('maxScore')) || 0;
      
        if (newScore > maxScore) {
          localStorage.setItem('maxScore', newScore);
        }
      }
    let countryData = getCountryData();

    function showScoreChange(text, isPositive) {
        const display = isPositive ? document.getElementById('score_change_display') : document.getElementById('score_change_display_negative');
        
        display.textContent = text;
        display.style.left = `${Math.random() * window.innerWidth}px`; 
        display.style.top = `${Math.random() * window.innerHeight / 2 + 50}px`; 
        
        display.style.opacity = 1;
    
        setTimeout(() => {
            display.style.opacity = 0;
        }, 2000);
    }

    function showNFTCard(nftCard) {
        const nftPopup = document.getElementById("nft_popup");
        document.getElementById("nft_image").src = nftCard.imageUrl;
        document.getElementById("nft_description").textContent = nftCard.description;
        nftPopup.style.display = "block";
    
        setTimeout(() => {
            nftPopup.style.display = "none";
        }, 5000);
    }

    const world = Globe()(globeContainer)
        .width(window.innerWidth)
        .height(window.innerHeight)
        .backgroundColor('#000')
        .showAtmosphere(true)
        .atmosphereColor('white')
        .atmosphereAltitude(0.2)
        .globeImageUrl(null)
        .showGlobe(true);

    const geoJsonUrl = 'https://unpkg.com/world-atlas@2/countries-110m.json';
    const worldData = await fetch(geoJsonUrl).then(res => res.json());
    const countries = topojson.feature(worldData, worldData.objects.countries).features;

    world.polygonsData(countries)
        .polygonCapColor(d => 
            selectedCountry === d ? 'white' : 
            hoveredCountry === d ? 'white' : 
            'rgba(255, 255, 255, 0.1)')
        .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.5)')
        .polygonSideColor(() => 'rgba(0, 0, 0, 0.5)')
        .polygonAltitude(d => selectedCountry === d ? 0.02 : 0.005)
        .onPolygonClick(d => {
            selectedCountry = d;
            const countryName = d.properties.name;
            console.log(countryName);

            const nftCard = nftCards.find(card => card.country === countryName);

            if (nftCard) {
                if (activatedNFTs.has(countryName)) {
                    return; 
                }
        
                activatedNFTs.add(countryName);
                activatedNFTsforProfile.add(nftCard.imageUrl);
                saveActivatedNFTsforProfile();
                console.log(activatedNFTsforProfile);
                updateScore(500);
                showScoreChange('+500', true);
        
                showNFTCard(nftCard);
        
                return; 
            }

            if (selectedCountries.includes(countryName)) {
                if (!foundCountries.has(countryName)) {
                    foundCountries.add(countryName);
                    rightAnswer.style.display = 'block';

                    setTimeout(() => {
                        rightAnswer.style.display = 'none';
                    }, 1000);
                    


                    world.polygonsData(countries)
                    .polygonCapColor(p => (p === d ? 'green' : (selectedCountry === p || hoveredCountry === p) ? 'white' : 'rgba(255, 255, 255, 0.1)'));

                    setTimeout(() => {
                        world.polygonsData(countries)
                            .polygonCapColor(p => (selectedCountry === p || hoveredCountry === p) ? 'white' : 'rgba(255, 255, 255, 0.1)');
                    }, 2000);

                    updateScore(100);
                    showScoreChange('+100', true);
                }
                if (foundCountries.size === difficulty) {
                    winWindow.style.display = 'block'
                    winText2.textContent = `You got ${score} points`
                    updateMaxScoreDirect(score);
                    stopTimer();
                }
            } else {
                wrongAnswer.style.display = 'block'

                setTimeout(() => {
                    wrongAnswer.style.display = 'none';
                }, 1000);


                world.polygonsData(countries)
                .polygonCapColor(p => (p === d ? 'red' : (selectedCountry === p || hoveredCountry === p) ? 'white' : 'rgba(255, 255, 255, 0.1)'));

                setTimeout(() => {
                    world.polygonsData(countries)
                        .polygonCapColor(p => (selectedCountry === p || hoveredCountry === p) ? 'white' : 'rgba(255, 255, 255, 0.1)');
                }, 2000);
                
                updateScore(-75);
                showScoreChange('-75', false);
            }
            
        })
        .onPolygonHover((hovered, prevHovered) => {
            hoveredCountry = hovered;
            world.polygonsData(countries);

            if (hovered) {
                const countryName = hovered.properties.name;
                tooltip.innerHTML = `${countryName}`;
            } else {
                tooltip.style.display = 'none';
            }
        });

        function toggleGameMode() {
            if (isDarkMode) {
                defaultBackgroundtMusic.loop = true;
                defaultBackgroundtMusic.volume = 0.1
                defaultBackgroundtMusic.play();
                world.backgroundColor('#000000');  
                world.atmosphereColor('white');
                world.globeImageUrl(null);
                world.backgroundImageUrl('imgs/background.png')
                world.polygonsData(countries)
                .polygonCapColor(d => 
                    selectedCountry === d ? 'white' : 
                    hoveredCountry === d ? 'white' : 
                    'rgba(255, 255, 255, 0.1)')
                .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.5)')
                
            }
            else {
                defaultBackgroundtMusic.loop = true;
                defaultBackgroundtMusic.volume = 0.1
                defaultBackgroundtMusic.play();
                world.backgroundColor('#000000');  
                world.atmosphereColor('white');
                world.polygonsData(countries)
                world.backgroundImageUrl('imgs/background2.png')
                .polygonCapColor(d => 
                    selectedCountry === d ? 'black' : 
                    hoveredCountry === d ? 'black' : 
                    'rgba(255, 255, 255, 0.1)')
                .polygonStrokeColor(() => 'rgba(0, 0, 0, 0.5)')
                
                world.globeImageUrl('imgs/whitepaper.png'); 

                
            }
        
        }

        provedBtn.onclick = function () {
            difficulty = 3;
            toggleModeCont.style.display = 'flex';
            difficultySelection.style.display = 'none';
            difficultyText.style.display = 'none'
            profileBtn.style.display = 'none';
        }
        proverBtn.onclick = function () {
            difficulty = 4;
            toggleModeCont.style.display = 'flex';
            difficultySelection.style.display = 'none';
            difficultyText.style.display = 'none'
            profileBtn.style.display = 'none';
        }
        superProverBtn.onclick = function () {
            difficulty = 5;
            toggleModeCont.style.display = 'flex';
            difficultySelection.style.display = 'none';
            difficultyText.style.display = 'none'
            profileBtn.style.display = 'none';
        }


        toggleModeWhitepaper.onclick = function () {
            isDarkMode = false;
            getRandomCountries(difficulty);
            startWindow.style.display = 'none';
            countriesToGuess.innerHTML = selectedCountries.join(', ');
            countriesToGuess.style.display = 'block';
            timerDisplay.style.display = 'block'
            scoreDisplay.style.display = 'block';
            startTimer();
            toggleGameMode();
        }
        toggleModeDark.onclick = function () {
            getRandomCountries(difficulty);
            startWindow.style.display = 'none';
            countriesToGuess.innerHTML = selectedCountries.join(', ');
            countriesToGuess.style.display = 'block';
            timerDisplay.style.display = 'block'
            scoreDisplay.style.display = 'block';
            startTimer();
            toggleGameMode();
        }

    document.addEventListener('mousemove', (event) => {
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
    });
};  


  

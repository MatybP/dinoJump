//VARIABLES DEL ESCENARIO
///NUBES
var cloudContent = document.getElementById("cloudContent");
var cloudTransitionDuration = 15; // en s 
var cloudTransitionDurationList = [];
var cloudCurrentTransformList = [];
var cloudMarginTopVariance = 16; // en rem
var cloud = [
    { image: "img/cloud_1.png", width: 714, height: 360 },
    { image: "img/cloud_2.png", width: 507, height: 253 },
    { image: "img/cloud_3.png", width: 447, height: 203 },
    { image: "img/cloud_4.png", width: 588, height: 296 },
];
var cloudList = Array.from(document.querySelectorAll("#cloud"));
var cloudTimeout;
//SUELO
var ground = document.getElementById("ground");
var groundBackgroundPositionX = 0;

//VARIABLES DE LOS OBSTACULOS
var obstacleSpeed = 0.65; // en vw
var obstacle = [
    { image: "img/rock_1.png", width: 112, height: 96 },
    { image: "img/rock_2.png", width: 84, height: 97 },
    { image: "img/trunk.png", width: 92, height: 97 },
];
var obstacleList = [];
var obstacleTimeout;
var temporizadorObstaculo;

// VARIABLES DEL JUGADOR
///SOMBRA DEL JUGADOR
var playerShadow = document.getElementById("playerShadow");
///JUGADOR
var player = document.getElementById("player");
var playerAnimationDuration = 0.6;
var isJumping = false;
var canJump = false;
var jumpCooldown = false;
var character = [
    { id: "one", imageRun: "img/dinoRun_1.png", imageDefault: "img/dinoDefault_1.png", imageHurt: "img/dinoHurt_1.png", requiredPoints: 500, unlocked: true, selected: true, color: "green" },
    { id: "two", imageRun: "img/dinoRun_2.png", imageDefault: "img/dinoDefault_2.png", imageHurt: "img/dinoHurt_2.png", requiredPoints: 1000, unlocked: false, selected: false, color: "yellow" },
    { id: "three", imageRun: "img/dinoRun_3.png", imageDefault: "img/dinoDefault_3.png", imageHurt: "img/dinoHurt_3.png", requiredPoints: 3000, unlocked: false, selected: false, color: "red" },
    { id: "four", imageRun: "img/dinoRun_4.png", imageDefault: "img/dinoDefault_4.png", imageHurt: "img/dinoHurt_4.png", requiredPoints: 4000, unlocked: false, selected: false, color: "blue" }
];
///BOTONES SELECCIÓN
var buttonCharacter;
var contentSelectCharacter = document.getElementById("contentSelectCharacter");
var effectSelectCharacter = document.getElementById('effectSelectCharacter');

// VARIABLES DEL MARCADOR
var scoreboard = document.getElementById("scoreboard");
var score = 0;
var scoreValue = 1;
var nextScore;
var scoreIncrement = 500;
var percentageIncrease = 0.1;

//VARIABLES DE LA PANTALLA DE INICIO
var contentScreen = document.getElementById("contentScreen");
var contentCurrentScore = document.getElementById("contentCurrentScore");
var tittle = document.getElementById("tittle");
var currentScore = document.getElementById("currentScore");
var maxScoreLocal = localStorage.getItem("maxScore");
var maxScore = document.getElementById("maxScore");
maxScore.textContent = Math.round(maxScoreLocal / 10) || 0;
var buttonResetScore = document.getElementById("buttonResetScore");
var contentImprovements = document.getElementById("contentImprovements");
var improvementShow = false;

//VARIABLES DEL SISTEMA
var game = document.getElementById("game");
var gameStarted = false;
var sound = document.getElementById("sound");

//Crea una nube en el juego con propiedades aleatorias
function createCloud() {
    var indexRandomCloud = Math.floor(Math.random() * cloud.length);
    var randomCloud = cloud[indexRandomCloud];
    var cloudMarginTop = Math.random() * cloudMarginTopVariance;
    var cloudElement = document.createElement("div");

    cloudContent.appendChild(cloudElement);

    cloudElement.id = "cloud";
    cloudElement.style.width = randomCloud.width + "px";
    cloudElement.style.transform = "translateX(100vw)";
    cloudElement.style.height = randomCloud.height + "px";
    cloudElement.style.backgroundImage = `url(${randomCloud.image})`;
    cloudElement.style.marginTop = (3 + cloudMarginTop) + "rem";

    cloudList.push(cloudElement);

    setTimeout(
        function () {
            updateCloudTransitionDuration();
            moveCloud();
        },
        20
    );
    cloudTimeout = setTimeout(startCreateCloud, cloudGenerationTime());
}
//Inicia la creación de nubes si se ha empezado el juego
function startCreateCloud() {
    if (gameStarted) {
        createCloud();
    }
}
//Genera un tiempo aleatorio de espera antes de crear una nueva nube
function cloudGenerationTime() {
    const minTiempo = Math.random() * 2500;
    const maxTiempo = Math.random() * 4500;
    const tiempo = Math.random() * (maxTiempo - minTiempo) + minTiempo;

    return tiempo;
}
//Actualiza la duración de la transición de las nubes
function updateCloudTransitionDuration() {
    cloudTransitionDurationList = [];
    cloudCurrentTransformList = [];

    for (var i = 0; i < cloudList.length; i++) {
        var cloudI = cloudList[i];
        var computedStyle = window.getComputedStyle(cloudI);
        var cloudTransform = computedStyle.getPropertyValue("transform");
        var transformValues = cloudTransform.split(","); //Dividir la cadena en partes utilizando la coma como separador
        var pxValue = parseFloat(transformValues[4].trim()); //Obtener el quinto valor (posición x) y eliminar los espacios en blanco
        var windowWidth = window.innerWidth;
        var vwValue = (pxValue / windowWidth) * 100; //Transformar la posición x (px->vw)
        var newCloudTransitionDuration = cloudTransitionDuration * (vwValue + 100) / 200;

        cloudCurrentTransformList.push(cloudTransform);

        if (newCloudTransitionDuration <= 0) {
            cloudI.remove();
            cloudList.splice(i, 1);
            i--;
        } else {
            cloudTransitionDurationList.push(newCloudTransitionDuration);
        }
    }
}
// Mueve las nubes en la pantalla hacia la izquierda
function moveCloud() {
    for (var i = 0; i < cloudList.length; i++) {
        var cloudI = cloudList[i];

        cloudI.className = "mov";
        cloudI.style.transform = "translateX(-100vw)";
        cloudI.style.transitionDuration = cloudTransitionDurationList[i] + "s";
    }
}
// Detiene el movimiento de las nubes
function stopCloud() {
    for (var i = 0; i < cloudList.length; i++) {
        var cloudI = cloudList[i];
        var computedStyle = window.getComputedStyle(cloudI);
        var cloudTransform = computedStyle.getPropertyValue("transform");

        cloudI.className = "stop";
        cloudI.style.transform = cloudTransform;
    }
}
//Crea un obstaculo en el juego con propiedades aleatorias
function createObstacle() {
    var indexRandomObstacle = Math.floor(Math.random() * obstacle.length);
    var randomObstacle = obstacle[indexRandomObstacle];
    var obstacleElement = document.createElement("div");

    game.appendChild(obstacleElement);

    obstacleElement.classList.add("obstacle");
    obstacleElement.style.left = "100vw";
    obstacleElement.style.width = randomObstacle.width + "px";
    obstacleElement.style.height = randomObstacle.height + "px";
    obstacleElement.style.backgroundImage = `url(${randomObstacle.image})`;
    
    obstacleList.push(obstacleElement);

    obstacleTimeout = setTimeout(startCreateObstacle, obstacleGenerationTime());
}
//Inicia la creación de obstáculos si se ha empezado el juego
function startCreateObstacle() {
    if (gameStarted) {
        createObstacle();
    }
}
//Genera un tiempo aleatorio de espera antes de crear un nuevo obstáculo
function obstacleGenerationTime() {
    const minTiempo = Math.random() * 2500;
    const maxTiempo = Math.random() * 7500;
    const tiempo = Math.random() * (maxTiempo - minTiempo) + minTiempo;

    return tiempo;
}
//Mueve los obstáculos en la pantalla hacia la izquierda
function moveObstacle() {
    for (var i = 0; i < obstacleList.length; i++) {
        var obstacleI = obstacleList[i];
        var obstacleLeft = parseFloat(obstacleI.style.left);

        if (obstacleLeft <= -obstacleI.offsetWidth) {
            obstacleI.remove();
            obstacleList.splice(i, 1);
            i--;
        } else {
            obstacleI.style.left = obstacleLeft - obstacleSpeed + "vw";
            checkCollision(obstacleI);
        }
    }

    var groundLeft = parseFloat(ground.style.backgroundPositionX);

    ground.style.backgroundPositionX = groundLeft - obstacleSpeed + "vw";
}
//Verifica el estado de desbloqueo al cargar el juego
window.addEventListener("load", 
    function () {
        for (var i = 0; i < character.length; i++) {
            var characterI = character[i];
            var unlocked = localStorage.getItem("character_" + characterI.id + "_unlocked");

            if (unlocked === "true") {
                characterI.unlocked = true;
                showCharacterButton(characterI);
            }
        }
    }
);
//Muestra el botón del personaje en función de su estado de desbloqueo
function showCharacterButton(characterI) {
    buttonCharacter = document.querySelector('.buttonCharacter.' + characterI.id);
    if (characterI.unlocked) {
        buttonCharacter.classList.add('unlocked');
    }
    else {
        buttonCharacter.classList.remove('unlocked');
    }
}
//Cambia el personaje seleccionado al personaje de la lista de personajes
function buttonCharacterOne() {
    changeCharacter(character[0]);
}
function buttonCharacterTwo() {
    changeCharacter(character[1]);
}
function buttonCharacterThree() {
    changeCharacter(character[2]);
}
function buttonCharacterFour() {
    changeCharacter(character[3]);
}
//Cambia al personaje seleccionado
function changeCharacter(characterI) {
    if (characterI.unlocked) {
        for (var i = 0; i < character.length; i++) {
            character[i].selected = false;
        }

        characterI.selected = true;
        player.className = characterI.id;
        player.classList.add("default");

        buttonCharacter = document.querySelector('.buttonCharacter.' + characterI.id);
        buttonCharacter.classList.add('mov');

        setTimeout(
            function () {
                buttonCharacter.classList.remove('mov');
            },
            1000
        );

        effectSelectCharacter.classList.add('mov');

        if (characterI.id == "one") {
            effectSelectCharacter.style.marginRight = "17.2rem";
            effectSelectCharacter.style.borderColor = "#9EBC4D";
        } else if (characterI.id == "two") {
            effectSelectCharacter.style.marginRight = "8.6rem";
            effectSelectCharacter.style.borderColor = "#FDC660";
        } else if (characterI.id == "three") {
            effectSelectCharacter.style.marginRight = "0rem";
            effectSelectCharacter.style.borderColor = "#BC4D4F";
        } else if (characterI.id == "four") {
            effectSelectCharacter.style.marginRight = "-8.6rem";
            effectSelectCharacter.style.borderColor = "#4D91BC";
        }

        setTimeout(
            function () {
                effectSelectCharacter.classList.remove('mov');
            },
            1000
        );
    }
}

//Se encarga de realizar un salto del jugador
function jump() {
    if (isJumping || !canJump || jumpCooldown) return;

    player.style.transform = "translateY(-10rem)";
    player.classList.remove("run");
    player.classList.add("jump");
    playerShadow.classList.add("jump");
    isJumping = true;

    setTimeout(
        function () {
            player.style.transform = "translateY(0)";
            playerShadow.classList.remove("jump");
            isJumping = false;
            jumpCooldown = true;

            setTimeout(
                function () {
                    player.classList.remove("jump");
                    player.classList.add("run");
                    jumpCooldown = false;
                },
                400
            );
        },
        500
    );
}
//Verifica si hay una colisión entre el jugador y un obstáculo
function checkCollision(obstacleI) {
    var playerRect = player.getBoundingClientRect();
    var obstacleRect = obstacleI.getBoundingClientRect();

    if (
        playerRect.left + 15 < obstacleRect.right &&
        playerRect.right - 15 > obstacleRect.left &&
        playerRect.top + 15 < obstacleRect.bottom &&
        playerRect.bottom - 15 > obstacleRect.top
    ) {
        player.classList.remove("run");
        player.classList.remove("jump");
        player.classList.add("hurt");
        player.style.transition = "transform 0.1s linear";
        player.style.transform = "translateX(-0.3rem) translateY(-0.3rem) rotateX(-7deg)";
        player.style.animationDuration = "0.2s";

        setTimeout(
            function () {
                player.style.transform = "translateX(0) translateY(0) rotateX(0deg)";
                player.classList.remove("run");
                player.classList.remove("jump");
                player.classList.remove("hurt");
                player.classList.add("default");
                player.style.animationDuration = "0.5s";
            },
            200
        );

        endGame();
    }
}
//Verifica si hay una colisión entre el jugador y un obstáculo
function increaseScore() {
    scoreboard.textContent = Math.round(score / 10).toString().padStart(7, "0");
    score += scoreValue;

    if (score >= nextScore) {
        cloudTransitionDuration *= 1 - percentageIncrease;
        stopCloud();
        updateCloudTransitionDuration();
        moveCloud();

        obstacleSpeed *= 1 + percentageIncrease;

        playerAnimationDuration *= 1 - percentageIncrease;
        player.style.animationDuration = playerAnimationDuration + "s";

        scoreValue *= 1 + percentageIncrease;
        nextScore += scoreIncrement;
        
        sound.play();
    }
}
//Inicia el juego
function startGame() {
    ///NUBES
    cloudTransitionDuration = 15;
    cloudTimeout = setTimeout(startCreateCloud, cloudGenerationTime());
    updateCloudTransitionDuration();
    moveCloud();
    ///SUELO
    ground.style.backgroundPositionX = groundBackgroundPositionX + "px";
    ///OBSTACULO
    obstacleSpeed = 0.65;
    obstacleList.forEach(
        function (obstacle) {
            obstacle.remove();
        }
    );
    obstacleList = [];
    obstacleTimeout = setTimeout(startCreateObstacle, obstacleGenerationTime());
    ///JUGADOR
    playerAnimationDuration = 0.6;
    player.style.transform = "translateY(0)";
    player.style.transition = "transform 0.4s ease-in-out";
    player.style.animationDuration = playerAnimationDuration + "s";
    player.classList.remove("default");
    player.classList.remove("hurt");
    player.classList.add("run");
    canJump = true;
    //PUNTAJE
    score = 0;
    scoreValue = 1;
    nextScore = scoreIncrement;
    ///SISTEMA
    gameStarted = true;
    ///PANTALLA DE INICIO
    contentScreen.style.display = "none";
    contentSelectCharacter.style.display = "none";
    contentImprovements.style.display = "none";
    improvementShow = true;
    clickButtonImprovement();
}
//Fin del juego
function endGame() {
    ///NUBES
    clearTimeout(cloudTimeout);
    stopCloud();
    ///SUELO
    groundBackgroundPositionX = parseFloat(ground.style.backgroundPositionX);
    ///OBSTACULO
    clearTimeout(obstacleTimeout);
    ///JUGADOR
    for (var i = 0; i < character.length; i++) {
        var characterI = character[i];
        if (!characterI.unlocked && score >= characterI.requiredPoints) {
            characterI.unlocked = true;
            // Almacenar el estado de desbloqueo en el almacenamiento del navegador
            localStorage.setItem("character_" + characterI.id + "_unlocked", true);
            // Mostrar botón de cambio de personaje desbloqueado
            showCharacterButton(characterI);
        }
    }
    saveCharacterUnlock();   
    ///PUNTAJE
    saveMaxScore(); 
    ///SISTEMA
    gameStarted = false;
    ///PANTALLA DE INICIO
    contentSelectCharacter.style.display = "flex";
    contentScreen.style.display = "flex";
    contentImprovements.style.display = "flex";
    tittle.textContent = "Game Over";
    contentCurrentScore.style.height = "1rem";
    contentCurrentScore.style.visibility = "visible";
    currentScore.textContent = Math.round(score / 10);
}
//Guarda la puntuación máxima del jugador en el almacenamiento local del navegador
function saveMaxScore() {
    maxScoreLocal = localStorage.getItem("maxScore");
    if (maxScoreLocal === null || score > maxScoreLocal) {
        maxScoreLocal = score;
        localStorage.setItem("maxScore", maxScoreLocal);
    }
    maxScore.textContent = Math.round(maxScoreLocal / 10);
}
//Establece el botón buttonResetScore para la ejecución de la función resetScore()
buttonResetScore.addEventListener("click", resetScore);
//Resetea el puntaje máximo
function resetScore() {
    localStorage.removeItem("maxScore");
    maxScore.textContent = "0";
    for (var i = 0; i < character.length; i++) {
        if (i == 0){
            player.className = character[i].id;
            player.classList.add("default");
        }else{
            var characterI = character[i];
            characterI.unlocked = false;
            localStorage.setItem("character_" + characterI.id + "_unlocked", false);
            showCharacterButton(characterI)
        }
        
    }
}
//Alterna la visibilidad de los elementos en la pantalla de mejoras según el estado del juego
function clickButtonImprovement() {
    if (!gameStarted) {
        if (improvementShow) {
            contentScreen.classList.add("show");
            contentImprovements.classList.add("show");
            improvementShow = false;
        }
        else {
            contentImprovements.classList.remove("show");
            contentScreen.classList.remove("show");
            improvementShow = true;
        }
    }
    else {
        contentImprovements.classList.remove("show");
        contentScreen.classList.remove("show");
        improvementShow = true;
    }
}
//Guarda el estado de desbloqueo de los personajes en el almacenamiento local del navegador 
function saveCharacterUnlock() {
    for (var i = 0; i < character.length; i++) {
        var characterI = character[i];
        localStorage.setItem("character_" + characterI.id + "_unlocked", characterI.unlocked.toString());
    }
}
//Bucle de juego que actualiza y renderiza los elementos del juego de forma continua
function gameLoop() {
    if (gameStarted) {
        moveObstacle();
        increaseScore();
    }
    requestAnimationFrame(gameLoop);
}
//Ejecuta diferentes acciones según el estado del juego y la tecla presionada
document.addEventListener("keydown",
    function (event) {
        if (!gameStarted && event.code === "Space" && document.querySelector('.default')) {
            startGame();
        } else if (gameStarted && event.code === "Space") {
            jump();
        }
    }
);
gameLoop();
// Escuchar mensajes del padre
window.addEventListener("message", function(event) {
    if (event.data === "Obtener código fuente") {
      // Enviar el código fuente HTML al padre
      var htmlCode = document.documentElement.outerHTML;
      parent.postMessage({ htmlCode: htmlCode }, "*");
    }
  });
  
  
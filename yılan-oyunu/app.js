//HTML elementlerini seç
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const scoree = document.querySelector(".scoree");
const highScoreElement = document.querySelector(".high-score");
const again = document.querySelector(".again");
const btn = document.querySelector(".btn");

// Oyunun bitip bitmediğini kontrol eden değişken
let gameOver = false;

// Yem konumunu tutacak değişken
let foodX, foodY;

// Yılanın başlangıç konumunu tutacak değişken
let snakeX = 5, snakeY = 5;

// Yılanın hızını belirleyen değişken
let velocityX = 0, velocityY = 0;

// Yılanın vücudunu temsil eden dizi
let snakeBody = [];

// Oyun döngüsünü kontrol edecek değişken
let setIntervalId;

// Oyun skorunu tutacak değişken 
let score = 0;

// En yüksek skoru localstorage'den alalım
let highScore = localStorage.getItem("high-score") || 0;

// En yüksek skoru ekrana yaz
highScoreElement.innerText = `Max skor: ${highScore}`;


// Yem konumunu rastgele belirleyen fonk.
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// Oyun sona erdiğinde çalışan fonk.
const handleGameOver = () => {
    clearInterval(setIntervalId);

    again.style.display = "flex";
    scoree.innerText = `Skorunuz: ${score}`;
    btn.addEventListener("click", () => {
        location.reload();
    });
};

// Tuşa basıldığında yılanın yönünü değiştiren fonk.
const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

// Oyunu başlatan fonk.

const initGame = () => {
    //Eğer oyun sona ermişse oyunu başlatmadan çık.
    if (gameOver) return handleGameOver();

    // Yılanın ve yemin konumunu html içeriği olarak oluştur.
    let html = `
        <div class="food" style="grid-area: ${foodY} / ${foodX}"></div>
    `;
    // Yılan yemi yemişse
    if (snakeX === foodX && snakeY === foodY) {

        // Yeni yem konumunu belirle
        updateFoodPosition();

        // Yemi yılan vücuduna ekle
        snakeBody.push([foodY, foodX]);

        // Skoru arttır.
        score++;

        // Eğer yeni skor en yüksek skoru geçerse en yüksek skoru güncelle.
        highScore = score >= highScore ? score : highScore;

        // En yüksek skoru locastorage'e kaydet
        localStorage.setItem("high-score", highScore);

        // Skor ve en yüksek skoru ekranda göster.
        scoreElement.innerText = `Skor: ${score}`;
        highScoreElement.innerText = `Max skor: ${highScore}`;
    }

    // Yılanın başını güncelle
    snakeX += velocityX;
    snakeY += velocityY;


    // Yılanın vücudunu kaydırarak haraket etti r.
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    // Yılanın tahta dışına çıkıp çıkmadığını kontrol et
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return (gameOver = true);
    }

    // Yılanın her bir parçasını temsil eden divleri html'e ekle
    for (let i = 0; i < snakeBody.length; i++) {
        html += `
            <div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>
        `;

        // Yılanın başının vücuduyla çarpışıp çarpışmadığını kontrol et.
        if ((i !== 0) && (snakeBody[0][1] === snakeBody[i][1]) && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    // Oyun tahtasını güncelle
    playBoard.innerHTML = html;
};

// Oyunu başlatmadan önce yem konumunu  belirle
updateFoodPosition();

// Oyun döngüsünü başlat
setIntervalId = setInterval(initGame, 100)

// Klavye tuşlarına basıldığında yılanın yönünü değiştir.
document.addEventListener("keyup", changeDirection);
// إعدادات اللعبة
const mario = document.getElementById("mario");
const ground = document.getElementById("ground");
const coins = document.getElementById("coins");
const scoreElement = document.getElementById("score");

let isJumping = false;
let marioBottom = 50; // موقع ماريو على المحور Y
let marioLeft = 50;   // موقع ماريو على المحور X
let gravity = 1; // تأثير الجاذبية
let score = 0; // النقاط
let gameInterval; // لتكرار الأعداء والجوائز

// دالة لتحريك ماريو للأعلى (القفز)
function jump() {
    if (isJumping) return;

    isJumping = true;
    let jumpHeight = 0;

    // قفز ماريو للأعلى
    let jumpInterval = setInterval(() => {
        if (jumpHeight >= 150) {
            clearInterval(jumpInterval);
            fall(); // يبدأ ماريو بالسقوط بعد القفز
        } else {
            jumpHeight += 5;
            marioBottom += 5;
            mario.style.bottom = `${marioBottom}px`;
        }
    }, 20);
}

// دالة لجعل ماريو يسقط بعد القفز
function fall() {
    let fallInterval = setInterval(() => {
        if (marioBottom <= 50) {
            clearInterval(fallInterval);
            isJumping = false;
        } else {
            marioBottom -= gravity;
            mario.style.bottom = `${marioBottom}px`;
        }
    }, 20);
}

// دالة لتحريك ماريو يسارًا ويمينًا
function moveMario(direction) {
    if (direction === "left") {
        marioLeft -= 5; // التحرك لليسار
    } else if (direction === "right") {
        marioLeft += 5; // التحرك لليمين
    }

    // تأكد من عدم الخروج عن الشاشة
    if (marioLeft < 0) marioLeft = 0;
    if (marioLeft > window.innerWidth - mario.offsetWidth) {
        marioLeft = window.innerWidth - mario.offsetWidth;
    }

    mario.style.left = `${marioLeft}px`; // تحديث موقع ماريو
}

// دالة لجمع النقاط عند ملامسة ماريو للعملة
function collectCoin() {
    const marioRect = mario.getBoundingClientRect();
    const coinRect = coins.getBoundingClientRect();

    // إذا اصطدم ماريو بالعملة
    if (marioRect.left < coinRect.right &&
        marioRect.right > coinRect.left &&
        marioRect.top < coinRect.bottom &&
        marioRect.bottom > coinRect.top) {

        // تحريك العملة إلى مكان عشوائي جديد
        coins.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
        coins.style.top = `${Math.random() * (window.innerHeight - 150)}px`;

        // زيادة النقاط
        score++;
        scoreElement.textContent = `النقاط: ${score}`;
    }
}

// دالة لإنشاء حركة الأعداء
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.style.position = 'absolute';
    enemy.style.bottom = '50px';
    enemy.style.left = `${Math.random() * window.innerWidth}px`;
    enemy.style.width = '40px';
    enemy.style.height = '40px';
    enemy.style.backgroundColor = 'red';
    enemy.style.borderRadius = '50%';

    document.body.appendChild(enemy);

    // حركة الأعداء من اليمين لليسار
    let enemyLeft = parseInt(enemy.style.left);

    let enemyInterval = setInterval(() => {
        if (enemyLeft < 0) {
            clearInterval(enemyInterval);
            document.body.removeChild(enemy); // إزالة العدو بعد خروجه من الشاشة
        } else {
            enemyLeft -= 5;
            enemy.style.left = `${enemyLeft}px`;
        }

        // إذا اصطدم ماريو بالعدو، أنهي اللعبة
        const marioRect = mario.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();

        if (marioRect.left < enemyRect.right &&
            marioRect.right > enemyRect.left &&
            marioRect.top < enemyRect.bottom &&
            marioRect.bottom > enemyRect.top) {
            alert("لقد خسرت! النقاط النهائية: " + score);
            resetGame();
        }
    }, 20);
}

// دالة لإعادة تشغيل اللعبة
function resetGame() {
    marioLeft = 50;
    marioBottom = 50;
    score = 0;
    scoreElement.textContent = `النقاط: ${score}`;
    clearInterval(gameInterval);
}

// الاستماع للأحداث (مثل الضغط على زر المسافة أو الأسهم)
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        jump(); // عند الضغط على زر المسافة، قفز ماريو
    } else if (e.code === "ArrowLeft") {
        moveMario("left"); // عند الضغط على السهم الأيسر، تحرك ماريو لليسار
    } else if (e.code === "ArrowRight") {
        moveMario("right"); // عند الضغط على السهم الأيمن، تحرك ماريو لليمين
    }
});

// إعداد اللعبة
gameInterval = setInterval(() => {
    collectCoin(); // تحقق من جمع العملة
    createEnemy(); // إنشاء أعداء
}, 2000);


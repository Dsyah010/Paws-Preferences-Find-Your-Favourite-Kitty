const TOTAL_CATS = 10;
let likedCats = [];
let catData = [];

const cardStack = document.getElementById("card-stack");
const summary = document.getElementById("summary");
const likeCount = document.getElementById("like-count");
const likedCatsDiv = document.getElementById("liked-cats");

// Fetch cat images from Cataas
async function fetchCatImages() {
  for (let i = 0; i < TOTAL_CATS; i++) {
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const imgUrl = `https://cataas.com/cat?unique=${uniqueId}`;
    catData.push(imgUrl);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  renderCards();
}

// Render cat cards
function renderCards() {
  catData.slice().reverse().forEach((src, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.zIndex = index;

    card.innerHTML = `
      <img src="${src}" 
           alt="Cat ${index}" 
           onerror="this.src='https://cataas.com/cat/says/Meow'; this.style.objectFit='contain';" />
    `;

    addSwipeEvents(card, src);
    cardStack.appendChild(card);
  });
}

// Swipe detection
function addSwipeEvents(card, src) {
  let offsetX = 0;
  let startX = 0;
  let isDragging = false;

  const onMove = (x) => {
    if (!isDragging) return;
    offsetX = x - startX;
    card.style.transform = `translateX(${offsetX}px) rotate(${offsetX / 10}deg)`;
  };

  const onEnd = () => {
    isDragging = false;

    if (offsetX > 100) {
      likedCats.push(src);
      swipeCard(card, 'right');
    } else if (offsetX < -100) {
      swipeCard(card, 'left');
    } else {
      card.style.transition = 'transform 0.3s ease-out';
      card.style.transform = 'translateX(0px) rotate(0deg)';
    }
  };

  function swipeCard(card, direction) {
    card.style.transition = 'transform 0.5s ease-out';
    const endPos = direction === 'right' ? 1000 : -1000;
    const rotateDeg = direction === 'right' ? 30 : -30;
    card.style.transform = `translateX(${endPos}px) rotate(${rotateDeg}deg)`;

    setTimeout(() => {
      card.remove();
      checkNext();
    }, 300);
  }

  // Mouse events
  card.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    card.style.transition = 'none';

    const onMouseMove = (e) => onMove(e.clientX);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      onEnd();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Touch events
  card.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    card.style.transition = 'none';
  });

  card.addEventListener('touchmove', (e) => {
    onMove(e.touches[0].clientX);
  });

  card.addEventListener('touchend', () => {
    onEnd();
  });
}

// Show results
function showSummary() {
  likeCount.textContent = likedCats.length;
  likedCats.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    likedCatsDiv.appendChild(img);
  });
  summary.classList.remove("hidden");
}

// Check if all cards are swiped
function checkNext() {
  if (cardStack.childElementCount === 0) {
    showSummary();
  }
}

fetchCatImages();
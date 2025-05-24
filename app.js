document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addBtn');
  const fileInput = document.getElementById('fileInput');
  const cardList = document.getElementById('cardList');
  let cards = [];

  addBtn.addEventListener('click', () => {
    setTimeout(() => {
      fileInput.click();
    }, 0);
  });

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgUrl = URL.createObjectURL(file);
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    const title  = lines[0] || 'Unknown Title';
    const artist = lines[1] || 'Unknown Artist';
    const date = new Date().toISOString().slice(0,10);
    cards.push({ imgUrl, title, artist, date });
    cards.sort((a,b) => b.date.localeCompare(a.date));
    renderCards();
  });

  function renderCards() {
    cardList.innerHTML = '';
    cards.forEach((c, i) => {
      const div = document.createElement('div');
      div.className = 'music-card';
      const angle  = -10 + i * 5;
      const offset = i * 30;
      div.style.transform = `rotateY(${angle}deg) translateX(${offset}px)`;
      div.innerHTML = `
        <img class="album" src="\${c.imgUrl}" alt="앨범 이미지"/>
        <div class="info">
          <h2 class="title">\${c.title}</h2>
          <p class="artist">\${c.artist}</p>
          <p class="date">\${c.date}</p>
          <div class="spotify">
            <img src="spotify-logo.svg" alt="Spotify"/>
          </div>
        </div>
      `;
      cardList.appendChild(div);
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addBtn');
  const fileInput = document.getElementById('fileInput');
  const cardList = document.getElementById('cardList');
  let cards = [];

  addBtn.addEventListener('click', () => {
    setTimeout(() => fileInput.click(), 0);
  });

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgUrl = URL.createObjectURL(file);
    const dominantColor = await getDominantColor(imgUrl);

    let title = 'Unknown Title';
    let artist = 'Unknown Artist';
    const date = new Date().toISOString().slice(0,10);

    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length >= 2) {
        title = lines[0];
        artist = lines[1];
      } else {
        const manual = prompt("곡 제목을 직접 입력해주세요:");
        if (manual) title = manual;
      }
    } catch {
      const manual = prompt("이미지 인식 실패. 곡 제목을 직접 입력해주세요:");
      if (manual) title = manual;
    }

    cards.push({ imgUrl, title, artist, date, bgColor: dominantColor });
    renderCards();
  });

  function renderCards() {
    cardList.innerHTML = '';
    cards.forEach((c, i) => {
      const div = document.createElement('div');
      div.className = 'music-card';
      div.style.backgroundColor = c.bgColor || "#b50000";

      const offset = Math.abs(i - Math.floor(cards.length / 2));
      div.style.transform = `rotateY(${(i - Math.floor(cards.length / 2)) * 5}deg) scale(${1 - offset * 0.05})`;
      div.style.opacity = offset > 2 ? 0.3 : 1;

      div.innerHTML = `
        <img class="album" src="${c.imgUrl}" alt="앨범 이미지"/>
        <div class="info">
          <div class="date">${c.date}</div>
          <h2 class="title">${c.title}</h2>
          <p class="artist">${c.artist}</p>
        </div>
      `;
      cardList.appendChild(div);
    });
  }

  async function getDominantColor(imageUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;

        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4 * 100) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        resolve(`rgb(${r},${g},${b})`);
      };
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const addBtn = document.getElementById('addBtn');
  const cardList = document.getElementById('cardList');
  const cropperContainer = document.getElementById('cropperContainer');
  const cropImage = document.getElementById('cropImage');
  const cropConfirmBtn = document.getElementById('cropConfirmBtn');
  let cropper, originalFile;
  let cards = JSON.parse(localStorage.getItem('musicCards')) || [];

  // Initialize
  renderCards();

  addBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    originalFile = e.target.files[0];
    if (!originalFile) return;
    const url = URL.createObjectURL(originalFile);
    cropImage.src = url;
    cropperContainer.style.display = 'flex';
    setTimeout(() => {
      cropper = new Cropper(cropImage, { aspectRatio: 1, viewMode: 1 });
    }, 100);
  });

  cropConfirmBtn.addEventListener('click', async () => {
    const canvas = cropper.getCroppedCanvas({ width:600, height:600 });
    const croppedUrl = canvas.toDataURL();
    cropper.destroy();
    cropperContainer.style.display = 'none';

    const bgColor = await getDominantColor(croppedUrl);
    let title='Unknown Title', artist='Unknown Artist';
    const date = new Date().toISOString().slice(0,10);

    try {
      const { data: { text } } = await Tesseract.recognize(originalFile, 'kor+eng');
      const lines = text.split('\n').map(l=>l.trim()).filter(l=>l);
      if (lines.length>=2) { title=lines[0]; artist=lines[1]; }
      else { artist = prompt('곡 아티스트명을 입력해주세요:'); }
    } catch {
      title = prompt('곡 제목을 입력해주세요:');
      artist = prompt('곡 아티스트명을 입력해주세요:');
    }

    cards.push({ imgUrl:croppedUrl, title, artist, date, bgColor });
    localStorage.setItem('musicCards', JSON.stringify(cards));
    renderCards();
  });

  function renderCards() {
    cardList.innerHTML = '';
    const mid = Math.floor(cards.length/2);
    cards.forEach((c,i)=>{
      const card = document.createElement('div');
      card.className = 'music-card';
      // Positioning
      const diff = i-mid;
      card.style.transform = `translateX(${diff*60}px) rotateY(${diff*12}deg) scale(${1-Math.abs(diff)*0.05})`;
      card.style.opacity = Math.abs(diff)>2?0.3:1;
      card.style.backgroundColor = c.bgColor;

      card.innerHTML = `
        <button class="delete-btn">×</button>
        <img class="album" src="${c.imgUrl}" alt="album"/>
        <div class="info">
          <div class="date">${c.date}</div>
          <h2 class="title">${c.title}</h2>
          <p class="artist">${c.artist}</p>
        </div>`;

      // Long press to show delete
      let pressTimer;
      card.addEventListener('mousedown', e => {
        e.preventDefault();
        pressTimer = setTimeout(()=> showDelete(card, i), 600);
      });
      card.addEventListener('mouseup', e => { clearTimeout(pressTimer); });
      card.addEventListener('mouseleave', e => { clearTimeout(pressTimer); });
      card.addEventListener('touchstart', e => {
        pressTimer = setTimeout(()=> showDelete(card, i), 600);
      });
      card.addEventListener('touchend', e => { clearTimeout(pressTimer); });

      cardList.appendChild(card);
    });
  }

  function showDelete(card, index) {
    const btn = card.querySelector('.delete-btn');
    btn.style.display = 'flex';
    btn.addEventListener('click', ()=>{
      cards.splice(index,1);
      localStorage.setItem('musicCards', JSON.stringify(cards));
      renderCards();
    });
  }

  async function getDominantColor(url) {
    return new Promise(resolve => {
      const img = new Image(); img.crossOrigin='anonymous'; img.src=url;
      img.onload = ()=>{
        const canvas=document.createElement('canvas');
        const ctx=canvas.getContext('2d');
        canvas.width=img.width; canvas.height=img.height;
        ctx.drawImage(img,0,0);
        const data=ctx.getImageData(0,0,img.width,img.height).data;
        let r=0,g=0,b=0,count=0;
        for(let i=0;i<data.length;i+=4*100){ r+=data[i];g+=data[i+1];b+=data[i+2];count++; }
        resolve(`rgb(${Math.round(r/count)},${Math.round(g/count)},${Math.round(b/count)})`);
      };
    });
  }
});

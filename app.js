/* reset & 기본 */
* { margin:0; padding:0; box-sizing:border-box; }
body, html { width:100%; height:100%; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background:#fff; color:#333; }
#app { padding:16px; }

/* 헤더 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header h1 { font-size:1.2rem; }
#addBtn {
  font-size:1.5rem;
  width:40px; height:40px;
  border:none; border-radius:50%;
  background:#b50000; color:#fff;
}

/* 카드 리스트(3D) */
.card-list {
  margin-top:16px;
  display:flex;
  overflow-x: auto;
  perspective: 1000px;
  height: calc(100vh - 100px);
  align-items: center;
}

/* 개별 카드 */
.music-card {
  flex: 0 0 auto;
  width: 80vw;         /* 모바일 최적화 */
  max-width: 300px;
  margin: 0 10px;
  background-color: #b50000;
  border-radius: 20px;
  padding: 12px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  transform-style: preserve-3d;
  transition: transform 0.3s;
}
.music-card:hover {
  transform: scale(1.03) rotateY(0deg) translateX(0);
}

/* 앨범 이미지 */
.music-card .album {
  width: 100%;
  border-radius: 12px;
}

/* 텍스트 정보 */
.info .title {
  font-size: 1.1rem; font-weight: bold;
  margin-top: 8px;
}
.info .artist {
  font-size: 0.9rem; opacity: 0.9;
  margin-top: 4px;
}
.info .date {
  font-size: 0.8rem; opacity: 0.7;
  margin-top: 4px;
}

/* Spotify 로고 */
.spotify img {
  width: 70px;
  margin-top: 8px;
}

export const webSeriesList = [
  {
    id: 'series-family-man',
    name: 'The Family Man',
    type: 'webseries',
    description: 'Srikant Tiwari is a middle-class man who also serves as a world-class spy for T.A.S.C, a highly classified wing of the National Investigation Agency.',
    logo: 'https://image.tmdb.org/t/p/w500/y73G4pC27k3YjW9G7zZ9k9oPz0Z.jpg',
    genres: ['Action', 'Thriller', 'Drama'],
    isTamil: false,
    episodes: [
      { id: 'ep-1', title: 'Episode 1: The Tasconian Mission', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
      { id: 'ep-2', title: 'Episode 2: Midnight Pursuit', url: 'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8' },
      { id: 'ep-3', title: 'Episode 3: The Threat Within', url: 'https://d2zihajmogu5jn.cloudfront.net/bipbop/bipbopall.m3u8' }
    ]
  },
  {
    id: 'series-panchayat',
    name: 'Panchayat',
    type: 'webseries',
    description: 'Abhishek Tripathi, an engineering graduate, takes up a low-salary job as a secretary in a remote Gram Panchayat office in Phulera, Uttar Pradesh.',
    logo: 'https://image.tmdb.org/t/p/w500/41npv2K626vH2L6g24V5r6F33a6.jpg',
    genres: ['Comedy', 'Drama', 'Village Life'],
    isTamil: false,
    episodes: [
      { id: 'ep-1', title: 'Episode 1: Welcome to Phulera', url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8' },
      { id: 'ep-2', title: 'Episode 2: The Lock & Key Dilemma', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
      { id: 'ep-3', title: 'Episode 3: The Solar Light Dilemma', url: 'https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8' }
    ]
  },
  {
    id: 'series-asur',
    name: 'Asur (Mystic Thriller)',
    type: 'webseries',
    description: 'A unique mythological thriller that pits forensic science against ancient mysticism in a cat-and-mouse game between a forensic expert and a serial killer.',
    logo: 'https://image.tmdb.org/t/p/w500/xZ7oM95e8PecKq1D86b53z9c7wS.jpg',
    genres: ['Mystery', 'Psychological', 'Crime'],
    isTamil: false,
    episodes: [
      { id: 'ep-1', title: 'Episode 1: The Divine Game', url: 'https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8' },
      { id: 'ep-2', title: 'Episode 2: Ashes of the Past', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }
    ]
  }
];

export const animeList = [
  {
    id: 'anime-naruto',
    name: 'Naruto',
    type: 'anime',
    description: 'Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the leader and strongest ninja in his village.',
    logo: 'https://image.tmdb.org/t/p/w500/z55Q4914cJo9qq5QFY19FSZLY27.jpg',
    genres: ['Anime', 'Action', 'Adventure'],
    isTamil: false,
    episodes: [
      { id: 'ep-1', title: 'Episode 1: Enter Naruto Uzumaki!', url: 'https://archive.org/download/naruto-season-1-5/Naruto%20Season%201/Naruto%20-%20001%20-%20Enter%20Naruto%20Uzumaki%21.mp4' },
      { id: 'ep-2', title: 'Episode 2: My Name is Konohamaru!', url: 'https://archive.org/download/naruto-season-1-5/Naruto%20Season%201/Naruto%20-%20002%20-%20My%20Name%20is%20Konohamaru%21.mp4' },
      { id: 'ep-3', title: 'Episode 3: Sasuke and Sakura: Friends or Foes?', url: 'https://archive.org/download/naruto-season-1-5/Naruto%20Season%201/Naruto%20-%20003%20-%20Sasuke%20and%20Sakura%3B%20Friends%20or%20Foes%3F.mp4' }
    ]
  },
  {
    id: 'anime-demon-slayer',
    name: 'Demon Slayer',
    type: 'anime',
    description: 'In Taisho-era Japan, Tanjiro Kamado sets off on a quest to become a demon slayer after his family is slaughtered and his sister Nezuko is transformed into a demon.',
    logo: 'https://image.tmdb.org/t/p/w500/3U8q6526w1b5t1a1W5q9oPz0Z.jpg',
    genres: ['Anime', 'Action', 'Fantasy'],
    isTamil: false,
    episodes: [
      { id: 'ep-1', title: 'Episode 1: Cruel Destiny & Red Snow', url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8' },
      { id: 'ep-2', title: 'Episode 2: Training on Mt. Sagiri', url: 'https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8' },
      { id: 'ep-3', title: 'Episode 3: The Final Selection', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 'anime-aot',
    name: 'Attack on Titan',
    type: 'anime',
    description: 'Eren Yeager vows to cleanse the earth of giant human-eating Titans after witnessing his hometown breached and his mother devoured.',
    logo: 'https://image.tmdb.org/t/p/w500/hTk625u7wsaSd6nI6Xtzy7wS.jpg',
    genres: ['Anime', 'Sci-Fi', 'Survival'],
    isTamil: false,
    episodes: [
      { id: 'ep-1', title: 'Episode 1: To You, in 2000 Years', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
      { id: 'ep-2', title: 'Episode 2: The Walled Shiganshina Collapses', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }
    ]
  }
];

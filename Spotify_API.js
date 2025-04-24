// Spotify API credentials
const clientId = 'f605cace67cb4f53a2c933b9d58c495a';
const clientSecret = '5f2bbbe9488b42ae8081a68fba54528d';

// Spotify Access Token 
let accessToken = '';

// Function to get Spotify Access Token (Client Credentials Flow)
async function getSpotifyAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  accessToken = data.access_token;
}

// Ensures access token exists before calling Spotify API
async function ensureAccessToken() {
  if (!accessToken) {
    await getSpotifyAccessToken();
  }
}

// Search Spotify API for songs
async function searchSpotify(query) {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  console.log("SPOTIFY DATA:", data);  // 🔍 Check this in browser console
  return data.tracks?.items || [];
}
  const data = await response.json();
  return data.tracks.items;  // Returns an array of tracks
}

// Display results on the page
function displayResults(tracks) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';  // Clear previous results

  tracks.forEach(track => {
    const trackElement = document.createElement('div');
    trackElement.classList.add('track');

    trackElement.innerHTML = `
      <p><strong>${track.name}</strong> by ${track.artists.map(artist => artist.name).join(', ')}</p>
      <p><em>Album: ${track.album.name}</em></p>
      <a href="${track.external_urls.spotify}" target="_blank">Listen on Spotify</a>
      ${track.preview_url ? `<audio controls>
        <source src="${track.preview_url}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>` : '<p>No preview available.</p>'}
    `;

    resultsDiv.appendChild(trackElement);
  });
}

// Event listener for search button
document.getElementById('searchButton').addEventListener('click', async () => {
  const query = document.getElementById('searchQuery').value.trim();

  if (query) {
    await ensureAccessToken();
    const tracks = await searchSpotify(query);
    displayResults(tracks);
  } else {
    alert('Please enter a song name!');
  }
});

// Optional: Get token on load (if you want to pre-load it)
getSpotifyAccessToken();

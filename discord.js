const discordId = "616547060891648002"; // Replace with your Discord ID

// Get elements
const avatarEl = document.getElementById("avatar");
const usernameEl = document.getElementById("username");
const badgesEl = document.getElementById("badges");
const statusEl = document.getElementById("status");
const spotifyTextEl = document.getElementById("spotify-text");
const spotifyAlbumEl = document.getElementById("spotify-album");
const activityEl = document.getElementById("current-activity");

// Your badges (manual display)
const MY_BADGES = {
    developer: "images/developer.svg",
    hypesquad_bravery: "images/hypesquadbravery.svg",
    tag_badge: "images/username.png",
    completed_quest: "images/quest.png",
};

// Status emojis
const STATUS_EMOJI = {
    online: "🟢",
    idle: "🌙",
    dnd: "⛔",
    offline: "⚫"
};

// Connect to Lanyard WebSocket
const ws = new WebSocket("wss://api.lanyard.rest/socket");

ws.onopen = () => {
    console.log("Connected to Lanyard WebSocket");
    ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: discordId } }));
};

ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
        const data = msg.d;
        const user = data.discord_user;

        // Avatar & username
        avatarEl.src = `https://cdn.discordapp.com/avatars/${discordId}/${user.avatar}.png?size=256`;
        usernameEl.textContent = user.username;

        // Status emoji only
        const status = data.discord_status || "offline";
        statusEl.textContent = STATUS_EMOJI[status] || "⚫";

        // Display all badges manually
        badgesEl.innerHTML = "";
        for (const [badge, url] of Object.entries(MY_BADGES)) {
            const img = document.createElement("img");
            img.src = url;
            img.alt = badge;
            img.className = "badge";
            badgesEl.appendChild(img);
        }

        // Current activity text only
        let activityText = "Currently doing nothing";
        if (data.activities && data.activities.length) {
            const normalActivity = data.activities.find(a => a.type !== 2 && a.name !== "Spotify");
            if (normalActivity) {
                activityText = normalActivity.name;
                if (normalActivity.state) activityText += normalActivity.state ? `: ${normalActivity.state}` : "";
            }
        }
        activityEl.textContent = activityText;

        // Spotify embed (song name only, larger album art)
        if (data.spotify) {
            spotifyTextEl.textContent = data.spotify.song;
            spotifyAlbumEl.src = data.spotify.album_art_url;
            spotifyAlbumEl.style.display = "block";
        } else {
            spotifyTextEl.textContent = "";
            spotifyAlbumEl.style.display = "none";
        }
    }
};

ws.onclose = () => console.log("Disconnected from Lanyard WebSocket");
ws.onerror = (err) => console.error("WebSocket error:", err);

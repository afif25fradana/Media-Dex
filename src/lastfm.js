/**
 * Last.fm Vinyl Player Integration for Media-Dex
 * Persona 5 styled live broadcast & recent scrobble status + 30-day telemetry
 */

export async function initLastFm(lastfmConfig = {}) {
  const { username = 'oxanara', apiKey = '' } = lastfmConfig || {};

  const elements = {
    title: document.getElementById('lastfmTrackTitle'),
    artist: document.getElementById('lastfmTrackArtist'),
    album: document.getElementById('lastfmTrackAlbum'),
    meta: document.getElementById('lastfmTrackMeta'),
    badge: document.getElementById('lastfmStatusBadge'),
    recordGroup: document.getElementById('lastfmRecordGroup'),
    tonearm: document.getElementById('lastfmTonearm'),
    eq: document.querySelector('.lastfm-eq'),
    vinylArt: document.getElementById('lastfmVinylArt'),
    time: document.getElementById('lastfmTrackTime'),
    trackLink: document.getElementById('lastfmTrackLink'),
    led: document.getElementById('lastfmPowerLed'),
    stage: document.querySelector('.lastfm-stage'),
    totalScrobblesChip: document.getElementById('lastfmMonthlyScrobbles'),
    totalScrobblesVal: document.getElementById('lastfmTotalScrobblesVal'),
    monthlyArtistsVal: document.getElementById('lastfmMonthlyArtistsVal'),
    monthlyTracksVal: document.getElementById('lastfmMonthlyTracksVal'),
    topArtistsList: document.getElementById('lastfmTopArtistsList'),
    topTracksList: document.getElementById('lastfmTopTracksList'),
    profileLink: document.getElementById('lastfmProfileLink')
  };

  const updateProfileLink = () => {
    if (elements.profileLink) {
      elements.profileLink.href = `https://www.last.fm/user/${encodeURIComponent(username)}`;
    }
  };

  const formatRelativeTime = (uts) => {
    if (!uts) return 'STANDBY';
    const sec = Math.max(0, Math.floor(Date.now() / 1000 - Number(uts)));
    if (sec < 60) return 'JUST NOW';
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}M AGO`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}H AGO`;
    return `${Math.floor(hr / 24)}D AGO`;
  };

  const setStandby = () => {
    if (elements.badge) {
      elements.badge.textContent = 'STANDBY';
      elements.badge.classList.remove('badge-live');
    }
    if (elements.title) {
      elements.title.textContent = 'RADIO STANDBY';
    }
    if (elements.artist) {
      elements.artist.textContent = 'STANDBY';
    }
    if (elements.album) {
      elements.album.textContent = 'STANDBY';
    }
    if (elements.time) {
      elements.time.textContent = 'STANDBY';
    }
    if (elements.recordGroup) {
      elements.recordGroup.classList.remove('is-playing');
    }
    if (elements.tonearm) {
      elements.tonearm.classList.remove('is-playing');
    }
    if (elements.eq) {
      elements.eq.classList.remove('is-active');
    }
    if (elements.led) {
      elements.led.classList.remove('is-live');
    }
    if (elements.vinylArt) {
      elements.vinylArt.setAttribute('href', '');
      elements.vinylArt.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '');
    }
    updateProfileLink();
  };

  const isConfigured = Boolean(apiKey && apiKey !== 'PASTE_YOUR_API_KEY_HERE' && apiKey.trim() !== '');

  if (!isConfigured) {
    setStandby();
    return;
  }

  const fetchTrack = async () => {
    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(username)}&api_key=${encodeURIComponent(apiKey)}&format=json&limit=1`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) {
        setStandby();
        return;
      }

      const json = await res.json();
      let track = json?.recenttracks?.track;
      if (Array.isArray(track)) {
        track = track[0];
      }
      if (!track) {
        setStandby();
        return;
      }

      const isPlaying = track['@attr']?.nowplaying === 'true';
      const title = track.name || 'UNKNOWN TRACK';
      const artist = track.artist?.['#text'] || track.artist?.name || (typeof track.artist === 'string' ? track.artist : 'UNKNOWN ARTIST');
      const album = track.album?.['#text'] || (typeof track.album === 'string' ? track.album : '') || 'STANDBY';

      let coverUrl = '';
      if (Array.isArray(track.image)) {
        const xl = track.image.find(img => img.size === 'extralarge');
        const lg = track.image.find(img => img.size === 'large');
        const any = track.image.find(img => img['#text']);
        coverUrl = xl?.['#text'] || lg?.['#text'] || any?.['#text'] || '';
      }

      const isStarPlaceholder = coverUrl.includes('2a96cbd8b46e442fc41c2b86b821562f');
      if (!coverUrl || isStarPlaceholder) {
        try {
          const itunesRes = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(`${artist} ${title}`)}&entity=song&limit=1`,
            { signal: AbortSignal.timeout(3500) }
          );
          if (itunesRes.ok) {
            const itunesData = await itunesRes.json();
            const match = itunesData.results?.[0];
            const itArtist = (match?.artistName || '').toLowerCase();
            const qArtist = artist.toLowerCase();
            const isMatch = itArtist.includes(qArtist) || qArtist.includes(itArtist);
            if (isMatch && match?.artworkUrl100) {
              coverUrl = match.artworkUrl100.replace('100x100bb', '600x600bb');
            }
          }
        } catch {}
      }

      if (elements.vinylArt && coverUrl) {
        elements.vinylArt.setAttribute('href', coverUrl);
        elements.vinylArt.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', coverUrl);
      }

      if (elements.title) {
        elements.title.textContent = title;
      }
      if (elements.artist) {
        elements.artist.textContent = artist;
      }
      if (elements.album) {
        elements.album.textContent = album;
      }

      const totalScrobbles = json?.recenttracks?.['@attr']?.total;
      if (totalScrobbles) {
        const formatted = Number(totalScrobbles).toLocaleString('en-US');
        if (elements.totalScrobblesChip) elements.totalScrobblesChip.textContent = `${formatted} SCROBBLES`;
        if (elements.totalScrobblesVal) elements.totalScrobblesVal.textContent = formatted;
      }

      const trackUrl = track.url || `https://www.last.fm/user/${encodeURIComponent(username)}`;
      if (elements.trackLink) {
        elements.trackLink.href = trackUrl;
      }

      if (isPlaying) {
        if (elements.recordGroup) elements.recordGroup.classList.add('is-playing');
        if (elements.tonearm) elements.tonearm.classList.add('is-playing');
        if (elements.badge) {
          elements.badge.textContent = '● ON AIR';
          elements.badge.classList.add('badge-live');
        }
        if (elements.eq) elements.eq.classList.add('is-active');
        if (elements.led) elements.led.classList.add('is-live');
        if (elements.time) elements.time.textContent = 'PLAYING NOW';
      } else {
        if (elements.recordGroup) elements.recordGroup.classList.remove('is-playing');
        if (elements.tonearm) elements.tonearm.classList.remove('is-playing');
        if (elements.badge) {
          elements.badge.textContent = 'LAST SCROBBLED';
          elements.badge.classList.remove('badge-live');
        }
        if (elements.eq) elements.eq.classList.remove('is-active');
        if (elements.led) elements.led.classList.remove('is-live');
        if (elements.time) elements.time.textContent = formatRelativeTime(track.date?.uts);
      }

      updateProfileLink();
    } catch {
      setStandby();
    }
  };

  const fetchMonthlyTelemetry = async () => {
    try {
      const base = 'https://ws.audioscrobbler.com/2.0/?format=json&period=1month&limit=5';
      const artistsUrl = `${base}&method=user.gettopartists&user=${encodeURIComponent(username)}&api_key=${encodeURIComponent(apiKey)}`;
      const tracksUrl = `${base}&method=user.gettoptracks&user=${encodeURIComponent(username)}&api_key=${encodeURIComponent(apiKey)}`;

      const [artistsRes, tracksRes] = await Promise.allSettled([
        fetch(artistsUrl, { signal: AbortSignal.timeout(5000) }),
        fetch(tracksUrl, { signal: AbortSignal.timeout(5000) })
      ]);

      if (artistsRes.status === 'fulfilled' && artistsRes.value.ok) {
        const data = await artistsRes.value.json();
        const artists = data?.topartists?.artist || [];
        const totalUniqueArtists = data?.topartists?.['@attr']?.total;
        if (elements.monthlyArtistsVal && totalUniqueArtists) {
          elements.monthlyArtistsVal.textContent = Number(totalUniqueArtists).toLocaleString('en-US');
        }
        if (elements.topArtistsList && Array.isArray(artists) && artists.length > 0) {
          elements.topArtistsList.innerHTML = artists.slice(0, 5).map((art, idx) => `
            <div class="lastfm-rank-item">
              <span class="lastfm-rank-num">#0${idx + 1}</span>
              <a href="${art.url || '#'}" target="_blank" rel="noopener noreferrer" class="lastfm-rank-name">${art.name}</a>
              <span class="lastfm-rank-count">${Number(art.playcount || 0).toLocaleString('en-US')} PLAYS</span>
            </div>
          `).join('');
        }
      }

      if (tracksRes.status === 'fulfilled' && tracksRes.value.ok) {
        const data = await tracksRes.value.json();
        const tracks = data?.toptracks?.track || [];
        const totalUniqueTracks = data?.toptracks?.['@attr']?.total;
        if (elements.monthlyTracksVal && totalUniqueTracks) {
          elements.monthlyTracksVal.textContent = Number(totalUniqueTracks).toLocaleString('en-US');
        }
        if (elements.topTracksList && Array.isArray(tracks) && tracks.length > 0) {
          elements.topTracksList.innerHTML = tracks.slice(0, 5).map((trk, idx) => `
            <div class="lastfm-rank-item">
              <span class="lastfm-rank-num">#0${idx + 1}</span>
              <a href="${trk.url || '#'}" target="_blank" rel="noopener noreferrer" class="lastfm-rank-name" title="${trk.name}">${trk.name}</a>
              <span class="lastfm-rank-count">${Number(trk.playcount || 0).toLocaleString('en-US')} PLAYS</span>
            </div>
          `).join('');
        }
      }
    } catch {}
  };

  await fetchTrack();
  fetchMonthlyTelemetry();

  if (elements.stage) {
    elements.stage.onclick = () => {
      const url = elements.trackLink?.href || `https://www.last.fm/user/${encodeURIComponent(username)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    };
    elements.stage.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        elements.stage.click();
      }
    };
  }

  if (!window.__lastFmPollingStarted) {
    window.__lastFmPollingStarted = true;
    setInterval(() => {
      if (document.visibilityState === 'visible') fetchTrack();
    }, 30000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') fetchTrack();
    });
  }
}

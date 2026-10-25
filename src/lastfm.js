/**
 * Last.fm Vinyl Player Integration for Media-Dex
 * Persona 5 styled live broadcast & recent scrobble status + 30-day telemetry
 */

import { esc, sanitizeUrl } from './utils.js';

export async function initLastFm(lastfmConfig = {}) {
  const { username = '', apiKey = '' } = lastfmConfig || {};

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
      elements.profileLink.href = username
        ? `https://www.last.fm/user/${encodeURIComponent(username)}`
        : '#';
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
    }
    if (elements.trackLink) {
      elements.trackLink.setAttribute('aria-disabled', 'true');
      elements.trackLink.setAttribute('href', '#');
      elements.trackLink.removeAttribute('target');
    }
    updateProfileLink();
  };

  const isConfigured = Boolean(
    apiKey && apiKey !== 'PASTE_YOUR_API_KEY_HERE' && apiKey.trim() !== '' &&
    username && username.trim() !== ''
  );

  if (!isConfigured) {
    setStandby();
    return;
  }

  let hasValidTrack = false;
  let inFlightTrack = false;
  let lastFetchTime = 0;

  const fetchTrack = async () => {
    if (inFlightTrack) return;
    inFlightTrack = true;
    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(username)}&api_key=${encodeURIComponent(apiKey)}&format=json&limit=1`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) {
        if (!hasValidTrack) setStandby();
        return;
      }

      const json = await res.json();
      let track = json?.recenttracks?.track;
      if (Array.isArray(track)) {
        track = track[0];
      }
      if (!track) {
        if (!hasValidTrack) setStandby();
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
        const safeCover = sanitizeUrl(coverUrl);
        if (safeCover && safeCover !== '#') {
          elements.vinylArt.setAttribute('href', safeCover);
        }
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

      const rawTrackUrl = track.url || `https://www.last.fm/user/${encodeURIComponent(username)}`;
      const trackUrl = sanitizeUrl(rawTrackUrl);
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
      hasValidTrack = true;
    } catch {
      if (!hasValidTrack) {
        setStandby();
      }
    } finally {
      inFlightTrack = false;
      lastFetchTime = Date.now();
    }
  };

  const renderTelemetry = (data) => {
    if (!data) return;
    if (elements.monthlyArtistsVal && data.totalUniqueArtists) {
      elements.monthlyArtistsVal.textContent = Number(data.totalUniqueArtists).toLocaleString('en-US');
    }
    if (elements.topArtistsList) {
      if (Array.isArray(data.artists) && data.artists.length > 0) {
        elements.topArtistsList.innerHTML = data.artists.slice(0, 5).map((art, idx) => `
          <div class="lastfm-rank-item">
            <span class="lastfm-rank-num">#0${idx + 1}</span>
            <a href="${sanitizeUrl(art.url)}" target="_blank" rel="noopener noreferrer" class="lastfm-rank-name">${esc(art.name)}</a>
            <span class="lastfm-rank-count">${Number(art.playcount || 0).toLocaleString('en-US')} PLAYS</span>
          </div>
        `).join('');
      } else {
        elements.topArtistsList.innerHTML = '<div class="lastfm-rank-item"><span class="lastfm-rank-num">--</span><span class="lastfm-rank-name">NO ARCHIVE DATA</span><span class="lastfm-rank-count">0 PLAYS</span></div>';
      }
    }

    if (elements.monthlyTracksVal && data.totalUniqueTracks) {
      elements.monthlyTracksVal.textContent = Number(data.totalUniqueTracks).toLocaleString('en-US');
    }
    if (elements.topTracksList) {
      if (Array.isArray(data.tracks) && data.tracks.length > 0) {
        elements.topTracksList.innerHTML = data.tracks.slice(0, 5).map((trk, idx) => `
          <div class="lastfm-rank-item">
            <span class="lastfm-rank-num">#0${idx + 1}</span>
            <a href="${sanitizeUrl(trk.url)}" target="_blank" rel="noopener noreferrer" class="lastfm-rank-name" title="${esc(trk.name)}">${esc(trk.name)}</a>
            <span class="lastfm-rank-count">${Number(trk.playcount || 0).toLocaleString('en-US')} PLAYS</span>
          </div>
        `).join('');
      } else {
        elements.topTracksList.innerHTML = '<div class="lastfm-rank-item"><span class="lastfm-rank-num">--</span><span class="lastfm-rank-name">NO ARCHIVE DATA</span><span class="lastfm-rank-count">0 PLAYS</span></div>';
      }
    }
  };

  const fetchMonthlyTelemetry = async () => {
    const cacheKey = `dex_lastfm_telemetry_${username}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed.timestamp === 'number' && (Date.now() - parsed.timestamp < 3600000) && parsed.data) {
          renderTelemetry(parsed.data);
          return;
        }
      }
    } catch {}

    try {
      const base = 'https://ws.audioscrobbler.com/2.0/?format=json&period=1month&limit=5';
      const artistsUrl = `${base}&method=user.gettopartists&user=${encodeURIComponent(username)}&api_key=${encodeURIComponent(apiKey)}`;
      const tracksUrl = `${base}&method=user.gettoptracks&user=${encodeURIComponent(username)}&api_key=${encodeURIComponent(apiKey)}`;

      const [artistsRes, tracksRes] = await Promise.allSettled([
        fetch(artistsUrl, { signal: AbortSignal.timeout(5000) }),
        fetch(tracksUrl, { signal: AbortSignal.timeout(5000) })
      ]);

      const telemetryData = {
        artists: [],
        totalUniqueArtists: null,
        tracks: [],
        totalUniqueTracks: null
      };

      if (artistsRes.status === 'fulfilled' && artistsRes.value.ok) {
        const data = await artistsRes.value.json();
        telemetryData.artists = data?.topartists?.artist || [];
        telemetryData.totalUniqueArtists = data?.topartists?.['@attr']?.total || null;
      }

      if (tracksRes.status === 'fulfilled' && tracksRes.value.ok) {
        const data = await tracksRes.value.json();
        telemetryData.tracks = data?.toptracks?.track || [];
        telemetryData.totalUniqueTracks = data?.toptracks?.['@attr']?.total || null;
      }

      renderTelemetry(telemetryData);

      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data: telemetryData
        }));
      } catch {}
    } catch (err) {
      console.warn('Last.fm telemetry unavailable:', err);
    }
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
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        if (now - lastFetchTime >= 15000) {
          fetchTrack();
        }
      }
    });
  }
}

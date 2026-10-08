/**
 * Last.fm Vinyl Player Integration for Media-Dex
 * Persona 5 styled live broadcast & recent scrobble status
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
    profileLink: document.getElementById('lastfmProfileLink')
  };

  const updateProfileLink = () => {
    if (elements.profileLink) {
      elements.profileLink.href = `https://www.last.fm/user/${encodeURIComponent(username)}`;
    }
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
      elements.artist.textContent = '—';
    }
    if (elements.album) {
      elements.album.textContent = '—';
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
      const album = track.album?.['#text'] || (typeof track.album === 'string' ? track.album : '—');

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
            const rawArt = itunesData.results?.[0]?.artworkUrl100;
            if (rawArt) coverUrl = rawArt.replace('100x100bb', '600x600bb');
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

      if (isPlaying) {
        if (elements.recordGroup) elements.recordGroup.classList.add('is-playing');
        if (elements.tonearm) elements.tonearm.classList.add('is-playing');
        if (elements.badge) {
          elements.badge.textContent = '● ON AIR';
          elements.badge.classList.add('badge-live');
        }
        if (elements.eq) elements.eq.classList.add('is-active');
      } else {
        if (elements.recordGroup) elements.recordGroup.classList.remove('is-playing');
        if (elements.tonearm) elements.tonearm.classList.remove('is-playing');
        if (elements.badge) {
          elements.badge.textContent = 'LAST SCROBBLED';
          elements.badge.classList.remove('badge-live');
        }
        if (elements.eq) elements.eq.classList.remove('is-active');
      }

      updateProfileLink();
    } catch {
      setStandby();
    }
  };

  await fetchTrack();
}

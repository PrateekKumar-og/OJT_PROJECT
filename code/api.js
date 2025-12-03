
// ITUNES API SERVICE

const MusicAPI = {
    /**
     * Search for tracks by query (song name or artist)
     * @param {string} query - Search term
     * @returns {Promise<Array>} Array of song objects
     */
    async searchTracks(query) {
        if (!query || query.trim() === '') {
            return this.getRecommendedTracks();
        }

        try {
            const encodedQuery = encodeURIComponent(query);
            const url = `https://itunes.apple.com/search?term=${encodedQuery}&media=music&entity=song&limit=30`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                return this.transformTracks(data.results);
            }

            return [];
        } catch (error) {
            console.error('Error searching tracks:', error);
            return [];
        }
    },

    /**
     * Get recommended/popular tracks for home page
     * Uses a mix of popular artists to simulate recommendations
     * @returns {Promise<Array>} Array of song objects
     */
    async getRecommendedTracks() {
        try {
            // Search for popular tracks from various popular artists
            const popularSearches = ['billie eilish', 'the weeknd', 'taylor swift', 'ed sheeran', 'ariana grande'];
            const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)];

            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(randomSearch)}&media=music&entity=song&limit=6`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                return this.transformTracks(data.results);
            }

            return [];
        } catch (error) {
            console.error('Error fetching recommended tracks:', error);
            return [];
        }
    },

    /**
     * Transform iTunes API response to match existing song object structure
     * @param {Array} tracks - Raw tracks from iTunes API
     * @returns {Array} Transformed song objects
     */
    transformTracks(tracks) {
        return tracks.map(track => ({
            name: track.trackName || 'Unknown Title',
            artist: track.artistName || 'Unknown Artist',
            image: track.artworkUrl100?.replace('100x100', '300x300') || track.artworkUrl60?.replace('60x60', '300x300') || 'https://via.placeholder.com/300',
            audio: track.previewUrl || '',
            id: track.trackId
        }));
    }
};

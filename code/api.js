// ITUNES API SERVICE
const MusicAPI = {
    /**
     * @param {string} query 
     * @returns {Promise<Array>} 
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
     * @returns {Promise<Array>} 
     */
    async getRecommendedTracks() {
        try {

            const popularSearches = ['billie eilish', 'the weeknd', 'taylor swift', 'ed sheeran', 'ariana grande'];
            const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)];

            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(randomSearch)}&media=music&entity=song&limit=`;

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
     * @param {Array} tracks 
     * @returns {Array} 
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

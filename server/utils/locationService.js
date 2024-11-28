import axios from 'axios';

class LocationService {
    constructor() {
        // Free API for Indian locations
        this.baseUrl = 'https://api.postalpincode.in/postoffice';
    }

    async getLocationSuggestions(query) {
        try {
            const response = await axios.get(`${this.baseUrl}/${query}`);
            
            if (response.data && response.data[0] && response.data[0].PostOffice) {
                // Remove duplicates and extract unique locations
                const locations = [...new Set(
                    response.data[0].PostOffice.map(office => ({
                        name: `${office.Name}, ${office.District}, ${office.State}`,
                        district: office.District,
                        state: office.State
                    }))
                )];

                return locations.slice(0, 10); // Limit to 10 suggestions
            }
            return [];
        } catch (error) {
            console.error('Location suggestion error:', error);
            return [];
        }
    }
}

export default new LocationService();
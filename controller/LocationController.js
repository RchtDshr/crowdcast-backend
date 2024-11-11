const Location = require('../models/location');
const Advertisement = require('../models/advertisement');


const addAdToLocation = async (ad) => {
    try {
        const { locationName, ageGroup, gender, id: adId } = ad;
        
        // Find or create the location document
        let location = await Location.findOne({ locationName });
        if (!location) {
            location = new Location({
                locationName,
                adGroupings: [],
            });
        }

        // Find the ad grouping within the location
        let adGrouping = location.adGroupings.find(
            (group) => group.ageGroup === ageGroup && group.gender === gender
        );

        // If the ad grouping doesn't exist, create it and add it to the adGroupings array
        if (!adGrouping) {
            adGrouping = {
                ageGroup,
                gender,
                adIds: [adId], // Initialize with the adId
            };
            location.adGroupings.push(adGrouping);
        } else {
            // If adGrouping exists, push the new adId if it's not already present
            if (!adGrouping.adIds.includes(adId)) {
                adGrouping.adIds.push(adId);
            }
        }

        // Mark the adGroupings array as modified to ensure Mongoose updates it
        location.markModified('adGroupings');

        // Save the location document
        await location.save();

        console.log(`Advertisement with ID ${adId} added to location: ${locationName}`);
    } catch (error) {
        console.error('Error adding advertisement to location:', error);
    }
};

const getAdIdsByGrouping = async (req, res) => {
    try {
        const { ageGroup, gender, locationName } = req.body;

        const location = await Location.findOne({ locationName });
        if (!location) {
            console.log(`No location found with name: ${locationName}`);
            return res.status(404).json({ message: `No location found with name: ${locationName}` });
        }

        const adGrouping = location.adGroupings.find(
            (group) => group.ageGroup === ageGroup && group.gender === gender
        );

        if (!adGrouping) {
            console.log(`No ad grouping found for age group: ${ageGroup} and gender: ${gender}`);
            return res.status(404).json({ message: `No ad grouping found for age group: ${ageGroup} and gender: ${gender}` });
        }

        return res.status(200).json({ adIds: adGrouping.adIds });
    } catch (error) {
        console.error('Error fetching ad IDs:', error);
        return res.status(500).json({ message: 'Error fetching ad IDs', error });
    }
};


module.exports = {
    addAdToLocation,
    getAdIdsByGrouping,
};
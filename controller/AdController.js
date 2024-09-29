const Advertisement = require('../models/advertisement'); // Make sure to import your model

const createAd = async (req, res) => {
    try {
        // Parse the JSON string for ads
        const ads = JSON.parse(req.body.ads);
        const adName = req.body.adName; // Don't parse this, it should already be a string

        // Check if ads is an array
        if (!Array.isArray(ads)) {
            return res.status(400).json({ message: 'Ads must be an array' });
        }

        // Array to store created ads
        const createdAds = [];

        // Process each ad object
        for (const ad of ads) {
            const { location, ageGroup, gender, price } = ad;

            // Create a new Advertisement object
            const newAd = new Advertisement({
                adName: adName,
                gender: gender,
                locationName: location,
                ageGroup: ageGroup,
                creditsDeducted: price
            });

            // Save the new advertisement
            const savedAd = await newAd.save();
            createdAds.push(savedAd);

            console.log(`Ad created: Location: ${location}, Age Group: ${ageGroup}, Gender: ${gender}, Price: ${price}`);
        }

        // Send a success response with created ads
        res.status(200).json({ 
            message: 'Ads processed and saved successfully', 
            ads: createdAds 
        });
    } catch (error) {
        console.error('Error processing ads:', error);
        res.status(500).json({ message: 'Error processing ads', error: error.message });
    }
};

module.exports = {
    createAd
};
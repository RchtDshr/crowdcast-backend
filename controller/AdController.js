const Advertisement = require('../models/advertisement'); // Make sure to import your model
const User = require('../models/user');

const createAd = async (req, res) => {
    try {
        // Parse the JSON string for ads
        const ads = JSON.parse(req.body.ads);
        const adName = req.body.adName; // Don't parse this, it should already be a string
        const userId = req.user;
        
        // Check if ads is an array
        if (!Array.isArray(ads)) {
            return res.status(400).json({ message: 'Ads must be an array' });
        }

        // Array to store created ads
        const createdAds = [];

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Process each ad object
        for (const ad of ads) {
            const { location, ageGroup, gender, price } = ad;

            // Create a new Advertisement object
            const newAd = new Advertisement({
                adName: adName,
                gender: gender,
                locationName: location,
                ageGroup: ageGroup,
                creditsDeducted: price,
                userId
            });

            // Save the new advertisement
            const savedAd = await newAd.save();
            createdAds.push(savedAd);

            // Add the saved ad ID to the user's adsPosted array
            user.adsPosted.push(savedAd._id);

            // console.log(`Ad created: Location: ${location}, Age Group: ${ageGroup}, Gender: ${gender}, Price: ${price}`);
        }

        // Save the updated user
        await user.save();

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

const getUserAds = async (req, res) => {
    try {
        const userId = req.user;  // Extracted from JWT by the middleware

        // Find the user and populate their adsPosted field
        const user = await User.findById(userId).populate('adsPosted', 'adName ageGroup locationName gender creditsDeducted');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Transform the ads array into a single object
        const adsData = {
            adName: user.adsPosted.length > 0 ? user.adsPosted[0].adName : '',  // Assume all ads have the same adName
            locations: [],
            genders: [],
            ageGroups: [],
            creditsDeducted: 0
        };

        user.adsPosted.forEach(ad => {
            adsData.locations.push(ad.locationName);
            adsData.genders.push(ad.gender);
            adsData.ageGroups.push(ad.ageGroup);
            adsData.creditsDeducted += ad.creditsDeducted;  // Sum credits deducted
        });

        // Removing duplicates in locations, genders, and ageGroups
        adsData.locations = [...new Set(adsData.locations)];
        adsData.genders = [...new Set(adsData.genders)];
        adsData.ageGroups = [...new Set(adsData.ageGroups)];

        res.status(200).json({
            message: 'Ads retrieved successfully',
            ads: adsData
        });
    } catch (error) {
        console.error('Error retrieving user ads:', error);
        res.status(500).json({ message: 'Error retrieving user ads', error: error.message });
    }
};


module.exports = {
    createAd,
    getUserAds
};
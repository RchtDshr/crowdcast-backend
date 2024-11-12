const Advertisement = require('../models/advertisement'); // Make sure to import your model
const User = require('../models/user');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { addAdToLocation } = require('./LocationController');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createAd = async (req, res) => {
    try {
        // Parse the JSON string for ads
        const ads = JSON.parse(req.body.ads);
        const adName = req.body.adName; // Don't parse this, it should already be a string
        const userId = req.user;
        let type = req.body.type;
        
        // Check if ads is an array
        if (type.startsWith('image')) {
            type='image'
        } else {
             type='video'
        }

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
        user.adsPosted=[];

        // Process each ad object
        for (const ad of ads) {
            const { location, ageGroup, gender, price,fileUpload } = ad;

            // Create a new Advertisement object
            const newAd = new Advertisement({
                adName: adName,
                gender: gender,
                locationName: location,
                type:type,
                ageGroup: ageGroup,
                fileUpload:fileUpload,
                creditsDeducted: price,
                userId
            });

            // Save the new advertisement
            const savedAd = await newAd.save();
            createdAds.push(savedAd);

            // Add the saved ad ID to the user's adsPosted array
            user.adsPosted.push(savedAd._id);

            await addAdToLocation(savedAd);

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


const uploadFiletoCloudinary = async (req, res) => {
    try {
        console.log(req.file);
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        

        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'auto', // Automatically detect if it's an image or video
        });

        let response = {
            publicId: result.public_id,
            url: result.secure_url,
            resourceType: result.resource_type,
        };

        // If it's a video, include the duration
        if (result.resource_type === 'video') {
            response.duration = result.duration;
        }

        res.json(response);
    } catch (error) {
        console.log('Error uploading to Cloudinary:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
};

const removeFilefromCloudinary = async (req, res) => {
    try {
        const { publicId } = req.body;

        if (!publicId) {
            return res.status(400).json({ error: 'No public ID provided' });
        }

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            res.json({ message: 'File removed successfully' });
        } else {
            res.status(500).json({ error: 'Error removing file from Cloudinary' });
        }
    } catch (error) {
        console.error('Error removing file from Cloudinary:', error);
        res.status(500).json({ error: 'Error removing file' });
    }
}


const getAdById = async (req, res) => {
    try {
        const { adId } = req.params;

        const ad = await Advertisement.findById(adId);

        if (!ad) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }

        res.status(200).json({
            message: 'Advertisement retrieved successfully',
            ad
        });
    } catch (error) {
        console.error('Error retrieving advertisement:', error);
        res.status(500).json({ message: 'Error retrieving advertisement', error: error.message });
    }
};

module.exports = {
    createAd,
    getUserAds,
    uploadFiletoCloudinary,
    removeFilefromCloudinary,
    getAdById
};
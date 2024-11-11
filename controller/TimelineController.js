const Timeline = require('../models/timeline'); // Assuming your model file is in models directory

// Function to add a new timeline entry to the database
exports.addTimelineEntry = async (req, res) => {
  try {
    // Destructure the required fields from the request body
    const { userId, adId, adName, locationName, deductedAmount } = req.body;

    // Validate that all required fields are provided
    if (!userId || !adId || !adName || !locationName || deductedAmount === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new timeline entry
    const newTimelineEntry = new Timeline({
      userId,
      adId,
      adName,
      locationName,
      deductedAmount,
      timeOfDisplay: new Date(), // Optionally set a custom display time
    });

    // Save the timeline entry to the database
    await newTimelineEntry.save();

    // Respond with a success message and the newly created timeline entry
    res.status(201).json({
      message: 'Timeline entry added successfully!',
      data: newTimelineEntry,
    });
  } catch (error) {
    console.error('Error adding timeline entry:', error);
    res.status(500).json({
      message: 'Failed to add timeline entry.',
      error: error.message,
    });
  }
};

exports.getTimelineEntriesByUserId = async (req, res) => {
    try {
      // Extract the userId from the request body
      const { userId } = req.body;
  
      // Validate that userId is provided
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
      }
  
      // Find all timeline entries that match the provided userId
      const timelineEntries = await Timeline.find({ userId }).populate('adId', 'adName'); // Populate adId to get ad details if necessary
  
      // Check if entries were found
      if (timelineEntries.length === 0) {
        return res.status(404).json({ message: 'No timeline entries found for this user.' });
      }
  
      // Respond with the found timeline entries
      res.status(200).json({
        message: 'Timeline entries fetched successfully!',
        data: timelineEntries,
      });
    } catch (error) {
      console.error('Error fetching timeline entries:', error);
      res.status(500).json({
        message: 'Failed to fetch timeline entries.',
        error: error.message,
      });
    }
  };
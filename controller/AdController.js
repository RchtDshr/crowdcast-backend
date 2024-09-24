const createAd = async (req, res) => {
    try {
        const { adName, ageGroups, locations, genders } = req.body;
        const adFile = req.file.path;
        console.log(adName, ageGroups, locations, genders, adFile);

        res.status(201).json({ message: 'Successfull'});
    } catch (err) {
        res.status(500).json({ message: 'Error ho gya' });
    }
}
module.exports = {
    createAd
}
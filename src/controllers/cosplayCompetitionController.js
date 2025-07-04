// Import the CosplayCompetition model
// TODO: You will need to create this model file similar to your Jsong model.
const CosplayCompetition = require("../models/CosplayCompetition");

/**
 * @description Create a new Cosplay Competition registration
 * @route POST /api/cosplay-competition/new
 */
const createCosplayCompetition = async (req, res) => {
    // Destructure the required fields from the request body
    const { nama_peserta, telp, nama_kelompok } = req.body;
    try {
        // Create a new registration object
        const newCosplayRegistration = {
            nama_peserta,
            telp,
            nama_kelompok,
            email: req.user.email, // Email is attached by the authenticateToken middleware
            status: false, // Default status
        };
        // Save the new registration to the database
        await CosplayCompetition.create(newCosplayRegistration);
        // Respond with a 201 status and the created object
        return res.status(201).send(newCosplayRegistration);
    } catch (error) {
        console.error("Error creating Cosplay Competition registration:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

/**
 * @description Get all Cosplay Competition registrations (Admin only)
 * @route GET /api/cosplay-competition/
 */
const getAllCosplayCompetitions = async (req, res) => {
    try {
        // Fetch all registrations from the database
        const registrations = await CosplayCompetition.find();
        return res.status(200).send(registrations);
    } catch (error) {
        console.error("Error fetching all Cosplay Competition registrations:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

/**
 * @description Get a specific Cosplay Competition registration by phone number
 * @route GET /api/cosplay-competition/:telp
 */
const getCosplayCompetitionByTelp = async (req, res) => {
    const { telp } = req.params;
    try {
        // Find a single registration by the 'telp' field
        const registration = await CosplayCompetition.findOne({ telp: telp });
        if (!registration) {
            return res.status(404).send({ message: "Registration not found." });
        }
        return res.status(200).send(registration);
    } catch (error) {
        console.error("Error fetching Cosplay Competition registration by phone:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

/**
 * @description Update the status of a Cosplay Competition registration
 * @route PUT /api/cosplay-competition/:telp
 */
const updateCosplayCompetitionStatus = async (req, res) => {
    const { telp } = req.params;
    try {
        // Find the registration to get its current status
        const registration = await CosplayCompetition.findOne({ telp: telp });
        if (!registration) {
            return res.status(404).send({ message: "Registration not found." });
        }
        // Update the status by toggling its current boolean value
        const updatedRegistration = await CosplayCompetition.updateOne(
            { telp: telp },
            { status: !registration.status }
        );
        return res.status(200).send(updatedRegistration);
    } catch (error) {
        console.error("Error updating Cosplay Competition status:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

/**
 * @description Get Cosplay Competition registrations by email
 * @route GET /api/cosplay-competition/email/:email
 */
const getCosplayCompetitionByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        // Find all registrations that match the provided email
        const registrations = await CosplayCompetition.find({ email: email });
        return res.status(200).send(registrations);
    } catch (error) {
        console.error("Error fetching Cosplay Competition registrations by email:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

// Export all the controller functions
module.exports = {
    createCosplayCompetition,
    getAllCosplayCompetitions,
    getCosplayCompetitionByTelp,
    updateCosplayCompetitionStatus,
    getCosplayCompetitionByEmail,
};

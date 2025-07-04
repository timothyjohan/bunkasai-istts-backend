// Import the Yonkoma model
// TODO: You will need to create this model file (e.g., models/Yonkoma.js)
const Yonkoma = require("../models/Yonkoma");

/**
 * @description Create a new Yonkoma competition registration
 * @route POST /api/yonkoma/new
 */
const createYonkoma = async (req, res) => {
    // Destructure the required fields from the request body
    const { nama_peserta, telp } = req.body;
    try {
        // Create a new registration object
        const newYonkomaRegistration = {
            nama_peserta,
            telp,
            email: req.user.email, // Email is attached by the authenticateToken middleware
            status: false, // Default status
        };
        // Save the new registration to the database
        await Yonkoma.create(newYonkomaRegistration);
        // Respond with a 201 status and the created object
        return res.status(201).send(newYonkomaRegistration);
    } catch (error) {
        console.error("Error creating Yonkoma registration:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

/**
 * @description Get all Yonkoma registrations (Admin only)
 * @route GET /api/yonkoma/
 */
const getAllYonkomas = async (req, res) => {
    try {
        // Fetch all registrations from the database
        const registrations = await Yonkoma.find();
        return res.status(200).send(registrations);
    } catch (error) {
        console.error("Error fetching all Yonkoma registrations:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

/**
 * @description Get a specific Yonkoma registration by phone number
 * @route GET /api/yonkoma/:telp
 */
const getYonkomaByTelp = async (req, res) => {
    const { telp } = req.params;
    try {
        // Find a single registration by the 'telp' field
        const registration = await Yonkoma.findOne({ telp: telp });
        if (!registration) {
            return res.status(404).send({ message: "Registration not found." });
        }
        return res.status(200).send(registration);
    } catch (error) {
        console.error("Error fetching Yonkoma registration by phone:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

/**
 * @description Update the status of a Yonkoma registration
 * @route PUT /api/yonkoma/:telp
 */
const updateYonkomaStatus = async (req, res) => {
    const { telp } = req.params;
    try {
        // Find the registration to get its current status
        const registration = await Yonkoma.findOne({ telp: telp });
        if (!registration) {
            return res.status(404).send({ message: "Registration not found." });
        }
        // Update the status by toggling its current boolean value
        const updatedRegistration = await Yonkoma.updateOne(
            { telp: telp },
            { status: !registration.status }
        );
        return res.status(200).send(updatedRegistration);
    } catch (error) {
        console.error("Error updating Yonkoma status:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

/**
 * @description Get Yonkoma registrations by email
 * @route GET /api/yonkoma/email/:email
 */
const getYonkomaByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        // Find all registrations that match the provided email
        const registrations = await Yonkoma.find({ email: email });
        return res.status(200).send(registrations);
    } catch (error) {
        console.error("Error fetching Yonkoma registrations by email:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

// Export all the controller functions
module.exports = {
    createYonkoma,
    getAllYonkomas,
    getYonkomaByTelp,
    updateYonkomaStatus,
    getYonkomaByEmail,
};

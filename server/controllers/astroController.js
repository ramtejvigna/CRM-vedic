import { Astro, Customer } from '../models/User.js';

export const fetchAndStoreAstroData = async (req, res) => {
  const { customerId } = req.params;

  try {
    // Check if the customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if astrology data already exists for the customer
    let astroData = await Astro.findOne({ customerId });

    if (!astroData) {
      // If astrology data doesn't exist, create and save it once
      const newAstro = {
        customerId,
        zodiacSign: 'Leo',
        nakshatra: 'Ashwini',
        numerologyNo: 3,
        luckyColour: 'Blueooo',
        gemstone: 'Ruby',
        destinyNumber: 7,
        luckyDay: 'Friday',
        luckyGod: 'Lord Shiva',
        luckyMetal: 'Gold',
      };

      // Save the newly generated astrology data
      astroData = new Astro(newAstro);
      await astroData.save();
    }

    // Return the astrology data (either from DB or newly created)
    res.status(200).json(astroData);

  } catch (error) {
    console.error('Error fetching or saving astrological data:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// controllers/astroController.js

export const updateAstroData = async (req, res) => {
  const { customerId } = req.params;  // Get the customerId from the URL parameters
  const updatedData = req.body;      // Get the updated astrology details from the request body

  try {
    // Find the customer by their ID
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Find or create the astrology data for the customer
    let astroData = await Astro.findOne({ customerId });

    if (!astroData) {
      // If no existing astrology data, create a new one
      astroData = new Astro({
        customerId,
        ...updatedData,
      });
    } else {
      // Otherwise, update the existing astrology data
      Object.assign(astroData, updatedData);
    }

    // Save the astrology data
    await astroData.save();

    // Send the updated astrology data back in the response
    res.status(200).json(astroData);

  } catch (error) {
    console.error('Error updating astrology details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

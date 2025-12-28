import User from '../models/User.js';
import { generateRandomPassword } from '../utils/passwordGenerator.js';
import { sendResetPasswordEmail } from '../utils/emailService.js';

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new random password
    const newPassword = generateRandomPassword();
    
    // Update user password
    user.password = newPassword;
    await user.save();

    // Send email with new password
    const emailSent = await sendResetPasswordEmail(email, newPassword);
    
    if (emailSent) {
      res.json({ 
        message: 'New password has been sent to your email address',
        success: true 
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to send email. Please try again.',
        success: false 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
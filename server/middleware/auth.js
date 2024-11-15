import jwt from 'jsonwebtoken';
import { Employee } from '../models/User.js';
export const isAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, 'crm');
    req.user = decoded.id;
    next();
  } catch (err) {
    console.log(err.message)
    res.status(401).json({ message: 'Token is not valid' });
  }
};


export const tokenExpirationMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Update isOnline status to true if the token is valid
        await Employee.findOneAndUpdate({ _id: decoded.id }, { isOnline: true });

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Update isOnline status to false if the token has expired
            const decoded = jwt.decode(token);
            await Employee.findOneAndUpdate({ _id: decoded.id }, { isOnline: false });

            return res.status(401).json({ message: 'Token expired' });
        }

        return res.status(401).json({ message: 'Invalid token' });
    }
};


// export const isAdmin = (req, res, next) => {
//   if (!req.user.isAdmin) {
//     return res.status(403).json({ message: 'Access denied. Admin only.' });
//   }
//   next();
// };


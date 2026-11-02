
import User from './models/userModel.js'
import Session from './models/session.js';


const checkAuth = async (req, res, next) => {

    const { sid } = req.signedCookies;

    

    try {
        if (!sid) {
            return res.clearCookie('sid').status(401).json({ message: 'Unauthorized from auth.js' });
        }
        const session = await Session.findById(sid)
        if (!session) {
            return res.clearCookie('sid').status(401).json({ message: 'Unauthorized' });
        } else {
            const user = await User.findOne({ _id: session.userId })
            if (!user) {
                return res.clearCookie('sid').status(401).json({
                    message: 'Unauthorized'
                });
            }
            req.user = user
            next()
        }

    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            message: "Authentication failed"
        });
    }
}

export default checkAuth;
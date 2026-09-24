const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Process demo payment to upgrade plan
// @route   POST /api/payment/demo
const demoPayment = async (req, res) => {
  try {
    const { plan = 'pro', amount = 299 } = req.body;

    // 1. Verify the logged-in user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 2. Verify the selected plan
    if (plan !== 'pro') {
      return res.status(400).json({ success: false, message: 'Invalid plan selected for upgrade' });
    }

    // 3. Create an Order record
    const order = await Order.create({
      user: user._id,
      plan: 'pro',
      amount: Number(amount) || 299,
      status: 'success',
      paymentMethod: 'demo'
    });

    // 4. Update the user's plan to 'pro'
    user.plan = 'pro';
    await user.save();

    // 5. Return successful response
    res.status(200).json({
      success: true,
      message: 'Demo payment successful',
      plan: 'pro',
      order: {
        _id: order._id,
        plan: order.plan,
        amount: order.amount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Demo payment processing failed'
    });
  }
};

module.exports = {
  demoPayment
};

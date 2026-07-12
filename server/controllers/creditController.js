import Transaction from "../models/Transaction.js";
import Stripe from 'stripe'
import User from "../models/User.js";


const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
]

// API Controller for getting all plans
export const getPlans = async (req, res) => {
  try {
    res.json({
      success: true,
      plans,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// API Controller for purchasing a plan
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    const plan = plans.find((plan) => plan._id === planId);

    if (!plan) {
      return res.json({
        success: false,
        message: "Invalid plan",
      });
    }

    // Create new Transaction
    const transaction = await Transaction.create({
      userId: userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false
    });

    const {origin} = req.headers;

    const session = await stripe.checkout.sessions.create({
        
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: plan.price * 100,
                    product_data: {
                        name: plan.name
                    }
                },
                quantity: 1,
            },
  ],
  mode: "payment",
  success_url: `${origin}/loading?session_id={CHECKOUT_SESSION_ID}`,
  metadata: {transactionId: transaction._id.toString(), appId: 'quickgpt'},
  expires_at: Math.floor(Date.now() / 1000) + 30 * 60, //Expires in 30 minutes
});
res.json({success: true, url: session.url})

    
  } catch (error) {
    res.json({success: false, message: error.message})
  }
};

export const verifyPayment = async (req, res) => {
  try {
    console.log("verifyPayment called");

    const { session_id } = req.query;
    console.log("Session ID:", session_id);

    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Payment Status:", session.payment_status);

    const transaction = await Transaction.findById(
      session.metadata.transactionId
    );
    console.log("Transaction:", transaction);

    const user = await User.findById(transaction.userId);
    console.log("User Before:", user.credits);

    if (!transaction.isPaid) {
      transaction.isPaid = true;
      await transaction.save();

      user.credits += transaction.credits;

      await user.save();

      console.log("User After:", user.credits);
    }

    res.json({
      success: true,
      message: "Payment verified",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
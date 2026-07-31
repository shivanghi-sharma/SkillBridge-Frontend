//This is a reusable helper that opens the Razorpay payment popup

export const openRazorpayCheckout = ({orderId , amount , currency , name , description , onSuccess , onFailure }) => {
    const options = {
        key : import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'SkillBridge',
        description,
        order_id: orderId,
        handler: function (response) {
            //This runs when payment succeeds on Razorpay's end
            //We get back paymnet_id and signature
            //We pass these to our backend for verification

            onSuccess({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymenTId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
            })
        },
        prefill: {
            name,
        },
        theme: {
            color: '#2563eb'
        },
        modal: {
            ondismiss: function () {
                if(onFailure) onFailure('Payment cancelled')
            }
        }
    }
    const rzp = new window.Razorpay(options)
    rzp.open();
}
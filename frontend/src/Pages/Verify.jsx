import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { backend_url } from '../App';
import { useNotification } from '../Context/NotificationContext';

const Verify = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const navigate = useNavigate();
    const { success: successMsg, error } = useNotification();

    const verifyPayment = async () => {
        const response = await fetch(`${backend_url}/api/order/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({ success, orderId })
        });
        const data = await response.json();
        if (data.success) {
            successMsg("Payment Successful!");
            navigate("/"); // Or /myorders
        } else {
            error("Payment Failed");
            navigate("/");
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [])

    return (
        <div className='verify'>
            <div className="spinner"></div>
            <style jsx>{`
                .verify {
                    min-height: 60vh;
                    display: grid;
                    place-items: center;
                }
                .spinner {
                    width: 100px;
                    height: 100px;
                    place-self: center;
                    border: 5px solid #dedede;
                    border-top-color: #ff4141;
                    border-radius: 50%;
                    animation: rotate 1.5s infinite;
                }
                @keyframes rotate {
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default Verify;

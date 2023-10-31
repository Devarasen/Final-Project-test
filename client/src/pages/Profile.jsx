import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import AuthService from '../utils/auth'; 
const Profile = () => {
    const [currentUser, ] = useState({
        username: AuthService.getUsername(),  
        ecoActions: [],
        totalGreenCoins: 0
    });
    const [donationAmount, setDonationAmount] = useState(0);

  
    const handleDonation = () => {
        if (donationAmount > 0) {
            
        }
    };

    return (
        <div className="dashboard">
            
            <div className="eco-actions">
                {/* <h2>Dashboard</h2> */}
                <h3>Welcome, {currentUser.username}!</h3>
                <h4>Recent Eco-Actions:</h4>
                <ul>
                    {currentUser.ecoActions.map((action, index) => (
                        <li key={index}>
                            {action.action} - {action.greenCoinsEarned} Green Coins
                        </li>
                    ))}
                </ul>                
            </div>

            <div className='aside-section'>
                <div className="coin-section">
                    <p>Total Green Coins Earned: {currentUser.totalGreenCoins}</p>
                    <h4>Make a Donation:</h4>
                    <div className='donation-input'>
                        <input
                            type="number"
                            placeholder="Donation Amount"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                        />
                        <div className="tooltip-container">
                            <button onClick={handleDonation}> 💰 </button>
                            <span className="tooltip">Donate</span>
                        </div>
                    </div>
                </div>
                <div className='profile-section'>
                    <p>Set your Name:</p>
                    <input placeholder="Set new name"></input>
                    <button onClick={handleDonation}> Confirm </button>
                    <p>Set your Bio:</p>
                    <textarea rows="2" placeholder="Set new bio"></textarea>
                    <button onClick={handleDonation}> Confirm </button>
                    <p>Set your Avatar:</p>
                    <button onClick={handleDonation}> Choose Avatar </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;








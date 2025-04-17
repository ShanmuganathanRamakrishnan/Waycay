import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PlaceCard.css';

interface PlaceCardProps {
    id: string;
    name: string;
    location: string;
    rating: number;
    imageUrl: string;
    isFavorite: boolean;
    onFavoriteClick: (id: string) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
    id,
    name,
    location,
    rating,
    imageUrl,
    isFavorite,
    onFavoriteClick,
}) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/place/${id}`);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click event from triggering
        onFavoriteClick(id);
    };

    return (
        <div className="property-card" onClick={handleCardClick}>
            <div className="property-image-container">
                <img src={imageUrl} alt={name} className="property-image" />
                <button
                    className={`favorite-button ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavoriteClick}
                >
                    <i className={`fas ${isFavorite ? 'fa-heart' : 'fa-heart'}`}></i>
                </button>
            </div>
            <div className="property-details">
                <div className="property-location-rating">
                    <h3>{name}</h3>
                    <div className="rating">
                        <i className="fas fa-star"></i>
                        <span>{rating}</span>
                    </div>
                </div>
                <div className="property-location">{location}</div>
            </div>
        </div>
    );
};

export default PlaceCard; 
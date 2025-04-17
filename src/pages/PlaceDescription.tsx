import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PlaceDescription.css';

interface PlaceDetails {
    id: string;
    name: string;
    location: string;
    rating: number;
    description: string;
    imageUrl: string;
    amenities: string[];
    price: string;
}

const PlaceDescription: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [place, setPlace] = useState<PlaceDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Here you would typically fetch the place details from your API
        const fetchPlaceDetails = async () => {
            try {
                // Simulated API call
                // Replace this with your actual API call
                const response = await fetch(`/api/places/${id}`);
                const data = await response.json();
                setPlace(data);
            } catch (error) {
                console.error('Error fetching place details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaceDetails();
    }, [id]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!place) {
        return <div className="error">Place not found</div>;
    }

    return (
        <div className="place-description">
            <div className="place-header">
                <h1>{place.name}</h1>
                <div className="place-meta">
                    <div className="rating">
                        <i className="fas fa-star"></i>
                        <span>{place.rating}</span>
                    </div>
                    <div className="location">{place.location}</div>
                </div>
            </div>

            <div className="place-image">
                <img src={place.imageUrl} alt={place.name} />
            </div>

            <div className="place-content">
                <section className="description">
                    <h2>About this place</h2>
                    <p>{place.description}</p>
                </section>

                <section className="amenities">
                    <h2>What this place offers</h2>
                    <div className="amenities-grid">
                        {place.amenities.map((amenity, index) => (
                            <div key={index} className="amenity-item">
                                <i className="fas fa-check"></i>
                                <span>{amenity}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="price-section">
                    <div className="price-details">
                        <h2>Price</h2>
                        <p className="price">{place.price}</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PlaceDescription; 
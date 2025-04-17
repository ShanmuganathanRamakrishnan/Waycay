import React, { useState } from 'react';
import PlaceCard from '../components/PlaceCard';
import WishlistModal from '../components/WishlistModal';
import './ExplorePage.css';

interface Place {
    id: string;
    name: string;
    location: string;
    rating: number;
    imageUrl: string;
}

interface Wishlist {
    id: string;
    name: string;
    imageUrl?: string;
    placesCount: number;
}

const ExplorePage: React.FC = () => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [wishlists, setWishlists] = useState<Wishlist[]>([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
    const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);

    const handleFavoriteClick = (placeId: string) => {
        setSelectedPlaceId(placeId);
        setIsWishlistModalOpen(true);
    };

    const handleSaveToWishlist = (wishlistId: string) => {
        // Here you would typically make an API call to save the place to the wishlist
        console.log(`Saving place ${selectedPlaceId} to wishlist ${wishlistId}`);
        setIsWishlistModalOpen(false);
        setSelectedPlaceId(null);
    };

    const handleCreateWishlist = (name: string) => {
        // Here you would typically make an API call to create a new wishlist
        const newWishlist: Wishlist = {
            id: `wishlist-${Date.now()}`,
            name,
            placesCount: 0
        };
        setWishlists([...wishlists, newWishlist]);
    };

    return (
        <div className="explore-page">
            <main className="listings">
                <div className="listings-grid" id="propertyGrid">
                    {places.map(place => (
                        <PlaceCard
                            key={place.id}
                            {...place}
                            isFavorite={false} // You would typically determine this from your backend
                            onFavoriteClick={handleFavoriteClick}
                        />
                    ))}
                </div>
            </main>

            <WishlistModal
                isOpen={isWishlistModalOpen}
                onClose={() => setIsWishlistModalOpen(false)}
                onSave={handleSaveToWishlist}
                onCreateNew={handleCreateWishlist}
                wishlists={wishlists}
            />
        </div>
    );
};

export default ExplorePage; 
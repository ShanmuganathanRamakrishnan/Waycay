import React, { useState } from 'react';
import './WishlistModal.css';

interface WishlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (wishlistId: string) => void;
    onCreateNew: (name: string) => void;
    wishlists: Array<{
        id: string;
        name: string;
        imageUrl?: string;
        placesCount: number;
    }>;
}

const WishlistModal: React.FC<WishlistModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onCreateNew,
    wishlists,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [newWishlistName, setNewWishlistName] = useState('');
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    if (!isOpen) return null;

    const handleCreateNew = () => {
        if (newWishlistName.trim()) {
            onCreateNew(newWishlistName.trim());
            setNewWishlistName('');
            setIsCreatingNew(false);
        }
    };

    const filteredWishlists = wishlists.filter(wishlist =>
        wishlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="modal-overlay show">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isCreatingNew ? 'Create wishlist' : 'Save to wishlist'}</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {isCreatingNew ? (
                        <div className="wishlist-form">
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={newWishlistName}
                                    onChange={(e) => setNewWishlistName(e.target.value)}
                                    placeholder="Name"
                                    maxLength={50}
                                />
                                <div className="character-count">
                                    <span>{newWishlistName.length}</span>/50 characters
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="wishlist-search">
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder="Search wishlists"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="wishlists-container">
                                {filteredWishlists.map(wishlist => (
                                    <div
                                        key={wishlist.id}
                                        className="wishlist-item"
                                        onClick={() => onSave(wishlist.id)}
                                    >
                                        <div className="wishlist-thumbnail">
                                            {wishlist.imageUrl && <img src={wishlist.imageUrl} alt={wishlist.name} />}
                                        </div>
                                        <div className="wishlist-info">
                                            <h3>{wishlist.name}</h3>
                                            <p>{wishlist.placesCount} places</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-footer">
                    {isCreatingNew ? (
                        <>
                            <button className="btn-secondary" onClick={() => setIsCreatingNew(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleCreateNew}
                                disabled={!newWishlistName.trim()}
                            >
                                Create
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn-primary"
                            onClick={() => setIsCreatingNew(true)}
                        >
                            Create new wishlist
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WishlistModal; 
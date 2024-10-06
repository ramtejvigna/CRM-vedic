import React from 'react';
import { useParams } from 'react-router-dom';

export const Customer = () => {
    
    const { username } = useParams();

    return (
        <div>
            <h1>Welcome, {username}</h1>
        </div>
    );
};

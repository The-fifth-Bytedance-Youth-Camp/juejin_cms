import React from 'react';
import PubSub from 'pubsub-js';

const Redirect = ({ to }) => {
	PubSub?.publish('navigate', to);
};

export default Redirect;

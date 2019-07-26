import React from 'react';

import Spinner from '../Spinner';

export const Loading = ({ flag, children }) => (flag ? <Spinner /> : children());

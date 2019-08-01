import React from 'react';

import Spinner from '../Spinner';

export const Loading = ({ flag, children, mode, withLogo }) =>
    flag ? <Spinner mode={mode} withLogo={withLogo} /> : children;

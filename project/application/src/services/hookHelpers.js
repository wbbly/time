import { useEffect, useState } from 'react';

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay]
    );

    return debouncedValue;
};

export const useOutsideClick = (ref, callback) => {
    useEffect(
        () => {
            const handleClick = e => {
                if (ref.current && !ref.current.contains(e.target)) {
                    callback();
                }
            };

            document.addEventListener('click', handleClick);
            return () => {
                document.removeEventListener('click', handleClick);
            };
        },
        [ref, callback]
    );
};

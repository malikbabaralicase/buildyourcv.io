import React, { useEffect, useState } from 'react';

// We use native CSS cursor overrides pointing to a custom inline data-uri SVG matching the MacOS Sierra/Monterey black pointer scale.
const CustomCursor = () => {
    return (
        <style>
            {`
            html, body, * {
                cursor: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 2C5.5 2 5 2.2 4.6 2.5C4 3 4 3.7 4 3.7V17C4 17 4 17.5 4.3 18C4.5 18.2 4.9 18.2 4.9 18.2L9.2 15L12 21C12 21 12.2 21.5 12.8 21.6C13.5 21.8 14.1 21.4 14.1 21.4L15.6 18.4C15.6 18.4 16 17.8 15.6 17L12.5 11.2L16.2 11.2C16.2 11.2 16.9 11.2 17.3 10.8C17.7 10.4 17.6 9.8 17.6 9.8L5.5 2Z" fill="black" stroke="white" stroke-width="1.5"/></svg>') 1 1, auto !important;
            }
            button, a, input[type="button"], input[type="submit"], [role="button"], .cursor-pointer {
                cursor: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.8 4.2C10.8 4.2 10.4 3.8 9.5 3.8C8.5 3.8 8.1 4.5 8.1 4.5V8.5C8.1 8.5 8 9.2 7.1 9M7.1 9V17C7.1 17 6.6 20 11.5 20C16.4 20 18.2 17 18.2 17V10.2M7.1 9C6.2 8.8 5.4 9.1 5.4 9.1L3.9 10C3.9 10 3.2 10.5 3.6 11.2C4.1 12 5.1 11.6 5.1 11.6L7.1 10.5V17M18.2 10.2C18.2 10.2 18.5 9 17.5 9C16.5 9 15.8 9.8 15.8 9.8V11.2M15.8 9.8V9.2C15.8 9.2 15.5 8.2 14.5 8.2C13.5 8.2 13.2 9 13.2 9V11.2M13.2 9V8.8C13.2 8.8 13.1 7.2 12.1 7.2C11 7.2 10.8 8.2 10.8 8.2V11A1 1 0 0 1 10.8 4.2Z" fill="black" stroke="white" stroke-width="1.2"/></svg>') 6 2, pointer !important;
            }
            `}
        </style>
    );
};

export default CustomCursor;

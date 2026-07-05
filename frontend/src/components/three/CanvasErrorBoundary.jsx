import React from 'react';

// Three.js/WebGL can fail in ways React itself can't recover from (lost context,
// unsupported browser, etc). Since these canvases are decorative, isolate any
// crash here instead of letting it take down the whole app tree.
class CanvasErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        console.error('3D scene failed to render:', error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? null;
        }
        return this.props.children;
    }
}

export default CanvasErrorBoundary;

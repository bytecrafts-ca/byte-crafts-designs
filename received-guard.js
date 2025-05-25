if (sessionStorage.getItem('canAccessReceived') !== 'true') {
    // Not allowed, redirect to home
    window.location.href = '/';
} else {
    // Clear the flag immediately to prevent future direct access
    sessionStorage.removeItem('canAccessReceived');
}
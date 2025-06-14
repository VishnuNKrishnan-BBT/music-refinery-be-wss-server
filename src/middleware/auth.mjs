// Middleware-like function to process incoming messages
export const auth = (ws, message, next) => {
    console.log('Middleware: Checking message')

    // Example of filtering messages
    if (message === 'blocked message') {
        ws.send('This message is blocked by middleware.')
    } else {
        next(message)  // Call the next handler if the message passes
    }
}
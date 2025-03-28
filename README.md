# XRPL Learning Challenges

An interactive web application to learn about building on the XRP Ledger through hands-on coding challenges.

## Overview

This project provides a structured learning environment for developers to understand and practice XRP Ledger development concepts. The application presents a series of challenges that progressively build knowledge of XRPL features:

1. **Connect to the XRP Ledger** - Learn how to establish a connection to the XRPL TestNet
2. **Create a TestNet Wallet** - Generate and fund a wallet on the TestNet
3. **Send XRP Payment** - Create and submit a basic XRP payment transaction
4. **Verify Transaction Status** - Check the status and details of an XRPL transaction
5. **Create an Escrow** - Set up a time-locked escrow payment

## Features

- **Interactive Code Editor** - Built-in JavaScript editor with syntax highlighting
- **Real-time Validation** - Automatic code checking as you type
- **Progress Tracking** - Visual progress indicators and persistent progress storage
- **Immediate Feedback** - Success notifications and detailed error messages
- **Responsive Design** - Works on desktop and mobile devices
- **Dark Mode Support** - Toggle between light and dark themes

## Project Structure

The project follows SOLID design principles with a modular architecture:

```
📁 xrpl-learning-project/
├── 📄 server.py                # Python server for running the application
├── 📄 index.html               # Main HTML entry point
├── 📁 css/
│   ├── 📄 main.css             # Main stylesheet
│   └── 📄 theme.css            # Theming and color variables
├── 📁 js/
│   ├── 📄 app.js               # Main application controller
│   ├── 📄 ui-manager.js        # UI management and rendering
│   ├── 📄 challenge-loader.js  # Loads challenges dynamically
│   ├── 📄 test-runner.js       # Handles code testing and verification
│   ├── 📄 code-editor.js       # CodeMirror setup and management
│   └── 📄 storage-manager.js   # Handles progress persistence
├── 📁 challenges/
│   ├── 📄 challenge-1.js       # Connect to XRPL challenge
│   ├── 📄 challenge-2.js       # Create wallet challenge
│   ├── 📄 challenge-3.js       # Send XRP challenge
│   ├── 📄 challenge-4.js       # Check transaction challenge
│   └── 📄 challenge-5.js       # Create escrow challenge
└── 📁 components/
    ├── 📄 modal.js             # Success modal component
    ├── 📄 notification.js      # Notification component
    └── 📄 progress-bar.js      # Progress tracking component
```

## Getting Started

### Prerequisites

- Python 3.6 or higher (for the local development server)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/xrpl-learning-challenges.git
   cd xrpl-learning-challenges
   ```

2. Start the Python server:
   ```bash
   python server.py
   ```

3. The application will automatically open in your default browser at http://localhost:8000

### Deployment

This application can be deployed to GitHub Pages or any static web hosting service:

1. Push the code to a GitHub repository
2. Enable GitHub Pages in the repository settings
3. Select the main branch as the source

## Using the Application

1. Start with Challenge 1 and progress through each challenge in order
2. Read the description and requirement for each challenge
3. Fill in the missing code in the code editor
4. Click "Run Code" to test your solution, or enable "Auto-Check" for real-time validation
5. If your solution is correct, you'll see a success modal and the challenge will be marked as completed
6. Progress is automatically saved in your browser's local storage

## Technical Details

- **XRP Ledger** - Uses the XRPL.js library for interacting with the XRP Ledger
- **Code Editor** - Powered by CodeMirror for syntax highlighting and editor features
- **No Backend Required** - Pure client-side application that persists data in LocalStorage
- **TestNet Only** - All transactions run on the XRPL TestNet, not MainNet

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- XRP Ledger Foundation for their excellent documentation
- The XRPL.js library maintainers
- CodeMirror for the code editing component
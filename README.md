# Medical Translation Assistant

## Overview

The Medical Translation Assistant is a web application designed to provide real-time translation for healthcare communication. It utilizes audio recording and transcription features to facilitate communication between healthcare providers and patients who speak different languages.

## Features

- Record audio in various languages.
- Transcribe audio to text.
- Translate the transcribed text into a target language.
- Play back the translated text as audio.

## Technologies Used

- React
- Next.js
- TypeScript
- Tailwind CSS
- MediaRecorder API
- Fetch API for backend communication

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
- You have a code editor installed (e.g., Visual Studio Code).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/l1ak1l/Nao-Medical-Healthcare-transcription-frontend.git
   cd <repository-directory>
   ```

2. Install the dependencies:

   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root of your project and add the following line:

   ```plaintext
   NEXT_PUBLIC_BACKEND_URL=<your-backend-url>
   ```

   Replace `<your-backend-url>` with the URL of your backend API.

## Running the Project

To run the project locally, use the following command:

```bash
npm run dev
```

This will start the development server, and you can access the application at `http://localhost:3000`.

## Building for Production

To build the project for production, run:

```bash
npm run build
```

After building, you can start the production server with:

```bash
npm start
```

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the contributors and the open-source community for their support and resources.
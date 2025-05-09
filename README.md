
# Fitness Tracker Demo - Web Edition
![Screenshot 2025-04-19 195350](https://github.com/user-attachments/assets/b8cdbc3c-87d7-4592-8297-97e123e24a1a)
![Screenshot 2025-04-19 195644](https://github.com/user-attachments/assets/54693655-5650-40c6-a407-aef15dac5609)

A real-time fitness tracking web application that uses TensorFlow.js and pose detection to monitor exercise form, count repetitions, and provide feedback for various exercises using your webcam .

## Features

- **Real-Time Pose Detection**: Uses TensorFlow.js pose detection to track key body landmarks during workouts.
- **Exercise Recognition**: Identifies the current exercise being performed by analyzing body movements and positions.
- **Repetition Counting**: Counts exercise repetitions by monitoring joint angles and detecting when they cross specific thresholds.
- **Form Feedback**: Provides immediate feedback on exercise form to help you perform exercises safely and effectively.
- **Exercise Library**: Supports multiple exercises including squats, pushups, bicep curls, and shoulder presses.

## Technical Implementation

- **Frontend**: React with TypeScript, styled with Tailwind CSS
- **Pose Detection**: TensorFlow.js and PoseNet/MoveNet models
- **UI Components**: Shadcn UI component library
- **State Management**: React hooks and context

## Privacy

All processing happens locally in your browser. No video data is stored or sent to any server, ensuring your privacy is protected.

## Supported Exercises
![image](https://github.com/user-attachments/assets/d24c951a-b80f-4edd-98ee-d5b0334e7cc1)

- Squats
- Push-ups
- Bicep Curls
- Shoulder Presses

## Getting Started

1. Clone this repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open your browser to the local development URL
5. Allow camera access when prompted
6. Start exercising!

## Inspiration

This web application is inspired by the Python-based [Fitness Tracker Pro](https://github.com/a1harfoush/Fitness_Tracker_Pro) project, adapting its functionality for the web platform.

![Untitled-3](https://github.com/user-attachments/assets/3c369613-96d2-48a4-b302-b330bd863fec)

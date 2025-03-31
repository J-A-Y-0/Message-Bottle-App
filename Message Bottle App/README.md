# Message Bottle App

A React Native mobile application that allows users to:
- Write and share messages with different moods
- Create and manage a wish list
- Release stress in an interactive "Angry Mode"
- Features a unique AI chat system that learns from user interactions

## Features

### Message Board
- Write messages with different mood emojis
- View message history
- Delete individual messages
- Clear all messages
- Messages are saved locally

### Wish List
- Add new wishes
- Mark wishes as completed
- Delete individual wishes
- Clear all wishes
- Wishes are saved locally

### Angry Mode
- Interactive punching animation
- Punch counter and power meter
- Celebration effects every 100 punches
- Sound effects for punches and celebrations
- Save statistics locally

### Wish Bottle
- Send wishes to the "ocean"
- Receive random wishes from other users
- View total wishes and active users count
- Beautiful bottle animation effects
- Real-time statistics

### AI Chat System
- Learn from user's chat history (50 messages required)
- Analyze user's personality and speaking style
- Generate contextual responses based on learned patterns
- Maintain conversation flow and context
- Real-time message tracking and progress display

## Installation

1. Clone the repository:
```bash
git clone https://github.com/J-A-Y-0
cd message-bottle-app
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS dependencies (iOS only):
```bash
cd ios
pod install
cd ..
```

4. Start the development server:
```bash
npm start
```

5. Run the app:
- For iOS:
```bash
npm run ios
```
- For Android:
```bash
npm run android
```

## Dependencies

- React Native
- React Navigation
- AsyncStorage
- React Native Sound
- React Native Vector Icons
- OpenAI API (for AI chat functionality)

## Environment Setup

1. Create a `.env` file in the root directory
2. Add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons provided by [Ionicons](https://ionic.io/ionicons)
- Sound effects from [Freesound](https://freesound.org/)
- OpenAI for providing the AI capabilities
- React Native community for the excellent framework
- All contributors who help improve this project

## Support

If you encounter any issues or have suggestions, please open an issue in the GitHub repository!

---

🖋️ Crafted with passion by **Jay (Weike) Yu**
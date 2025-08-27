# 🎯 AI Lottery Number Picker

An open-source AI-powered lottery number generator that uses advanced OpenAI reasoning models and statistical analysis to generate potentially winning lottery numbers for Powerball and Mega Millions.

## 🌟 Features

### 🧠 AI-Powered Generation
- **OpenAI o3-mini Model**: Utilizes advanced reasoning capabilities for sophisticated number analysis
- **Historical Data Analysis**: Processes frequency patterns, hot/cold numbers, and positional trends
- **Mathematical Algorithms**: Implements golden ratio, modular arithmetic, and statistical distribution analysis
- **Smart Validation**: Ensures generated numbers fall within historical winning ranges

### 🎲 Lottery Games Supported
- **Powerball**: 5 numbers (1-69) + 1 Powerball (1-26)
- **Mega Millions**: 5 numbers (1-70) + 1 Mega Ball (1-25)

### 👤 User Features
- **Anonymous Play**: 5 free generations per game type monthly
- **User Accounts**: 20+ monthly generations with referral bonuses
- **Win Tracking**: Automatic win detection and prize calculation
- **Statistics Dashboard**: Personal analytics, win rates, and performance metrics
- **Referral System**: Earn bonus generations by referring friends

### 🛡️ Security & Admin
- **Row Level Security**: Supabase RLS policies protect user data
- **Admin Controls**: Manage winning numbers and user roles
- **Rate Limiting**: Prevents abuse with generation limits
- **Secure Authentication**: Email/password with Supabase Auth

## 🚀 Live Demo

Visit our live application: [opensource-ai-lottery-number-picker.lovable.app](https://opensource-ai-lottery-number-picker.lovable.app)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Framer Motion** for animations
- **React Query** for state management

### Backend
- **Supabase** for database and authentication
- **Supabase Edge Functions** for serverless API
- **PostgreSQL** with Row Level Security
- **OpenAI API** for AI number generation

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **Bun** for package management

## 📋 Prerequisites

- Node.js 18+ or Bun
- Supabase account
- OpenAI API key

## 🏃‍♂️ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/opensource-ai-lottery-number-picker.git
cd opensource-ai-lottery-number-picker
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using bun (recommended)
bun install
```

### 3. Environment Setup
The application uses Supabase for backend services. The public keys are already configured in the codebase.

### 4. Set Up OpenAI API Key
1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. In your Supabase project dashboard, go to Settings → Edge Functions
3. Add a new secret named `OPENAI_API_KEY` with your API key

### 5. Run Development Server
```bash
# Using npm
npm run dev

# Using bun
bun run dev
```

Visit `http://localhost:8080` to see the application.

## 🗄️ Database Schema

The application uses the following main tables:

- **profiles**: User profile data and generation limits
- **lottery_history**: Generated number history and win tracking
- **winning_numbers**: Official lottery results for win detection
- **anonymous_generations**: Track free generations for non-users
- **referral_codes**: Referral system for bonus generations
- **user_roles**: Admin role management

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the database migrations (handled automatically in this repo)
3. Configure authentication providers if needed
4. Add your OpenAI API key to Edge Function secrets

### OpenAI Configuration
The AI uses sophisticated prompts that consider:
- Historical frequency analysis
- Mathematical pattern recognition
- Statistical distribution balancing
- Game-specific validation rules

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design principles

## 📝 API Documentation

### Edge Functions

#### `/generate`
Generates lottery numbers using AI analysis.

**Request:**
```typescript
POST /functions/v1/generate
Content-Type: application/json

{
  "prompt": "Generate Powerball numbers using advanced statistical analysis"
}
```

**Response:**
```typescript
{
  "generatedText": "[12, 24, 35, 47, 58, 19]"
}
```

## 🔒 Security

This application implements several security measures:
- Row Level Security (RLS) policies
- API key protection via Supabase secrets
- Rate limiting on number generation
- User authentication and authorization
- Secure CORS configuration

## 📊 Analytics & Monitoring

The application includes:
- User generation tracking
- Win rate calculations
- Performance analytics
- Error logging and monitoring

## 🚀 Deployment

### Deploy to Lovable (Recommended)
1. Visit [Lovable](https://lovable.dev)
2. Import this repository
3. Configure your OpenAI API key in Supabase
4. Deploy with one click

### Deploy to Other Platforms
The application can be deployed to any static hosting platform:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Google Cloud Storage

## 📈 Roadmap

- [ ] Machine learning model training on historical data
- [ ] Additional lottery games support
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Social features and communities
- [ ] Multiple AI model comparison

## 🤖 How the AI Works

Our AI system uses multiple analytical approaches:

1. **Frequency Analysis**: Tracks hot and cold numbers across historical draws
2. **Pattern Recognition**: Identifies mathematical sequences and relationships
3. **Statistical Distribution**: Ensures balanced number selection across ranges
4. **Positional Analysis**: Considers where numbers typically appear
5. **Delta System**: Analyzes gaps between consecutive numbers
6. **Sum Range Optimization**: Keeps totals within historical winning ranges

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing advanced reasoning models
- Supabase for backend infrastructure
- The lottery statistics community for research insights
- All contributors who help improve this project

## 📞 Support

- 📧 Create an issue for bug reports
- 💬 Join discussions in our GitHub Discussions
- 🔗 Follow the project for updates

## ⚠️ Disclaimer

This application is for entertainment purposes only. Lottery games are games of chance, and no system can guarantee winning numbers. Please play responsibly and within your means. The AI analysis is based on historical patterns and statistical methods, but lottery drawings are random events.

---

**⭐ Star this repository if you find it helpful!**

Built with ❤️ by the open-source community
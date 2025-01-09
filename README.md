# Goal Tracker 🎯

A powerful, intuitive goal tracking application built with Next.js, Tailwind CSS, and Airtable.

## 🌟 Features

### Goal Management
- Track multiple goals with daily targets
- Set quarterly objectives
- Monitor progress in real-time

### Milestone Tracking
- Break down goals into achievable milestones
- Update milestone status (Not Started, In Progress, Completed)
- Visualize progress towards goal completion

### Reporting
- Weekly progress reports
- Automated email reporting via GitHub Actions
- Detailed insights into goal performance

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Airtable, Server Actions
- **Deployment**: Vercel
- **Notifications**: Sonner

## 📦 Prerequisites

- Node.js 18+
- npm or yarn
- Airtable account
- Vercel account (optional)

## 🔧 Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/goal-tracker.git
cd goal-tracker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
- Copy `.env.example` to `.env`
- Fill in your Airtable API key and base ID

4. Run the development server
```bash
npm run dev
```

## 🤖 Automated Weekly Reports

Configured with GitHub Actions to send weekly progress reports:
- Runs every Sunday
- Triggered via API endpoint
- Customizable email recipient

## 🔒 Security

- API endpoints secured with bearer token
- Environment-based configuration
- Minimal exposure of sensitive data

## 📊 Airtable Schema

### Goals Table
- Title
- Description
- Daily Target
- Unit of Measurement
- Quarterly Target
- Progress

### Progress Table
- Goal (Linked to Goals)
- Daily Progress
- Date

### Milestones Table
- Title
- Description
- Goal (Linked to Goals)
- Target Date
- Status
- Target Value

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT License

## 🙌 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Airtable](https://www.airtable.com/)
- [Shadcn UI](https://ui.shadcn.com/)

---

Made with ❤️ by [Jay Ark](https://jayark.dev)
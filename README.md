# GullyStrayCare - Animal Welfare Website

A modern, responsive website for GullyStrayCare, a non-profit organization dedicated to rescuing, rehabilitating, and rehoming street animals across India.

## 🚀 Features

### Payment Integration
- **Razorpay Integration**: Secure payment processing with proper Orders API implementation
- **Multiple Payment Methods**: Credit/Debit cards, UPI, Net Banking, Wallets
- **80G Tax Exemption**: Automated tax certificate generation for eligible donations
- **Payment Verification**: Enhanced security with payment signature verification
- **Error Handling**: Comprehensive error handling for failed payments

### User Experience
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Accessibility**: WCAG compliant with proper contrast ratios and keyboard navigation
- **Performance**: Optimized images and lazy loading for fast page loads

### Content Management
- **Dynamic Content**: Easy to update donation amounts, testimonials, and impact statistics
- **Image Gallery**: Showcase rescue operations and success stories
- **Contact Forms**: Multiple contact methods with form validation
- **Social Media Integration**: Links to social platforms for community engagement

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Payment**: Razorpay
- **Build Tool**: Vite
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gullystraycare-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔧 Configuration

### Razorpay Setup
1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API keys from the dashboard
3. Update the Razorpay key in `src/components/PaymentPage.tsx`:
```javascript
key: 'your_razorpay_key_here'
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx         # Hero section
│   ├── About.tsx        # About section
│   ├── Services.tsx     # Services section
│   ├── Impact.tsx       # Impact statistics
│   ├── Donation.tsx     # Donation section
│   ├── PaymentPage.tsx  # Payment processing
│   ├── Testimonials.tsx # User testimonials
│   ├── Contact.tsx      # Contact form
│   ├── Footer.tsx       # Footer section
│   ├── ThankYouPage.tsx # Post-payment page
│   ├── PrivacyPolicy.tsx# Privacy policy
│   └── TermsOfService.tsx# Terms of service
├── assets/              # Static assets
│   └── images/          # Image files
├── App.tsx              # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🔒 Security Features

- **SSL Encryption**: All data transmission is encrypted
- **PCI DSS Compliance**: Payment processing meets industry standards
- **Input Validation**: All forms include client-side and server-side validation
- **CSRF Protection**: Cross-site request forgery protection
- **Data Privacy**: GDPR compliant data handling

## 📱 Mobile Optimization

- **Touch-Friendly**: Large touch targets for mobile devices
- **Fast Loading**: Optimized images and code splitting
- **Offline Support**: Service worker for basic offline functionality
- **App-Like Experience**: PWA features for mobile installation

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb)
- **Secondary**: Amber (#f59e0b)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Orange (#f97316)

### Typography
- **Headings**: Inter font family, bold weights
- **Body**: Inter font family, regular weight
- **Code**: Fira Code, monospace

### Spacing
- **Base Unit**: 8px
- **Scale**: 4px, 8px, 16px, 24px, 32px, 48px, 64px

## 🧪 Testing

### Manual Testing Checklist
- [ ] Payment flow works correctly
- [ ] Form validation functions properly
- [ ] Responsive design on all devices
- [ ] All links and buttons work
- [ ] Images load correctly
- [ ] Error handling works as expected

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📊 Analytics & Monitoring

### Integrated Analytics
- **Facebook Pixel**: User behavior tracking
- **Payment Analytics**: Transaction success rates
- **Performance Monitoring**: Page load times and errors

### Key Metrics
- Donation conversion rate
- Average donation amount
- User engagement time
- Mobile vs desktop usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📞 Support

For technical support or questions:
- **Email**: gullystrayc@gmail.com
- **Phone**: +91 9323263322
- **Hours**: 9:00 AM - 9:00 PM (Daily)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Razorpay** for secure payment processing
- **Pexels** for stock photography
- **Lucide** for beautiful icons
- **Tailwind CSS** for utility-first styling
- **React** community for excellent documentation

---

**Made with ❤️ for animal welfare by GullyStrayCare**
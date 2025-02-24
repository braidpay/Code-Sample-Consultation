# A sample repo to create a Consultation selling website using Next.js, Shadcn, Tailwind, and BraidPay.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo-name)

A sample repo to create a Consultation selling website using Next.js, Shadcn, Tailwind, and BraidPay. This template provides a ready-to-use consultation booking platform with integrated payment processing through BraidPay.

## Features

- 🎨 Modern UI with Tailwind CSS and Shadcn components
- 💳 Secure payments with BraidPay integration
- 🔄 Real-time payment status updates
- 📱 Fully responsive design
- ⚡ Built with Next.js for optimal performance
- 🛠️ Easy to customize and extend

## Prerequisites

Before you begin, you'll need:

1. A BraidPay account - [Watch setup guide](https://youtu.be/qGZ4zG4Vt94)
2. A BraidPay payment link - [Watch creation guide](https://youtu.be/kqhYSC8063Y)
3. Node.js 18+ installed
4. Basic knowledge of React and Next.js

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
WEBHOOK_SECRET=your_braidpay_webhook_secret
```

4. Update the payment link ID in `app/page.tsx`:
```typescript
const PAYMENT_LINK_ID = "your_payment_link_id"
```
5. Update payment link in `app/page.tsx`, line 347

6. Update Calendar in `app/page.tsx`, line 159

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## BraidPay Setup

### 1. Create BraidPay Account
- Follow the account creation process shown in [this video guide](https://youtu.be/qGZ4zG4Vt94)
- Complete the necessary KYC requirements

### 2. Create Payment Link
- Watch [this tutorial](https://youtu.be/kqhYSC8063Y) to create your payment link
- Copy the payment link ID from the payment link page URL and update it in your code

### 3. Configure Webhooks
BraidPay uses webhooks to notify your application about payment status changes. [Read the webhook documentation](https://docs.braidpay.com/braidpay/set-up-braidpay/webhooks) for detailed setup instructions.

1. Go to BraidPay Dashboard > Settings > Webhooks
2. Add your webhook endpoint: `https://your-domain.com/api/webhook`
3. Copy the webhook secret and add it to your `.env` file
4. Test the webhook to ensure proper configuration

## Deployment

1. Push your code to GitHub
2. Click the "Deploy with Vercel" button above
3. Follow Vercel's deployment process
4. Add your environment variables in Vercel's dashboard
5. Deploy and test your live site

## Customization

### Modifying Consultation Details
Edit `app/page.tsx` to update:
- Consultation title and description
- Pricing
- Available time slots
- Consultant profile and expertise
- Booking terms and conditions

### Styling
- Tailwind classes can be modified directly in the components
- Global styles are in `app/globals.css`- Theme configuration is in `tailwind.config.ts`

### Components
The template uses [Shadcn UI](https://ui.shadcn.com/) components, which can be customized in the `components/ui` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
- Open an issue in this repository
- Contact BraidPay support for payment-related queries
- Refer to the [Next.js documentation](https://nextjs.org/docs)

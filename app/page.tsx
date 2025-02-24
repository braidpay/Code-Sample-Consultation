"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, Video, CheckCircle2, ArrowRight, HelpCircle, MessageCircle, Zap, Target, Users } from "lucide-react"
import dynamic from "next/dynamic"
const Confetti = dynamic(() => import("react-confetti"), { ssr: false })
import { motion } from "framer-motion"

// Payment link configuration
const PAYMENT_LINK_ID = "cm7c8wagn00034dzv71ddm09f" // Replace with consultation payment link

interface PaymentStatus {
  success: boolean;
  email: string;
}

// Add these CSS class overrides at the top of your component
const darkModeClasses = {
  card: "bg-blue-900/95 border-blue-700/30 text-cream-50",
  dialog: "bg-blue-900/95 border-blue-700/30",
  input: "bg-blue-800/50 border-blue-700/50 text-cream-50 placeholder:text-cream-200/50",
  button: "bg-blue-600 hover:bg-blue-700 text-cream-50"
}

export default function ConsultationBooking() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      const normalizedEmail = email.toLowerCase();
      setEmail(normalizedEmail);
      
      try {
        await fetch('/api/check-payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: normalizedEmail,
            paymentLinkID: PAYMENT_LINK_ID,
            action: 'register'
          }),
        });
        
        setIsEmailModalOpen(false);
        setIsPaymentModalOpen(true);
      } catch (error) {
        console.error('Error registering purchase:', error);
      }
    }
  }

  // Check for completed payment periodically
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        console.log('Checking payment status for:', email)
        const response = await fetch('/api/check-payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email,
            paymentLinkID: PAYMENT_LINK_ID 
          }),
        })

        const data = await response.json()
        console.log('Payment status response:', data)
        
        if (data.success && data.shouldShowSuccess) {
          console.log('Payment completed and pending, updating UI')
          setIsPaymentModalOpen(false)
          setPaymentStatus({
            success: true,
            email: email
          })
          setShowConfetti(true)
          return true
        }
        return false
      } catch (error) {
        console.error('Error checking payment status:', error)
        return false
      }
    }

    if (!email) return

    const pollInterval = setInterval(async () => {
      const completed = await checkPaymentStatus()
      if (completed) {
        clearInterval(pollInterval)
      }
    }, 2000)

    checkPaymentStatus()

    return () => {
      clearInterval(pollInterval)
    }
  }, [email])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
      {showConfetti && <Confetti />}
      
      <main className="flex-grow container mx-auto px-4 py-12">
        {paymentStatus?.success ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-900/95 to-indigo-900/95 backdrop-blur-sm border border-blue-700/30">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-400 mb-4" />
                  <h1 className="text-2xl font-bold text-cream-50 mb-2">
                    Payment Successful!
                  </h1>
                  <p className="text-cream-200/80 mb-6">
                    You're one step away from your consultation. Please schedule your preferred time slot below.
                  </p>
                </div>

                {!isCalendlyOpen ? (
                  <Button 
                    onClick={() => setIsCalendlyOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-cream-50 py-4"
                  >
                    Schedule Your Consultation <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <div className="h-[600px] w-full border border-blue-700/30 rounded-lg overflow-hidden">
                    <iframe
                      src="https://calendly.com/your-calendly-link"
                      className="w-full h-full"
                      frameBorder="0"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            {/* Hero Section with enhanced gradient */}
            <div className="text-center mb-12">
              <div className="inline-block p-2 px-4 rounded-full bg-blue-800/30 backdrop-blur-sm mb-6 text-cream-100">
                <span className="text-yellow-100">✨</span> Expert Business Strategy Sessions
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-50 to-cream-200">
                Transform Your Business Strategy
              </h1>
              <p className="text-xl text-cream-100/90 max-w-2xl mx-auto">
                Get personalized strategies and actionable insights in a one-on-one session with our expert consultant.
              </p>
            </div>

            <Card className={`border-0 shadow-2xl ${darkModeClasses.card}`}>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    {/* Consultant Profile */}
                    <div className="mb-8 bg-gradient-to-br from-blue-800/50 to-indigo-800/50 p-6 rounded-lg border border-blue-700/30">
                      <div className="flex items-start space-x-4">
                        <img
                          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&auto=format&fit=crop&q=80"
                          alt="David Chen"
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div>
                          <h2 className="text-2xl font-bold text-cream-50">David Chen</h2>
                          <p className="text-blue-200 font-medium">Senior Business Strategist</p>
                          <div className="flex items-center mt-2 text-cream-200/80">
                            <Users className="h-4 w-4 mr-2" />
                            <span>500+ consultations delivered</span>
                          </div>
                          <p className="mt-3 text-cream-100/80">
                            Former VP of Strategy at Fortune 500 companies with 15+ years of experience 
                            in business development and growth strategies.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-gradient-to-br from-blue-800/40 to-indigo-800/40 hover:from-blue-700/40 hover:to-indigo-700/40 p-4 rounded-lg transition-all duration-300 border border-blue-700/30">
                        <Target className="h-8 w-8 text-blue-200 mb-2" />
                        <h3 className="font-semibold text-cream-50">Strategic Planning</h3>
                        <p className="text-sm text-cream-200/80">Custom roadmap for your goals</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-800/40 to-indigo-800/40 hover:from-blue-700/40 hover:to-indigo-700/40 p-4 rounded-lg transition-all duration-300 border border-blue-700/30">
                        <Zap className="h-8 w-8 text-blue-200 mb-2" />
                        <h3 className="font-semibold text-cream-50">Quick Solutions</h3>
                        <p className="text-sm text-cream-200/80">Immediate actionable advice</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-800/40 to-indigo-800/40 hover:from-blue-700/40 hover:to-indigo-700/40 p-4 rounded-lg transition-all duration-300 border border-blue-700/30">
                        <MessageCircle className="h-8 w-8 text-blue-200 mb-2" />
                        <h3 className="font-semibold text-cream-50">Expert Insights</h3>
                        <p className="text-sm text-cream-200/80">Industry-specific guidance</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-800/40 to-indigo-800/40 hover:from-blue-700/40 hover:to-indigo-700/40 p-4 rounded-lg transition-all duration-300 border border-blue-700/30">
                        <Clock className="h-8 w-8 text-blue-200 mb-2" />
                        <h3 className="font-semibold text-cream-50">Follow-up Notes</h3>
                        <p className="text-sm text-cream-200/80">Detailed session summary</p>
                      </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-100 to-cream-200">
                          Frequently Asked Questions
                        </span>
                      </h3>
                      
                      <div className="bg-gradient-to-br from-blue-800/40 to-indigo-800/40 hover:from-blue-700/40 hover:to-indigo-700/40 p-4 rounded-lg transition-all duration-300 border border-blue-700/30">
                        <h4 className="font-semibold text-cream-50 flex items-center">
                          <HelpCircle className="h-5 w-5 text-blue-200 mr-2" />
                          How should I prepare for the consultation?
                        </h4>
                        <p className="mt-2 text-cream-100/80">
                          Prepare a brief overview of your current situation and specific questions you'd like to address. 
                          This helps us make the most of our time together.
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-800/40 to-indigo-800/40 hover:from-blue-700/40 hover:to-indigo-700/40 p-4 rounded-lg transition-all duration-300 border border-blue-700/30">
                        <h4 className="font-semibold text-cream-50 flex items-center">
                          <HelpCircle className="h-5 w-5 text-blue-200 mr-2" />
                          What happens after the session?
                        </h4>
                        <p className="mt-2 text-cream-100/80">
                          You'll receive a detailed summary of our discussion, including actionable steps and recommendations 
                          within 24 hours of our call.
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-800/40 to-indigo-800/40 hover:from-blue-700/40 hover:to-indigo-700/40 p-4 rounded-lg transition-all duration-300 border border-blue-700/30">
                        <h4 className="font-semibold text-cream-50 flex items-center">
                          <HelpCircle className="h-5 w-5 text-blue-200 mr-2" />
                          Can I get a recording of the session?
                        </h4>
                        <p className="mt-2 text-cream-100/80">
                          Yes, upon request, we can provide a recording of the session for your future reference, 
                          at no additional cost.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-start">
                    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-lg p-6 mb-6 text-cream-50 shadow-xl border border-blue-500/30">
                      <h3 className="text-2xl font-bold mb-2">Premium Consultation</h3>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center">
                          <CheckCircle2 className="mr-2 h-5 w-5 text-blue-200" />
                          30-minute focused session
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="mr-2 h-5 w-5 text-blue-200" />
                          Personalized action plan
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="mr-2 h-5 w-5 text-blue-200" />
                          Session recording included
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="mr-2 h-5 w-5 text-blue-200" />
                          Written summary report
                        </li>
                      </ul>
                      <div className="mb-6">
                        <p className="text-3xl font-bold text-cream-50">$49.00</p>
                        <p className="text-blue-200">One-time consultation fee</p>
                      </div>
                    </div>

                    <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
                      <DialogTrigger asChild>
                        <Button className={`w-full py-6 text-lg ${darkModeClasses.button}`}>
                          Book Your Consultation
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={`sm:max-w-md ${darkModeClasses.dialog}`}>
                        <DialogHeader>
                          <DialogTitle className="text-cream-50">Enter your email to continue</DialogTitle>
                          <DialogDescription className="text-cream-200/80">
                            We'll use this email for your consultation details and calendar invite.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-cream-100">Email address</Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email..."
                              className={darkModeClasses.input}
                            />
                          </div>
                          <Button type="submit" className={`w-full ${darkModeClasses.button}`}>
                            Continue to Payment
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                      <DialogContent className={`max-w-4xl w-full !h-[90vh] p-0 ${darkModeClasses.dialog}`}>
                        <div className="relative h-full flex flex-col">
                          <div className="flex-1">
                            <iframe 
                              src={`https://app.braidpay.com/p/fTDoxCuo5Sy`}
                              className="w-full h-full rounded-lg"
                              allow="payment"
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <footer className="bg-blue-950/40 border-t border-blue-800/30 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            {/* Test Notice */}
            <div className="text-red-300 text-sm text-center border border-red-400/20 bg-red-950/10 backdrop-blur-sm p-2 rounded">
              This is a test page as a part of our BraidPay Use Case demos. This page does not actually sell any consultations.
            </div>
            {/* Footer Content */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-purple-200 text-center md:text-left">
                © 2024 Expert Consultation. All rights reserved.
              </div>
              <a href="https://braidpay.com" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-purple-200">Powered by</span>
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-24%20at%202.35.40%E2%80%AFPM-UqymRYWzvC1igf2clq8gjv0gQEvsvi.png"
                    alt="BraidPay Logo"
                    className="h-6"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 
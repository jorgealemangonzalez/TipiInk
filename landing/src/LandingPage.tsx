'use client'

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Bot, Brain, CheckCircle, Clock, DollarSign, PhoneCall, Plus, Rocket, Target, TrendingUp} from "lucide-react"
import {useTranslation} from "react-i18next"
import {useEffect} from "react"
import mixpanel from "mixpanel-browser"

export function LandingPage() {
    const {t} = useTranslation()

    useEffect(() => {
        mixpanel.track_pageview()
    }, [])

    const redirectToSales = () => {
        window.location.href = 'https://calendar.app.google/dPWb5XdarVm7popF9'
    }

    const redirectToPlatform = () => {
        window.location.href = 'https://app.botwhirl.com'
    }

    return (<>
        <div className="flex flex-col min-h-screen bg-[#effcfc]">
            <header className="px-4 lg:px-6 h-16 flex items-center border-b border-[#3fc1c9]/20">
                <a className="flex items-center justify-center" href="#">
                    <Bot className="h-8 w-8 text-[#3fc1c9]"/>
                    <span
                        className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3fc1c9] to-[#3FC98C]">BotWhirl</span>
                </a>
            </header>
            <main className="flex-1">
                <section
                    className="flex justify-center w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-[#effcfc] to-[#b7f0fe]">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                                    {t('hero.title')} <span
                                        className="bg-clip-text text-transparent bg-gradient-to-r from-[#3fc1c9] to-[#3FC98C]">{t('hero.highlight')}</span>
                                </h1>
                                <p className="mx-auto max-w-[700px] text-neutral/80 md:text-xl">
                                    {t('hero.description')}
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Button onClick={redirectToPlatform}
                                    className="bg-[#3fc1c9] text-white hover:bg-[#3fc1c9]/90 rounded-full px-8 py-2 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                    {t('hero.ctaButton')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="benefits" className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-white">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                            {t('benefits.title')} <span
                                className="bg-clip-text text-transparent bg-gradient-to-r from-[#3fc1c9] to-[#3FC98C]">{t('benefits.highlight')}</span>
                        </h2>
                        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 p-2 bg-[#3fc1c9] rounded-full">
                                    <Clock className="w-8 h-8 text-white"/>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{t('benefits.availability.title')}</h3>
                                <p className="text-neutral/80">{t('benefits.availability.description')}</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 p-2 bg-[#3F7CC9] rounded-full">
                                    <Brain className="w-8 h-8 text-white"/>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{t('benefits.personalizedLearning.title')}</h3>
                                <p className="text-neutral/80">{t('benefits.personalizedLearning.description')}</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 p-2 bg-[#3FC98C] rounded-full">
                                    <Target className="w-8 h-8 text-white"/>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{t('benefits.scalableImpact.title')}</h3>
                                <p className="text-neutral/80">{t('benefits.scalableImpact.description')}</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 p-2 bg-[#ffc000] rounded-full">
                                    <DollarSign className="w-8 h-8 text-white"/>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{t('benefits.passiveIncome.title')}</h3>
                                <p className="text-neutral/80">{t('benefits.passiveIncome.description')}</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 p-2 bg-[#00aa6f] rounded-full">
                                    <Rocket className="w-8 h-8 text-white"/>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{t('benefits.quickLaunch.title')}</h3>
                                <p className="text-neutral/80">{t('benefits.quickLaunch.description')}</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 p-2 bg-[#ff6569] rounded-full">
                                    <TrendingUp className="w-8 h-8 text-white"/>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{t('benefits.dataInsights.title')}</h3>
                                <p className="text-neutral/80">{t('benefits.dataInsights.description')}</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="how-it-works"
                    className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[#effcfc] to-[#b7f0fe]">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                            {t('howItWorks.title')} <span
                                className="bg-clip-text text-transparent bg-gradient-to-r from-[#3fc1c9] to-[#3FC98C]">{t('howItWorks.highlight')}</span>
                        </h2>
                        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
                            {[0, 1, 2].map((index) => (
                                <div key={index} className="flex flex-col items-center text-center">
                                    <div
                                        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#3fc1c9] to-[#3FC98C] text-white text-2xl font-bold mb-4 shadow-lg">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{t(`howItWorks.steps.${index}.title`)}</h3>
                                    <p className="text-neutral/80">{t(`howItWorks.steps.${index}.description`)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section id="pricing" className="flex justify-center w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                            <span
                                className="bg-clip-text text-transparent bg-gradient-to-r from-[#3fc1c9] to-[#3FC98C]">
                                {t('pricing.title')}
                            </span>
                        </h2>
                        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
                            {[
                                {
                                    name: t('pricing.standard'),
                                    price: "€0",
                                    originalPrice: "€99",
                                    perUser: "+10%",
                                    features: [
                                        t('pricing.freeFirst20'),
                                        t('pricing.dedicatedSupport'),
                                        t('pricing.chooseCharge'),
                                        t('pricing.automaticCharge')
                                    ],
                                    highlight: true
                                },
                                {
                                    name: t('pricing.pro'),
                                    price: "€199",
                                    perUser: "+5%",
                                    features: [
                                        t('pricing.moneyBackGuarantee'),
                                        t('pricing.dedicatedSupport'),
                                        t('pricing.chooseCharge'),
                                        t('pricing.automaticCharge'),
                                        t('pricing.earnMore')
                                    ],
                                    highlight: false
                                }
                            ].map((plan) => (
                                <Card key={plan.name}
                                    className={`bg-white/50 backdrop-blur-md border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden ${plan.highlight ? 'border-[#3fc1c9] ring-2 ring-[#3fc1c9]' : ''}`}>
                                    <CardHeader>
                                        <CardTitle
                                            className="text-2xl font-bold text-center">{plan.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center">
                                        <div className="text-center mb-4">
                                            {plan.originalPrice && (
                                                <span
                                                    className="text-2xl line-through text-gray-400 mr-2">{plan.originalPrice}</span>
                                            )}
                                            <span className="text-5xl font-bold">{plan.price}</span>
                                            <span className="text-xl">{t('pricing.perMonth')}</span>
                                        </div>
                                        <div
                                            className="text-2xl font-bold text-[#3fc1c9] mb-6">{plan.perUser} {t('pricing.perUser')}</div>
                                        <Button onClick={redirectToPlatform}
                                            className="animate-border w-full bg-[#3fc1c9] text-white hover:bg-[#3fc1c9]/90 rounded-full py-2 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
                                            {t('pricing.contactSales')}
                                        </Button>
                                        <ul className="space-y-2 w-full">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start">
                                                    {i === 0 && plan.name === t('pricing.standard') ? (
                                                        <Plus
                                                            className="w-5 h-5 text-[#3fc1c9] mr-2 flex-shrink-0 mt-1"/>
                                                    ) : (
                                                        <CheckCircle
                                                            className="w-5 h-5 text-[#00aa6f] mr-2 flex-shrink-0 mt-1"/>
                                                    )}
                                                    <span className="text-neutral/80">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                <section
                    className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[#effcfc] to-[#b7f0fe]">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                    {t('cta.title')} <span
                                        className="bg-clip-text text-transparent bg-gradient-to-r from-[#3fc1c9] to-[#3FC98C]">{t('cta.highlight')}</span> {t('cta.subtitle')}
                                </h2>
                                <p className="mx-auto max-w-[600px] text-neutral/80 md:text-xl">
                                    {t('cta.description')}
                                </p>
                            </div>
                            <Button onClick={redirectToSales}
                                className="bg-[#3fc1c9] text-white hover:bg-[#3fc1c9]/90 rounded-full px-8 py-2 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                <PhoneCall className="w-5 h-5 mr-2"/>
                                {t('cta.button')}
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="w-full py-6 bg-neutral text-white">
                <div className="w-full px-4 md:px-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-2">
                            <a href="#" className="flex items-center">
                                <Bot className="h-6 w-6 text-[#3fc1c9] mr-2"/>
                                <span className="font-bold">BotWhirl</span>
                            </a>
                            <p className="text-sm">{t('footer.copyright')}</p>
                        </div>
                        <nav className="flex gap-4 sm:gap-6 sm:justify-start md:justify-end">
                            <a className="text-sm hover:text-[#3fc1c9] transition-colors"
                                href="https://app.botwhirl.com/terms-and-conditions">
                                {t('footer.termsAndConditions')}
                            </a>
                            <a className="text-sm hover:text-[#3fc1c9] transition-colors"
                                href="https://app.botwhirl.com/privacy-policy">
                                {t('footer.privacyPolicy')}
                            </a>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    </>
    )
}

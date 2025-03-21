import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import {
    Building,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    Headphones,
    Home,
    Mail,
    MessageSquare,
    Mic,
    PhoneCall,
    PieChart,
    TrendingUp,
    Utensils,
    X,
} from 'lucide-react'
import mixpanel from 'mixpanel-browser'

import { LeadForm } from '@/components/LeadForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LandingPage() {
    const { t } = useTranslation()
    const contactSectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        mixpanel.track_pageview()
    }, [])

    const scrollToContact = () => {
        contactSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className='flex min-h-screen flex-col'>
            <header className='sticky top-0 z-50 flex h-16 items-center border-b border-neutral-200 bg-black px-4 lg:px-6'>
                <a className='flex items-center justify-center' href='#'>
                    <img src='/logo-tipi-blanco.svg' alt='Tipi Logo' className='h-16 w-auto -translate-x-1' />
                    <span className='text-2xl font-bold'>Tipi</span>
                </a>
                <div className='ml-auto flex items-center space-x-4'>
                    <Button onClick={scrollToContact} className='rounded-md bg-[#FF914D] hover:bg-[#FF914D]/90'>
                        {t('contact.ctaButton')}
                    </Button>
                </div>
            </header>

            <main className='flex-1'>
                {/* Hero Section */}
                <section className='relative flex h-screen w-full items-center overflow-hidden px-6 py-12 md:h-fit md:py-24 lg:py-32'>
                    <div className='absolute inset-0 z-0'>
                        <img
                            src='/emplatando-apaisado.png'
                            alt='Chef en acción'
                            className='h-full w-full object-cover opacity-20'
                            loading='eager'
                        />
                    </div>
                    <div className='container relative z-10 px-4 md:px-6'>
                        <div className='grid grid-cols-1 items-center gap-8'>
                            <div className='space-y-4'>
                                <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl'>
                                    {t('hero.title')} <span className='text-[#FF914D]'>{t('hero.highlight')}</span>
                                </h1>
                                <p className='max-w-[600px] text-neutral-700 md:text-xl'>{t('hero.description')}</p>
                                <Button
                                    onClick={scrollToContact}
                                    className='rounded-md bg-[#FF914D] px-8 py-6 text-lg font-semibold hover:bg-[#FF914D]/90'
                                >
                                    {t('hero.ctaButton')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problems Section */}
                <section id='problems' className='w-full bg-neutral-100 px-6 py-12 md:py-24'>
                    <div className='container px-4 md:px-6'>
                        <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-2'>
                            <div className='relative h-[400px] w-full overflow-hidden rounded-lg shadow-xl'>
                                <img
                                    src='/vertical-cortando-salmon.png'
                                    alt='Chef estresado'
                                    className='h-full w-full object-cover'
                                />
                            </div>
                            <div className='space-y-6'>
                                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                                    {t('problems.title')}{' '}
                                    <span className='text-[#FF914D]'>{t('problems.highlight')}</span>
                                </h2>
                                <p className='text-neutral-700 md:text-lg'>{t('problems.description')}</p>
                                <div className='space-y-4'>
                                    <div className='flex items-center'>
                                        <X className='mr-3 h-6 w-6 flex-shrink-0 text-red-500' />
                                        <p className='text-neutral-700'>{t('problems.issue1')}</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <X className='mr-3 h-6 w-6 flex-shrink-0 text-red-500' />
                                        <p className='text-neutral-700'>{t('problems.issue2')}</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <X className='mr-3 h-6 w-6 flex-shrink-0 text-red-500' />
                                        <p className='text-neutral-700'>{t('problems.issue3')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id='how-it-works' className='w-full px-6 py-12 md:py-24'>
                    <div className='container px-4 md:px-6'>
                        <div className='mb-12 text-center'>
                            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                                {t('howItWorks.title')}{' '}
                                <span className='text-[#FF914D]'>{t('howItWorks.highlight')}</span>
                            </h2>
                            <p className='mx-auto mt-4 max-w-[800px] text-neutral-700 md:text-lg'>
                                {t('howItWorks.description')}
                            </p>
                        </div>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                            <Card className='border-none shadow-lg transition-all duration-300 hover:shadow-xl'>
                                <CardHeader>
                                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF914D]/10'>
                                        <Mic className='h-6 w-6 text-[#FF914D]' />
                                    </div>
                                    <CardTitle className='text-xl'>{t('howItWorks.feature1.title')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-neutral-700'>"{t('howItWorks.feature1.description')}"</p>
                                </CardContent>
                            </Card>
                            <Card className='border-none shadow-lg transition-all duration-300 hover:shadow-xl'>
                                <CardHeader>
                                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF914D]/10'>
                                        <FileText className='h-6 w-6 text-[#FF914D]' />
                                    </div>
                                    <CardTitle className='text-xl'>{t('howItWorks.feature2.title')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-neutral-700'>"{t('howItWorks.feature2.description')}"</p>
                                </CardContent>
                            </Card>
                            <Card className='border-none shadow-lg transition-all duration-300 hover:shadow-xl'>
                                <CardHeader>
                                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF914D]/10'>
                                        <DollarSign className='h-6 w-6 text-[#FF914D]' />
                                    </div>
                                    <CardTitle className='text-xl'>{t('howItWorks.feature3.title')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-neutral-700'>"{t('howItWorks.feature3.description')}"</p>
                                </CardContent>
                            </Card>
                            <Card className='border-none shadow-lg transition-all duration-300 hover:shadow-xl'>
                                <CardHeader>
                                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF914D]/10'>
                                        <MessageSquare className='h-6 w-6 text-[#FF914D]' />
                                    </div>
                                    <CardTitle className='text-xl'>{t('howItWorks.feature4.title')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-neutral-700'>"{t('howItWorks.feature4.description')}"</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section id='benefits' className='relative w-full bg-neutral-100 px-6 py-12 md:py-24'>
                    <div className='absolute inset-0 z-0 opacity-20'>
                        <img src='/plato-tataki.png' alt='Plato de comida' className='h-full w-full object-cover' />
                    </div>
                    <div className='container relative z-10 px-4 md:px-6'>
                        <div className='mb-12 text-center'>
                            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                                {t('benefits.title')} <span className='text-[#FF914D]'>{t('benefits.highlight')}</span>
                            </h2>
                        </div>
                        <div className='grid grid-cols-1 gap-8 md:ml-40 md:grid-cols-2'>
                            <div className='flex flex-col items-start'>
                                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF914D]/10'>
                                    <Clock className='h-6 w-6 text-[#FF914D]' />
                                </div>
                                <h3 className='mb-2 text-xl font-bold'>{t('benefits.time.title')}</h3>
                                <p className='text-neutral-700'>{t('benefits.time.description')}</p>
                            </div>
                            <div className='flex flex-col items-start'>
                                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF914D]/10'>
                                    <TrendingUp className='h-6 w-6 text-[#FF914D]' />
                                </div>
                                <h3 className='mb-2 text-xl font-bold'>{t('benefits.margins.title')}</h3>
                                <p className='text-neutral-700'>{t('benefits.margins.description')}</p>
                            </div>
                            <div className='flex flex-col items-start'>
                                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF914D]/10'>
                                    <Headphones className='h-6 w-6 text-[#FF914D]' />
                                </div>
                                <h3 className='mb-2 text-xl font-bold'>{t('benefits.support.title')}</h3>
                                <p className='text-neutral-700'>{t('benefits.support.description')}</p>
                            </div>
                            <div className='flex flex-col items-start'>
                                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF914D]/10'>
                                    <PieChart className='h-6 w-6 text-[#FF914D]' />
                                </div>
                                <h3 className='mb-2 text-xl font-bold'>{t('benefits.analytics.title')}</h3>
                                <p className='text-neutral-700'>{t('benefits.analytics.description')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Market Data Section */}
                <section id='market' className='w-full py-12 md:py-24'>
                    <div className='container px-4 md:px-6'>
                        <div className='mb-12 text-center'>
                            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                                {t('market.title')} <span className='text-[#FF914D]'>{t('market.highlight')}</span>
                            </h2>
                        </div>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5'>
                            {[1, 2, 3, 4, 5].map(index => (
                                <Card
                                    key={index}
                                    className='border-none text-center shadow-lg transition-all duration-300 hover:shadow-xl'
                                >
                                    <CardHeader>
                                        <CardTitle className='text-3xl font-bold text-[#FF914D]'>
                                            {t(`market.stat${index}`)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className='text-neutral-700'>{t(`market.stat${index}Description`)}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section id='team' className='w-full bg-neutral-100 py-12 md:py-24'>
                    <div className='container px-4 md:px-6'>
                        <div className='mb-12 text-center'>
                            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                                {t('team.title')} <span className='text-[#FF914D]'>{t('team.highlight')}</span>
                            </h2>
                            <p className='mx-auto mt-4 max-w-[800px] text-neutral-700 md:text-lg'>
                                {t('team.description')}
                            </p>
                        </div>
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                            <Card className='border-none shadow-lg transition-all duration-300 hover:shadow-xl'>
                                <CardHeader className='flex flex-row items-center gap-4'>
                                    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#FF914D]/10'>
                                        <span className='text-xl font-bold text-[#FF914D]'>SC</span>
                                    </div>
                                    <div>
                                        <CardTitle>{t('team.member1.name')}</CardTitle>
                                        <CardDescription>{t('team.member1.role')}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-neutral-700'>{t('team.member1.description')}</p>
                                    <div className='mt-4 flex gap-2'>
                                        <img src='/annua.png' alt='Annua' className='h-8 w-auto rounded-full' />
                                        <img src='/gula.png' alt='Gula' className='h-8 w-auto rounded-full' />
                                        <img src='/bulbiza.png' alt='Bulbiza' className='h-8 w-auto rounded-full' />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className='border-none shadow-lg transition-all duration-300 hover:shadow-xl'>
                                <CardHeader className='flex flex-row items-center gap-4'>
                                    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#FF914D]/10'>
                                        <span className='text-xl font-bold text-[#FF914D]'>JA</span>
                                    </div>
                                    <div>
                                        <CardTitle>{t('team.member2.name')}</CardTitle>
                                        <CardDescription>{t('team.member2.role')}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-neutral-700'>{t('team.member2.description')}</p>
                                    <div className='mt-4 flex gap-2'>
                                        <img src='/king.png' alt='King' className='h-8 w-auto rounded-full' />
                                        <img src='/subbo.png' alt='Subbo' className='h-8 w-auto rounded-full' />
                                        <img
                                            src='/Travelperk.png'
                                            alt='TravelPerk'
                                            className='h-8 w-auto rounded-full'
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id='pricing' className='w-full py-12 md:py-24'>
                    <div className='container px-4 md:px-6'>
                        <div className='mb-12 text-center'>
                            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                                {t('pricing.title')} <span className='text-[#FF914D]'>{t('pricing.highlight')}</span>
                            </h2>
                        </div>
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                            <Card className='border-none shadow-lg transition-all duration-300 hover:shadow-xl'>
                                <CardHeader>
                                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF914D]/10'>
                                        <Home className='h-6 w-6 text-[#FF914D]' />
                                    </div>
                                    <CardTitle>{t('pricing.micro.title')}</CardTitle>
                                    <div className='mt-4'>
                                        <span className='text-4xl font-bold'>{t('pricing.micro.price')}</span>
                                        <span className='text-neutral-700'>{t('pricing.micro.period')}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className='mb-6 text-neutral-700'>{t('pricing.micro.description')}</p>
                                    <div className='space-y-4'>
                                        <div className='flex items-center gap-2'>
                                            <CheckCircle className='h-5 w-5 text-[#FF914D]' />
                                            <span className='text-sm'>20 pedidos semanales</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <CheckCircle className='h-5 w-5 text-[#FF914D]' />
                                            <span className='text-sm'>3 recetas creadas por voz semanales</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={scrollToContact}
                                        className='mt-6 w-full rounded-md bg-[#FF914D] hover:bg-[#FF914D]/90'
                                    >
                                        {t('pricing.ctaButton')}
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className='border-none shadow-lg ring-2 ring-[#FF914D] transition-all duration-300 hover:shadow-xl'>
                                <CardHeader>
                                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF914D]/10'>
                                        <Utensils className='h-6 w-6 text-[#FF914D]' />
                                    </div>
                                    <CardTitle>{t('pricing.medium.title')}</CardTitle>
                                    <div className='mt-4'>
                                        <span className='text-4xl font-bold'>{t('pricing.medium.price')}</span>
                                        <span className='text-neutral-700'>{t('pricing.medium.period')}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className='mb-6 text-neutral-700'>{t('pricing.medium.description')}</p>
                                    <div className='space-y-4'>
                                        <div className='flex items-center gap-2'>
                                            <CheckCircle className='h-5 w-5 text-[#FF914D]' />
                                            <span className='text-sm'>50 pedidos semanales</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <CheckCircle className='h-5 w-5 text-[#FF914D]' />
                                            <span className='text-sm'>8 recetas creadas por voz semanles</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={scrollToContact}
                                        className='mt-6 w-full rounded-md bg-[#FF914D] hover:bg-[#FF914D]/90'
                                    >
                                        {t('pricing.ctaButton')}
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className='border-none shadow-lg transition-all duration-300 hover:shadow-xl'>
                                <CardHeader>
                                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF914D]/10'>
                                        <Building className='h-6 w-6 text-[#FF914D]' />
                                    </div>
                                    <CardTitle>{t('pricing.enterprise.title')}</CardTitle>
                                    <div className='mt-4'>
                                        <span className='text-4xl font-bold'>{t('pricing.enterprise.price')}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className='mb-6 text-neutral-700'>{t('pricing.enterprise.description')}</p>
                                    <div className='space-y-4'>
                                        <div className='flex items-center gap-2'>
                                            <CheckCircle className='h-5 w-5 text-[#FF914D]' />
                                            <span className='text-sm'>Pedidos a medida</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <CheckCircle className='h-5 w-5 text-[#FF914D]' />
                                            <span className='text-sm'>Recetas a medida</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={scrollToContact}
                                        className='mt-6 w-full rounded-md bg-[#FF914D] hover:bg-[#FF914D]/90'
                                    >
                                        {t('pricing.ctaButton')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id='contact' ref={contactSectionRef} className='w-full px-6 pb-12 md:pb-24'>
                    <div className='container px-4 md:px-6'>
                        <div className='mx-auto max-w-[600px] text-center'>
                            <h2 className='mb-6 text-3xl font-bold tracking-tighter sm:text-4xl'>
                                {t('contact.title')} <span className='text-[#FF914D]'>{t('contact.highlight')}</span>{' '}
                                {t('contact.subtitle')}
                            </h2>
                            <LeadForm />

                            <h3 className='mb-4 mt-8 text-2xl font-semibold'>{t('contact.getInTouch')}</h3>

                            <div className='mb-8 flex flex-col justify-center gap-6 sm:flex-row'>
                                <div className='flex items-center'>
                                    <Mail className='mr-2 h-5 w-5' />
                                    <a href={`mailto:${t('contact.email')}`} className='hover:text-[#FF914D]'>
                                        {t('contact.email')}
                                    </a>
                                </div>
                                <div className='flex items-center'>
                                    <PhoneCall className='mr-2 h-5 w-5' />
                                    <a href={`tel:${t('contact.phone')}`} className='hover:text-[#FF914D]'>
                                        {t('contact.phone')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className='w-full border-t border-white/10 bg-[#2C2C2C] py-6'>
                <div className='container px-4 md:px-6'>
                    <div className='grid gap-6 md:grid-cols-2'>
                        <div className='flex flex-col space-y-2'>
                            <a href='#' className='flex items-center'>
                                <img src='/logo-tipi-blanco.svg' alt='Tipi Logo' className='h-16 w-auto' />
                                <span className='ml-2 font-bold'>Tipi</span>
                            </a>
                            <p className='/60 text-sm'>{t('footer.copyright')}</p>
                        </div>
                        <nav className='flex gap-4 sm:justify-start sm:gap-6 md:justify-end'>
                            <a
                                href='/terms-and-conditions'
                                className='/60 text-sm transition-colors hover:text-[#FF914D]'
                            >
                                {t('footer.termsAndConditions')}
                            </a>
                            <a href='/privacy-policy' className='/60 text-sm transition-colors hover:text-[#FF914D]'>
                                {t('footer.privacyPolicy')}
                            </a>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    )
}

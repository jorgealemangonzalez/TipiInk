import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Bot,
    Brain,
    Building,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    Headphones,
    Home,
    Mail,
    Mic,
    Phone,
    PhoneCall,
    PieChart,
    Plus,
    Rocket,
    Target,
    TrendingUp,
    Utensils,
    X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import mixpanel from "mixpanel-browser";

export function LandingPage() {
    const { t } = useTranslation();
    const contactSectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        mixpanel.track_pageview();
    }, []);

    const scrollToContact = () => {
        contactSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-black px-4 lg:px-6 h-16 flex items-center border-b border-neutral-200 sticky top-0 z-50">
                <a className="flex items-center justify-center" href="#">
                    <img src="/logo-tipi-blanco.svg" alt="Tipi Logo" className="h-16 w-auto -translate-x-1" />
                    <span className="text-2xl font-bold ">Tipi</span>
                </a>
                <div className="ml-auto flex items-center space-x-4">
                    <Button onClick={scrollToContact} className="bg-[#FF914D]  hover:bg-[#FF914D]/90 rounded-md">
                        {t("contact.ctaButton")}
                    </Button>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative px-6 h-screen flex items-center md:h-fit w-full py-12 md:py-24 lg:py-32 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/emplatando-apaisado.png"
                            alt="Chef en acción"
                            className="object-cover w-full h-full opacity-20"
                            loading="eager"
                        />
                    </div>
                    <div className="container px-4 md:px-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                                    {t("hero.title")} <span className="text-[#FF914D]">{t("hero.highlight")}</span>
                                </h1>
                                <p className="max-w-[600px] text-neutral-700 md:text-xl">{t("hero.description")}</p>
                                <Button
                                    onClick={scrollToContact}
                                    className="bg-[#FF914D]  hover:bg-[#FF914D]/90 rounded-md px-8 py-6 text-lg font-semibold"
                                >
                                    {t("hero.ctaButton")}
                                </Button>
                            </div>
                            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl hidden md:block">
                                <img
                                    src="/vertical-sarten-cocinando.png"
                                    alt="Chef usando Tipi"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problems Section */}
                <section id="problems" className="w-full px-6 py-12 md:py-24 bg-neutral-100">
                    <div className="container px-4 md:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
                                <img
                                    src="/vertical-cortando-salmon.png"
                                    alt="Chef estresado"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                    {t("problems.title")}{" "}
                                    <span className="text-[#FF914D]">{t("problems.highlight")}</span>
                                </h2>
                                <p className="text-neutral-700 md:text-lg">{t("problems.description")}</p>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <X className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                                        <p className="text-neutral-700">{t("problems.issue1")}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <X className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                                        <p className="text-neutral-700">{t("problems.issue2")}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <X className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                                        <p className="text-neutral-700">{t("problems.issue3")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="w-full px-6 py-12 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                {t("howItWorks.title")}{" "}
                                <span className="text-[#FF914D]">{t("howItWorks.highlight")}</span>
                            </h2>
                            <p className="mt-4 text-neutral-700 md:text-lg max-w-[800px] mx-auto">
                                {t("howItWorks.description")}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-full bg-[#FF914D]/10 flex items-center justify-center mb-4">
                                        <Mic className="w-6 h-6 text-[#FF914D]" />
                                    </div>
                                    <CardTitle className="text-xl">{t("howItWorks.feature1.title")}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-neutral-700">"{t("howItWorks.feature1.description")}"</p>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-full bg-[#FF914D]/10 flex items-center justify-center mb-4">
                                        <FileText className="w-6 h-6 text-[#FF914D]" />
                                    </div>
                                    <CardTitle className="text-xl">{t("howItWorks.feature2.title")}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-neutral-700">"{t("howItWorks.feature2.description")}"</p>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-full bg-[#FF914D]/10 flex items-center justify-center mb-4">
                                        <DollarSign className="w-6 h-6 text-[#FF914D]" />
                                    </div>
                                    <CardTitle className="text-xl">{t("howItWorks.feature3.title")}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-neutral-700">"{t("howItWorks.feature3.description")}"</p>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-full bg-[#FF914D]/10 flex items-center justify-center mb-4">
                                        <Phone className="w-6 h-6 text-[#FF914D]" />
                                    </div>
                                    <CardTitle className="text-xl">{t("howItWorks.feature4.title")}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-neutral-700">"{t("howItWorks.feature4.description")}"</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section id="benefits" className="w-full px-6 py-12 md:py-24 bg-neutral-100 relative">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <img src="/plato-tataki.png" alt="Plato de comida" className="object-cover w-full h-full" />
                    </div>
                    <div className="container px-4 md:px-6 relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                {t("benefits.title")} <span className="text-[#FF914D]">{t("benefits.highlight")}</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:ml-40">
                            <div className="flex flex-col items-start">
                                <div className="w-12 h-12 rounded-full bg-[#FF914D]/10 flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6 text-[#FF914D]" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{t("benefits.time.title")}</h3>
                                <p className="text-neutral-700">{t("benefits.time.description")}</p>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="w-12 h-12 rounded-full bg-[#FF914D]/10 flex items-center justify-center mb-4">
                                    <TrendingUp className="w-6 h-6 text-[#FF914D]" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{t("benefits.margins.title")}</h3>
                                <p className="text-neutral-700">{t("benefits.margins.description")}</p>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="w-12 h-12 rounded-full bg-[#FF914D]/10 flex items-center justify-center mb-4">
                                    <Headphones className="w-6 h-6 text-[#FF914D]" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{t("benefits.support.title")}</h3>
                                <p className="text-neutral-700">{t("benefits.support.description")}</p>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="w-12 h-12 rounded-full bg-[#FF914D]/10 flex items-center justify-center mb-4">
                                    <PieChart className="w-6 h-6 text-[#FF914D]" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{t("benefits.analytics.title")}</h3>
                                <p className="text-neutral-700">{t("benefits.analytics.description")}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Market Data Section */}
                <section id="market" className="w-full py-12 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                {t("market.title")} <span className="text-[#FF914D]">{t("market.highlight")}</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {[1, 2, 3, 4, 5].map((index) => (
                                <Card
                                    key={index}
                                    className="border-none shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-3xl font-bold text-[#FF914D]">
                                            {t(`market.stat${index}`)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-neutral-700">{t(`market.stat${index}Description`)}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section id="team" className="w-full py-12 md:py-24 bg-neutral-100">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                {t("team.title")} <span className="text-[#FF914D]">{t("team.highlight")}</span>
                            </h2>
                            <p className="mt-4 text-neutral-700 md:text-lg max-w-[800px] mx-auto">
                                {t("team.description")}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-[#FF914D]/10 flex items-center justify-center">
                                        <span className="text-xl font-bold text-[#FF914D]">SC</span>
                                    </div>
                                    <div>
                                        <CardTitle>{t("team.member1.name")}</CardTitle>
                                        <CardDescription>{t("team.member1.role")}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-neutral-700">{t("team.member1.description")}</p>
                                    <div className="mt-4 flex gap-2">
                                        <img src="/annua.png" alt="Annua" className="h-8 w-auto rounded-full" />
                                        <img src="/gula.png" alt="Gula" className="h-8 w-auto rounded-full" />
                                        <img src="/bulbiza.png" alt="Bulbiza" className="h-8 w-auto rounded-full" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-[#FF914D]/10 flex items-center justify-center">
                                        <span className="text-xl font-bold text-[#FF914D]">JA</span>
                                    </div>
                                    <div>
                                        <CardTitle>{t("team.member2.name")}</CardTitle>
                                        <CardDescription>{t("team.member2.role")}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-neutral-700">{t("team.member2.description")}</p>
                                    <div className="mt-4 flex gap-2">
                                        <img src="/king.png" alt="King" className="h-8 w-auto rounded-full" />
                                        <img src="/subbo.png" alt="Subbo" className="h-8 w-auto rounded-full" />
                                        <img
                                            src="/Travelperk.png"
                                            alt="TravelPerk"
                                            className="h-8 w-auto rounded-full"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="w-full py-12 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                {t("pricing.title")} <span className="text-[#FF914D]">{t("pricing.highlight")}</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-full bg-[#FF914D]/10 flex items-center justify-center mb-4">
                                        <Home className="w-6 h-6 text-[#FF914D]" />
                                    </div>
                                    <CardTitle>{t("pricing.micro.title")}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">{t("pricing.micro.price")}</span>
                                        <span className="text-neutral-700">{t("pricing.micro.period")}</span>
                                    </div>
                                    <p className="text-neutral-700 mb-6">{t("pricing.micro.description")}</p>
                                    <Button
                                        onClick={scrollToContact}
                                        className="w-full bg-[#FF914D]  hover:bg-[#FF914D]/90 rounded-md"
                                    >
                                        {t("pricing.ctaButton")}
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 ring-2 ring-[#FF914D]">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-full bg-[#FF914D]/10 flex items-center justify-center mb-4">
                                        <Utensils className="w-6 h-6 text-[#FF914D]" />
                                    </div>
                                    <CardTitle>{t("pricing.medium.title")}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">{t("pricing.medium.price")}</span>
                                        <span className="text-neutral-700">{t("pricing.medium.period")}</span>
                                    </div>
                                    <p className="text-neutral-700 mb-6">{t("pricing.medium.description")}</p>
                                    <Button
                                        onClick={scrollToContact}
                                        className="w-full bg-[#FF914D]  hover:bg-[#FF914D]/90 rounded-md"
                                    >
                                        {t("pricing.ctaButton")}
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-full bg-[#FF914D]/10 flex items-center justify-center mb-4">
                                        <Building className="w-6 h-6 text-[#FF914D]" />
                                    </div>
                                    <CardTitle>{t("pricing.enterprise.title")}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">{t("pricing.enterprise.price")}</span>
                                    </div>
                                    <p className="text-neutral-700 mb-6">{t("pricing.enterprise.description")}</p>
                                    <Button
                                        onClick={scrollToContact}
                                        className="w-full bg-[#FF914D]  hover:bg-[#FF914D]/90 rounded-md"
                                    >
                                        {t("pricing.ctaButton")}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" ref={contactSectionRef} className="w-full md:pb-24 pb-12 px-6">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-[600px] mx-auto text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">
                                {t("contact.title")} <span className="text-[#FF914D]">{t("contact.highlight")}</span>{" "}
                                {t("contact.subtitle")}
                            </h2>
                            <div className="flex flex-col sm:flex-row justify-center gap-6 /80">
                                <div className="flex items-center">
                                    <Mail className="w-5 h-5 mr-2" />
                                    <a href={`mailto:${t("contact.email")}`} className="hover:text-[#FF914D]">
                                        {t("contact.email")}
                                    </a>
                                </div>
                                <div className="flex items-center">
                                    <PhoneCall className="w-5 h-5 mr-2" />
                                    <a href={`tel:${t("contact.phone")}`} className="hover:text-[#FF914D]">
                                        {t("contact.phone")}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="w-full py-6 bg-[#2C2C2C]  border-t border-white/10">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-2">
                            <a href="#" className="flex items-center">
                                <img src="/logo-tipi-blanco.svg" alt="Tipi Logo" className="h-16 w-auto" />
                                <span className="ml-2 font-bold">Tipi</span>
                            </a>
                            <p className="text-sm /60">{t("footer.copyright")}</p>
                        </div>
                        <nav className="flex gap-4 sm:gap-6 sm:justify-start md:justify-end">
                            <a
                                href="/terms-and-conditions"
                                className="text-sm /60 hover:text-[#FF914D] transition-colors"
                            >
                                {t("footer.termsAndConditions")}
                            </a>
                            <a href="/privacy-policy" className="text-sm /60 hover:text-[#FF914D] transition-colors">
                                {t("footer.privacyPolicy")}
                            </a>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
}

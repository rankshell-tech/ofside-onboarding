import Link from "next/link";
import ContactForm from "../components/ContactForm";
import { CtaBand, PageHero, Section, SectionIntro } from "../components/marketing";
import { BriefcaseBusiness, Instagram, Mail, MessageCircle, Phone } from "lucide-react";

const contactCards = [
  {
    title: "General support",
    value: "play@ofside.in",
    href: "mailto:play@ofside.in",
    icon: Mail,
  },
  {
    title: "Business enquiries",
    value: "Partnercare@ofside.in",
    href: "mailto:Partnercare@ofside.in",
    icon: BriefcaseBusiness,
  },
  {
    title: "Phone",
    value: "+91 98117 85330",
    href: "tel:+919811785330",
    icon: Phone,
  },
  {
    title: "WhatsApp",
    value: "Chat with Ofside",
    href: "https://wa.me/919811785330",
    icon: MessageCircle,
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/ofsideapp",
    icon: Instagram,
  },
  {
    label: "Email",
    href: "mailto:play@ofside.in",
    icon: Mail,
  },
];

export default function ContactUsPage() {
  return (
    <main className="bg-white text-gray-950">
      <PageHero
        eyebrow="Contact Us"
        title="Talk to Ofside for support, partnerships, venue onboarding, or general questions."
        description="Trust grows faster when people know how to reach you. This page gives users, venue partners, and business stakeholders multiple ways to start a conversation."
        primaryCta={{ label: "Send a Message", href: "#contact-form" }}
        secondaryCta={{ label: "List Your Venue", href: "/onboarding" }}
        aside={
          <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <p className="text-sm uppercase tracking-[0.24em] text-yellow-600">Business enquiries</p>
            <h2 className="mt-4 text-3xl font-semibold text-gray-950">Multiple ways to reach the team</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Reach out for venue listings, player support, partnerships, or commercial discussions. If you prefer a quick route, call or WhatsApp directly.
            </p>
          </div>
        }
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ContactForm />
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <SectionIntro
                eyebrow="Direct Contact"
                title="Email, phone, and WhatsApp"
                description="Choose the route that matches the urgency and type of conversation."
              />
              <div className="mt-8 grid gap-4">
                {contactCards.map(({ title, value, href, icon: Icon }) => (
                  <a
                    key={title}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-yellow-300 hover:bg-yellow-50"
                  >
                    <div className="rounded-2xl bg-yellow-100 p-3 text-gray-950">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{title}</p>
                      <p className="text-base font-semibold text-gray-950">{value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-200 bg-gray-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
              <p className="text-sm uppercase tracking-[0.24em] text-yellow-300">Social Links</p>
              <div className="mt-6 grid gap-4">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                  >
                    <Icon className="h-5 w-5 text-yellow-300" />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-white/5 p-4 text-sm leading-7 text-gray-300">
                Metro 55, Lane 2, Westend Marg, Saidulajab, Saiyad Ul Ajaib Extension, Saket, New Delhi, Delhi 110030
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <CtaBand
          title="Need help from the right Ofside team?"
          description="Use player support for product questions, partner care for venue and business discussions, or WhatsApp for a faster conversation."
          primaryCta={{ label: "Email Ofside", href: "mailto:play@ofside.in" }}
          secondaryCta={{ label: "WhatsApp Ofside", href: "https://wa.me/919811785330" }}
        />
      </Section>
    </main>
  );
}

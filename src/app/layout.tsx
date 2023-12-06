import { Roboto_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { siteConfig } from '@config/siteConfig';
import './globals.css';
import './syntax.css';

const roboto = Roboto_Mono({
    variable: '--font-roboto-mono',
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: siteConfig.siteName,
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let index = 1;
    return (
        <html lang="en" className={`${roboto.variable}`}>
            <head>
                {siteConfig.links.map((x) => {
                    return <link key={index++} rel={x.rel} href={x.href} />;
                })}
            </head>
            <body>{children}</body>
        </html>
    );
}

import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t bg-background py-8 md:py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold tracking-tighter">CASTY</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            The premium platform for the entertainment and showbiz industry. Connect, cast, and discover talent.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Explore</h3>
                        <Link href="/castings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Castings
                        </Link>
                        <Link href="/talents" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Talents
                        </Link>
                        <Link href="/agencies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Agencies
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Legal</h3>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Connect</h3>
                        <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>© {currentYear} CASTY Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

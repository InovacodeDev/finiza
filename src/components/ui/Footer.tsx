"use client";

export function Footer() {
    const scrollTo = (id: string) => {
        if (window.location.pathname !== "/") {
            window.location.href = `/#${id}`;
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    const scrollToTop = () => {
        if (window.location.pathname !== "/") {
            window.location.href = "/";
            return;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="w-full bg-zinc-950 border-t border-white/5 py-12 px-6 lg:px-24">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
                {/* Brand & Copyright */}
                <div className="flex flex-col items-center md:items-start space-y-4">
                    <button
                        onClick={scrollToTop}
                        className="text-2xl font-bold tracking-tight text-zinc-100 hover:text-emerald-400 transition-colors focus:outline-none"
                    >
                        Finiza<span className="text-emerald-500">.</span>
                    </button>
                    <p className="text-zinc-500 text-sm">O controle do seu futuro financeiro.</p>
                    <p className="text-zinc-600 text-xs mt-4">
                        &copy; {new Date().getFullYear()} Finiza. Todos os direitos reservados.
                    </p>
                </div>

                {/* Built by Inovacode */}
                <div className="flex flex-col items-center md:items-start space-y-4">
                    <h4 className="text-zinc-100 font-semibold mb-2">Desenvolvimento</h4>
                    <p className="text-zinc-400 text-sm flex items-center gap-2">
                        Desenvolvido por
                        <a
                            href="https://inovacode.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-100 hover:text-emerald-400 transition-colors font-medium underline underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-500"
                        >
                            Inovacode
                        </a>
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col items-center md:items-start space-y-4">
                    <h4 className="text-zinc-100 font-semibold mb-2">Navegação</h4>
                    <nav className="flex flex-col items-center md:items-start gap-3">
                        <button
                            onClick={() => scrollTo("solucao")}
                            className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm focus:outline-none"
                        >
                            Solução
                        </button>
                        <button
                            onClick={() => scrollTo("produto")}
                            className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm focus:outline-none"
                        >
                            Benefícios
                        </button>
                        <button
                            onClick={() => scrollTo("precos")}
                            className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm focus:outline-none"
                        >
                            Planos
                        </button>
                    </nav>
                </div>
                {/* Legal Links */}
                <div className="flex flex-col items-center md:items-start space-y-4">
                    <h4 className="text-zinc-100 font-semibold mb-2">Legal</h4>
                    <nav className="flex flex-col items-center md:items-start gap-3">
                        <a href="/privacy" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">
                            Privacidade
                        </a>
                        <a href="/terms" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">
                            Termos de Uso
                        </a>
                        <a href="/cookies" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">
                            Cookies
                        </a>
                        <a href="/ia" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">
                            Transparência IA
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}

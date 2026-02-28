import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import React from "react";

interface AccountInviteEmailProps {
    inviterName: string;
    accountName: string;
    inviteLink: string;
}

export const AccountInviteEmail: React.FC<AccountInviteEmailProps> = ({
    inviterName = "Você",
    accountName = "Conta Conjunta",
    inviteLink = "https://finiza.inovacode.dev/invite/123",
}) => {
    const previewText = `Você foi convidado(a) por ${inviterName} para participar da conta financeira ${accountName} no Finiza.`;

    return (
        <Html lang="pt-BR">
            <Head>
                <style>
                    {`
                    body {
                        font-family:
                            "Inter",
                            -apple-system,
                            BlinkMacSystemFont,
                            "Segoe UI",
                            Roboto,
                            Helvetica,
                            Arial,
                            sans-serif;
                    }
                    `}
                </style>
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Section style={containerWrapper}>
                    <Container style={container}>
                        <Section style={header}>
                            <Text style={logo}>
                                Finiza<span style={logoAccent}>.</span>
                            </Text>
                        </Section>

                        <Section style={content}>
                            <Heading style={title}>Você foi convidado!</Heading>

                            <Text style={text}>
                                Você foi convidado(a) por <strong style={{ color: "#fafafa" }}>{inviterName}</strong>{" "}
                                para participar da conta financeira{" "}
                                <strong style={{ color: "#fafafa" }}>{accountName}</strong> no Finiza.
                            </Text>

                            <Text style={text}>
                                Ao aceitar este convite, você terá acesso à conta através da Sincronia Doméstica da
                                plataforma.
                            </Text>

                            <Section style={buttonContainer}>
                                <Button style={button} href={inviteLink}>
                                    Aceitar Convite e Acessar Conta
                                </Button>
                            </Section>

                            <Hr style={divider} />

                            <Text style={{ ...text, fontSize: "14px", marginBottom: "0" }}>
                                Se você não esperava por este convite, por favor, ignore este email de forma segura. O
                                link expirará em breve.
                            </Text>
                        </Section>

                        <Section style={footer}>
                            <Text style={footerText}>
                                &copy; {new Date().getFullYear()} Finiza. Todos os direitos reservados.
                            </Text>
                            <Text style={footerText}>
                                Se precisar de ajuda, entre em contato através do nosso{" "}
                                <Link href="#" style={link}>
                                    suporte
                                </Link>
                                .
                            </Text>
                        </Section>
                    </Container>
                </Section>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: "#09090b",
    backgroundImage: "radial-gradient(circle at 50% -20%, rgba(120, 119, 198, 0.15), transparent)",
    color: "#fafafa",
    margin: "0",
    padding: "0",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const containerWrapper = {
    padding: "40px 20px",
};

const container = {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#18181b",
    background: "rgba(24, 24, 27, 0.6)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
};

const header = {
    padding: "32px 24px",
    textAlign: "center" as const,
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
};

const logo = {
    color: "#fafafa",
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "-1px",
    textDecoration: "none",
    margin: "0",
};

const logoAccent = {
    color: "#34d399",
};

const content = {
    padding: "40px 32px",
};

const title = {
    fontSize: "22px",
    fontWeight: "600",
    color: "#fafafa",
    marginTop: "0",
    marginBottom: "16px",
    textAlign: "center" as const,
};

const text = {
    color: "#a1a1aa",
    fontSize: "16px",
    textAlign: "center" as const,
    lineHeight: "1.6",
    margin: "0 0 24px 0",
};

const buttonContainer = {
    textAlign: "center" as const,
    marginBottom: "32px",
    marginTop: "32px",
};

const button = {
    backgroundColor: "#10b981",
    backgroundImage: "linear-gradient(to right, #34d399, #10b981)",
    color: "#09090b",
    fontWeight: "600",
    textDecoration: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "16px",
    boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)",
    display: "inline-block",
};

const divider = {
    height: "1px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    margin: "32px 0 24px 0",
    border: "none",
    width: "100%",
};

const footer = {
    padding: "0 32px 32px",
    textAlign: "center" as const,
};

const footerText = {
    margin: "0 0 8px 0",
    fontSize: "13px",
    color: "#71717a",
};

const link = {
    color: "#34d399",
    textDecoration: "none",
};

export default AccountInviteEmail;

import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  KeyRound,
  Send,
  HardDrive,
  Server,
  Type,
  Scale,
  UserCheck,
  Cookie,
  Mail,
} from "lucide-react";

const LAST_UPDATED = "13 July 2026";

export default function Privacy() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-12 sm:py-16 border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            The short version: this app has no accounts and no database. Almost
            everything stays in your browser, and your work is sent only to the
            AI provider whose key you enter.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Who is responsible
              </h2>
              <p className="text-muted-foreground">
                The data controller for this app is Ioana Ognibeni. Full contact
                details are in the{" "}
                <a
                  href="https://ioana-ognibeni.eu/impressum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  Impressum
                </a>
                . For privacy questions, email{" "}
                <a
                  href="mailto:contact@ioana-ognibeni.eu"
                  className="text-primary underline underline-offset-2"
                >
                  contact@ioana-ognibeni.eu
                </a>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                Your API key
              </h2>
              <p className="text-muted-foreground">
                To run the exercises you enter your own OpenAI or Anthropic API
                key. That key is stored only in your browser's{" "}
                <span className="font-medium">sessionStorage</span>, is used
                solely to call the provider you chose, and is{" "}
                <span className="font-medium">never sent to our server</span> —
                this app has no backend that could receive it. It is deleted
                automatically when you close the browser tab, and you can clear
                it any time in Settings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                What you type (criteria, examples)
              </h2>
              <p className="text-muted-foreground">
                The text you submit is sent directly from your browser to the AI
                provider you selected — OpenAI (<code>api.openai.com</code>) or
                Anthropic (<code>api.anthropic.com</code>) — so it can be
                evaluated. We do not receive, store, or log it. Once sent, that
                text is processed under the provider's own terms and privacy
                policy:
              </p>
              <ul className="text-muted-foreground list-disc pl-5 space-y-1">
                <li>
                  <a
                    href="https://openai.com/policies/privacy-policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    OpenAI Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.anthropic.com/legal/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    Anthropic Privacy Policy
                  </a>
                </li>
              </ul>
              <p className="text-muted-foreground">
                Both providers are based in the United States, so submitting text
                involves a transfer of data outside the EU/EEA. That transfer is
                governed by the provider's data-processing terms and Standard
                Contractual Clauses. Please don't enter personal or confidential
                information you wouldn't want a third-party AI service to process.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-primary" />
                Progress stored on your device
              </h2>
              <p className="text-muted-foreground">
                Your progress — completed challenges, achievements, and
                error-analysis state — is saved in your browser's{" "}
                <span className="font-medium">localStorage</span>. It stays on
                your device, is never sent anywhere, and you can delete it at any
                time by clearing your site data or using the reset option in the
                app.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Hosting
              </h2>
              <p className="text-muted-foreground">
                The site is hosted on GitHub Pages (GitHub, Inc.). When your
                browser loads the app, GitHub's servers may process technical
                data such as your IP address in standard server logs to deliver
                the page. See the{" "}
                <a
                  href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  GitHub Privacy Statement
                </a>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                Fonts
              </h2>
              <p className="text-muted-foreground">
                Fonts are hosted on this site itself — no third-party font
                services are used, so loading the app sends no data to Google or
                any other font provider.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Cookie className="h-5 w-5 text-primary" />
                Cookies and tracking
              </h2>
              <p className="text-muted-foreground">
                This app sets no tracking cookies and uses no analytics. The only
                data stored in your browser is the functional localStorage and
                sessionStorage described above, which is necessary for the app to
                work.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Legal basis
              </h2>
              <ul className="text-muted-foreground list-disc pl-5 space-y-1">
                <li>
                  Sending your input to the AI provider you chose: necessary to
                  provide the service you requested (Art. 6(1)(b) GDPR).
                </li>
                <li>
                  Serving the site and its logs: our legitimate interest in
                  delivering and securing the app (Art. 6(1)(f) GDPR).
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Your rights
              </h2>
              <p className="text-muted-foreground">
                Under the GDPR you have the right to access, rectify, erase,
                restrict, and port your data, and to object to processing.
                Because this app keeps no personal data on a server, most of your
                data lives on your own device and you can remove it yourself by
                clearing your browser storage. For anything else, or to exercise
                your rights, contact{" "}
                <a
                  href="mailto:contact@ioana-ognibeni.eu"
                  className="text-primary underline underline-offset-2"
                >
                  contact@ioana-ognibeni.eu
                </a>
                . You also have the right to complain to your local data
                protection authority.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Changes to this policy
              </h2>
              <p className="text-muted-foreground">
                This policy may be updated as the app evolves. The date at the
                top reflects the latest version. Questions? Email{" "}
                <a
                  href="mailto:contact@ioana-ognibeni.eu"
                  className="text-primary underline underline-offset-2"
                >
                  contact@ioana-ognibeni.eu
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

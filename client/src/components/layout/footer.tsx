export function Footer() {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground" data-testid="text-footer">
          Made by Ioana Ognibeni with Claude & Replit & NotebookLM
        </p>
        <p className="text-center text-sm text-muted-foreground mt-1" data-testid="text-footer-feedback">
          I'd love your feedback — feel free to reach out on{" "}
          <a
            href="https://www.linkedin.com/in/ioanamarinescu/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
        </p>
        <p className="text-center text-sm text-muted-foreground mt-2" data-testid="text-footer-legal">
          <a
            href="https://ioana-ognibeni.eu/impressum"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            Impressum
          </a>
        </p>
      </div>
    </footer>
  );
}

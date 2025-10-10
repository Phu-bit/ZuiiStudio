// src/app/components/Footer.jsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-black/10">
      <div className="mx-auto w-[95%] py-10 text-sm">
        {/* Equal-width columns from sm:2 to md:3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {/* Contact */}
          <div className="space-y-2 min-w-0">
            <p className="uppercase tracking-wide text-xs text-neutral-500">Contact</p>
            <address className="not-italic space-y-1">
              <a
                href="mailto:zuii.design.studios@gmail.com"
                className="hover:underline"
              >
                Work With Us
              </a>
            </address>
          </div>

          {/* Find us */}
          <div className="space-y-3 min-w-0">
            <p className="uppercase tracking-wide text-xs text-neutral-500">Find us</p>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://instagram.com/yourstudio"
                  className="hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Studio */}
          <div className="space-y-2 min-w-0">
            <p className="uppercase tracking-wide text-xs text-neutral-500">Studio</p>
            <address className="not-italic space-y-1">
              <p>Our crew works remotely, based in Boulder.</p>
            </address>
          </div>
        </div>

        {/* Optional tiny bottom row */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {year} Zuii Studio</p>
          <div className="flex gap-4">
          </div>
        </div>
      </div>
    </footer>
  );
}

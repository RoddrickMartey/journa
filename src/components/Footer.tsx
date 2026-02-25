import { Link } from "react-router-dom";
import LogoDisplay from "./LogoDisplay";
import { Github, Twitter, Linkedin, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

const footerLinks = {
  product: [
    { name: "Features", href: "#" },
    { name: "Feed", href: "#" },
    { name: "Create Post", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Terms", href: "#" },
  ],
  social: [
    { name: "GitHub", icon: Github, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ],
};

function Footer() {
  const currentYear = new Date().getFullYear();

  // Helper to prevent link navigation
  const handleDisableLink = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <footer className="w-full border-t bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <LogoDisplay type="header" />
            <p className="text-sm leading-6 text-muted-foreground max-w-xs">
              A modern platform for sharing thoughts, connecting with others,
              and exploring new ideas through curated posts.
            </p>
            <div className="flex gap-x-2">
              {footerLinks.social.map((item) => (
                <Button key={item.name} variant="ghost" size="icon" asChild>
                  <a
                    href={item.href}
                    onClick={handleDisableLink}
                    className="cursor-default"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="sr-only">{item.name}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  Product
                </h3>
                <ul className="mt-6 space-y-4">
                  {footerLinks.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={handleDisableLink}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-default"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  Company
                </h3>
                <ul className="mt-6 space-y-4">
                  {footerLinks.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={handleDisableLink}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-default"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="hidden sm:block">
              <h3 className="text-sm font-semibold leading-6 text-foreground">
                Stay Updated
              </h3>
              <p className="mt-6 text-sm text-muted-foreground">
                Subscribe to our newsletter for the latest updates.
              </p>
              <form
                className="mt-4 flex max-w-md gap-x-2 items-center"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  className="min-w-0 flex-auto rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button type="submit" size="sm">
                  Join
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs leading-5 text-muted-foreground">
            &copy; {currentYear} YourBrand Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-x-4 text-xs text-muted-foreground">
            <Link
              to="#"
              onClick={handleDisableLink}
              className="hover:underline cursor-default"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              onClick={handleDisableLink}
              className="flex items-center gap-1 hover:underline cursor-default"
            >
              System Status <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

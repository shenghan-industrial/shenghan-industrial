import {
  Linkedin,
  Youtube,
  Twitter,
  Facebook,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/data/site-config";

const iconMap: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
};

export function SocialIcons({ variant = "icon" }: { variant?: "icon" | "card" }) {
  const links = siteConfig.socialLinks;

  if (variant === "card") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {links.map((link) => {
          const Icon = iconMap[link.icon] ?? Facebook;
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-bg-warm dark:bg-brand-800/40 border border-gray-100 dark:border-white/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <Icon className="w-8 h-8 text-text-muted transition-transform duration-300 group-hover:scale-110 group-hover:text-accent" />
              <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                {link.name}
              </span>
              <span className="text-xs text-text-muted">{link.description}</span>
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {links.map((link) => {
        const Icon = iconMap[link.icon] ?? Facebook;
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:text-accent"
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}

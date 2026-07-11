import type { ComponentType } from "react";
import {
  Facebook,
  Github,
  Globe,
  Instagram,
  Link as LinkIcon,
  Linkedin,
  Mail,
  MessageCircle,
  Twitter,
  Youtube,
} from "lucide-react";

type IconType = ComponentType<{ className?: string }>;

/**
 * Maps a `social.icon` key to a Lucide glyph. Unknown keys fall back to a
 * generic link icon so a new platform never renders a blank space.
 */
const REGISTRY: Record<string, IconType> = {
  website: Globe,
  globe: Globe,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  twitter: Twitter,
  x: Twitter,
  discord: MessageCircle,
  email: Mail,
  mail: Mail,
  link: LinkIcon,
};

export function SocialIcon({ name, className }: { name: string; className?: string }) {
  const Icon = REGISTRY[name.toLowerCase()] ?? LinkIcon;
  return <Icon className={className} />;
}

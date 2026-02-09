import { Link, type ExternalPathString } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { Platform } from "react-native";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
}

export function ExternalLink({ href, children, ...rest }: ExternalLinkProps) {
  return (
    <Link
      href={href as ExternalPathString} // ✅ Explicitly cast href to ExternalPathString
      {...rest}
      target="_blank"
      onPress={async (event) => {
        if (Platform.OS !== "web") {
          event?.preventDefault();
          await openBrowserAsync(href);
        }
      }}
    >
      {children}
    </Link>
  );
}

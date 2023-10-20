import { Theme } from "@radix-ui/themes";
import "../styles/globals.css";
import "@radix-ui/themes/styles.css";

export default function Nextra({ Component, pageProps }) {
  return (
    <Theme accentColor="pink">
      <Component {...pageProps} />
    </Theme>
  );
}
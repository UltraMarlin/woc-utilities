declare namespace React {
  interface CSSProperties {
    "--accentColor"?: string | undefined;
    [varName: `--${string}`]: string | number | undefined;
  }
}

export function processSubdomain(subdomain: string) {
  if (
    subdomain == 'api' ||
    subdomain == 'admin' ||
    subdomain == process.env.ROOT_DOMAIN
  ) {
    // public domains, which make use of the public schema by default
    return 'public';
  }
  return subdomain;
}

export function isPublicSchema(subdomain: string) {
  const result = processSubdomain(subdomain);
  return result == 'public';
}

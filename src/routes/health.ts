export default async function HealthRoute(): Promise<Response> {
  return new Response(`Evilbot v${process.env.npm_package_version}`, { status: 200 });
}

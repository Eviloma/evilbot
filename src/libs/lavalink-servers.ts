import { map, max, slice, split } from 'lodash';
import { NodeOption } from 'shoukaku';

import env from './env';

const { LAVALINK_NAMES, LAVALINK_HOSTS, LAVALINK_PASSWORDS, LAVALINK_SECURED } = env;

export default function LavalinkServers(): NodeOption[] {
  const names = split(LAVALINK_NAMES, '|');
  const hosts = split(LAVALINK_HOSTS, '|');
  const passwords = split(LAVALINK_PASSWORDS, '|');
  const secured = map(split(LAVALINK_SECURED, '|'), Boolean);

  const hostsCount = max([names.length, hosts.length, passwords.length, secured.length]);

  return map(slice(hosts, 0, hostsCount), (_, index) => ({
    name: names.at(index)!,
    url: hosts.at(index)!,
    auth: passwords.at(index)!,
    secure: secured.at(index)!,
  }));
}

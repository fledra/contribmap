import process from 'node:process';

export default function getToken(name: string) {
  const token = process.env[name];

  if (!token) {
    throw new Error(`Could not find token "${name}" in environment`);
  }

  return token;
}

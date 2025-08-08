import fs from 'node:fs';
import path from 'node:path';
export async function getAllSlashCommands() {
  const root = path.resolve(process.cwd(), 'src', 'commands');
  const files = await fs.promises.readdir(root);
  const modules: any[] = [];
  for (const name of files) {
    if (!name.endsWith('.ts')) continue;
    const mod = await import(path.join(root, name));
    if (mod.data && mod.execute) modules.push(mod.data.toJSON());
  }
  return modules;
}

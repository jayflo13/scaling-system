import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function query(sql: string) {
  try {
    const { stdout, stderr } = await execPromise(`team-db "${sql.replace(/"/g, '\\"')}"`);
    if (stderr) {
      console.error('team-db stderr:', stderr);
    }
    return JSON.parse(stdout);
  } catch (error) {
    console.error('Error executing team-db query:', error);
    throw error;
  }
}

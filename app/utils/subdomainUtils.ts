export type HostsInstructions = {
  subdomain: string;
  url: string;
  instructions: {
    windows: string;
    mac: string;
    linux: string;
  };
};

export const generateSubdomainUrl = (subdomain: string): string => {
  if (!subdomain) return process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';
  const cleanSubdomain = subdomain.replace('.martory.com', '').split('.')[0];
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';
  const port = baseUrl.split(':')[2] || '3000';
  return `http://${cleanSubdomain}.localhost:${port}`;
};

export const generateHostsFileInstructions = (subdomain: string): HostsInstructions => {
  const cleanSubdomain = subdomain.replace('.martory.com', '').split('.')[0];
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';
  const port = baseUrl.split(':')[2] || '3000';
  
  return {
    subdomain: cleanSubdomain,
    url: `http://${cleanSubdomain}.localhost:${port}`,
    instructions: {
      windows: `1. Open Notepad as Administrator
2. Open: C:\\Windows\\System32\\drivers\\etc\\hosts
3. Add this line: 127.0.0.1 ${cleanSubdomain}.localhost
4. Save the file
5. Restart your browser`,
      
      mac: `1. Open Terminal
2. Run: sudo nano /etc/hosts
3. Add this line: 127.0.0.1 ${cleanSubdomain}.localhost
4. Save (Ctrl+X, then Y, then Enter)
5. Restart your browser`,
      
      linux: `1. Open Terminal
2. Run: sudo nano /etc/hosts
3. Add this line: 127.0.0.1 ${cleanSubdomain}.localhost
4. Save (Ctrl+X, then Y, then Enter)
5. Restart your browser`
    }
  };
};

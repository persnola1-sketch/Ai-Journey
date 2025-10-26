// Quick setup script to create .env file with your OpenAI API key
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔑 OpenAI API Key Setup\n');
console.log('Get your API key from: https://platform.openai.com/api-keys\n');

rl.question('Paste your OpenAI API key (starts with sk-): ', (apiKey) => {
  if (!apiKey || !apiKey.startsWith('sk-')) {
    console.log('\n❌ Invalid API key! It should start with "sk-"\n');
    process.exit(1);
  }

  const envContent = `# OpenAI API Key
OPENAI_API_KEY=${apiKey.trim()}
`;

  fs.writeFileSync('.env', envContent);
  console.log('\n✅ .env file created successfully!');
  console.log('🚀 Now run: npm run server\n');
  
  rl.close();
});


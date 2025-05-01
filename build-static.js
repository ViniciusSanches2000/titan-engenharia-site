import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Executar o build do frontend
console.log('Construindo o frontend...');
execSync('vite build', { stdio: 'inherit' });

// Verificar se o diretório dist existe
if (!fs.existsSync('dist')) {
  console.error('O diretório dist não foi criado');
  process.exit(1);
}

// Verificar o conteúdo do diretório dist
console.log('Conteúdo do diretório dist:');
const distFiles = fs.readdirSync('dist');
console.log(distFiles);

// Criar um arquivo index.html no diretório raiz do dist que redireciona para o arquivo correto
// Isso é necessário porque o Replit Static Sites espera um index.html na raiz
if (!fs.existsSync(path.join('dist', 'index.html'))) {
  console.log('Criando arquivo index.html na raiz do dist...');
  
  // Se o dist contém um diretório assets, então o index.html deve estar na raiz
  if (distFiles.includes('assets')) {
    console.log('O diretório assets foi encontrado na raiz, o index.html deve estar na raiz');
  } else {
    // Procurar por um diretório que contém o index.html
    let indexHtmlPath = null;
    for (const file of distFiles) {
      const filePath = path.join('dist', file);
      if (fs.statSync(filePath).isDirectory()) {
        const subFiles = fs.readdirSync(filePath);
        if (subFiles.includes('index.html')) {
          indexHtmlPath = path.join(file, 'index.html');
          break;
        }
      }
    }
    
    if (indexHtmlPath) {
      console.log(`Criando redirecionamento para ${indexHtmlPath}`);
      const redirectHtml = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=./${indexHtmlPath}" />
</head>
<body>
  <p>Redirecionando para <a href="./${indexHtmlPath}">aqui</a>.</p>
</body>
</html>`;
      fs.writeFileSync(path.join('dist', 'index.html'), redirectHtml);
    } else {
      console.error('Não foi possível encontrar index.html em nenhum subdiretório');
    }
  }
}

console.log('Build concluído com sucesso!');
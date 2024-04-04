module.exports = {
    target: 'es2022',
    entryPoints: ['./src/index.ts'], // Arquivo de entrada principal
    format: ['esm'], // Formatos de saída desejados: CommonJS e ES module (mjs)
    outDir: './dist', // Diretório de saída para os arquivos compilados
  };
  
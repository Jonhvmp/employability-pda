import app from './app';

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'API rodando...' });
})

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} é inválida`);
    process.exit(1);
  } else {
    throw err;
  }
});

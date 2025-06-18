# 🍺 PedeDrink - Sistema de Gestão de Distribuidora

Sistema completo para gestão de distribuidora de bebidas com frontend React e backend Node.js + API REST.

## 🚀 Características

- **Frontend React** - Interface moderna e responsiva
- **Backend Node.js** - API REST completa
- **Autenticação JWT** - Sistema seguro de login
- **Gestão de Produtos** - CRUD completo de bebidas
- **Controle de Vendas** - Registro e acompanhamento
- **Relatórios** - Dashboard com métricas
- **Integração Postman** - Collection completa para testes

## 📋 Funcionalidades

### Frontend (React)
- ✅ Dashboard com métricas
- ✅ Gestão de produtos
- ✅ Controle de vendas
- ✅ Relatórios visuais
- ✅ Sistema de autenticação
- ✅ Interface responsiva

### Backend (Node.js)
- ✅ API REST completa
- ✅ Autenticação JWT
- ✅ Middleware de segurança
- ✅ Rate limiting
- ✅ Validação de dados
- ✅ CORS configurado

## 🛠️ Tecnologias

### Frontend
- React 18
- React Router DOM
- Lucide React (ícones)
- CSS3

### Backend
- Node.js
- Express.js
- JSON Web Token (JWT)
- bcryptjs
- express-validator
- helmet (segurança)
- cors

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/ZacariusY/PedeDrink_Integra-o.git
cd PedeDrink_Integra-o
```

### 2. Instale as dependências do Frontend
```bash
npm install
```

### 3. Instale as dependências do Backend
```bash
cd backend
npm install
```

## 🚀 Como usar

### 1. Inicie o Backend
```bash
cd backend
node server.js
```
O servidor estará rodando em: `http://localhost:3001`

### 2. Inicie o Frontend
```bash
npm start
```
A aplicação estará disponível em: `http://localhost:3000`

## 🔧 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/verify` - Verificar token
- `GET /api/auth/profile` - Perfil do usuário

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto
- `GET /api/products/low-stock` - Produtos com estoque baixo

### Vendas
- `GET /api/sales` - Listar vendas
- `POST /api/sales` - Registrar venda

### Relatórios
- `GET /api/reports/dashboard` - Dados do dashboard

## 📫 Testando com Postman

1. Importe a collection: `backend/PedeDrink-Postman-Collection.json`
2. Configure o ambiente com:
   - `baseUrl`: `http://localhost:3001`
   - `token`: (será preenchido após login)

### Usuário padrão para testes:
- **Email:** `admin@pededrink.com`
- **Senha:** `password`

## 🔐 Segurança

- Autenticação JWT
- Senhas com hash bcrypt
- Rate limiting (100 req/15min)
- Headers de segurança (Helmet)
- Validação de entrada
- CORS configurado

## 📁 Estrutura do Projeto

```
PedeDrink/
├── src/                     # Frontend React
│   ├── components/          # Componentes React
│   ├── pages/              # Páginas da aplicação
│   └── App.js              # Componente principal
├── backend/                 # Backend Node.js
│   ├── routes/             # Rotas da API
│   ├── models/             # Modelos de dados
│   ├── middleware/         # Middlewares
│   └── server.js           # Servidor principal
└── public/                 # Arquivos estáticos
```

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Abra uma [issue](https://github.com/ZacariusY/PedeDrink_Integra-o/issues)
2. Ou entre em contato

---

⭐ Se este projeto te ajudou, considere dar uma estrela!

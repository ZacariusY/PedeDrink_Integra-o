# 🍺 PedeDrink Backend API

Backend completo para o sistema de gerenciamento de distribuidora PedeDrink.

## 🚀 Instalação e Execução

### 1. Instalar dependências:
```bash
cd backend
npm install
```

### 2. Executar o servidor:
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

### 3. Verificar se está funcionando:
- **URL Base:** `http://localhost:3001`
- **Health Check:** `GET http://localhost:3001/api/health`

---

## 📋 **Endpoints da API**

### 🔐 **Autenticação** (`/api/auth`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/login` | Login do usuário | ❌ |
| POST | `/register` | Registro de novo usuário | ❌ |
| GET | `/verify` | Verificar token | ✅ |
| POST | `/refresh` | Renovar token | ✅ |
| GET | `/profile` | Perfil do usuário | ✅ |

### 📦 **Produtos** (`/api/products`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/` | Listar produtos (com filtros) | ✅ |
| GET | `/:id` | Buscar produto por ID | ✅ |
| POST | `/` | Criar novo produto | ✅ |
| PUT | `/:id` | Atualizar produto | ✅ |
| DELETE | `/:id` | Deletar produto | ✅ |
| GET | `/low-stock` | Produtos com estoque baixo | ✅ |
| GET | `/categories` | Listar categorias | ✅ |
| GET | `/stats/overview` | Estatísticas dos produtos | ✅ |
| PATCH | `/:id/stock` | Atualizar estoque específico | ✅ |

### 💰 **Vendas** (`/api/sales`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/` | Listar vendas | ✅ |
| POST | `/` | Registrar nova venda | ✅ |

### 📊 **Relatórios** (`/api/reports`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/dashboard` | Dados do dashboard | ✅ |

---

## 🧪 **Testando com Postman**

### 1. **Configurar Environment no Postman:**
```json
{
  "baseUrl": "http://localhost:3001",
  "token": ""
}
```

### 2. **Fazer Login:**
```http
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

### 3. **Copiar o token retornado e configurar no Environment:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. **Usar token nas demais requisições:**
```http
Authorization: Bearer {{token}}
```

---

## 📝 **Exemplos de Uso**

### **Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### **Listar Produtos:**
```bash
curl -X GET http://localhost:3001/api/products \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### **Criar Produto:**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Cerveja Nova 350ml",
    "price": 3.50,
    "quantity": 100,
    "category": "Cerveja",
    "description": "Cerveja premium gelada"
  }'
```

### **Registrar Venda:**
```bash
curl -X POST http://localhost:3001/api/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "productId": "1",
    "quantity": 2,
    "customerName": "João Silva"
  }'
```

---

## 🔧 **Configurações**

### **Usuário Padrão:**
- **Username:** admin
- **Password:** password
- **Role:** admin

### **Categorias de Produtos:**
- Cerveja
- Refrigerante
- Água
- Suco
- Energético
- Vinho
- Whisky
- Vodka
- Outros

### **Produtos Pré-cadastrados:**
1. Cerveja Skol 350ml - R$ 2,50
2. Refrigerante Coca-Cola 2L - R$ 6,00
3. Água Mineral Crystal 500ml - R$ 1,50

---

## 🎯 **Collection do Postman**

Importe esta collection no Postman para testar rapidamente:

```json
{
  "info": {
    "name": "PedeDrink API",
    "description": "Collection completa para testar a API do PedeDrink"
  },
  "auth": {
    "type": "bearer",
    "bearer": [{"key": "token", "value": "{{token}}"}]
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"username\":\"admin\",\"password\":\"password\"}"
            }
          }
        }
      ]
    },
    {
      "name": "Products",
      "item": [
        {
          "name": "List Products",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/products"
          }
        },
        {
          "name": "Create Product",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/products",
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"Produto Teste\",\"price\":5.99,\"quantity\":50,\"category\":\"Cerveja\"}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## 📊 **Status Codes**

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Dados inválidos
- **401** - Token não fornecido ou inválido
- **403** - Acesso negado
- **404** - Recurso não encontrado
- **500** - Erro interno do servidor

---

## 🔄 **Próximos Passos**

1. ✅ **Backend funcionando**
2. 🔄 **Testar no Postman**
3. 🔄 **Integrar com Frontend**
4. 🔄 **Adicionar banco de dados**
5. 🔄 **Deploy em produção**

**🎯 Agora você pode testar todas as APIs no Postman GRATUITAMENTE!** 
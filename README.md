# PEDEDRINK - Sistema de Gerenciamento de Distribuidora

Sistema administrativo completo para gerenciamento de distribuidora de bebidas, desenvolvido em React com JavaScript.

## 📋 Funcionalidades

### 🏠 Dashboard
- Visão geral das estatísticas da distribuidora
- Produtos cadastrados, vendas realizadas e faturamento total
- Produtos com estoque baixo
- Top produtos mais vendidos
- Vendas dos últimos 7 dias

### 📦 Gerenciamento de Produtos
- **Adicionar produtos** com foto, preço, quantidade e categoria
- **Editar produtos** existentes
- **Excluir produtos** do catálogo
- Controle de estoque em tempo real
- Status visual de produtos em estoque/fora de estoque
- Categorias: Cerveja, Refrigerante, Água, Suco, Energético, Vinho, Whisky, Vodka, Outros

### 💰 Fluxo de Vendas
- **Registrar novas vendas** com controle de estoque automático
- Seleção de produtos com preço e estoque disponível
- Cálculo automático do total da venda
- Filtros por data
- Estatísticas de vendas em tempo real
- Histórico completo de todas as vendas

### 📊 Relatórios de Vendas
- **Gráficos interativos** com Recharts:
  - Vendas por data (linha)
  - Vendas por categoria (pizza)
  - Top 10 produtos mais vendidos (barras)
- **Filtros por período** personalizado
- **Estatísticas detalhadas**:
  - Total de vendas
  - Receita total
  - Ticket médio
  - Clientes únicos
- **Exportação de relatórios** em JSON
- Tabela detalhada por categoria com percentuais

## 🚀 Tecnologias Utilizadas

- **React** 18 - Framework principal
- **React Router DOM** - Roteamento
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones modernos
- **CSS3** - Estilização moderna com gradientes
- **LocalStorage** - Persistência de dados

## 🎨 Design

- Interface moderna e responsiva
- Gradientes e cores vibrantes
- Cards com sombras suaves
- Hover effects nos botões
- Layout mobile-first
- Paleta de cores harmoniosa

## 📱 Responsividade

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (até 767px)

## 🔧 Como Executar

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd pededrink
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o projeto**
   ```bash
   npm start
   ```

4. **Acesse no navegador**
   ```
   http://localhost:3000
   ```

## 📚 Estrutura do Projeto

```
pededrink/
├── src/
│   ├── components/
│   │   ├── Dashboard.js       # Tela principal com estatísticas
│   │   ├── Navbar.js          # Menu de navegação
│   │   ├── Produtos.js        # CRUD de produtos
│   │   ├── Vendas.js          # Registro e fluxo de vendas
│   │   └── Relatorios.js      # Relatórios e gráficos
│   ├── context/
│   │   └── ProductContext.js  # Gerenciamento global de estado
│   ├── App.js                 # Componente principal
│   ├── App.css                # Estilos globais
│   └── index.js               # Ponto de entrada
├── public/
├── package.json
└── README.md
```

## 💾 Persistência de Dados

Os dados são salvos automaticamente no **LocalStorage** do navegador, incluindo:
- Lista de produtos
- Histórico de vendas
- Configurações do sistema

## 🎯 Recursos Avançados

### Controle de Estoque
- Redução automática do estoque ao registrar vendas
- Alertas visuais para produtos com estoque baixo (≤10 unidades)
- Validação de quantidade disponível antes da venda

### Análise de Dados
- Cálculo de produtos mais vendidos
- Análise por categoria
- Métricas de performance
- Tendências de vendas

### Interface Intuitiva
- Modais para formulários
- Confirmações de ação
- Feedback visual imediato
- Navegação fluida

## 🔒 Validações

- Campos obrigatórios nos formulários
- Validação de estoque antes da venda
- Controle de tipos de dados (números, datas, URLs)
- Prevenção de vendas com estoque insuficiente

## 🎨 Paleta de Cores

- **Primária**: #667eea → #764ba2 (Gradiente azul-roxo)
- **Sucesso**: #48c6ef → #6f86d6 (Gradiente azul claro)
- **Perigo**: #ff6b6b → #ee5a52 (Gradiente vermelho)
- **Aviso**: #feca57 → #ff9ff3 (Gradiente amarelo-rosa)
- **Secundária**: #6c757d → #5a6268 (Gradiente cinza)

## 🚀 Melhorias Futuras

- [ ] Backend com banco de dados
- [ ] Autenticação de usuários
- [ ] Relatórios em PDF
- [ ] Notificações push
- [ ] Integração com sistemas fiscais
- [ ] App mobile
- [ ] Dashboard em tempo real
- [ ] Backup automático

## 👨‍💻 Desenvolvimento

Projeto desenvolvido como sistema administrativo completo para distribuidoras de bebidas, focando em usabilidade, performance e design moderno.

## 📄 Licença

Este projeto é de uso livre para fins educacionais e comerciais.

---

**PEDEDRINK** - Gerencie sua distribuidora com eficiência e estilo!

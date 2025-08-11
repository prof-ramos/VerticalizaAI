#!/bin/bash

# 🔍 Script de Verificação de Ambiente - Verticaliza-AI
# Verifica se todas as variáveis de ambiente necessárias estão configuradas

echo "🚀 Verificando configuração do ambiente..."
echo ""

# Variáveis obrigatórias
required_vars=(
  "DATABASE_URL"
  "GEMINI_API_KEY"
  "PGHOST"
  "PGPORT"
  "PGUSER"
  "PGPASSWORD"
  "PGDATABASE"
)

# Variáveis opcionais
optional_vars=(
  "NODE_ENV"
)

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

missing_vars=()
all_good=true

echo "${BLUE}📋 Verificando variáveis obrigatórias:${NC}"
echo ""

for var in "${required_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    echo "❌ ${RED}$var${NC} não está definida"
    missing_vars+=("$var")
    all_good=false
  else
    # Mostrar apenas parte da variável por segurança
    value="${!var}"
    if [[ ${#value} -gt 20 ]]; then
      masked_value="${value:0:10}...${value: -7}"
    else
      masked_value="${value:0:5}***"
    fi
    echo "✅ ${GREEN}$var${NC} = ${masked_value}"
  fi
done

echo ""
echo "${BLUE}📋 Verificando variáveis opcionais:${NC}"
echo ""

for var in "${optional_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    echo "⚠️  ${YELLOW}$var${NC} não está definida (opcional)"
  else
    echo "✅ ${GREEN}$var${NC} = ${!var}"
  fi
done

echo ""

if [ "$all_good" = true ]; then
  echo "🎉 ${GREEN}Todas as variáveis obrigatórias estão configuradas!${NC}"
  echo ""
  echo "${BLUE}📋 Próximos passos:${NC}"
  echo "1. npm install"
  echo "2. npm run db:push"
  echo "3. npm run dev"
else
  echo "❌ ${RED}Configuração incompleta!${NC}"
  echo ""
  echo "${BLUE}📋 Variáveis faltando:${NC}"
  for var in "${missing_vars[@]}"; do
    echo "- $var"
  done
  echo ""
  echo "${BLUE}📋 Como corrigir:${NC}"
  echo "1. Copie o arquivo .env.example para .env"
  echo "2. Preencha as variáveis faltando"
  echo "3. Execute este script novamente"
  echo ""
  echo "${BLUE}📋 Obter chaves de API:${NC}"
  echo "- GEMINI_API_KEY: https://aistudio.google.com/"
  echo "- DATABASE_URL: Configure PostgreSQL local ou use serviço em nuvem"
  
  exit 1
fi

echo ""
echo "${BLUE}🔧 Testando conexões...${NC}"

# Testar conexão com banco
if command -v psql &> /dev/null; then
  if PGPASSWORD="$PGPASSWORD" psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -c "SELECT 1;" &> /dev/null; then
    echo "✅ ${GREEN}Conexão com PostgreSQL OK${NC}"
  else
    echo "❌ ${RED}Falha na conexão com PostgreSQL${NC}"
    echo "   Verifique se o banco está rodando e as credenciais estão corretas"
  fi
else
  echo "⚠️  ${YELLOW}psql não encontrado - instale PostgreSQL client para testar conexão${NC}"
fi

# Testar API do Gemini (básico)
if command -v curl &> /dev/null && [[ -n "$GEMINI_API_KEY" ]]; then
  response=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Content-Type: application/json" \
    -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GEMINI_API_KEY")
  
  if [[ "$response" == "200" ]]; then
    echo "✅ ${GREEN}API do Gemini OK${NC}"
  else
    echo "❌ ${RED}Falha na API do Gemini (HTTP $response)${NC}"
    echo "   Verifique se a chave GEMINI_API_KEY está correta"
  fi
else
  echo "⚠️  ${YELLOW}Não foi possível testar API do Gemini${NC}"
fi

echo ""
echo "🏁 ${GREEN}Verificação concluída!${NC}"
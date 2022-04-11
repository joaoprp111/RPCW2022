import requests

with open('apikey.txt','r') as f:
    apikey = f.read()
    
#Exercícios de aquecimento
# 1 - Quantos processos (nível 3) e quais são (obtem uma lista em JSON; podes concatenar sublistas invocando várias queries), pertencentes à descendência da classe 750?
resp1 = requests.get('http://clav-api.di.uminho.pt/v2/classes?estrutura=lista&nivel=3&apikey=' + apikey).json()
descendentes750 = []

for p in resp1:
    codigo = p['codigo'][:3]
    if codigo == '750':
        descendentes750.append(p)

resposta1 = {}
resposta1['descendentes'] = descendentes750
resposta1['quantos'] = len(descendentes750)

# 2 - Quantos subprocessos existem no catálogo inteiro? (classes de nível 4)
resp2 = requests.get('http://clav-api.di.uminho.pt/v2/classes?estrutura=lista&nivel=4&apikey=' + apikey).json()
resposta2 = {}
resposta2['quantos'] = len(resp2)

# 3 - Quantos processos (classes de nível 3) se encontram na descendência de 750.30?
resp3 = requests.get('http://clav-api.di.uminho.pt/v2/classes/c750.30/descendencia?apikey=' + apikey).json()

resposta3 = {}
resposta3['quantos'] = len(resp3)

# 4 - Quantos processos (classes de nível 3) estão relacionados com 750.30.001?
resp4 = requests.get('http://clav-api.di.uminho.pt/v2/classes/c750.30.001/procRel?apikey=' + apikey).json()

resposta4 = {}
resposta4['quantos'] = len(resp4)

print('-'*100)
print('Resultados')
print('-'*100)

print('1: ', resposta1)
print('2: ', resposta2)
print('3: ', resposta3)
print('4: ', resposta4)


#https://www4.di.uminho.pt/~jcr/AULAS/didac/RepFichas/site/fichas/pri-2021-normal.html
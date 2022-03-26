import json
import re

with open('arq-son-EVO.json') as f:
    content = f.read()
    f.close()

#Acrescentar as vírgulas
content = re.sub(r'\}\s*\{', r'},{', content)

#Acrescentar o objeto musicas
init = """
{
    "musicas": [
"""

end = """]
}
"""

newContent = init + content + end

# O ficheiro não deve existir ainda, senão pode causar erros inesperados
with open('arq-son.json', 'a') as newf:
    newf.write(newContent)
    newf.close()
    
with open('arq-son.json') as jsonf:
    jo = json.load(jsonf)

#Acrescentar id da musica
musicas = jo['musicas']
c = 1
for m in musicas:
    m['id'] = c
    c += 1
    
with open('arq-son.json', 'w') as jsonfinal:
    json.dump(jo, jsonfinal)



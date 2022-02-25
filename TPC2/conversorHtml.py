import json
import os

def generateFilmesPage(movies):
    html = '''
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Filmes</title>
            <link rel="stylesheet" href="../css/w3.css">
            <link rel="stylesheet" href="../css/styling.css">
        </head>
        <body>
            <h1>Lista de filmes por ordem alfabética</h1>
            <ul>
    '''
    #Sort movies alphabetically
    res = list(sorted(movies.items(), key=lambda i: i[1]))
    for movie in res:
        link = 'http://localhost:7777/filmes/f' + str(movie[0])
        html += '<li><a href=\"' + link + '\">' + str(movie[1]) + '</a></li>'
    html += '</ul></body></html>'
    return html

def content(movieContent):
    contentHtml = '<h1>' + movieContent['title'] + '</h1>' + '<p>' + str(movieContent['year']) + ' | '
    
    for genero in movieContent['genres']:
        contentHtml += genero + ' '
    
    contentHtml += '</p>' + '<h2>Elenco</h2>' + '<ul>'
    
    elenco = movieContent['cast']
    for ator in elenco:
        contentHtml += '<li>' + ator + '</li>'
        
    contentHtml += '</ul>'
    
    return contentHtml

def generateHtml(movieContent, file):
    html = '''
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>''' + movieContent['title'] + '''</title>
            <link rel="stylesheet" href="../css/w3.css">
            <link rel="stylesheet" href="../css/styling.css">
        </head>
        <body>''' + content(movieContent) + '''</body></html>'''
        
    file.write(html)

#Open dataset
f = open('dataset.json', encoding='utf-8')

#Dict with id as a key and movie name as a value
movies = dict()

#Html folder
folderHtml = 'html/'
#Create it if it doesn't exist
if not os.path.exists(folderHtml):
    os.makedirs(folderHtml)

#List of registers (movies)
jsonObj = json.load(f)
#Movies counter
count = 1

print('Generating pages...')
for reg in jsonObj:
    #Create html file that corresponds to the register
    filename = folderHtml + 'f' + str(count) + '.html'
    htmlFile = open(filename,'w',encoding='utf-8')
    movies[count] = reg['title']
    count += 1
    generateHtml(reg, htmlFile)
    htmlFile.close()
    
#Generate main page (/filmes)
htmlMainPage = generateFilmesPage(movies)
indexFile = open('html/index.html','w',encoding='utf-8')
indexFile.write(htmlMainPage)
indexFile.close()
    
print('Done!')
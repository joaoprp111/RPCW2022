import json
import os
import re

def generateAtoresPage(actorsId):
    html = '''
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Atores</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body class="w3-container" style="background-color: rgb(22, 22, 22); color: white;">
            <h1 class="w3-text-amber">Lista de atores por ordem alfabética</h1>
            <ul>
    '''
    #Sort actors alphabetically
    res = list(sorted(actorsId.items(), key=lambda i: i[0]))
    for a in res:
        link = 'http://localhost:7777/atores/a' + str(a[1])
        html += '<li><a href=\"' + link + '\">' + str(a[0]) + '</a></li>'
    html += '</ul></body></html>'
    return html

def generateActorPage(actorName, movies, moviesDict):
    html = '''
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>''' + actorName + '''</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body class="w3-container" style="background-color: rgb(22, 22, 22); color: white;">
            <h1 class="w3-text-amber">''' + actorName + '''</h1>
            <h2 class="w3-text-amber">Filmes onde participa</h2>
            <ul>
    '''
    moviesDictKeys = list(moviesDict.keys())
    moviesDictValues = list(moviesDict.values())
    for movie in movies:
        keyPosition = moviesDictValues.index(movie)
        movieId = moviesDictKeys[keyPosition]
        html += '<li><a href=\"http://localhost:7777/filmes/f' + str(movieId) + '\">' + movie + '</a></li>'
        
    html += '</ul></body></html>'
    
    return html

def generateFilmesPage(movies):
    html = '''
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Filmes</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body class="w3-container" style="background-color: rgb(22, 22, 22); color: white;">
            <h1 class="w3-text-amber">Lista de filmes por ordem alfabética</h1>
            <ul>
    '''
    #Sort movies alphabetically
    res = list(sorted(movies.items(), key=lambda i: i[1]))
    for movie in res:
        link = 'http://localhost:7777/filmes/f' + str(movie[0])
        html += '<li><a href=\"' + link + '\">' + str(movie[1]) + '</a></li>'
    html += '</ul></body></html>'
    return html

def content(movieContent, actorsIds):
    contentHtml = '<h1 class="w3-text-amber">' + movieContent['title'] + '</h1>' + '<div class="w3-border-top w3-border-bottom">' + '<p>' + str(movieContent['year']) + '</p>' + '<p>'
    
    if len(movieContent['genres']) > 0:
        contentHtml += '| '
    
    for genero in movieContent['genres']:
        contentHtml += genero + ' | '
    
    contentHtml += '</p></div>' + '<h2 class="w3-text-amber">Elenco</h2>' + '<ul>'
    
    elenco = movieContent['cast']
    for ator in elenco:
        contentHtml += '<li><a href=\"http://localhost:7777/atores/a' + str(actorsIds[ator]) + '\">' + ator + '</a></li>'
        
    contentHtml += '</ul>'
    
    return contentHtml

def generateHtml(movieContent, file, actorsIds):
    html = '''
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>''' + movieContent['title'] + '''</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body class="w3-container" style="background-color: rgb(22, 22, 22); color: white;">''' + content(movieContent,actorsIds) + '''</body></html>'''
        
    file.write(html)

#Open dataset
f = open('dataset.json', encoding='utf-8')

#Dict with id as a key and movie name as a value
movies = dict()

#Actor's name and its id
actorsId = dict()
#Actor's name and its movies
actorsMovies = dict()

#Html folder
folderHtml = 'html/'
#Create it if it doesn't exist
if not os.path.exists(folderHtml):
    os.makedirs(folderHtml)

#List of registers (movies)
jsonObj = json.load(f)
#Movies counter
count = 1
actorCount = 1

print('Generating pages...')
for reg in jsonObj:
    movies[count] = reg
    count += 1
    
    #Fill actors dictionaires
    for actor in reg['cast']:
        #For every actor
        if actor not in actorsId.keys():
            actorsId[actor] = actorCount
            actorCount += 1
        actorsMovies.setdefault(actor,[])
        actorsMovies[actor].append(reg['title'])
    
#Generate all movies pages
for (k,v) in movies.items():  
    #Create html file that corresponds to the movie
    filename = folderHtml + 'f' + str(k) + '.html'
    htmlFile = open(filename,'w',encoding='utf-8')
    generateHtml(v,htmlFile,actorsId)
    htmlFile.close()
    
#Update movies dict
for key in movies.keys():
    temp = movies.get(key)
    movies[key] = temp['title']

#Generate main page (/filmes)
htmlMainPage = generateFilmesPage(movies)
indexFile = open('html/index.html','w',encoding='utf-8')
indexFile.write(htmlMainPage)
indexFile.close()

#Generate aditional page (/atores)
htmlAtores = generateAtoresPage(actorsId)
atoresFile = open('html/atores.html','w',encoding='utf-8')
atoresFile.write(htmlAtores)
atoresFile.close()

#Generate actors pages
for actor in actorsId.keys():
    actorFilename = 'html/a' + str(actorsId[actor]) + '.html'
    htmlActorPage = generateActorPage(actor, actorsMovies[actor], movies)
    actorFile = open(actorFilename, 'w', encoding='utf-8')
    actorFile.write(htmlActorPage)
    actorFile.close()
    
print('Done!')
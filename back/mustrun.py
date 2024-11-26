import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "back.settings")
"""En premier lieu, crée une base de données du nom "sshoesbdd" puis dans votre terminal,
lancer la commande "python3 ./runit.py afin de crée la base de données et toutes ses données." """





try:
    os.system("python3 manage.py makemigrations backapi")
    os.system("python3 manage.py sqlmigrate backapi 0001")
    
    
    # all_users = json.load(open("./bdd/users.json", "r"))
    # all_products = json.load(open("./bdd/products.json", 'r'))
    
except:
    print("Une erreur est survenu lors de la création de la base de données")


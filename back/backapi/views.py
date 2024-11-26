from .models import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder
import json
import re
import jwt
import json 

reg_general = r'^[-.a-zA-Z\d]{5,30}$'
reg_general_bis = r'^[-.a-zA-Z\d\s]{5,50}$'
reg_email = r'^([-.a-zA-Z\d]{5,150})+@+([-a-zA-Z\d]{3,150})+\.+([a-zA-Z\d]{2,20})$'
reg_price = r'^([\d]{1,4})+\.+([\d]{2,2})$'
reg_id = r'[\D]'
reg_pwd_p1 = r"[a-z]"
reg_pwd_p2 = r"[A-Z]"
reg_pwd_p3 = r"[\d]"
reg_pwd_p4 = r"[.@:/#]"
reg_pwd_ban = r"[{}\[\]<>()%]"
reg_img = r"^(http://|https://)+([a-zA-Z\d\/\.]{5,250})+(.jpg|.png|.jpeg)$"




def insert_data():
    all_roles = json.load(open("./bdd/roles.json", "r"))
    all_products = json.load(open("./bdd/products.json", "r"))
    all_users = json.load(open("./bdd/users.json", "r"))
    all_brands = json.load(open("./bdd/brands.json", "r"))
    for i in all_brands:
        Brands(i['pk'], i['fields']['name'], i['fields']['img']).save()
    for i in all_roles:
        Roles(i['pk'], i['fields']['name']).save()
    for i in all_users:
        Users(i['pk'], i['fields']['username'], i['fields']['email'], i['fields']['password'], i['fields']['adress'], i['fields']['city'], i['fields']['country'], i['fields']['role']).save()
    for i in all_products:
        Products(i['pk'], i['fields']['name'], i['fields']['price'], i['fields']['img'], i['fields']['desc'], i['fields']['newprice'], i['fields']['promo'], i['fields']['brand'], i['fields']['gender']).save()

###################### USERS #############

@api_view(['GET', 'DELETE', 'PUT'])
def func_users(request, user_id):

    insert_data()
    
    if request.method == "GET":
        
        if bool(re.search(reg_id, str(user_id))) == False:
            user = Users.objects.filter(id= user_id)
            str_data = serialize('json', user, cls =DjangoJSONEncoder)
            data = json.loads(str_data)
            return Response(data , status=status.HTTP_200_OK)
        else:
            data = {"message": "User ID corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        
        if bool(re.search(reg_id, str(user_id))) == False:
            try:
                id_from_user = jwt.decode(request.data["token"], "secret", algorithms=["HS256"])
                verifyUserAdmin = Users.objects.filter(id = id_from_user['id'], role = 1).values("role", "id")
                if id_from_user != user_id and len(verifyUserAdmin) == 0:
                    data = {"message": "Vous n'avez pas l'autorisation."}
                    return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
            except:
                data = {"message": "Une erreur dans le token"}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            

            if bool(re.search(reg_general, request.data['username'])) == False:
                data = {"message": "Le nom d'utilisateur ne doit pas avoir d'espace ni de caractère spécial."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            if bool(re.search(reg_email, request.data['email'])) == False:
                data = {"message": "Merci de mettre un email correct."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            check_email = Users.objects.filter(email = request.data['email'])
            str_data = serialize('json', check_email, cls =DjangoJSONEncoder)
            check_email = json.loads(str_data)

            if len(check_email) > 0 and check_email[0]["pk"] != user_id:
                data = {"message": "Cette email est déjà utilisé"}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
                
            msg_miss_pwd = "Il vous manque"

            if bool(re.search(reg_pwd_p1, request.data['password'])) == False:
                msg_miss_pwd = msg_miss_pwd + " une lettre minuscule,"
            
            if bool(re.search(reg_pwd_p2, request.data['password'])) == False:
                msg_miss_pwd = msg_miss_pwd + " une lettre majuscule,"
            
            if bool(re.search(reg_pwd_p3, request.data['password'])) == False:
                msg_miss_pwd = msg_miss_pwd + " un chiffre,"
            
            if bool(re.search(r"[^A-Za-z0-9]", request.data['password'])) == True:
                if bool(re.search(reg_pwd_ban, request.data['password'])) == True:
                    msg_miss_pwd = msg_miss_pwd + " un caractère spécial sauf '} { ] [< >( ) %"        
            
            if bool(re.search(r"[^A-Za-z0-9]", request.data['password'])) == False:
                msg_miss_pwd = msg_miss_pwd + " un caractère spécial sauf ' }, {, ], [, <, >, (, ) '%"
        
            if bool(re.search(r"[^A-Za-z0-9]", request.data['confirmPassword'])) == True:
                if bool(re.search(reg_pwd_ban, request.data['confirmPassword'])) == True:
                
                    message = "Caractères invalide dans la confirmation du mot de passe"
                    return Response(data = {"message": message}, status=status.HTTP_400_BAD_REQUEST)
                
            if bool(request.data['password'] == request.data['confirmPassword']) == False:
                message = "Les mots de passe ne sont pas les mêmes"
                return Response(data= {"message": message}, status=status.HTTP_400_BAD_REQUEST)
            

            if len(request.data['password']) < 12:
                msg_miss_pwd = msg_miss_pwd + " 12 caractères minimum,"
            
            if msg_miss_pwd != "Il vous manque":
                return Response(data = {"message" : msg_miss_pwd[0:len(msg_miss_pwd) - 1] + "."}, status=status.HTTP_400_BAD_REQUEST)
            
            
            if bool(re.search(reg_general_bis, request.data['adress'])) == False:
                data = {"message": "Veuillez ne pas mettre de caractères spéciaux dans le champs \"Adresse\"."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            
            if bool(re.search(reg_general_bis, request.data['city'])) == False: 
                data = {"message": "Veuillez ne pas mettre de caractères spéciaux dans le champs \"Ville\"."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            
            if bool(re.search(reg_general_bis, request.data['country'])) == False:
                data = {"message": "Veuillez ne pas mettre de caractères spéciaux dans le champs \"Pays\"."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
                

            same_role = Users.objects.filter(id= user_id)
            str_data = serialize('json', same_role, cls =DjangoJSONEncoder)
            same_role_json = json.loads(str_data)
            
            
            password = request.data['password']
            
            
            
            user = Users.objects.filter(id= user_id).update(username = request.data['username'], email = request.data['email'], password = password, adress = request.data['adress'], city = request.data['city'], country = request.data['country'])
            
            
            data = {"message":"Utilisateur modifié avec succès"}

            get_and_write = Users.objects.all()
            data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
            get_and_write = json.loads(data_gaw)
            
            with open("./bdd/users.json", "w") as json_users:
                json.dump(get_and_write, json_users)

            return Response(data , status=status.HTTP_200_OK)
        else:
            data = {"message": "User ID corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        if bool(re.search(reg_id, str(user_id))) == False:

            try:
                id_from_user = jwt.decode(request.data["token"], "secret", algorithms=["HS256"])
                verifyUserAdmin = Users.objects.filter(id = id_from_user['id'], role = 1).values("role", "id")
                if id_from_user != user_id and len(verifyUserAdmin) == 0:
                    data = {"message": "Vous n'avez pas l'autorisation."}
                    return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
            except:
                data = {"message": "Une erreur dans le token"}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)

            user = Users.objects.filter(id= user_id).delete()
            data = {"message": "Utilisateur supprimé avec succès"}

            get_and_write = Users.objects.all()
            data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
            get_and_write = json.loads(data_gaw)
            
            with open("./bdd/users.json", "w") as json_users:
                json.dump(get_and_write, json_users)

            return Response(data , status=status.HTTP_200_OK)
        else:
            data = {"message": "User ID corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"message" : "Bad method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    
@api_view(['GET', 'POST'])
def func_usersBis(request):

    insert_data()
    
    if request.method == "POST":
        password = request.data['password']
 

        if bool(re.search(reg_general, request.data['username'])) == False:
            data = {"message": "Le nom d'utilisateur ne doit pas avoir d'espace ni de caractère spécial."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
        if bool(re.search(reg_email, request.data['email'])) == False:
            data = {"message": "Merci de mettre un email correct."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
        check_email = Users.objects.filter(email = request.data['email'])
        str_data = serialize('json', check_email, cls =DjangoJSONEncoder)
        check_email = json.loads(str_data)

         
            
        msg_miss_pwd = "Il vous manque"

        if bool(re.search(reg_pwd_p1, request.data['password'])) == False:
            msg_miss_pwd = msg_miss_pwd + " une lettre minuscule,"
        
        if bool(re.search(reg_pwd_p2, request.data['password'])) == False:
            msg_miss_pwd = msg_miss_pwd + " une lettre majuscule,"
        
        if bool(re.search(reg_pwd_p3, request.data['password'])) == False:
            msg_miss_pwd = msg_miss_pwd + " un chiffre,"
        
        if bool(re.search(r"[^0-9A-Za-z]", request.data['password'])) == True:
            if bool(re.search(reg_pwd_ban, request.data['password'])) == True:
                msg_miss_pwd = msg_miss_pwd + " un caractère spécial sauf '} { ] [< >( ) %"        
        
        if bool(re.search(r"[^0-9A-Za-z]", request.data['password'])) == False:
            msg_miss_pwd = msg_miss_pwd + " un caractère spécial sauf ' }, {, ], [, <, >, (, ) '%"
            print(request.data['password'])
    
        if bool(re.search(r"[^0-9A-Za-z]", request.data['confirmPassword'])) == True:
            if bool(re.search(reg_pwd_ban, request.data['confirmPassword'])) == True:
            
                message = "Caractères invalide dans la confirmation du mot de passe"
                return Response(data = {"message": message}, status=status.HTTP_400_BAD_REQUEST)
            
        if bool(request.data['password'] == request.data['confirmPassword']) == False:
            message = "Les mots de passe ne sont pas les mêmes"
            return Response(data= {"message": message}, status=status.HTTP_400_BAD_REQUEST)
        

        if len(request.data['password']) < 12:
            msg_miss_pwd = msg_miss_pwd + " 12 caractères minimum,"
        
        if msg_miss_pwd != "Il vous manque":
            return Response(data = {"message" : msg_miss_pwd[0:len(msg_miss_pwd) - 1] + "."}, status=status.HTTP_400_BAD_REQUEST)
        
        
        if bool(re.search(reg_general_bis, request.data['adress'])) == False:
            data = {"message": "Veuillez ne pas mettre de caractères spéciaux dans le champs \"Adresse\"."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
        
        if bool(re.search(reg_general_bis, request.data['city'])) == False: 
            data = {"message": "Veuillez ne pas mettre de caractères spéciaux dans le champs \"Ville\"."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
        
        if bool(re.search(reg_general_bis, request.data['country'])) == False:
            data = {"message": "Veuillez ne pas mettre de caractères spéciaux dans le champs \"Pays\"."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
              

            
        if len(Users.objects.filter(email=request.data['email'])) < 1:
            
            
            if (len(Users.objects.all()) == 0):
                Users(id = 1, username = request.data['username'], email = request.data['email'], password = request.data['password'], adress = request.data['adress'], city = request.data['city'], country = request.data['country'], role_id = 1).save()
                data = {"message": "Votre compte a été crée avec succès."}
            else:
                for_new_id = Users.objects.all().values("id").order_by('-id')
                
                Users(id = for_new_id[0]['id'] + 1, username = request.data['username'], email = request.data['email'], password = request.data['password'], adress = request.data['adress'], city = request.data['city'], country = request.data['country'], role_id = 1).save()
                data = {"message": "Votre compte a été crée avec succès."}


            get_and_write = Users.objects.all()
            data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
            get_and_write = json.loads(data_gaw)
            
            with open("./bdd/users.json", "w") as json_users:
                json.dump(get_and_write, json_users)

            return Response(data , status=status.HTTP_201_CREATED)
        else:
            data = {"message": "Cette email est déjà utilisé."}
            return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
    
    elif request.method == "GET":
        users = Users.objects.all()
        str_data = serialize('json', users, cls =DjangoJSONEncoder)
        data = json.loads(str_data)
        return Response(data , status=status.HTTP_202_ACCEPTED)


@api_view(['POST'])
def func_users_login(request):
    insert_data()

    email = request.data['email']
    password = request.data['password']

    if bool(re.search(reg_email, request.data['email'])) == False:
        data = {"message": "Merci de mettre un email correct."}
        return Response(data = data, status=status.HTTP_400_BAD_REQUEST)

    checkEmail = Users.objects.filter(email=email)
    str_data = serialize('json', checkEmail, cls =DjangoJSONEncoder)
    data = json.loads(str_data)

    if len(checkEmail) == 1:
        if bool(re.search(reg_pwd_ban, request.data['password'])) == True:
            data = {"message": "Caractères non autoriser"}
            return Response(data= data, status=status.HTTP_400_BAD_REQUEST)
        if bool(password == data[0]['fields']['password']) == True:
            encoded_jwt = jwt.encode({"id": data[0]['pk']}, "secret", algorithm="HS256")
            return Response(data = {"token": encoded_jwt, "message" : "Connexion réussie."}, status=status.HTTP_200_OK)
        else:
            print(data[0]['fields']['password'])
            data = {"message": "Mot de passe incorrect."}
            return Response(data= data, status=status.HTTP_406_NOT_ACCEPTABLE)
    else:
        data = {"message": "Aucun email trouver"}
        return Response(data=data, status=status.HTTP_404_NOT_FOUND)

        
    

###################### PRODUCTS #############


@api_view(['GET', 'DELETE', 'PUT'])
def func_products(request, product_id):

    print("WAZA")
    insert_data()

    if request.method == "GET":
        print("heyu")
        if bool(re.search(reg_id, str(product_id))) == False:
            product = Products.objects.filter(id= product_id)
            str_data = serialize('json', product, cls =DjangoJSONEncoder)
            data = json.loads(str_data)
            print(data)
            return Response(data , status=status.HTTP_200_OK)
        else:
            data = {"message": "Product ID corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        if bool(re.search(reg_id, str(product_id))) == False:

            try:
                id_from_user = jwt.decode(request.data["token"], "secret", algorithms=["HS256"])
                verifyUserAdmin = Users.objects.filter(id = id_from_user['id'], role = 1).values("role", "id")
                if len(verifyUserAdmin) == 0:
                    data = {"message": "Vous n'avez pas l'autorisation."}
                    return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
            except:
                data = {"message": "Une erreur dans le token"}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)

            if bool(re.search(reg_general_bis, request.data['name'])) == False:
                data = {"message": "Nom de produit invalide"}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            if isinstance(request.data['price'], float) == False:
                data = {'message': "Le prix doit être un nombre décimal."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            if bool(re.search(reg_img, request.data['img'])) == False:
                data = {"message": "Erreur dans le nom d'image."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            if bool(re.search(reg_general_bis, request.data['desc'])) == False:
                data = {"message": "Nom de produit invalide"}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)

            if isinstance(request.data['newprice'], float) == False:
                data = {'message': "Le prix de promo doit être un nombre décimal."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)

            if isinstance(request.data['promo'], int) == False:
                data = {'message': "Le prix de promo doit être un nombre décimal."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            if isinstance(request.data['brand'], int) == False:
                data = {'message': "Le prix de promo doit être un nombre décimal."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            if isinstance(request.data['gender'], int) == False:
                data = {'message': "Le prix de promo doit être un nombre décimal."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)

            product = Products.objects.filter(id= product_id).update(name = request.data['name'], price = request.data['price'], img = request.data['img'], gender = request.data['gender'], brand = request.data['brand'], newprice = request.data['newprice'], promo = request.data['promo'])
            data = {"message":"Produits modifié avec succès"}

            get_and_write = Products.objects.all()
            data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
            get_and_write = json.loads(data_gaw)
            
            with open("./bdd/products.json", "w") as json_products:
                json.dump(get_and_write, json_products)

            return Response(data , status=status.HTTP_200_OK)

    elif request.method == "DELETE":

        if isinstance(product_id, int) == True:

            try:
                id_from_user = jwt.decode(request.data["token"], "secret", algorithms=["HS256"])
                verifyUserAdmin = Users.objects.filter(id = id_from_user['id'], role = 1).values("role", "id")
                if len(verifyUserAdmin) == 0:
                    data = {"message": "Vous n'avez pas l'autorisation."}
                    return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
            except:
                data = {"message": "Une erreur dans le token"}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)

            product = Products.objects.filter(id= product_id).delete()
            data = {"message": "Produits supprimé avec succès"}

            get_and_write = Products.objects.all()
            data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
            get_and_write = json.loads(data_gaw)
            
            with open("./bdd/products.json", "w") as json_products:
                json.dump(get_and_write, json_products)

            return Response(data , status=status.HTTP_200_OK)
        else:
            data = {"message": "Produits ID corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"message" : "Bad method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET', 'POST'])
def func_productsBis(request):

    insert_data()

    if request.method == "POST":

        try:
            id_from_user = jwt.decode(request.data["token"], "secret", algorithms=["HS256"])
            verifyUserAdmin = Users.objects.filter(id = id_from_user['id'], role = 1).values("role", "id")
            if len(verifyUserAdmin) == 0:
                data = {"message": "Vous n'avez pas l'autorisation."}
                return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
        except:
            data = {"message": "Une erreur dans le token"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        if bool(re.search(reg_general_bis, request.data['name'])) == False:
            data = {"message": "Nom de produit invalide"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
        if isinstance(request.data['price'], float) == False:
            data = {'message': "Le prix doit être un nombre décimal."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
        if bool(re.search(reg_img, request.data['img'])) == False:
            data = {"message": "Erreur dans le nom d'image."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
        if bool(re.search(reg_general_bis, request.data['desc'])) == False:
            data = {"message": "Nom de produit invalide"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        if isinstance(request.data['newprice'], float) == False:
            data = {'message': "Le prix de promo doit être un nombre décimal."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        if isinstance(request.data['promo'], int) == False:
            data = {'message': "Le prix de promo doit être un nombre décimal."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
        if isinstance(request.data['brand'], int) == False:
            data = {'message': "Le prix de promo doit être un nombre décimal."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
        if isinstance(request.data['gender'], int) == False:
            data = {'message': "Le prix de promo doit être un nombre décimal."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST) 

        for_new_id = len(Products.objects.all())
        product = Products(id = for_new_id + 1, name = request.data['name'], price = request.data['price'], img = request.data['img'], gender = request.data['gender'], brand_id =  3, newprice = request.data['newprice'], promo = request.data['promo'])
        product.save()
        data = {"message": "Votre produit a été crée avec succès."}

        get_and_write = Products.objects.all()
        data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
        get_and_write = json.loads(data_gaw)
            
        with open("./bdd/products.json", "w") as json_products:
            json.dump(get_and_write, json_products)

        return Response(data , status=status.HTTP_201_CREATED)
    elif request.method == "GET":
        products = Products.objects.values("id", "name" , "price", "img", "desc", "newprice", "promo", "brand_id", "gender", "brand__id", "brand__name", "brand__img")
         
        productsJSON = []
        for i in products:
            pk = i['id']
            fields = {"brand__name" : i['brand__name'], "brand__img": i['brand__img'], 'name' : i['name'], "img": i['img'], "price": i['price'], 'desc' : i['desc'], "newprice": i['newprice'], "promo" : i['promo'], "brand": i['brand_id'], "gender": i['gender']  }
            productsJSON.append({"pk" : pk , "fields": fields})
        return Response(productsJSON , status=status.HTTP_202_ACCEPTED)
    


@api_view(['GET'])
def func_productsBisFlut (request):
    if request.method == "GET":
        products = Products.objects.values("id", "name" , "price", "img", "desc", "newprice", "promo", "brand_id", "gender", "brand__id", "brand__name", "brand__img")
         
        productsJSON = []
        for i in products:
            pk = i['id']
            productsJSON.append({"pk": pk, "brand__name": i['brand__name'], "brand__img": i['brand__img'], 'name': i['name'], "img": i['img'], "price": i['price'], 'desc' : i['desc'], "newprice": i['newprice'], "promo": i['promo'], "brand": i['brand_id'], "gender": i['gender'] })
            
        return Response(productsJSON, status=status.HTTP_202_ACCEPTED)


################### ROLES ############

@api_view(['GET', 'DELETE', 'PUT'])
def func_roles(request, role_id):
    
    insert_data()

    if request.method == "GET":
        
        if bool(re.search(reg_id, str(role_id))) == False:
        
            role = Roles.objects.filter(id= role_id)
            str_data = serialize('json', role, cls =DjangoJSONEncoder)
            data = json.loads(str_data)
            return Response(data , status=status.HTTP_200_OK)
        else:
            data = {"message": "Product ID corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":

        try:
            id_from_user = jwt.decode(request.data["token"], "secret", algorithms=["HS256"])
            verifyUserAdmin = Users.objects.filter(id = id_from_user['id'], role = 1).values("role", "id")
            if len(verifyUserAdmin) == 0:
                data = {"message": "Vous n'avez pas l'autorisation."}
                return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
        except:
            data = {"message": "Une erreur dans le token"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        if bool(re.search(r"^[\D][\W]$", request.data['name'])) == True:
            data = {"message" : "Le nom doit comporter seulement des lettres."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        role = Roles.objects.filter(id= role_id).update(name = request.data['name'])
        data = {"message":"Role modifié avec succès"}

        get_and_write = Roles.objects.all()
        data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
        get_and_write = json.loads(data_gaw)
            
        with open("./bdd/roles.json", "w") as json_roles:
            json.dump(get_and_write, json_roles)

        return Response(data , status=status.HTTP_200_OK)
        

    elif request.method == "DELETE":

        try:
            id_from_user = jwt.decode(request.data["token"], "secret", algorithms=["HS256"])
            verifyUserAdmin = Users.objects.filter(id = id_from_user['id'], role = 1).values("role", "id")
            if len(verifyUserAdmin) == 0:
                data = {"message": "Vous n'avez pas l'autorisation."}
                return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
        except:
            data = {"message": "Une erreur dans le token"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        if bool(re.search(reg_id, role_id)) == False:
            data = {"message": "Role ID corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        role = Roles.objects.filter(id= role_id).delete()
        data = {"message": "Role supprimé avec succès"}
        return Response(data , status=status.HTTP_200_OK)
    else:
        return Response({"message" : "Bad method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET', 'POST'])
def func_rolesBis(request):
    insert_data()

    if request.method == "POST":

        try:
            id_from_user = jwt.decode(request.data["token"], "secret", algorithms=["HS256"])
            verifyUserAdmin = Users.objects.filter(id = id_from_user['id'], role = 1).values("role", "id")
            if len(verifyUserAdmin) == 0:
                data = {"message": "Vous n'avez pas l'autorisation."}
                return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
        except:
            data = {"message": "Une erreur dans le token"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        for_new_id = len(Roles.objects.all())
        if bool(re.search(r"^[\D][\W]$", request.data['name'])) == True:
            data = {"message" : "Le nom doit comporter seulement des lettres."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
        role = Roles(id= for_new_id + 1, name= request.data['name'])
        role.save()
        data = {"message": "Votre role a été crée avec succès."}

        get_and_write = Roles.objects.all()
        data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
        get_and_write = json.loads(data_gaw)
            
        with open("./bdd/roles.json", "w") as json_roles:
            json.dump(get_and_write, json_roles)

        return Response(data , status=status.HTTP_201_CREATED)
    
    elif request.method == "GET":
        roles = Roles.objects.all()
        str_data = serialize('json', roles, cls =DjangoJSONEncoder)
        data = json.loads(str_data)
        return Response(data , status=status.HTTP_202_ACCEPTED)
    

################### BRANDS ############


@api_view(['GET', 'DELETE', 'PUT'])
def func_brands(request, brand_id):

    insert_data()

    if request.method == "GET":
        
        if bool(re.search(reg_id, str(brand_id))) == False:
            brand = Brands.objects.filter(id= brand_id)
            str_data = serialize('json', brand, cls =DjangoJSONEncoder)
            data = json.loads(str_data)
            return Response(data , status=status.HTTP_200_OK)
        else:
            data = {"message": "Brand ID corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        if bool(re.search(reg_id, str(brand_id))) == False:

            try:
                id_from_user = jwt.decode(request.data["token"], "secret", algorithms=["HS256"])
                verifyUserAdmin = Users.objects.filter(id = id_from_user['id'], role = 1).values("role", "id")
                if len(verifyUserAdmin) == 0:
                    data = {"message": "Vous n'avez pas l'autorisation."}
                    return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
            except:
                data = {"message": "Une erreur dans le token"}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)

            if bool(re.search(reg_general_bis, request.data['name'])) == False:
                data = {"message": "Nom de marque invalide"}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            if bool(re.search(reg_img, request.data['img'])) == False:
                data = {"message": "Erreur dans le nom d'image."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)


            brand = Brands.objects.filter(id= brand_id).update(name = request.data['name'], img = request.data['img'])
            data = {"message":"Marque modifié avec succès"}

            get_and_write = Brands.objects.all()
            data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
            get_and_write = json.loads(data_gaw)
            
            with open("./bdd/brands.json", "w") as json_products:
                json.dump(get_and_write, json_products)

            return Response(data , status=status.HTTP_200_OK)

    elif request.method == "DELETE":

        if bool(re.search(reg_id, brand_id)) == False:

            try:
                id_from_user = jwt.decode(request.data["token"], "secret", algorithms=["HS256"])
                verifyUserAdmin = Users.objects.filter(id = id_from_user['id'], role = 1).values("role", "id")
                if len(verifyUserAdmin) == 0:
                    data = {"message": "Vous n'avez pas l'autorisation."}
                    return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
            except:
                data = {"message": "Une erreur dans le token"}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)

            brand = Brands.objects.filter(id= brand_id).delete()
            data = {"message": "Marque supprimé avec succès"}

            get_and_write = Brands.objects.all()
            data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
            get_and_write = json.loads(data_gaw)
            
            with open("./bdd/brands.json", "w") as json_products:
                json.dump(get_and_write, json_products)

            return Response(data , status=status.HTTP_200_OK)
        else:
            data = {"message": "Marque ID corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"message" : "Bad method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET', 'POST'])
def func_brandsBis(request):

    insert_data()

    if request.method == "POST":


        try:
            id_from_user = jwt.decode(request.data["token"], "secret", algorithms=["HS256"])
            verifyUserAdmin = Users.objects.filter(id = id_from_user['id'], role = 1).values("role", "id")
            if len(verifyUserAdmin) == 0:
                data = {"message": "Vous n'avez pas l'autorisation."}
                return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
        except:
            data = {"message": "Une erreur dans le token"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        if bool(re.search(reg_general_bis, request.data['name'])) == False:
            data = {"message": "Nom de la marque invalide"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
        if bool(re.search(reg_img, request.data['img'])) == False:
            data = {"message": "Erreur dans le nom d'image."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)


        for_new_id = len(Brands.objects.all())
        brand = Brands(id= for_new_id + 1, name= request.data['name'], img = request.data['img'])
        brand.save()
        data = {"message": "Marque crée avec succès."}

        get_and_write = Brands.objects.all()
        data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
        get_and_write = json.loads(data_gaw)
            
        with open("./bdd/brands.json", "w") as json_products:
            json.dump(get_and_write, json_products)

        return Response(data , status=status.HTTP_201_CREATED)
    elif request.method == "GET":
        brands = Brands.objects.all()
        str_data = serialize('json', brands, cls =DjangoJSONEncoder)
        data = json.loads(str_data)
        return Response(data , status=status.HTTP_202_ACCEPTED)
    

def func_brandsBisFlut(request):
    if request.method == "GET":
        brands = Brands.objects.all()
        str_data = serialize('json', brands, cls =DjangoJSONEncoder)
        data = json.loads(str_data)
        return Response(data , status=status.HTTP_202_ACCEPTED)
    
################### COMMANDES ############

@api_view(['GET', 'DELETE', 'PUT'])
def func_commandes(request, commande_id):
 
    insert_data()

    if request.method == "GET":
        print("heyu")
        if bool(re.search(reg_id, str(commande_id))) == False:
            commande = Commandes.objects.filter(id= commande_id)
            str_data = serialize('json', commande, cls =DjangoJSONEncoder)
            data = json.loads(str_data)
            return Response(data , status=status.HTTP_200_OK)
        else:
            data = {"message": "Commande ID corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

    
    elif request.method == "DELETE":
        id_from_user = 0
        try:
            id_from_user = jwt.decode(request.data["token"], "secret", algorithms=["HS256"])
            verifyUser = Users.objects.filter(id = id_from_user['id']).values("role", "id")
            if len(verifyUser) == 0:
                data = {"message": "Vous n'avez pas l'autorisation."}
                return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
            

        except:
            data = {"message": "Une erreur dans le token"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
        if isinstance(id_from_user, int) == False:
            data = {"message": "Erreur id user"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        if bool(re.search(reg_id, str(commande_id))) == False:
            commande = Commandes.objects.filter(id= commande_id, user = id_from_user['id']).delete()
            data = {"message": "Commande supprimé avec succès"}

            get_and_write = Commandes.objects.all()
            data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
            get_and_write = json.loads(data_gaw)
            
            with open("./bdd/brands.json", "w") as json_products:
                json.dump(get_and_write, json_products)

            return Response(data , status=status.HTTP_200_OK)
        else:
            data = {"message": "Marque ID corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"message" : "Bad method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET', 'POST', 'PUT'])
def func_commandesBis(request):

    insert_data()

    if request.method == "POST":
        user_id = 0
        try:
            user_id = jwt.decode(request.data['token'],"secret" ,algorithms="HS256")['id']
        except:
            data = {"message": "Erreur dans le token"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        if isinstance(request.data['isDelivred'], bool) == False:
                data = {"message": "Erreur isDelivred corrompu."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
        if isinstance(request.data['isDelivred'], int) == False:
                data = {"message": "Erreur isDelivred corrompu."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
        if isinstance(request.data['isCommanded'], bool) == False:
            data = {"message": "Erreur isCommanded corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        if isinstance(request.data['product'], int) == False:
            data = {"message": "Erreur id Product corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        if isinstance(user_id, int) == False:
            data = {"message": "Erreur id User corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

       


        for_new_id = len(Commandes.objects.all())
        brand = Commandes(id= for_new_id + 1, isDelivred= request.data['isDelivred'], isCommanded = request.data['isCommanded'], product_id = request.data['product'], user_id = user_id)
        brand.save()
        data = {"message": "Commande crée avec succès."}

        get_and_write = Commandes.objects.all()
        data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
        get_and_write = json.loads(data_gaw)
            
        with open("./bdd/commandes.json", "w") as json_products:
            json.dump(get_and_write, json_products)

        return Response(data , status=status.HTTP_201_CREATED)
    elif request.method == "GET":
        commandes = Commandes.objects.values("id", "user_id", "product_id", "product__name", "product__img", "product__price", "product__promo", "product__newprice", "isDelivred", "isCommanded")
        commandesJSON = []
        for i in commandes:
            pk = i['id']
            fields = {"isDelivred": i['isDelivred'], "isCommanded": i['isCommanded'], "user_id": i["user_id"], "product__name" : i['product__name'], "product__img": i['product__img'],  "product__price": i['product__price'], "product__newprice": i['product__newprice'], "product__promo" : i['product__promo']  }
            commandesJSON.append({"pk" : pk , "fields": fields})
        
        return Response(commandesJSON , status=status.HTTP_202_ACCEPTED)
    
    elif request.method == "PUT":

        try:
            id_from_user = jwt.decode(request.data["token"], "secret", algorithms=["HS256"])
            verifyUser = Users.objects.filter(id = id_from_user['id']).values("role", "id")
            if len(verifyUser) == 0:
                data = {"message": "Vous n'avez pas l'autorisation."}
                return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
        except:
            data = {"message": "Une erreur dans le token"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
        if isinstance(request.data['isDelivred'], bool) == False:
            data = {"message": "Erreur isDelivred corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
        if isinstance(request.data['isCommanded'], bool) == False:
            data = {"message": "Erreur isCommanded corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)


        if isinstance(request.data['user'], int) == False:
            data = {"message": "Erreur id User corrompu."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)


        commande = Commandes.objects.filter(user= request.data['user']).update(isDelivred = request.data['isDelivred'], isCommanded = request.data['isCommanded'])
        data = {"message":"Commande modifié avec succès"}

        get_and_write = Commandes.objects.all()
        data_gaw = serialize('json', get_and_write, cls =DjangoJSONEncoder)
        get_and_write = json.loads(data_gaw)
        
        with open("./bdd/commandes.json", "w") as json_products:
            json.dump(get_and_write, json_products)

        return Response(data , status=status.HTTP_200_OK)
